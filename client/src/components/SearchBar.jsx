import { CiSearch } from "react-icons/ci";
import PropTypes from "prop-types";

const SearchBar = ({ value, onChange }) => (
  <div className="flex w-[80%] bg-secondary-500 items-center rounded-md border px-2 py-1">
    <textarea
      className="bg-secondary-500 w-full resize-none outline-none"
      placeholder="Search for an official..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <CiSearch />
  </div>
);

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default SearchBar;
