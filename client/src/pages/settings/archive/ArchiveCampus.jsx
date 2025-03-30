import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ComboBox";
import { Input } from "@/components/ui/input";
import { GrPowerReset } from "react-icons/gr";
import campusColumns from "@/components/columns/ArchiveCampus";
import useUserStore from "@/context/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCampuses } from "@/api/component-info";
import { IoAlertCircle } from "react-icons/io5";
import { RiDeleteBin7Fill } from "react-icons/ri";

const ArchiveCampus = () => {
  const { currentUser } = useUserStore((state) => state);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [reset, setReset] = useState(false);
  const [fromDate, setFromDate] = useState(""); // Date filter state
  const [toDate, setToDate] = useState(""); // Date filter state
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });

  
  const openConfirmationModal = () => {
    setOpenModal(true);
  }
  
  const logActivityMutation = useMutation({
    mutationFn: async (logData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/activitylogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
        credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to log activity");
        }
        return response.json();
        },
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

      const campusDate = new Date(campus.date_last_modified);
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
        await logActivityMutation.mutateAsync({
          user_number: currentUser.user_number, // Replace with actual user number
          username: currentUser.username, // Replace with actual username
          firstname: currentUser.firstname, // Replace with actual firstname
          lastname: currentUser.lastname, // Replace with actual lastname
          role_type: currentUser.role_type, // Replace with actual role type
          campus_name: currentUser.campus_name, // Replace with actual campus name
          action: `Retrieved ${campus.campus_name} Campus`,
          date_created: campus.date_added,
          date_last_modified: Date.now(),
      });
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

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(rowSelection);
  
    if (selectedIds.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one campus to delete.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses/delete-bulk`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
        credentials: "include",
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete campuses");
  
      if (response.ok) {
        queryClient.invalidateQueries(["archivedCampuses"]);
  
        toast({
          title: "Success",
          description: `${selectedIds.length} campus deleted successfully.`,
          variant: "default",
        });

      await logActivityMutation.mutateAsync({
        user_number: currentUser.user_number,
        username: currentUser.username,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        role_type: currentUser.role_type,
        campus_name: currentUser.campus_name,
        action: `Deleted  ${selectedIds.length} campus`,
        date_created: Date.now(),
        date_last_modified: Date.now(),
      });
    
      setOpenModal(false);
      setRowSelection({});
      }
       // Clear selection after deletion
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete campus.",
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

  if (isLoading) {
    return 
    <Skeleton className="w-[240px] rounded-md bg-secondary-200/40 py-24" />
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-1 flex-col space-y-5">
      <div className="flex items-center gap-5">
        <Input
          type="text"
          placeholder="Search"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <Button
          className="bg-red-500 text-white"
          disabled={Object.keys(rowSelection).length === 0}
          onClick={openConfirmationModal}
        >
          <RiDeleteBin7Fill/>
          Clear Archives
        </Button>
      </div>   

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
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          setGlobalFilter={setGlobalFilter}
          columnActions={{ handleUnarchive }}
        />
      </div>
      {openModal && (
              <div className="fixed !mt-0 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="flex w-[500px] flex-col items-center justify-center rounded-md bg-secondary-300 p-6 text-center shadow-md">
                  <IoAlertCircle className="text-[3rem] text-base-200" />
                  <p className="text-md my-4 text-gray-600">
                  Once you proceed, the selected data will be permanently deleted and cannot be restored.
                  </p>
                  <div className="mt-4 flex w-[100%] justify-center gap-4">
                    <button
                      onClick={() => setOpenModal(false)}
                      className="w-[100%] rounded-md border border-secondary-210 bg-secondary-300 px-4 py-2 text-secondary-210"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      className="w-[100%] rounded-md border border-base-200 bg-base-210 px-4 py-2 text-base-200"
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default ArchiveCampus;
