import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-[#2FAE67] via-[#1E9B5E] to-[#157A4E] text-white shadow-[0_12px_32px_rgba(47,174,103,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(47,174,103,0.42)] focus-visible:ring-[#2FAE67]/60",
  secondary:
    "bg-gradient-to-r from-[#00A99D] via-[#0FA9B7] to-[#0D7F8A] text-white shadow-[0_12px_30px_rgba(0,169,157,0.3)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(0,169,157,0.35)] focus-visible:ring-[#00A99D]/60",
  outline:
    "border border-[#7CD6A1]/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/12 focus-visible:ring-[#7CD6A1]/40",
  ghost:
    "bg-[#ECF8F2] text-[#00482B] hover:bg-[#DFF2E7] focus-visible:ring-[#007B3E]/25",
  danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_12px_30px_rgba(239,68,68,0.28)] hover:-translate-y-0.5 focus-visible:ring-red-500/60",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3.5 py-2.5 text-sm",
  md: "px-5 py-3 text-sm md:text-base",
  lg: "px-6 py-3.5 text-base",
};

function Button({
  title,
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-2xl font-semibold tracking-[0.01em] transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {children ?? title}
    </button>
  );
}

export default Button;