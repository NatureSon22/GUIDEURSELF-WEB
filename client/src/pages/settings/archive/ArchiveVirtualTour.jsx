import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import ComboBox from "@/components/ComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import { Input } from "@/components/ui/input";
import virtualTourColumns from "@/components/columns/ArchiveVirtualTour";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook

const ArchiveVirtualTour = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);
  const [archivedItems, setArchivedItems] = useState([]); // Updated state variable
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast(); // Initialize the toast function

  // Fetch archived items from the backend
  useEffect(() => {
    const fetchArchivedItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/archived-items", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setArchivedItems(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedItems();
  }, []);

  // Handle unarchiving an item
  const handleUnarchiveItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/archived-items/${itemId}/unarchive`,
        {
          method: "POST",
          credentials: "include",
        }
      );
  
      const result = await response.json();
      console.log("Response from backend:", result); // Log the backend response
  
      if (!response.ok) throw new Error(result.message || "Failed to unarchive item");
  
      setArchivedItems((prev) => prev.filter((item) => item._id !== itemId));
  
      toast({
        title: "Success",
        description: "Items unarchive successfully.",
        variant: "default", // Use a destructive variant for errors
    }); 
    } catch (error) {
      console.error("Error unarchiving item:", error);
    }
  };
  

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
  };

  return (
    <div className="space-y-5">
      <Input
        type="text"
        placeholder="Search"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      <div className="flex items-center gap-5">
        <p>Filters:</p>
        <DateRangePicker />
        <ComboBox
          options={[]}
          placeholder="select campus"
          filter="campus_name"
          setFilters={setFilters}
          reset={reset}
        />

        <Button
          className="ml-auto text-secondary-100-75"
          variant="outline"
          onClick={handleReset}
        >
          <GrPowerReset /> Reset Filters
        </Button>
      </div>

      <DataTable
        data={archivedItems} // Pass the fetched archived items
        columns={virtualTourColumns}
        filters={filters}
        setFilters={setFilters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        columnActions={{ handleUnarchive: handleUnarchiveItem }} // Pass the handleUnarchive function
      />
    </div>
  );
};

export default ArchiveVirtualTour;