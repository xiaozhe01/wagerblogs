import Link from "next/link";

export default function EmptyState({
  title,
  body,
  action,
  className = "",
}: {
  title: string;
  body?: string;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={`border border-dashed border-border-placeholder rounded-md p-5 md:p-8 flex flex-col items-center justify-center text-center gap-2 ${className}`}
    >
      <p className="text-md font-semibold text-text-primary text-pretty">{title}</p>
      {body && (
        <p className="text-sm text-text-muted leading-relaxed max-w-100 text-pretty">{body}</p>
      )}
      {action && (
        <Link href={action.href} className="btn-secondary mt-1">
          {action.label}
        </Link>
      )}
    </div>
  );
}
