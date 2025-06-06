import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { update } from "@/api/accounts";
import { useToast } from "@/hooks/use-toast";
import useToggleTheme from "@/context/useToggleTheme";
const ProfileField = ({ isLoading, user_photo_url, _id }) => {
  const [edit, setEdit] = useState(false);
  const inputRef = useRef(null);
  const [img, setImg] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isDarkMode } = useToggleTheme((state) => state);

  const { mutateAsync: handleUpdateProfile, isPending: isUpdating } =
    useMutation({
      mutationFn: update,
      onSuccess: (data) => {
        queryClient.invalidateQueries(["user"]);
        toast({
          title: "Success",
          description: data.message,
        });
        setEdit(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          type: "destructive",
        });
      },
    });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImg(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleInputClick = () => {
    inputRef.current.click();
  };

  const handleUpdate = () => {
    if (img) {
      const formData = new FormData();
      formData.append("profile_photo", inputRef.current.files[0]);
      formData.append("accountId", _id);
      handleUpdateProfile(formData);
    } else {
      alert("No image selected!");
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setImg(null);
  };

  return (
    <Layout
      title={"Manage Profile"}
      subtitle={"Update profile photo"}
      toggleEditMode={setEdit}
    >
      {isLoading ? (
        <Skeleton className="w-[240px] py-24"></Skeleton>
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
                className="grid size-[240px] cursor-pointer place-items-center overflow-hidden rounded-md border"
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
                  <IoMdAdd
                    className={`text-[3rem] ${isDarkMode ? "text-dark-secondary-100-75" : "text-secondary-100/40"} `}
                  />
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
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className={
                  isDarkMode ? "border border-dark-secondary-100-75" : ""
                }
              >
                Update
              </Button>
              <Button
                variant="ghost"
                onClick={handleCancel}
                className={isDarkMode ? "bg-dark-secondary-100-75" : ""}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

ProfileField.propTypes = {
  isLoading: PropTypes.bool,
  user_photo_url: PropTypes.string,
  _id: PropTypes.string,
};

export default ProfileField;
