import { cn } from "@/lib/utils";

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const CTAButton = ({ children, className }: CTAButtonProps) => {
  return (
    <a
      href="https://pay.hotmart.com/E104054938B?checkoutMode=10"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold",
        "bg-gradient-to-br from-peach to-[hsl(18_70%_48%)] text-white rounded-full",
        "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
        "transform hover:-translate-y-0.5 hover:brightness-105 transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-peach focus:ring-offset-2",
        className
      )}
    >
      {children}
    </a>
  );
};
