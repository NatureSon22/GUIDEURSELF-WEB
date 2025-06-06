import PropTypes from "prop-types";
import { Label } from "@/components/ui/label";
import SwitchToggle from "@/components/SwitchToggle";
import { useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import useToggleTheme from "@/context/useToggleTheme";

const Permissions = ({
  module,
  roleaccess = [],
  handleSetPermissions,
  style = "",
  disableToggle = false,
  customizePermission = false,
  newRole = false,
}) => {
  const [checkAll, setCheckAll] = useState(false);
  const { isDarkMode } = useToggleTheme((state) => state);

  useEffect(() => {
    setCheckAll(module.access.every((access) => roleaccess.includes(access)));
  }, [module.access, roleaccess]);

  const toggleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);

    // Update all permissions in the module when "Check All" is toggled
    module.access.forEach((access) => {
      handleSetPermissions(module.module, access, newCheckAll);
    });
  };

  const mod = newRole
    ? roleaccess.find((mod) => mod.module === module.module)
    : null;

  return (
    <div
      className={`bg-secondary-200/5 px-5 py-6 ${isDarkMode ? "border-dark-text-base-300-75/50" : style} transition-colors duration-150`}
    >
      <div className="flex items-center justify-between">
        <Label className={isDarkMode ? "text-dark-text-base-300" : ""}>
          {module.module}
        </Label>

        <div className="flex items-center gap-2">
          {customizePermission ? (
            <>
              <Checkbox
                className="border-secondary-200"
                checked={checkAll}
                onCheckedChange={toggleCheckAll}
              />
              <Label className={isDarkMode ? "text-dark-text-base-300" : ""}>Check All</Label>
            </>
          ) : (
            <div className="py-2"></div>
          )}
        </div>
      </div>

      <p
        className={`mt-[3px] text-[0.85rem] ${isDarkMode ? "text-dark-text-base-300-75" : ""} `}
      >
        {module.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-4">
        {module.access.map((access) => {
          let isChecked = roleaccess.includes(access); // Default for existing roles

          if (newRole) {
            isChecked = mod ? mod.access.includes(access) : false;
          }

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
  module: PropTypes.shape({
    module: PropTypes.string.isRequired,
    description: PropTypes.string,
    access: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  roleaccess: PropTypes.array,
  handleSetPermissions: PropTypes.func.isRequired,
  style: PropTypes.string,
  disableToggle: PropTypes.bool,
  customizePermission: PropTypes.bool,
  newRole: PropTypes.bool,
};

export default Permissions;
