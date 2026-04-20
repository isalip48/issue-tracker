import { VisualMockup } from "@/components/auth/VisualMockup";

export const LoginVisual = () => {
  return (
    <VisualMockup
      auraColorRgba="rgba(99,102,241,0.08)"
      badge={{
        label: "CRITICAL",
        textClass: "text-indigo-500",
        bgBorderClass: "bg-indigo-500/5 border-indigo-500/20",
        dotClass: "bg-indigo-500",
        dotGlowRgba: "rgba(99,102,241,0.8)",
      }}
      id="API-402"
      title="Database connection pooling exhausting limits"
      description="The primary postgres cluster is dropping connections under heavy load. Needs immediate scaling and pooler configuration fix."
      tags={["PostgreSQL", "Backend"]}
      statusPill={{
        label: "Deploying Fix",
        textClass: "text-indigo-500",
        borderClass: "border-indigo-500/30",
        boxShadowRgba: "rgba(99,102,241,0.15)",
        dotClass: "bg-indigo-500",
        dotGlowRgba: "rgba(99,102,241,0.8)",
      }}
      userPill={{
        avatarNode: (
          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
            <span className="text-[7px] text-primary-foreground font-bold">
              JD
            </span>
          </div>
        ),
        name: "Assigned to James",
      }}
    />
  );
};
