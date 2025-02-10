import { CiSearch } from "react-icons/ci";

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="w-[100%] flex flex-row justify-between bg-secondary-500 items-center py-1 px-2 rounded-md border-gray-300 border ">
      <textarea
        className=" bg-secondary-500 overflow-hidden w-[95%] h-5 resize-none outline-none"
        placeholder="Search for an official..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <CiSearch />
    </div>
  );
};

export default SearchBox;
