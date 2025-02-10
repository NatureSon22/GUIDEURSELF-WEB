import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import { Input } from "@/components/ui/input";
import { GrPowerReset } from "react-icons/gr";
import campusColumns from "@/components/columns/ArchiveCampus";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook
import { getAllCampuses } from "@/api/component-info";

const ArchiveCampus = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);
  const { toast } = useToast(); // Initialize the toast function
  const queryClient = useQueryClient(); // Initialize the query client

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });

  // Fetch archived campuses using useQuery
  const {
    data: archivedCampuses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["archivedCampuses"], // Unique key for the query
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/archived-campuses", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch archived campuses");
      }
      return response.json();
    },
  });

  const getArchivedCampuses = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/archived-campuses`, {
      method: "GET",
      credentials: "include",
    });
  
    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || "Failed to fetch archived campuses");
    }
  
    const campuses = await response.json();
  
    return campuses.map((campus) => ({
      value: campus._id,
      label: campus.campus_name,
    })) || [];
  };
  
  const { data: allArchivedCampuses, } = useQuery({
    queryKey: ["getArchivedCampuses"],
    queryFn: getArchivedCampuses,
  });
  

  // Handle unarchiving a campus
  const handleUnarchive = async (campus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/archived-campuses/unarchive/${campus._id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Campus unarchived successfully.",
          variant: "default",
        });
        // Invalidate the query to refetch the data
        queryClient.invalidateQueries("archivedCampuses"); // Invalidate the query
      } else {
        console.error("Failed to unarchive campus:", campus.campus_name);
      }
    } catch (error) {
      console.error("Error unarchiving campus:", error);
    }
  };

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-1 flex-col space-y-5">
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
          options={allArchivedCampuses || []}
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

      <div className="flex-1">
        <DataTable
          data={archivedCampuses} // Pass the fetched data
          columns={campusColumns}
          filters={filters}
          setFilters={setFilters}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnActions={{ handleUnarchive }} // Pass the handleUnarchive function
        />
      </div>
    </div>
  );
};

export default ArchiveCampus;