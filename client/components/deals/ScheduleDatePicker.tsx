import { useMemo } from "react";
import { addHours, isSameDay, startOfDay } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ScheduleDatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

const TIME_INTERVAL_MINUTES = 5;

const padTime = (value: number) => value.toString().padStart(2, "0");

const formatTime = (date: Date) =>
  `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;

const roundUpToInterval = (date: Date, minutes: number) => {
  const rounded = new Date(date);
  const ms = minutes * 60 * 1000;
  rounded.setTime(Math.ceil(rounded.getTime() / ms) * ms);
  return rounded;
};

const buildTimeSlots = (interval: number) => {
  const slots: { label: string; hours: number; minutes: number }[] = [];
  for (let total = 0; total < 24 * 60; total += interval) {
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    slots.push({
      label: `${padTime(hours)}:${padTime(minutes)}`,
      hours,
      minutes,
    });
  }
  return slots;
};

export function ScheduleDatePicker({ value, onChange }: ScheduleDatePickerProps) {
  const minDateTime = addHours(new Date(), 1);

  const timeSlots = useMemo(
    () => buildTimeSlots(TIME_INTERVAL_MINUTES),
    [],
  );

  const selectedTimeLabel = value ? formatTime(value) : null;

  const getMinTimeForDate = (date: Date) =>
    isSameDay(date, minDateTime) ? minDateTime : startOfDay(date);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    const baseTime = value ?? minDateTime;
    const nextDate = new Date(date);
    nextDate.setHours(baseTime.getHours(), baseTime.getMinutes(), 0, 0);

    const minTime = getMinTimeForDate(date);
    if (nextDate < minTime) {
      const rounded = roundUpToInterval(minTime, TIME_INTERVAL_MINUTES);
      nextDate.setHours(rounded.getHours(), rounded.getMinutes(), 0, 0);
    }

    onChange(nextDate);
  };

  const handleTimeSelect = (hours: number, minutes: number) => {
    const baseDate = value ?? minDateTime;
    const nextDate = new Date(baseDate);
    nextDate.setHours(hours, minutes, 0, 0);
    onChange(nextDate);
  };

  const isTimeDisabled = (hours: number, minutes: number) => {
    const baseDate = value ?? minDateTime;
    const target = new Date(baseDate);
    target.setHours(hours, minutes, 0, 0);
    const minTime = getMinTimeForDate(baseDate);
    return target < minTime;
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-[0_20px_45px_-35px_hsl(var(--primary)/0.6)] sm:flex-row">
      <Calendar
        mode="single"
        selected={value ?? undefined}
        onSelect={handleDateSelect}
        disabled={{ before: startOfDay(minDateTime) }}
        className="w-full rounded-xl border border-border/60 bg-background/70 p-2 sm:w-auto"
        classNames={{
          months: "w-full space-y-4",
          table: "w-full border-collapse space-y-2",
        }}
      />
      <div className="w-full sm:w-44">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Time
        </p>
        <ScrollArea className="h-64 rounded-xl border border-border/60 bg-background/70">
          <div className="grid gap-1 p-2">
            {timeSlots.map((slot) => {
              const disabled = isTimeDisabled(slot.hours, slot.minutes);
              const isSelected = selectedTimeLabel === slot.label;
              return (
                <button
                  key={slot.label}
                  type="button"
                  onClick={() => handleTimeSelect(slot.hours, slot.minutes)}
                  disabled={disabled}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors",
                    "hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    disabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
                    isSelected &&
                      "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                  )}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
