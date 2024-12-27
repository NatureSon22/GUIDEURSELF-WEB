import PropTypes from "prop-types";
import { Label } from "@/components/ui/label";
import SwitchToggle from "@/components/SwitchToggle";

const Permissions = ({ module, roleaccess = [], handleSetPermissions }) => {
  return (
    <div className="bg-secondary-200/5 px-4 py-6">
      <Label>{module.module}</Label>
      <p className="text-[0.85rem]">{module.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-4">
        {module.access.map((access) => {
          const isChecked = roleaccess.includes(access);

          return (
            <SwitchToggle
              key={access}
              access={access}
              module={module.module}
              handleSetPermissions={handleSetPermissions}
              isChecked={isChecked}
            />
          );
        })}
      </div>
    </div>
  );
};

Permissions.propTypes = {
  module: PropTypes.object.isRequired,
  roleaccess: PropTypes.array,
  handleSetPermissions: PropTypes.func.isRequired,
};

export default Permissions;
