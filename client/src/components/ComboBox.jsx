import React, { useState } from "react";
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
  ({ options = [], placeholder = "Select", onChange, value: propValue }, ref) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const selectedValue = propValue ?? value;

    const handleSelect = (currentValue) => {
      const newValue = currentValue === selectedValue ? "" : currentValue;
      setValue(newValue);
      onChange?.(newValue); // Call onChange if provided
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref} // Pass the ref here
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-[200px] justify-between ${
              selectedValue ? "text-base-300" : "text-secondary-100-75 uppercase"
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
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedValue === option.value
                          ? "opacity-100"
                          : "opacity-0"
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
  }
);

ComboBox.propTypes = {
  options: PropTypes.array,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

ComboBox.displayName = "ComboBox";

export default ComboBox;
