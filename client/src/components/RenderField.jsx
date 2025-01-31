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
  additionalProps = {}
) => {
  // Generate an id based on the field name or provide a custom one
  const fieldId = `${fieldName}-input`;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <FormLabel htmlFor={fieldId} className={`text-[0.9rem] ${additionalProps.className} `}>
            {fieldTitle}
          </FormLabel>
          <FormControl>
            {cloneElement(children, {
              ...field,
              id: fieldId, // Assign the generated ID to the form field
              ...additionalProps, // Spread any additional props passed
            })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RenderField;