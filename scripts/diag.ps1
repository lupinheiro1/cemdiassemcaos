# Diagnóstico do ambiente Cemdiassemcaos.
# Uso:  powershell -File scripts\diag.ps1
# Grava a saída em ~\Dropbox\Marcelo\diag-<maquina>.txt (se o Dropbox existir),
# senão no diretório atual.
$dropbox = Join-Path $env:USERPROFILE "Dropbox\Marcelo"
$out = if (Test-Path $dropbox) { Join-Path $dropbox "diag-$($env:COMPUTERNAME).txt" } else { ".\diag-$($env:COMPUTERNAME).txt" }
$sb = [System.Text.StringBuilder]::new()
function L($t){ [void]$sb.AppendLine($t) }

L "===== DIAGNOSTICO Cemdiassemcaos ====="
L "data: $(Get-Date -Format 'yyyy-MM-dd HH:mm')  |  maquina: $env:COMPUTERNAME  |  usuario: $env:USERNAME"
L "pasta: $(Get-Location)"

L "`n[1] GIT"
L "branch: $(git branch --show-current)"
L (git log --oneline -3 | Out-String).Trim()
$pend = (git status --short | Out-String).Trim()
L "pendencias: $(if($pend){$pend}else{'(limpo)'})"
git fetch origin 2>&1 | Out-Null
L "commits atras do remoto: $(git rev-list --count HEAD..origin/main 2>$null)  (0 = atualizado)"

L "`n[2] ARQUIVOS-CHAVE"
"scripts\build-prerender-prod.mjs","scripts\build-prerender.mjs","scripts\deploy.mjs","src\prerender-client.tsx","src\prerender-server.tsx" | ForEach-Object {
  L "  $(if(Test-Path $_){'OK   '}else{'FALTA'}) $_"
}

L "`n[3] AMBIENTE"
L "  node_modules: $(if(Test-Path node_modules){'presente'}else{'FALTA - rode npm install'})"
L "  node: $(node --version)   npm: $(npm --version)"

L "`n[4] BUILD DE PRODUCAO (teste real)"
$build = npm run build 2>&1 | Out-String
L (($build.Trim() -split "`n") | Select-Object -Last 2 | Out-String).Trim()

L "`n[5] INTEGRIDADE DO BUILD"
if (Test-Path dist-prerender-prod\index.html) {
  $c = Get-Content dist-prerender-prod\index.html -Raw
  # CTAs REAIS = so os href=, nao o seletor do script UTM (que tambem cita o dominio)
  $ctas = ([regex]::Matches($c, 'href="https://pay\.hotmart\.com')).Count
  L "  H1 no HTML:             $(if($c -match '<h1'){'SIM'}else{'NAO !!'})"
  L "  GTM presente:           $(if($c -match 'GTM-5MLMK2BS'){'SIM'}else{'NAO !!'})"
  L "  noindex (deve ser NAO): $(if($c -match 'noindex'){'SIM !!'}else{'NAO'})"
  L "  CTAs (botoes reais):    $ctas (esperado 7)"
} else { L "  dist-prerender-prod NAO gerado !!" }

L "`n[6] PRODUCAO NO AR"
try {
  $prod = Invoke-WebRequest "https://maternologia.com.br/100-dias-sem-caos/?cb=$(Get-Random)" -UseBasicParsing
  L "  landing HTTP: $($prod.StatusCode)  |  H1 servido: $(if($prod.Content -match '<h1'){'SIM'}else{'NAO !!'})"
  $js = ([regex]::Match($prod.Content,'/100-dias-sem-caos/assets/index-[^"]+\.js')).Value
  $jsr = Invoke-WebRequest "https://maternologia.com.br$js" -UseBasicParsing
  L "  bundle JS: $($jsr.StatusCode) / $($jsr.Headers.'Content-Type')  (deve ser javascript)"
  $obr = Invoke-WebRequest "https://maternologia.com.br/100-dias-sem-caos/obrigado/?cb=$(Get-Random)" -UseBasicParsing
  L "  /obrigado/: $($obr.StatusCode)"
} catch { L "  ERRO ao consultar producao: $($_.Exception.Message)" }

L "`n===== FIM ====="
$sb.ToString() | Out-File -FilePath $out -Encoding utf8
Write-Host "Diagnostico salvo em: $out" -ForegroundColor Green
