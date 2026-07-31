from __future__ import annotations

import argparse

from .build import build
from .validate import validate_outputs


def main() -> None:
    parser = argparse.ArgumentParser(prog="maternologia_pdf")
    parser.add_argument("command", choices=("build", "validate"))
    args = parser.parse_args()
    if args.command == "build":
        build()
    else:
        validate_outputs()


if __name__ == "__main__":
    main()

