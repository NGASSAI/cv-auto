"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GraphiqueInscriptionsProps {
  donnees: { semaine: string; total: number }[];
}

export function GraphiqueInscriptions({ donnees }: GraphiqueInscriptionsProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={donnees}>
        <XAxis
          dataKey="semaine"
          tick={{ fontSize: 11 }}
          stroke="var(--color-muted-foreground)"
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          stroke="var(--color-muted-foreground)"
          width={30}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
        <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}