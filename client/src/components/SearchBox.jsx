import { CiSearch } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import useToggleTheme from "@/context/useToggleTheme";

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <Input
      type="text"
      className={`${isDarkMode ? "border-transparent bg-dark-secondary-100-75/20 text-dark-text-base-300-75 !placeholder-dark-secondary-100-75" : ""}`}
      placeholder="Search for an official..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
};

export default SearchBox;
