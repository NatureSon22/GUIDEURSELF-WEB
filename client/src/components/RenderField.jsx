import PropTypes from "prop-types";
import { FormField } from "./ui/form";

const RenderField = ({
  form,
  name,
  label,
  placeholder,
  type = "text",
  children,
}) => {
  return <FormField control={form.control} name={name} ></FormField>;
};

RenderField.proptype = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node,
  form: PropTypes.object.isRequired,
};

export default RenderField;
