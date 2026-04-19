export const AmbientBlobs = () => (
  <div className="pointer-events-none select-none" aria-hidden>
    <div
      className="fixed inset-0 z-[50]"
      style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--foreground) / 0.045) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    />
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/[0.06] blur-[140px] rounded-full z-0" />
    <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-primary/[0.04] blur-[100px] rounded-full z-0" />
  </div>
);
