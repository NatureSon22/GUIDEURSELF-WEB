import { useState, useEffect, useMemo } from "react";
import DataTable from "@/components/DataTable";
import ComboBox from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import { Input } from "@/components/ui/input";
import virtualTourColumns from "@/components/columns/ArchiveVirtualTour";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCampuses } from "@/api/component-info";
import { Skeleton } from "@/components/ui/skeleton";

const ArchiveVirtualTour = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);
  const [fromDate, setFromDate] = useState(""); // Date filter state
  const [toDate, setToDate] = useState(""); // Date filter state
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/archived-items`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch archived items");
      }

      return response.json();
    },
  });

  // Filter archived items based on search, date range, and campus
  const filteredItems = useMemo(() => {
    if (!archivedItems) return [];

    return archivedItems.filter((item) => {
      const matchesFilters = filters.every((filter) => {
        if (!filter.value) return true;
        return item[filter.id]?.toLowerCase() === filter.value.toLowerCase();
      });

      const itemDate = new Date(item.date_archived);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const matchesDateRange =
        (!from || itemDate >= from) &&
        (!to || itemDate <= to);

      return matchesFilters && matchesDateRange;
    });
  }, [archivedItems, filters, fromDate, toDate]);

  const handleUnarchiveItem = async (itemId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}//archived-items/${itemId}/unarchive`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();
      console.log("Response from backend:", result);

      if (!response.ok) throw new Error(result.message || "Failed to unarchive item");

      queryClient.invalidateQueries(["archivedItems"]);

      toast({
        title: "Success",
        description: "Item unarchived successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Unsuccessful",
        description: "Item parent is also archived. Retrieve it first!",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setFromDate("");
    setToDate("");
    setReset(!reset);
  };

  useEffect(() => {
    console.log("Filters:", filters);
  }, [filters]);

  if (isLoading) {
    return 
    <Skeleton className="w-[240px] rounded-md bg-secondary-200/40 py-24" />
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
        <Input type="date" className="w-[170px]" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <Input type="date" className="w-[170px]" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <ComboBox
          options={allCampuses || []}
          placeholder="Select campus"
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
          data={filteredItems} // Apply filtered data
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
