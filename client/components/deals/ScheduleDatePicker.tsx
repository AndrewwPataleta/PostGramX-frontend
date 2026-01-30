import { useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addHours, isSameDay } from "date-fns";

interface ScheduleDatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

export function ScheduleDatePicker({ value, onChange }: ScheduleDatePickerProps) {
  const minDateTime = addHours(new Date(), 1);

  const minTime = useMemo(() => {
    if (!value) {
      return minDateTime;
    }
    if (isSameDay(value, minDateTime)) {
      return minDateTime;
    }
    const startOfDay = new Date(value);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }, [minDateTime, value]);

  const maxTime = useMemo(() => {
    const endOfDay = new Date();
    endOfDay.setHours(23, 55, 0, 0);
    return endOfDay;
  }, []);

  return (
    <DatePicker
      selected={value}
      onChange={(date) => date && onChange(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={5}
      dateFormat="yyyy-MM-dd HH:mm"
      minDate={minDateTime}
      minTime={minTime}
      maxTime={maxTime}
      inline
      calendarStartDay={1}
      className="!border-0"
    />
  );
}
