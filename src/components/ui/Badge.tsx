interface Props {
  text: string;
  color: "green" | "red" | "yellow";
}

function Badge({ text, color }: Props) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
        color === "green" ? "bg-green-600" : color === "red" ? "bg-red-500" : "bg-amber-500"
      }`}
    >
      {text}
    </span>
  );
}

export default Badge;