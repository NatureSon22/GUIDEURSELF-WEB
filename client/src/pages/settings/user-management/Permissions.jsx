import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import PropTypes from "prop-types";
import formatTitle from "@/utils/formatTitle";

const Permissions = ({ module }) => {
  return (
    <div className="bg-secondary-200/5 px-4 py-6">
      <Label>{module.module}</Label>
      <p className="text-[0.85rem]">{module.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-4">
        {module.access.map((access) => {
          return (
            <div className="flex items-center space-x-2" key={access}>
              <Switch
                id={access}
                className="data-[state=checked]:bg-base-200"
              />
              <Label htmlFor={access} className="text-[0.8rem]">
                {formatTitle(access)}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Permissions.propTypes = {
  module: PropTypes.object.isRequired,
};

export default Permissions;
