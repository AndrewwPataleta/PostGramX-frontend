import { useEffect, useMemo, useState } from "react";
import { addHours, isSameDay, startOfDay } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

const formatDisplayDateTime = (date: Date | null) => {
  if (!date) {
    return "";
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const roundUpToInterval = (date: Date, minutes: number) => {
  const rounded = new Date(date);
  const ms = minutes * 60 * 1000;
  rounded.setTime(Math.ceil(rounded.getTime() / ms) * ms);
  return rounded;
};

const clampToMin = (date: Date, min: Date) => (date < min ? new Date(min) : date);

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
  const minDateTime = useMemo(() => addHours(new Date(), 1), []);
  const minSelectableTime = useMemo(
    () => roundUpToInterval(minDateTime, TIME_INTERVAL_MINUTES),
    [minDateTime],
  );
  const minSelectableDay = useMemo(
    () => startOfDay(minSelectableTime),
    [minSelectableTime],
  );
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"date" | "time">("date");
  const [draftDate, setDraftDate] = useState<Date | null>(value);
  const [calendarMonth, setCalendarMonth] = useState<Date>(minSelectableDay);

  const timeSlots = useMemo(
    () => buildTimeSlots(TIME_INTERVAL_MINUTES),
    [],
  );

  useEffect(() => {
    if (open) {
      setStep("date");
      const nextDraft = draftDate ? clampToMin(draftDate, minSelectableTime) : minSelectableTime;
      setDraftDate(nextDraft);
      setCalendarMonth(startOfDay(nextDraft));
      return;
    }
    setDraftDate(value);
  }, [open, value, draftDate, minSelectableTime]);

  const selectedTimeLabel = draftDate ? formatTime(draftDate) : null;

  const getMinTimeForDate = (date: Date) =>
    isSameDay(date, minSelectableTime) ? minSelectableTime : startOfDay(date);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    const baseTime = draftDate ?? minSelectableTime;
    const nextDate = new Date(date);
    nextDate.setHours(baseTime.getHours(), baseTime.getMinutes(), 0, 0);

    const minTime = getMinTimeForDate(date);
    const clamped = clampToMin(nextDate, minTime);
    setDraftDate(clamped);
    setStep("time");
  };

  const handleTimeSelect = (hours: number, minutes: number) => {
    if (!draftDate) {
      return;
    }
    const nextDate = new Date(draftDate);
    nextDate.setHours(hours, minutes, 0, 0);
    const clamped = clampToMin(nextDate, minSelectableTime);
    setDraftDate(clamped);
    onChange(clamped);
    setOpen(false);
  };

  const isTimeDisabled = (hours: number, minutes: number) => {
    const baseDate = draftDate ?? minSelectableTime;
    const target = new Date(baseDate);
    target.setHours(hours, minutes, 0, 0);
    const minTime = getMinTimeForDate(baseDate);
    return target < minTime;
  };

  const filteredTimeSlots = useMemo(() => {
    const baseDate = draftDate ?? minSelectableTime;
    if (!isSameDay(baseDate, minSelectableTime)) {
      return timeSlots;
    }
    const minMinutes = minSelectableTime.getHours() * 60 + minSelectableTime.getMinutes();
    return timeSlots.filter(
      (slot) => slot.hours * 60 + slot.minutes >= minMinutes,
    );
  }, [draftDate, minSelectableTime, timeSlots]);

  const displayValue = formatDisplayDateTime(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="w-full text-left">
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/80" />
            <Input
              readOnly
              value={displayValue}
              placeholder="Select date & time"
              className="h-11 cursor-pointer rounded-xl border-primary/30 bg-background/70 pl-9 text-sm font-medium text-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.2)] transition focus-visible:ring-primary/40"
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-[min(100vw-2rem,420px)] rounded-2xl border border-primary/20 bg-card/95 p-4 shadow-[0_20px_45px_-35px_hsl(var(--primary)/0.6)]"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-primary/90">
            {step === "date" ? "Select date" : "Select time"}
          </p>
          {step === "time" && (
            <button
              type="button"
              className="text-xs text-muted-foreground transition hover:text-foreground"
              onClick={() => setStep("date")}
            >
              Back
            </button>
          )}
        </div>

        {step === "date" ? (
          <Calendar
            mode="single"
            selected={draftDate ?? undefined}
            onSelect={handleDateSelect}
            disabled={{ before: minSelectableDay }}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            initialFocus
            className="w-full rounded-xl border border-primary/20 bg-background/70 p-2"
            classNames={{
              months: "w-full space-y-4",
              table: "w-full border-collapse space-y-2",
              day_disabled: "text-muted-foreground/40 line-through opacity-60",
            }}
          />
        ) : (
          <div className="w-full">
            <ScrollArea className="h-64 rounded-xl border border-primary/20 bg-background/70">
              <div className="grid grid-cols-3 gap-2 p-2">
                {filteredTimeSlots.map((slot) => {
                  const disabled = isTimeDisabled(slot.hours, slot.minutes);
                  const isSelected = selectedTimeLabel === slot.label;
                  return (
                    <button
                      key={slot.label}
                      type="button"
                      onClick={() => handleTimeSelect(slot.hours, slot.minutes)}
                      disabled={disabled}
                      className={cn(
                        "rounded-xl border px-2 py-2 text-sm font-medium text-foreground transition",
                        disabled
                          ? "cursor-not-allowed border-border/40 opacity-40"
                          : "border-border hover:bg-primary/10",
                        isSelected &&
                          "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
                      )}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
