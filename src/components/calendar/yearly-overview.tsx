import { Card } from "@/components/ui/card";
import { eachDayOfInterval, format, getDay, subYears } from "date-fns";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";

import { Id } from "@server/convex/_generated/dataModel";

interface YearlyOverviewProps {
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  habits: Array<{
    _id: Id<"habits">;
    name: string;
    calendarId: Id<"calendars">;
  }>;
  calendars: Array<{
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  }>;
}

export const YearlyOverview = ({ completions }: YearlyOverviewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  // Memoize date calculations that don't need to change
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const yearAgo = subYears(today, 1);
    const days = eachDayOfInterval({ start: yearAgo, end: today }).map((date) => format(date, "yyyy-MM-dd"));

    // Calculate weeks
    const firstDayOfWeek = getDay(yearAgo);
    const emptyStartDays = Array(firstDayOfWeek).fill(null);
    const weeks: (string | null)[][] = [];
    let currentWeek: (string | null)[] = [...emptyStartDays];

    days.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // Get month labels
    const monthLabels = [];
    for (let i = 0; i <= 12; i++) {
      const date = new Date(yearAgo);
      date.setMonth(date.getMonth() + i);
      monthLabels.push({
        key: format(date, "MMM yyyy"),
        label: format(date, "MMM"),
      });
    }

    return { weeks, monthLabels };
  }, []); // Empty deps since these only need to calculate once

  // Memoize completion counts to avoid recalculating on every render
  const completionCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    completions.forEach((completion) => {
      const date = new Date(completion.completedAt);
      const dateKey = format(date, "yyyy-MM-dd");
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });

    return counts;
  }, [completions]);

  // Memoize color class function
  const getColorClass = useCallback((count: number) => {
    if (count === 0) return "bg-neutral-100 dark:bg-neutral-800";
    if (count <= 2) return "bg-emerald-200 dark:bg-emerald-500";
    if (count <= 5) return "bg-emerald-300 dark:bg-emerald-600";
    if (count <= 10) return "bg-emerald-400 dark:bg-emerald-700";
    return "bg-emerald-500 dark:bg-emerald-800";
  }, []);

  // Extract grid cell to separate component for better performance
  const GridCell = memo(({ day }: { day: string | null }) => {
    if (!day) return <div className="aspect-square w-[15px] max-w-full sm:w-4" />;

    const count = completionCounts[day] || 0;
    return (
      <div
        className={`aspect-square w-[15px] max-w-full sm:w-4 rounded-sm transition-colors hover:opacity-80 relative ${getColorClass(count)}`}
        title={`${format(new Date(day), "MMM d, yyyy")}: ${count} completions`}
      />
    );
  });
  GridCell.displayName = "GridCell";

  // Add this near other useMemo calculations
  const totalCompletions = useMemo(() => {
    return Object.values(completionCounts).reduce((sum, count) => sum + count, 0);
  }, [completionCounts]);

  return (
    // TODO: 2024-12-24 - make this responsive
    <div className="max-w-5xl mx-auto">
      <div className="mt-4 text-muted-foreground mb-2">{totalCompletions} things done in the last year</div>
      <Card className="mb-16 rounded-xl shadow-md sm:p-4 overflow-hidden">
        <div ref={scrollRef} className=" overflow-x-auto -mr-1 sm:-mr-4">
          <div className="flex flex-col">
            {/* Month labels */}
            <div className="flex mb-1 sm:mb-2 ">
              <div className="pl-12 gap-12 flex justify-between text-[8px] sm:text-xs text-muted-foreground">
                {monthLabels.map((month) => (
                  <div key={month.key}>{month.label}</div>
                ))}
              </div>
            </div>

            {/* Day labels and contribution grid */}
            <div className="flex ">
              {/* Day labels */}
              <div className="flex flex-col gap-px mr-2">
                <div className="h-4" /> {/* Empty space for alignment */}
                <div className="text-muted-foreground h-2 sm:h-3">Mon</div>
                <div className="h-4" />
                <div className="text-muted-foreground h-2 sm:h-3">Wed</div>
                <div className="h-4" />
                <div className="text-muted-foreground h-2 sm:h-3">Fri</div>
              </div>

              {/* Contribution grid */}
              <div className="flex gap-px">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[1px] flex-1">
                    {week.map((day, dayIndex) => (
                      <GridCell key={day || `empty-${weekIndex}-${dayIndex}`} day={day} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
