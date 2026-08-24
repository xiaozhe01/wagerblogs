export default function Divider() {
  // border-0 is required: preflight leaves <hr>'s 1px top border, which would stack
  // with h-px and render a 2px rule.
  return <hr className="h-px border-0 bg-border-divider" />;
}
