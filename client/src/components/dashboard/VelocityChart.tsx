import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { MdBugReport } from "react-icons/md";
import { EmptyState } from "@/components/shared/EmptyState";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-border/50 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
        {label}
      </p>
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

interface VelocityChartProps {
  data: { date: string; issues: number }[];
}

export const VelocityChart = ({ data }: VelocityChartProps) => (
  <div className="lg:col-span-2 group rounded-2xl border border-border/40 bg-secondary/20 backdrop-blur-md p-6 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_80px_rgba(99,102,241,0.05)]">
    <h3 className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-6">
      7-Day Velocity
    </h3>

    {data.length === 0 ? (
      <EmptyState
        icon={MdBugReport}
        title="No trend data yet."
        variant="default"
      />
    ) : (
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{
              fontSize: 11,
              fill: "hsl(var(--muted-foreground))",
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
            dy={16}
          />
          <YAxis
            tick={{
              fontSize: 11,
              fill: "hsl(var(--muted-foreground))",
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            dx={-16}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="issues"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTrend)"
            activeDot={{
              r: 6,
              strokeWidth: 0,
              fill: "hsl(var(--primary))",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    )}
  </div>
);
