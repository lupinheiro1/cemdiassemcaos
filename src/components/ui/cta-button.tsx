import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const CTAButton = ({ children, className, onClick }: CTAButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold",
        "bg-primary text-primary-foreground rounded-full",
        "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
        "transform hover:-translate-y-0.5 transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
    >
      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
      {children}
    </button>
  );
};
