import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";

const SystemLogoField = ({ isLoading, generallogo }) => {
  const [edit, setEdit] = useState(false);
  const inputRef = useRef(null);
  const [editimg, setEditImg] = useState(null);
  const [img, setImg] = useState(generallogo); // Initialize with existing logo
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setEditImg(URL.createObjectURL(selectedFile)); // Show preview
      setFile(selectedFile);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleInputClick = () => {
    inputRef.current.click();
  };

  const handleUpdate = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("general_logo_url", file);

        const response = await fetch(
          `http://localhost:3000/api/general/675cdd2056f690410f1473b7`,
          {
            method: "PUT",
            credentials: "include",
            body: formData,
          },
        );

        if (response.ok) {
          const data = await response.json(); // Get the updated data from response
          const newLogoUrl = data.updatedGeneral.general_logo_url; // Extract new logo URL
          setImg(newLogoUrl); // Update the image immediately
          setEditImg(null);
          setEdit(false); // Exit edit mode
        } else {
          alert("Failed to update logo");
        }
      } catch (error) {
        console.error("Error uploading logo:", error);
        alert("Error uploading logo");
      }
    } else {
      alert("No image selected!");
    }
  };

  return (
    <Layout
      title={"University Official Logo"}
      subtitle={"Update official logo of the university"}
      toggleEditMode={setEdit}
    >
      {isLoading ? (
        <Skeleton className="w-[240px] rounded-md bg-secondary-200/40 py-24" />
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div>
              <input
                className="hidden"
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
              />
              <div
                className="grid size-[240px] cursor-pointer place-items-center rounded-md border"
                onClick={handleInputClick}
                aria-label="Upload new profile photo"
              >
                {editimg ? (
                  <img
                    src={editimg}
                    alt="Selected file preview"
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <IoMdAdd className="text-[3rem] text-secondary-100/40" />
                )}
              </div>
            </div>
          ) : (
            <div className="flex size-[240px] items-center justify-center rounded-md">
              <img
                src={img} // Use updated image directly
                alt="University Logo"
                className="rounded-md object-cover"
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

SystemLogoField.propTypes = {
  isLoading: PropTypes.bool,
  generallogo: PropTypes.string,
};

export default SystemLogoField;
