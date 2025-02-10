import { useState, useEffect, useMemo } from "react";
import DataTable from "@/components/DataTable";
import ComboBox from "@/components/ComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import { Input } from "@/components/ui/input";
import virtualTourColumns from "@/components/columns/ArchiveVirtualTour";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCampuses } from "@/api/component-info";
import { get } from "lodash";

const ArchiveVirtualTour = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });

  const {
    data: archivedItems,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["archivedItems"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/archived-items", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch archived items");
      }

      return response.json();
    },
  });

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
      console.log("Response from backend:", result);

      if (!response.ok) throw new Error(result.message || "Failed to unarchive item");

      queryClient.invalidateQueries("archivedItems");

      toast({
        title: "Success",
        description: "Item unarchived successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Unsuccessfull",
        description: "Item parent is also in the archived. Retrieved it first!",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
  };

  useEffect(() => {
    console.log("Filters:", filters);
  }, [filters]);

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
                  options={allCampuses || []}
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
          data={archivedItems}
          columns={virtualTourColumns}
          filters={filters}
          setFilters={setFilters}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnActions={{ handleUnarchive: handleUnarchiveItem }}
        />
      </div>
    </div>
  );
};

export default ArchiveVirtualTour;