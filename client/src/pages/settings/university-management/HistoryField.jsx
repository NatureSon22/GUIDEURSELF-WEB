import { useState } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const HistoryField = ({ isLoading, universityhistory, onHistoryUpdate }) => {
  const [edit, setEdit] = useState(false);
  const [history, setHistory] = useState(universityhistory); // Store the updated history value

  const handleInputChange = (e) => {
    setHistory(e.target.value); // Update the local state as the user types
  };

  const handleUpdate = async () => {
    if (history !== universityhistory) {
      try {
        const response = await fetch("http://localhost:3000/api/university/675cdd9756f690410f1473b8", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            university_history: history,
          }),
          credentials: "include",
        });

        if (response.ok) {
          onHistoryUpdate(history);
          setEdit(false); // Exit the edit mode
        } else {
          alert("Failed to update history");
        }
      } catch (error) {
        console.error("Error updating history:", error);
        alert("Error updating history");
      }
    } else {
      alert("No changes to update");
    }
  };

  return (
    <Layout
      title={"History"}
      subtitle={"Overview of the History of the university"}
      setEdit={setEdit}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="w-[100%] h-[500px] flex flex-col">
              <textarea
                value={history} // Bind the input value to the state
                onChange={handleInputChange} // Update the state on input change
                className="p-2 w-full h-full rounded-md border"
                placeholder="Enter the university history"
                rows={4}
              />
            </div>
          ) : (
            <div className="w-[100%] h-[500px] rounded-md">
              <textarea
              value={universityhistory}
              className="p-2 h-full w-full outline-none"
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

HistoryField.propTypes = {
  isLoading: PropTypes.bool,
  universityhistory: PropTypes.string,
  onHistoryUpdate: PropTypes.func.isRequired,
};

export default HistoryField;
