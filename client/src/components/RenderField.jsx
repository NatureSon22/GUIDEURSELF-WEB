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
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <FormLabel htmlFor={fieldName}>{fieldTitle}</FormLabel>
          <FormControl>
            {cloneElement(children, { ...field, ...additionalProps })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RenderField;
