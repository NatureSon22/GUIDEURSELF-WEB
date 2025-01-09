import { useState } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";

const AboutField = ({ isLoading, systemabout, onAboutUpdate }) => {
  const [edit, setEdit] = useState(false);
  const [about, setAbout] = useState(systemabout); // Store the updated mission value

  const handleInputChange = (e) => {
    setAbout(e.target.value); // Update the local state as the user types
  };

  const handleUpdate = async () => {
    if (about !== systemabout) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/general/675cdd2056f690410f1473b7",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              general_about: about,
            }),
            credentials: "include",
          },
        );

        if (response.ok) {
          onAboutUpdate(about);
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
      title={"About"}
      subtitle={"view platforms and information details"}
      toggleEditMode={setEdit}
    >
      {isLoading ? (
        <div>Loading...</div> // You can replace this with your actual loading skeleton component
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="flex h-[500px] w-[100%] flex-col">
              <textarea
                value={about} // Bind the input value to the state
                onChange={handleInputChange} // Update the state on input change
                className="h-full rounded-md border p-2"
                placeholder="Enter the university mission"
                rows={4}
              />
            </div>
          ) : (
            <div className="flex h-[500px] flex-col p-2">
              <textarea
                value={systemabout}
                readOnly
                className="h-full resize-none p-2 outline-none"
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

AboutField.propTypes = {
  isLoading: PropTypes.bool,
  systemabout: PropTypes.string,
  onAboutUpdate: PropTypes.func.isRequired,
};

export default AboutField;
