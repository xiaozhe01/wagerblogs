/** Running body copy. Spans the parent deliberately — the parent is the
 * measure, so narrow the container to narrow the text. */
export default function Prose({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-lg font-medium leading-copy text-text-strong-secondary text-pretty${className && ` ${className}`}`}
    >
      {children}
    </p>
  );
}
