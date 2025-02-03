import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import ComboBox from "@/components/ComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import DataTable from "@/components/DataTable";
import keyOfficialsColumns from "@/components/columns/ArchiveKeyOfficials";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook

const ArchiveKeyOfficials = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);
  const [archivedOfficials, setArchivedOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
      const { toast } = useToast(); // Initialize the toast function

  // Fetch archived key officials
  useEffect(() => {
    const fetchArchivedOfficials = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/keyofficials/archived", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch archived key officials");
        }

        const data = await response.json();
        setArchivedOfficials(data);
        
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedOfficials();
  }, []);

  // Handle unarchiving a key official
  const handleUnarchive = async (official) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/keyofficials/unarchive/${official._id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
  
      if (response.ok) {
        toast({
          title: "Success",
          description: "Key Official unarchive successfully.",
          variant: "default", // Use a destructive variant for errors
      }); 
        setArchivedOfficials((prev) => prev.filter((o) => o._id !== official._id));
      } else {
        console.error("Failed to unarchive key official:", official.name);
      }
    } catch (error) {
      console.error("Error unarchiving key official:", error);
    }
  };

  // Handle resetting filters
  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
  };
  
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-5 flex flex-col">
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

      <div className="flex-1">
      <DataTable
        data={archivedOfficials}
        columns={keyOfficialsColumns}
        filters={filters}
        setFilters={setFilters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        columnActions={{ handleUnarchive }}
      />
      </div>

    </div>
  );
};

export default ArchiveKeyOfficials;
