import useToggleTheme from "@/context/useToggleTheme";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { cloneElement } from "react";
const RenderField = (
  form,
  fieldName,
  fieldTitle,
  children,
  additionalProps = {},
) => {
  const fieldId = `${fieldName}-input`;
  const { isDarkMode } = useToggleTheme((state) => state);

  // Extract className specifically for the label from additionalProps
  // This allows other props in additionalProps to still go to the child component
  const labelClassName = additionalProps.labelClassName || ""; // Use a specific prop for the label's class
  const { labelClassName: _, ...restAdditionalProps } = additionalProps; // Destructure to prevent passing labelClassName to the child

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <FormLabel
            htmlFor={fieldId}
            className={`text-[0.9rem] ${isDarkMode ? "text-dark-text-base-300" : ""} ${labelClassName} `.trim()}
          >
            {fieldTitle}
          </FormLabel>
          <FormControl>
            {cloneElement(children, {
              ...field,
              id: fieldId,
              ...restAdditionalProps,
            })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RenderField;
