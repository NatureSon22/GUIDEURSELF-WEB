import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import BigComboBox from "@/components/BigComboBox";
import { Input } from "@/components/ui/input";
import { GrPowerReset } from "react-icons/gr";
import DataTable from "@/components/DataTable";
import keyOfficialsColumns from "@/components/columns/ArchiveKeyOfficials";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import useUserStore from "@/context/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { IoAlertCircle } from "react-icons/io5";
import { RiDeleteBin7Fill } from "react-icons/ri";

const ArchiveKeyOfficials = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { currentUser } = useUserStore((state) => state);
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [fromDate, setFromDate] = useState(""); // Date filter state
  const [toDate, setToDate] = useState(""); // Date filter state
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Fetch positions for filtering
  const getPositions = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/administartiveposition`, {
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

  // Filter archived officials based on search, date range, and position
  const filteredOfficials = useMemo(() => {
    if (!archivedOfficials) return [];

    return archivedOfficials.filter((official) => {
      const matchesFilters = filters.every((filter) => {
        if (!filter.value) return true;
        return official[filter.id]?.toLowerCase() === filter.value.toLowerCase();
      });

      const officialDate = new Date(official.date_last_modified);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const matchesDateRange =
        (!from || officialDate >= from) &&
        (!to || officialDate <= to);

      return matchesFilters && matchesDateRange;
    });
  }, [archivedOfficials, filters, fromDate, toDate]);

  // Handle unarchiving a key official
  const handleUnarchive = async (official) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/keyofficials/unarchive/${official._id}`,
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
        action: `Retrieved key official ${official.name}`,
        date_created: official.date_added,
        date_last_modified: Date.now(),
    });
        toast({
          title: "Success",
          description: "Key Official unarchived successfully.",
          variant: "default",
        });
        queryClient.invalidateQueries(["archivedOfficials"]);
      } else {
        console.error("Failed to unarchive key official:", official.name);
      }
    } catch (error) {
      console.error("Error unarchiving key official:", error);
    }
  };

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(rowSelection);
  
    if (selectedIds.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one official to delete.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/keyofficials/delete-bulk`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
        credentials: "include",
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete official");
  
      if (response.ok) {
        queryClient.invalidateQueries(["archivedOfficials"]);
  
        toast({
          title: "Success",
          description: `${selectedIds.length} key offocial deleted successfully.`,
          variant: "default",
        });
      await logActivityMutation.mutateAsync({
        user_number: currentUser.user_number,
        username: currentUser.username,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        role_type: currentUser.role_type,
        campus_name: currentUser.campus_name,
        action: `Deleted ${selectedIds.length} key official`,
        date_created: Date.now(),
        date_last_modified: Date.now(),
      });
      setOpenModal(false)
      setRowSelection({});
      }
       // Clear selection after deletion
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to official items.",
        variant: "destructive",
      });
    }
  };  

  // Handle resetting filters
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
          data={filteredOfficials} // Apply filtered data
          columns={keyOfficialsColumns}
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

export default ArchiveKeyOfficials;
