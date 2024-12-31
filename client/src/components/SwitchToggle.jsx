import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import formatTitle from "@/utils/formatTitle";
import PropTypes from "prop-types";

const SwitchToggle = ({
  access,
  module,
  handleSetPermissions,
  isChecked = false,
  disable = false,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={access}
        className="data-[state=checked]:bg-base-200"
        checked={isChecked} // Controlled by parent
        onCheckedChange={() => handleSetPermissions(module, access, !isChecked)}
        disabled={disable}
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
  disable: PropTypes.bool,
};

export default SwitchToggle;
