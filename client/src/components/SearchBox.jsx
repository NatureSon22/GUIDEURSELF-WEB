import SearchIcon from "@/assets/Search.png";

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="w-[100%] flex flex-row justify-between items-center py-1 px-2 rounded-md border-gray-300 border ">
      <textarea
        className="overflow-hidden w-[95%] h-5 resize-none outline-none"
        placeholder="Search for an official..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <img className="h-[100%]" src={SearchIcon} alt="Search" />
    </div>
  );
};

export default SearchBox;
