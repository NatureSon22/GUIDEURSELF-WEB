import { useState } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";

const TermsConditionsField = ({
  isLoading,
  systemconditions,
  onConditionsUpdate,
}) => {
  const [edit, setEdit] = useState(false);
  const [conditions, setConditions] = useState(systemconditions); // Store the updated mission value

  const handleInputChange = (e) => {
    setConditions(e.target.value); // Update the local state as the user types
  };

  const handleUpdate = async () => {
    if (conditions !== systemconditions) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/general/675cdd2056f690410f1473b7",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              terms_conditions: conditions,
            }),
            credentials: "include",
          },
        );

        if (response.ok) {
          onConditionsUpdate(conditions);
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
      title={"Terms of Service"}
      subtitle={"Modify the terms users must agree to."}
      toggleEditMode={setEdit}
    >
      {isLoading ? (
        <div>Loading...</div> // You can replace this with your actual loading skeleton component
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="flex h-[1050px] w-[100%] flex-col">
              <textarea
                value={conditions} // Bind the input value to the state
                onChange={handleInputChange} // Update the state on input change
                className="h-full rounded-md border p-2"
                placeholder="Enter the university mission"
                rows={4}
              />
            </div>
          ) : (
            <div className="flex h-[1050px] w-[100%] flex-col">
              <textarea
                value={systemconditions}
                className="h-full p-2 outline-none"
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

TermsConditionsField.propTypes = {
  isLoading: PropTypes.bool,
  systemconditions: PropTypes.string,
  onConditionsUpdate: PropTypes.func.isRequired,
};

export default TermsConditionsField;
