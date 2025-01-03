import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
const ProfileField = ({ isLoading, user_photo_url }) => {
  const [edit, setEdit] = useState(false);
  const inputRef = useRef(null);
  const [img, setImg] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImg(URL.createObjectURL(file)); // Preview the selected image
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleInputClick = () => {
    inputRef.current.click();
  };

  const handleUpdate = () => {
    if (img) {
      console.log("Uploading image...");
      // Add API call or logic to upload the image
    } else {
      alert("No image selected!");
    }
  };

  return (
    <Layout
      title={"Manage Profile"}
      subtitle={"Update profile photo"}
      setEdit={setEdit}
    >
      {isLoading ? (
        <Skeleton className="w-[240px] rounded-md bg-secondary-200/40 py-24"></Skeleton>
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
                {img ? (
                  <img
                    src={img}
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
                src={user_photo_url}
                alt="Profile photo of user"
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

ProfileField.propTypes = {
  isLoading: PropTypes.bool,
  user_photo_url: PropTypes.string,
};

export default ProfileField;
