import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import formatTitle from "@/utils/formatTitle";
import PropTypes from "prop-types";
import { useState } from "react";

const SwitchToggle = ({
  access,
  module,
  handleSetPermissions,
  isChecked = false,
}) => {
  const [checked, setChecked] = useState(isChecked);

  return (
    <div className="flex items-center space-x-2" key={access}>
      <Switch
        id={access}
        className="data-[state=checked]:bg-base-200"
        checked={checked}
        onCheckedChange={() => {
          handleSetPermissions(module, access, !checked);
          setChecked(!checked);
        }}
      />
      <Label htmlFor={access} className="text-[0.8rem]">
        {formatTitle(access)}
      </Label>
    </div>
  );
};

SwitchToggle.propTypes = {
  access: PropTypes.string.isRequired,
  module: PropTypes.string.isRequired,
  handleSetPermissions: PropTypes.func.isRequired,
  isChecked: PropTypes.bool,
};

export default SwitchToggle;
