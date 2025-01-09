import { useState } from "react";
import addImage from "@/assets/add.png";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPositions} from "@/api/component-info";
import { addPosition } from "@/api/university-settings";
import { useToast } from "@/hooks/use-toast";

const AdministrativeField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: positions, isLoading, isError } = useQuery({
    queryKey: ["universitypositions"],
    queryFn: getPositions,
  });

  const [newPosition, setNewPosition] = useState("");

  const mutation = useMutation({
    mutationFn: addPosition,
    onSuccess: (newPositionData) => {
      queryClient.setQueryData(["universitypositions"], (oldData) => [
        ...(oldData || []),
        newPositionData,
      ]);
      toast({
        title: "Success",
        description: "New position successfully added",
      });

      setNewPosition("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        type: "destructive",
      });
    },
  });

  const handleInputChange = (e) => {
    setNewPosition(e.target.value);
  };

  const handleAddPosition = () => {
    if (newPosition.trim()) {
      mutation.mutate(newPosition);
    }
  };

  return (
    <div className="box-shadow-100 space-y-4 rounded-lg bg-white p-4">
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className="text-[0.95rem] font-semibold">Administrative Position</p>
          <p className="text-[0.85rem] text-secondary-100/60">
            Define key administrative positions
          </p>
        </div>
        <p className="text-[1.1rem] font-semibold">New Position</p>
        <div className="w-[100%] flex flex-row gap-2">
          <input
            className="p-2 w-[85%] h-[40px] outline-none border border-gray-400 rounded-md"
            type="text"
            placeholder="Name of the position"
            value={newPosition}
            onChange={handleInputChange}
          />
          <button
            className="w-[15%] h-[40px] flex justify-evenly items-center border border-gray-400 rounded-md"
            onClick={handleAddPosition}
            disabled={mutation.isLoading}
          >
            <img
              className="w-[30px] h-[30px]"
              src={addImage}
              alt="Add Officials"
            />
            {mutation.isLoading ? "Adding..." : "Add Position"}
          </button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <p>Loading positions...</p>
          ) : isError ? (
            <p>Error fetching positions.</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Position Name</th>
                  <th className="p-2 border">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {(positions || []).length > 0 ? (
                  positions.map((position) => (
                    <tr key={position._id}>
                      <td className="p-2 border text-md">
                        {position.administartive_position_name}
                      </td>
                      <td className="p-2 border text-md">
                        {new Date(position.date_added).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 border" colSpan="2">
                      No positions available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdministrativeField;
