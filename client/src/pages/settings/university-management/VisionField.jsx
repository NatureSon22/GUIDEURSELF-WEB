import { useState } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const VisionField = ({ isLoading, universityvision, onVisionUpdate }) => {
  const [edit, setEdit] = useState(false);
  const [vision, setVision] = useState(universityvision);

  const handleInputChange = (e) => {
    setVision(e.target.value);
  };

  const handleUpdate = async () => {
    if (vision !== universityvision) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/university/675cdd9756f690410f1473b8",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              university_vision: vision,
            }),
            credentials: "include",
          },
        );

        if (response.ok) {
          onVisionUpdate(vision);
          setEdit(false); // Exit the edit mode
        } else {
          alert("Failed to update vision");
        }
      } catch (error) {
        console.error("Error updating vision:", error);
        alert("Error updating vision");
      }
    } else {
      alert("No changes to update");
    }
  };

  return (
    <Layout
      title={"University Vision"}
      subtitle={"The official vision of the university"}
      toggleEditMode={setEdit}
    >
      {isLoading ? (
        <div>Loading...</div> // You can replace this with your actual loading skeleton component
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="flex h-[300px] w-[100%] flex-col">
              <textarea
                value={vision} // Bind the input value to the state
                onChange={handleInputChange} // Update the state on input change
                className="h-full rounded-md border p-2"
                placeholder="Enter the university vision"
                rows={4}
              />
            </div>
          ) : (
            <div className="size-[240px] w-[100%] rounded-md">
              <textarea
                value={universityvision}
                className="h-full w-full p-2 outline-none"
                readOnly
              />
            </div>
          )}

          {edit && (
            <Button onClick={handleUpdate} className="mt-4">
              Update
            </Button>
          )}
        </div>
      )}
    </Layout>
  );
};

VisionField.propTypes = {
  isLoading: PropTypes.bool,
  universityvision: PropTypes.string,
  onVisionUpdate: PropTypes.func.isRequired,
};

export default VisionField;
