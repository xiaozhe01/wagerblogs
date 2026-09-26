// Login-screen brand mark. The admin does not load the site's stylesheet or
// font, so this restates the wordmark's shape inline rather than importing
// anything from the frontend.
export default function Logo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.35rem",
      }}
    >
      <span
        style={{
          fontSize: "2.5rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        WagerBlogs
      </span>
      <span
        style={{
          fontSize: "0.8125rem",
          fontWeight: 500,
          letterSpacing: "0.02em",
          opacity: 0.6,
        }}
      >
        Editorial workspace
      </span>
    </div>
  );
}
