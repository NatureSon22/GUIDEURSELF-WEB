import PropTypes from "prop-types";
import { Label } from "@/components/ui/label";
import SwitchToggle from "@/components/SwitchToggle";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";

const Permissions = ({
  module,
  roleaccess = [],
  handleSetPermissions,
  style = "",
  disableToggle = false,
  customizePermission = false,
}) => {
  const [checkAll, setCheckAll] = useState(false);

  const toggleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);

    // Update all permissions in the module when "Check All" is toggled
    module.access.forEach((access) => {
      handleSetPermissions(module.module, access, newCheckAll);
    });
  };

  return (
    <div className={`bg-secondary-200/5 px-5 py-6 ${style}`}>
      <div className="flex items-center justify-between">
        <Label>{module.module}</Label>

        <div className="flex items-center gap-2">
          {customizePermission ? (
            <>
              <Checkbox
                className="border-secondary-200"
                checked={checkAll}
                onClick={toggleCheckAll}
              />
              <Label>Check All</Label>
            </>
          ) : (
            <div className="py-2"></div>
          )}
        </div>
      </div>

      <p className="text-[0.85rem]">{module.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-4">
        {module.access.map((access) => {
          const isChecked = roleaccess.includes(access);

          return (
            <SwitchToggle
              key={access}
              access={access}
              module={module.module}
              handleSetPermissions={handleSetPermissions}
              isChecked={checkAll || isChecked}
              checkAll={checkAll}
              disable={disableToggle}
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
  style: PropTypes.string,
  disableToggle: PropTypes.bool,
  customizePermission: PropTypes.bool,
};

export default Permissions;
