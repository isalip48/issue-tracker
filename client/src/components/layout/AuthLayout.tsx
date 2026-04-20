import { Link } from "react-router-dom";
import { cn } from "@/utils";
import { Logo } from "@/components/shared/Logo";

interface AuthLayoutProps {
  leftHeadline: React.ReactNode;
  leftSubHeadline: React.ReactNode;
  leftVisual: React.ReactNode;
  leftBottomContent?: React.ReactNode;

  topBadge: string;
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;

  bottomLinkText: string;
  bottomLinkTo: string;
  bottomLinkActionText: string;

  animationClass?: string;
}

export const AuthLayout = ({
  leftHeadline,
  leftSubHeadline,
  leftVisual,
  leftBottomContent,
  topBadge,
  title,
  subtitle,
  children,
  bottomLinkText,
  bottomLinkTo,
  bottomLinkActionText,
  animationClass = "",
}: AuthLayoutProps) => {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4 antialiased bg-background font-sans overflow-hidden",
        animationClass,
      )}
    >
      <div className="relative z-10 w-full max-w-[920px] min-h-[600px] grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
        <div className="relative hidden lg:flex flex-col justify-between p-10 bg-background/50 border-r border-border overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="relative z-10">
            <Logo />
          </div>

          <div className="relative z-10 py-6">{leftVisual}</div>

          <div className="relative z-10 space-y-6">
            <div>
              <h2 className="text-[26px] font-semibold text-foreground leading-[1.1] tracking-tight">
                {leftHeadline}
              </h2>
              <h2 className="text-[26px] font-medium leading-[1.1] tracking-tight text-muted-foreground hidden md:block mt-1">
                {leftSubHeadline}
              </h2>
            </div>
            {leftBottomContent}
          </div>
        </div>

        <div className="relative flex items-center justify-center p-8 md:p-12 bg-card">
          <div className="relative z-10 w-full max-w-[300px]">
            <div className="mb-10 lg:hidden">
              <Logo size="sm" />
            </div>

            <div className="mb-8">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-4 shadow-sm">
                {topBadge}
              </span>
              <h2 className="text-[28px] font-bold text-foreground leading-[1.15] tracking-tight mb-2">
                {title}
              </h2>
              <p className="text-[13px] text-muted-foreground/80 font-medium">
                {subtitle}
              </p>
            </div>

            {children}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
              <span className="text-[12px] text-muted-foreground">
                {bottomLinkText}
              </span>
              <Link
                to={bottomLinkTo}
                className="text-[12px] font-medium text-foreground hover:text-primary transition-colors"
                title={bottomLinkActionText}
              >
                {bottomLinkActionText} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 group z-10">
        {["Privacy", "Terms", "Security"].map((t, i) => (
          <span key={t} className="flex items-center gap-2">
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {t}
            </span>
            {i < 2 && <span className="text-[10px] text-border">&middot;</span>}
          </span>
        ))}
      </div>
    </div>
  );
};
