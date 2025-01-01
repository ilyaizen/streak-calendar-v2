"use client";

import { CalendarContainer } from "@/components/calendar/calendar-container";
import { ImportExport } from "@/components/calendar/import-export";
import { YearlyOverview } from "@/components/calendar/yearly-overview";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { useDateRange } from "@/hooks/use-date-range";
import { useHabitState } from "@/hooks/use-habit-state";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useMemo } from "react";

// Authentication wrapper component
const AuthenticationWrapper = ({ children }: { children: React.ReactNode }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Please sign in to view your calendars</h2>
        <SignInButton mode="modal">
          <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            Sign In
          </button>
        </SignInButton>
      </div>
    </SignedOut>
  </>
);

// Main calendar page component
export default function CalendarsPage() {
  const { calendarView, setCalendarView, ...calendarState } = useCalendarState();
  const habitState = useHabitState();

  // Pre-fetch data for both views
  const monthData = useDateRange(90);
  const yearData = useDateRange(365);
  const monthViewData = useCalendarData(monthData.startDate, monthData.today);
  const yearViewData = useCalendarData(yearData.startDate, yearData.today);

  // Use appropriate data based on view
  const { days } = useMemo(
    () => (calendarView === "monthRow" ? monthData : yearData),
    [calendarView, monthData, yearData]
  );

  const { calendars, habits } = useMemo(
    () => (calendarView === "monthRow" ? monthViewData : yearViewData),
    [calendarView, monthViewData, yearViewData]
  );

  return (
    <div className="container mx-auto max-w-7xl">
      <AuthenticationWrapper>
        <>
          <YearlyOverview completions={yearViewData.completions || []} habits={habits} calendars={calendars} />
          <CalendarContainer
            calendarState={calendarState}
            calendarView={calendarView}
            calendars={monthViewData.calendars || []}
            completions={monthViewData.completions || []}
            days={days}
            habitState={habitState}
            habits={monthViewData.habits || []}
            monthViewData={monthViewData}
            onViewChange={setCalendarView}
            view={calendarView}
          />
          <div className="mt-8 justify-center">
            <ImportExport />
          </div>
        </>
      </AuthenticationWrapper>
    </div>
  );
}
