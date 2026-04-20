import { type IconType } from "react-icons";
import {
  MdTrackChanges,
  MdReplay,
  MdBarChart,
  MdLabel,
  MdSync,
  MdEditNote,
  MdPerson,
  MdCheckCircle,
} from "react-icons/md";

interface Tip {
  icon: IconType;
  title: string;
  body: string;
}

/* ── CREATE TIPS ───────────────────────── */
const CREATE_TIPS: Tip[] = [
  {
    icon: MdTrackChanges,
    title: "Write a specific title",
    body: 'Avoid vague names like "Bug fix". Prefer "Login button unresponsive on mobile Safari".',
  },
  {
    icon: MdReplay,
    title: "Include reproduction steps",
    body: "Describe exactly how to trigger the issue so anyone can reproduce it reliably.",
  },
  {
    icon: MdBarChart,
    title: "Set severity accurately",
    body: "Use Blocker only if the system is unusable. Minor for cosmetic or edge-case issues.",
  },
  {
    icon: MdLabel,
    title: "Add meaningful tags",
    body: 'Tags like "auth", "UI", "performance" make filtering and triage much faster.',
  },
];

/* ── EDIT TIPS ───────────────────────── */
const EDIT_TIPS: Tip[] = [
  {
    icon: MdSync,
    title: "Keep status current",
    body: 'Move the issue to "In Progress" as soon as work begins so the team has accurate visibility.',
  },
  {
    icon: MdEditNote,
    title: "Update the description",
    body: "Add findings, workarounds, or links to related PRs directly in the description.",
  },
  {
    icon: MdPerson,
    title: "Reassign if needed",
    body: "If the original assignee is unavailable, reassign via the Assignment panel before saving.",
  },
  {
    icon: MdCheckCircle,
    title: "Close when complete",
    body: "Mark as Resolved once the fix is verified, or Closed for won’t-fix / duplicate decisions.",
  },
];

const TIPS_MAP = {
  create: CREATE_TIPS,
  edit: EDIT_TIPS,
} as const;

const HEADINGS = {
  create: "Tips for writing a great issue",
  edit: "Tips for a thorough update",
} as const;

interface IssueTipsProps {
  variant: keyof typeof TIPS_MAP;
}

export const IssueTips = ({ variant }: IssueTipsProps) => {
  const tips = TIPS_MAP[variant];
  const heading = HEADINGS[variant];

  return (
    <div className="mt-8 rounded-2xl border border-border/40 bg-secondary/10 p-6">
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">
        {heading}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tips.map((tip) => {
          const Icon = tip.icon;

          return (
            <div
              key={tip.title}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/40 transition"
            >
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500 shrink-0">
                <Icon size={16} />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  {tip.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tip.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
