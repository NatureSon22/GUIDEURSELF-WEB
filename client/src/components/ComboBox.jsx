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
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

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
            className={`w-[200px] justify-between ${
              selectedValue
                ? "text-base-300"
                : "uppercase text-secondary-100-75"
            }`}
          >
            {selectedValue
              ? options.find((opt) => opt.value === selectedValue)?.label
              : placeholder}
            <ChevronDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value, option.label)}
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
};

ComboBox.displayName = "ComboBox";

export default ComboBox;
