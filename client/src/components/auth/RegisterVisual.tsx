import { VisualMockup } from "@/components/auth/VisualMockup";

export const RegisterVisual = () => {
  return (
    <VisualMockup
      auraColorRgba="rgba(59,130,246,0.08)"
      badge={{
        label: "FEATURE",
        textClass: "text-blue-500",
        bgBorderClass: "bg-blue-500/5 border-blue-500/20",
        dotClass: "bg-blue-500",
        dotGlowRgba: "rgba(59,130,246,0.8)"
      }}
      id="SYS-101"
      title="Initialize Workspace Infrastructure"
      description="Set up core teams, establish initial sprint cycles, and connect primary GitHub workflows to your new tracker instance."
      tags={["Infrastructure", "Onboarding"]}
      statusPill={{
        label: "In Progress",
        textClass: "text-primary",
        borderClass: "border-primary/30",
        boxShadowRgba: "rgba(99,102,241,0.15)", 
        dotClass: "bg-primary",
        dotGlowRgba: "rgba(99,102,241,0.8)"   
      }}
      userPill={{
        avatarNode: (
          <div className="w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center border-dashed">
            <span className="text-[10px] text-muted-foreground font-bold">+</span>
          </div>
        ),
        name: "Unassigned"
      }}
    />
  );
};
