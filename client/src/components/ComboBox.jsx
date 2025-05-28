import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useToggleTheme from "@/context/useToggleTheme";

const ComboBox = React.forwardRef(
  (
    {
      options = [],
      placeholder = "Select",
      filter,
      reset,
      setFilters,
      onChange,
      value: propValue,
      style = {},
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const { isDarkMode } = useToggleTheme((state) => state);

    const selectedValue = propValue ?? value;

    // the pattern becomes false -> true -> false -> true
    // hence. the second time the pattern is true, the condition will not be met
    useEffect(() => {
      setValue("");
    }, [reset]);

    const handleFilter = useCallback(
      (value) => {
        if (!setFilters) return;
        setFilters((prev) => {
          const updatedFilters = [...prev];
          const index = updatedFilters.findIndex((f) => f.id === filter);
          if (index !== -1) {
            updatedFilters[index].value = value;
          } else {
            updatedFilters.push({ id: filter, value });
          }
          return updatedFilters;
        });
      },
      [filter, setFilters],
    );

    const handleSelect = useCallback(
      (currentValue, label) => {
        const newValue = currentValue === selectedValue ? "" : currentValue;
        setValue(newValue);
        onChange?.(newValue);
        handleFilter(label);
        setOpen(false);
      },
      [selectedValue, onChange, handleFilter],
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`${style?.width || "w-[200px]"} ${style?.py || ""} justify-between ${
              selectedValue
                ? "text-base-300"
                : "uppercase text-secondary-100-75"
            } ${isDarkMode ? "border-dark-text-base-300-75/60 bg-dark-base-bg text-dark-text-base-300-75 hover:bg-dark-base-bg hover:text-dark-text-base-300-75" : "bg-white"} transition-colors duration-150`}
          >
            {selectedValue
              ? options.find((opt) => opt.value === selectedValue)?.label
              : placeholder}
            <ChevronDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`${style?.width || "w-[200px]"} p-0`}>
          <Command>
            <CommandList
              className={`${isDarkMode ? "bg-dark-base-bg text-dark-text-base-300" : ""}`}
            >
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value, option.label)}
                    className={` ${isDarkMode ? "text-dark-text-base-300 hover:!bg-secondary-200/30 data-[selected=true]:bg-secondary-200/40 data-[selected=true]:text-dark-text-base-300" : ""}`}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedValue === option.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

ComboBox.propTypes = {
  options: PropTypes.array,
  placeholder: PropTypes.string,
  filter: PropTypes.string,
  reset: PropTypes.bool,
  setFilters: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  style: PropTypes.object,
};

ComboBox.displayName = "ComboBox";

export default ComboBox;
