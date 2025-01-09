import { useState } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const MissionField = ({ isLoading, universitymission, onMissionUpdate }) => {
  const [edit, setEdit] = useState(false);
  const [mission, setMission] = useState(universitymission); // Store the updated mission value

  const handleInputChange = (e) => {
    setMission(e.target.value); // Update the local state as the user types
  };

  const handleUpdate = async () => {
    if (mission !== universitymission) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/university/675cdd9756f690410f1473b8",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              university_mission: mission,
            }),
            credentials: "include",
          },
        );

        if (response.ok) {
          onMissionUpdate(mission);
          setEdit(false); // Exit the edit mode
        } else {
          alert("Failed to update mission");
        }
      } catch (error) {
        console.error("Error updating mission:", error);
        alert("Error updating mission");
      }
    } else {
      alert("No changes to update");
    }
  };

  return (
    <Layout
      title={"University Mission"}
      subtitle={"The official mission of the university"}
      toggleEditMode={setEdit}
    >
      {isLoading ? (
        <div>Loading...</div> // You can replace this with your actual loading skeleton component
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="flex h-[400px] w-[100%] flex-col">
              <textarea
                value={mission} // Bind the input value to the state
                onChange={handleInputChange} // Update the state on input change
                className="h-full rounded-md border p-2"
                placeholder="Enter the university mission"
                rows={4}
              />
            </div>
          ) : (
            <div className="flex h-[200px] w-[100%] flex-col">
              <textarea
                value={universitymission}
                className="h-full p-2 outline-none"
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

MissionField.propTypes = {
  isLoading: PropTypes.bool,
  universitymission: PropTypes.string,
  onMissionUpdate: PropTypes.func.isRequired,
};

export default MissionField;
