import React from "react";
import Search from "@/assets/Search.png";

const SearchBar = ({ value, onChange }) => (
  <div className="w-[80%] flex items-center border rounded-md px-2 py-1">
    <textarea
      className="w-full resize-none outline-none"
      placeholder="Search for an official..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <img src={Search} alt="Search" className="h-5" />
  </div>
);
export default SearchBar;
