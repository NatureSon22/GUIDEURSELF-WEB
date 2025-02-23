import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {updateVectorLogo} from "@/api/university-settings"
import { useToast } from "@/hooks/use-toast";

const VectorField = ({ isLoading, universityvector }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [edit, setEdit] = useState(false);
  const inputRef = useRef(null);
  const [editimg, setEditImg] = useState(null);
  const [file, setFile] = useState(null);
  const {mutateAsync:handleUpdateVectorLogo, isPending} = useMutation({
    mutationFn:updateVectorLogo, 
    onSuccess: () => {
      queryClient.invalidateQueries(["universitysettings"])
      toast({
        title: "Success",
        description: "University vector successfully updated",
      });
      setEdit(false)
      setFile(null)
      setEditImg(null)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        type: "destructive",
      });
    },
  })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setEditImg(URL.createObjectURL(selectedFile));  // Show preview
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
             
        handleUpdateVectorLogo(file)
        
    } else {
      alert("No image selected!");
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setEditImg(null);
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
                    className="rounded-md object-contain h-[240px] w-[240px]"
                  />
                ) : (
                  <IoMdAdd className="text-[3rem] text-secondary-100/40" />
                )}
              </div>
            </div>
          ) : (
            <div className="grid size-[240px] place-items-center rounded-md border">
              <img
                src={universityvector}
                alt="University Vector"
                className="rounded-md object-contain h-[240px] w-[240px]"
              />
            </div>
          )}

          {edit && (
            <div className="flex items-center space-x-4">
            <Button onClick={handleUpdate} className="mt-4" disabled={isPending}>
              Update
            </Button>
            <Button variant="ghost" className="mt-4" onClick={handleCancel}>
                Cancel
            </Button>
            </div>
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
