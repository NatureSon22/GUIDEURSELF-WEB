import { addDays, format } from "date-fns";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PropTypes from "prop-types";

const DateRangePicker = ({ setFilters, filterId }) => {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const handleDateChange = (selectedDateRange) => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      const combinedDateRange = {
        start: format(selectedDateRange.from, "MM/dd/yyyy"),
        end: format(selectedDateRange.to, "MM/dd/yyyy"),
      };

      setFilters((prevFilters) => {
        const existingIndex = prevFilters.findIndex(filter => filter.id === filterId);
        if (existingIndex !== -1) {
          return prevFilters.map((filter, index) =>
            index === existingIndex ? { id: filterId, dateRange: combinedDateRange } : filter
          );
        }
        return [...prevFilters, { id: filterId, dateRange: combinedDateRange }];
      });
    }
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-[300px] justify-start text-left font-normal"
          >
            <CalendarIcon />
            {dateRange.from && dateRange.to ? (
              <>
                {format(dateRange.from, "MM/dd/yyyy")} - {format(dateRange.to, "MM/dd/yyyy")}
              </>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from || new Date()}
            selected={dateRange}
            onSelect={(selected) => {
              if (selected?.from && selected?.to) {
                setDateRange(selected);
                handleDateChange(selected);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

DateRangePicker.propTypes = {
  setFilters: PropTypes.func,
  filterId: PropTypes.string, // Ensure filterId is provided
};

export default DateRangePicker;