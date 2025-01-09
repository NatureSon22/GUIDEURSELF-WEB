import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";

const VectorField = ({ isLoading, universityvector }) => {
  const [edit, setEdit] = useState(false);
  const inputRef = useRef(null);
  const [editimg, setEditImg] = useState(null);
  const [img, setImg] = useState(universityvector);
  const [file, setFile] = useState(null); // Store the selected file

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setEditImg(URL.createObjectURL(selectedFile)); // This is just for preview
      setFile(selectedFile); // Store the actual file
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
        formData.append("university_vector_url", file); // Send the actual file

        const response = await fetch(
          `http://localhost:3000/api/university/675cdd9756f690410f1473b8`,
          {
            method: "PUT",
            credentials: "include",
            body: formData,
          },
        );

        if (response.ok) {
          const data = await response.json(); // Get the updated data from response
          const newVectorUrl = data.updatedUniversity.university_vector_url; // Extract new logo URL
          setImg(newVectorUrl); // Update the image immediately
          setEditImg(null);
          setEdit(false); // Exit edit mode
        } else {
          alert("Failed to update vector image");
        }
      } catch (error) {
        console.error("Error uploading vector image:", error);
        alert("Error uploading vector image");
      }
    } else {
      alert("No image selected!");
    }
  };

  return (
    <Layout
      title={"University Official Vector"}
      subtitle={"Update official vector of the university"}
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
                aria-label="Upload new vector image"
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
            <div className="size-[240px] rounded-md">
              <img
                src={img}
                alt="University Vector"
                className="h-full w-full rounded-md object-cover"
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

VectorField.propTypes = {
  isLoading: PropTypes.bool,
  universityvector: PropTypes.string,
};

export default VectorField;
