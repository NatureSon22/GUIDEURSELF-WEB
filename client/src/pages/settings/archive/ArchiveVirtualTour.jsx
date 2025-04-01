import { useState, useEffect, useMemo } from "react";
import DataTable from "@/components/DataTable";
import ComboBox from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import useUserStore from "@/context/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { GrPowerReset } from "react-icons/gr";
import { Input } from "@/components/ui/input";
import virtualTourColumns from "@/components/columns/ArchiveVirtualTour";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCampuses } from "@/api/component-info";
import { Skeleton } from "@/components/ui/skeleton";
import { IoAlertCircle } from "react-icons/io5";
import { RiDeleteBin7Fill } from "react-icons/ri";

const ArchiveVirtualTour = () => {
  const { currentUser } = useUserStore((state) => state);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [fromDate, setFromDate] = useState(""); // Date filter state
  const [toDate, setToDate] = useState(""); // Date filter state
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchValue = globalFilter?.toLowerCase() || "";

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

  const filteredItems = useMemo(() => {
    if (!archivedItems) return [];
  
    const transformedItems = archivedItems.map((item) => ({
      ...item,
      item_name: item.type === "floor"
        ? item.floor_data?.floor_name || "N/A"
        : item.location_data?.marker_name || "N/A"
    }));
  
    return transformedItems.filter((item) => {
      // Global text search
      const matchesGlobalSearch = !globalFilter || 
        ["campus_name", "type", "item_name"].some((key) => {
          const value = item[key];
          return typeof value === "string" && value.toLowerCase().includes(searchValue);
        });
  
      // Filters (e.g., campus filter)
      const matchesFilters = filters.every((filter) => {
        if (!filter.value) return true;
        return item[filter.id]?.toLowerCase() === filter.value.toLowerCase();
      });
  
      // Date range filtering
      const itemDate = new Date(item.date_last_modified);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
  
      const matchesDateRange = (!from || itemDate >= from) && (!to || itemDate <= to);
  
      return matchesGlobalSearch && matchesFilters && matchesDateRange;
    });
  }, [archivedItems, filters, fromDate, toDate, globalFilter]);

  const handleUnarchiveItem = async (itemId, itemName) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/archived-items/${itemId}/unarchive`,
        {
          method: "POST",
          credentials: "include",
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) throw new Error(result.message || "Item parent is also archived. Retrieve it first!");
  
      queryClient.invalidateQueries(["archivedItems"]);
  
      await logActivityMutation.mutateAsync({
        user_number: currentUser.user_number,
        username: currentUser.username,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        role_type: currentUser.role_type,
        campus_name: currentUser.campus_name,
        action: `Retrieved an item: ${itemName}`,
        date_created: Date.now(),
        date_last_modified: Date.now(),
      });

      
  
      toast({
        title: "Success",
        description: "Item unarchived successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Unsuccessful",
        description: error.message === "ITEM_PARENT_ARCHIVED" 
          ? "Item parent is also archived. Retrieve it first!" 
          : "Item parent is also archived. Retrieve it first!",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(rowSelection);
  
    if (selectedIds.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to delete.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/archived-items/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
        credentials: "include",
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete items");
  
      queryClient.invalidateQueries(["archivedItems"]);
  
      toast({
        title: "Success",
        description: `${selectedIds.length} item deleted successfully.`,
        variant: "default",
      });

      await logActivityMutation.mutateAsync({
        user_number: currentUser.user_number,
        username: currentUser.username,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        role_type: currentUser.role_type,
        campus_name: currentUser.campus_name,
        action: `Deleted ${selectedIds.length} item`,
        date_created: Date.now(),
        date_last_modified: Date.now(),
      });
  
      setOpenModal(false);
      setRowSelection({}); // Clear selection after deletion
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete items.",
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
        data={filteredItems}
        columns={virtualTourColumns}
        filters={filters}
        setFilters={setFilters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        columnActions={{ 
          handleUnarchive: (itemId, itemName) => handleUnarchiveItem(itemId, itemName),
        }}
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

export default ArchiveVirtualTour;
