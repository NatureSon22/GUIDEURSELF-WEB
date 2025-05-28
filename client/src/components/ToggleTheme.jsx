import { Switch } from "./ui/switch";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import useToggleTheme from "@/context/useToggleTheme";

const ToggleTheme = () => {
  const { isDarkMode, setIsDarkMode } = useToggleTheme((state) => state);

  const handleSetDarkMode = (value) => {
    localStorage.setItem("isDarkMode", value);
    setIsDarkMode(value);
  };

  return (
    <div>
      <div className="flex items-center space-x-3">
        <MdLightMode
          className={`text-xl ${isDarkMode ? "text-dark-text-base-300" : "text-secondary-100-75/50"}`}
        />
        <Switch
          className="data-[state=checked]:bg-base-200 data-[state=unchecked]:bg-secondary-100-75/30"
          checked={isDarkMode}
          onCheckedChange={handleSetDarkMode}
        />
        <MdDarkMode
          className={`text-xl ${isDarkMode ? "text-dark-text-base-300" : "text-secondary-100-75/50"}`}
        />
      </div>
    </div>
  );
};

export default ToggleTheme;
