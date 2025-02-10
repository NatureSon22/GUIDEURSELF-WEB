import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import BigComboBox from "@/components/BigComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import { Input } from "@/components/ui/input";
import { GrPowerReset } from "react-icons/gr";
import DataTable from "@/components/DataTable";
import keyOfficialsColumns from "@/components/columns/ArchiveKeyOfficials";
import { useToast } from "@/hooks/use-toast";

const ArchiveKeyOfficials = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch archived key officials
  const { data: archivedOfficials, isLoading, isError, error } = useQuery({
    queryKey: ["archivedOfficials"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/keyofficials/archived`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to fetch archived key officials");
      }

      return response.json();
    },
  });

  // Fetch positions and format them for ComboBox
  const getPositions = async () => {
    const response = await fetch("http://localhost:3000/api/administartiveposition", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch positions");
    }

    const data = await response.json();
    return data.map((position) => ({
      value: position._id,
      label: position.position_name || position.administartive_position_name,
    }));
  };

  const { data: allPositions } = useQuery({
    queryKey: ["positions"],
    queryFn: getPositions,
  });

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
          description: "Key Official unarchived successfully.",
          variant: "default",
        });
        queryClient.invalidateQueries("archivedOfficials");
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
        <BigComboBox
          options={allPositions || []}
          placeholder="Select position"
          filter="position_name"
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
