interface ButtonProps {
  title: string;
  onClick?: () => void;
}

function Button({ title, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
      bg-[#007B3E]
      hover:bg-[#00482B]
      text-white
      px-6
      py-3
      rounded-xl
      font-semibold
      transition-all
      duration-300
      dark:bg-[#0F2A1D]
      dark:hover:bg-[#173022]
      dark:text-white
      "
    >
      {title}
    </button>
  );
}

export default Button;