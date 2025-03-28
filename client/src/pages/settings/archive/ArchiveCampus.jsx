import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ComboBox";
import { Input } from "@/components/ui/input";
import { GrPowerReset } from "react-icons/gr";
import campusColumns from "@/components/columns/ArchiveCampus";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCampuses } from "@/api/component-info";

const ArchiveCampus = () => {
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

  // Fetch archived campuses
  const { data: archivedCampuses, isLoading, isError, error } = useQuery({
    queryKey: ["archivedCampuses"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/archived-campuses`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch archived campuses");
      return response.json();
    },
  });

  // Fetch archived campuses for dropdown
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

  const { data: allArchivedCampuses } = useQuery({
    queryKey: ["getArchivedCampuses"],
    queryFn: getArchivedCampuses,
  });

  // Filter archived campuses based on date range and other filters
  const filteredCampuses = useMemo(() => {
    if (!archivedCampuses) return [];

    return archivedCampuses.filter((campus) => {
      const matchesFilters = filters.every((filter) => {
        if (filter.value === "") return true;
        return campus[filter.id]?.toLowerCase() === filter.value.toLowerCase();
      });

      const campusDate = new Date(campus.date_added);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const matchesDateRange =
        (!from || campusDate >= from) &&
        (!to || campusDate <= to);

      return matchesFilters && matchesDateRange;
    });
  }, [archivedCampuses, filters, fromDate, toDate]);

  // Handle unarchiving a campus
  const handleUnarchive = async (campus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/archived-campuses/unarchive/${campus._id}`,
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
        queryClient.invalidateQueries(["archivedCampuses"]);
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
    setFromDate("");
    setToDate("");
    setReset(!reset);
  };

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
          options={allArchivedCampuses || []}
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
          data={filteredCampuses} // Apply filtered data
          columns={campusColumns}
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

export default ArchiveCampus;
