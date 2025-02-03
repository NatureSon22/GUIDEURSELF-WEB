import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import { Input } from "@/components/ui/input";
import { GrPowerReset } from "react-icons/gr";
import campusColumns from "@/components/columns/ArchiveCampus";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook

const ArchiveCampus = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);
  const [archivedCampuses, setArchivedCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast(); // Initialize the toast function

  // Fetch archived campuses from the backend
  useEffect(() => {
    const fetchArchivedCampuses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/archived-campuses", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setArchivedCampuses(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedCampuses();
  }, []);

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
          description: "Campus unarchive successfully.",
          variant: "default", // Use a destructive variant for errors
      }); 
        setArchivedCampuses((prev) => prev.filter((c) => c._id !== campus._id));
      } else {
        console.error("Failed to unarchive campus:", campus.campus_name);
      }
    } catch (error) {
      console.error("Error unarchiving campus:", error);
    }
  };

  if (error) return <p>Error: {error.message}</p>;

  
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
        data={archivedCampuses} // Pass the fetched data
        columns={campusColumns}
        filters={filters}
        setFilters={setFilters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        columnActions={{ handleUnarchive }} // Pass the handleUnarchive function
      />
    </div>
  );
};

export default ArchiveCampus;