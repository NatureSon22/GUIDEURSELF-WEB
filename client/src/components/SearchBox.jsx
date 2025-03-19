import { CiSearch } from "react-icons/ci";
import { Input } from "@/components/ui/input";

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  return (
      <Input
        type="text"
        placeholder="Search for an official..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
  );
};

export default SearchBox;
