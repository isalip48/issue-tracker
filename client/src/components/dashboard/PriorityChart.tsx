import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MdBugReport } from "react-icons/md";
import { EmptyState } from "@/components/shared/EmptyState";

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-border/50 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <p className="text-sm font-bold text-foreground">
            {entry.value} issues
          </p>
        </div>
      ))}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
interface PriorityChartProps {
  data: { name: string; value: number; fill: string }[];
}

export const PriorityChart = ({ data }: PriorityChartProps) => (
  <div className="lg:col-span-1 group rounded-2xl border border-border/40 bg-secondary/20 backdrop-blur-md p-6 transition-all duration-500 hover:border-border/80 hover:shadow-[0_0_80px_rgba(99,102,241,0.05)]">
    <h3 className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
      Priority Distribution
    </h3>

    {data.every((d) => d.value === 0) ? (
      <EmptyState
        icon={MdBugReport}
        title="No priority data."
        variant="default"
      />
    ) : (
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.fill}
                  className="transition-all duration-300 hover:opacity-80 outline-none"
                />
              ))}
            </Pie>
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={<CustomTooltip />}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom Minimalist Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 w-full max-w-[200px]">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
