export default function Eyebrow({ children, tone = "light" }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide " +
        (tone === "dark"
          ? "bg-white/15 text-white"
          : "bg-basilica-marbleBlack/10 text-basilica-marbleBlack")
      }
    >
      {children}
    </span>
  );
}
