import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GrPowerReset } from "react-icons/gr";
import DataTable from "@/components/DataTable";
import keyOfficialsColumns from "@/components/columns/ArchiveKeyOfficials";
import { useToast } from "@/hooks/use-toast";
import useUserStore from "@/context/useUserStore";
import { useMutation } from "@tanstack/react-query";
import DialogContainer from "@/components/DialogContainer";
import { FaCircleExclamation } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import useToggleTheme from "@/context/useToggleTheme";

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
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Fetch archived key officials
  const {
    data: archivedOfficials,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["archivedOfficials"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/keyofficials/archived`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to fetch archived key officials");
      }

      return response.json();
    },
  });

  // Fetch positions for filtering
  // const getPositions = async () => {
  //   const response = await fetch(
  //     `${import.meta.env.VITE_API_URL}/administartiveposition`,
  //     {
  //       method: "GET",
  //       credentials: "include",
  //     },
  //   );

  //   if (!response.ok) {
  //     throw new Error("Failed to fetch positions");
  //   }

  //   const data = await response.json();
  //   return data.map((position) => ({
  //     value: position._id,
  //     label: position.position_name || position.administartive_position_name,
  //   }));
  // };

  // Filter archived officials based on search, date range, and position
  const filteredOfficials = useMemo(() => {
    if (!archivedOfficials) return [];

    return archivedOfficials.filter((official) => {
      const matchesFilters = filters.every((filter) => {
        if (!filter.value) return true;
        return (
          official[filter.id]?.toLowerCase() === filter.value.toLowerCase()
        );
      });

      const officialDate = new Date(official.date_last_modified);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const matchesDateRange =
        (!from || officialDate >= from) && (!to || officialDate <= to);

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
    setIsDeleting(true);
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/keyofficials/delete-bulk`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedIds }),
          credentials: "include",
        },
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to delete official");

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
        setOpenModal(false);
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
    return;
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
        <p className={` ${isDarkMode ? "text-dark-text-base-300" : ""} `}>
          Filters:
        </p>
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
        <DialogContainer openDialog={openModal}>
          <div className="flex flex-col items-center gap-5">
            <FaCircleExclamation className="text-[2.5rem] text-base-200" />
            <p className="text-center text-[0.91rem] font-semibold">
              Warning: Once deleted, these key official cannot be restored. Do
              you want to proceed?
            </p>
            <div className="flex w-full gap-4">
              <Button
                variant="outline"
                className="flex-1 border-secondary-200 py-1 text-secondary-100-75"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteSelected}
                className="flex-1 border border-base-200 bg-base-200/10 py-1 text-base-200 shadow-none hover:bg-base-200/10"
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

export default ArchiveKeyOfficials;
