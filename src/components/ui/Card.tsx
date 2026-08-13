import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
      bg-surface
      dark:bg-[#102618]
      border border-surface
      dark:border-[#21402C]
      rounded-2xl
      shadow-md
      hover:shadow-xl
      transition-all
      duration-300
      p-6
      ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;