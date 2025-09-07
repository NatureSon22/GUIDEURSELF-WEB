import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GrPowerReset } from "react-icons/gr";
import campusColumns from "@/components/columns/ArchiveCampus";
import useUserStore from "@/context/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import DialogContainer from "@/components/DialogContainer";
import { FaCircleExclamation } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import useToggleTheme from "@/context/useToggleTheme";
import useToggleTheme from "@/context/useToggleTheme";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { isDarkMode } = useToggleTheme((state) => state);

  const openConfirmationModal = () => {
    setOpenModal(true);
  };

  const logActivityMutation = useMutation({
    mutationFn: async (logData) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/activitylogs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logData),
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to log activity");
      }
      return response.json();
    },
  });

  // Fetch archived campuses
  const {
    data: archivedCampuses,
    isError,
    error,
  } = useQuery({
    queryKey: ["archivedCampuses"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/archived-campuses`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Failed to fetch archived campuses");
      return response.json();
    },
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
        (!from || campusDate >= from) && (!to || campusDate <= to);

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
        },
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
    setIsDeleting(true);
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/campuses/delete-bulk`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedIds }),
          credentials: "include",
        },
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to delete campuses");

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

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-1 flex-col space-y-5">
      <div className="flex items-center gap-5">
        <Input
          type="text"
          placeholder="Search"
          className={`${isDarkMode ? "border-transparent bg-dark-secondary-100-75/20 text-dark-text-base-300-75 !placeholder-dark-secondary-100-75" : ""}`}
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <Button
          className="bg-red-500 text-white"
          disabled={Object.keys(rowSelection).length === 0}
          onClick={openConfirmationModal}
        >
          <MdDelete />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-5">
        <p className={` ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} `}>Filters:</p>
        <Input
          type="date"
          className="w-[170px]"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <Input
          type="date"
          className="w-[170px]"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <Button
          className={`ml-auto ${isDarkMode ? "border-dark-text-base-300-75/60 bg-dark-secondary-200 text-dark-text-base-300" : "text-secondary-100-75"} `}
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
        <DialogContainer openDialog={openModal}>
          <div className="flex flex-col items-center gap-5">
            <FaCircleExclamation className="text-[2.5rem] text-base-200" />
            <p className="text-center text-[0.91rem] font-semibold">
              Warning: Once deleted, these campus cannot be restored. Do you
              want to proceed?
            </p>
            <div className="flex w-full gap-4">
              <Button
                variant="outline"
                className="flex-1 border-secondary-200 py-1 text-secondary-100-75"
                onClick={() => setOpenModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 border border-base-200 bg-base-200/10 py-1 text-base-200 shadow-none hover:bg-base-200/10"
                onClick={handleDeleteSelected}
                disabled={isDeleting}
              >
                Proceed
              </Button>
            </div>
          </div>
        </DialogContainer>
      )}
    </div>
  );
};

export default ArchiveCampus;
