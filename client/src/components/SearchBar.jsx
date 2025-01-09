import Search from "@/assets/Search.png";
import PropTypes from "prop-types";

const SearchBar = ({ value, onChange }) => (
  <div className="flex w-[80%] items-center rounded-md border px-2 py-1">
    <textarea
      className="w-full resize-none outline-none"
      placeholder="Search for an official..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <img src={Search} alt="Search" className="h-5" />
  </div>
);

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default SearchBar;
