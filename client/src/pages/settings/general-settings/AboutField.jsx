import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import the default theme CSS
import "@/quillConfig.js"; // Import the Quill config here
import "@/quillCustom.css";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { getGeneralData } from "@/api/component-info";

const AboutField = ({ isLoading }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Headers
      ["bold", "italic", "underline", "strike"], // Text styling
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ indent: "-1" }, { indent: "+1" }], // Indentation
      [{ align: [] }], // Text alignment
      ["link", "image"], // Link and image
      ["clean"], // Clear formatting
      [{ size: ["small", "normal", "large", "huge"] }],
    ],
  };
  const { toast } = useToast();
  const [edit, setEdit] = useState(false);

  // Use useQueryClient to invalidate and refetch data
  const queryClient = useQueryClient();

  const { data: general, isError } = useQuery({
    queryKey: ["generalsettings"],
    queryFn: getGeneralData,
  });

  const [about, setAbout] = useState("");

  // Sync the `about` state with the `general` data when it changes
  useEffect(() => {
    if (general) {
      setAbout(general.general_about);
    }
  }, [general]);

  const handleInputChange = (content) => {
    setAbout(content);
  };

  const handleClickUpdate = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/general/update/675cdd2056f690410f1473b7`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ general_about: about }),
        },
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "System about successfully updated",
        });
        setEdit(false);

        // Invalidate and refetch the "generalsettings" query to get the latest data
        await queryClient.invalidateQueries(["generalsettings"]);
      } else {
        toast({
          title: "Failed",
          description: "System about unsuccessfully updated",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "System about unsuccessfully updated",
        variant: "error",
      });
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setAbout(general?.general_about || ""); // Reset to the original value
  };

  return (
    <Layout
      title={"About"}
      subtitle={"view platforms and information details"}
      toggleEditMode={setEdit}
    >
      {isLoading || !general ? (
        <div>
          <Skeleton className="h-[300px]" ></Skeleton>
        </div>
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="fixed inset-0 flex items-center justify-center bg-[#000000cc]">
              <div className="flex h-[700px] w-[60%] flex-col gap-3 rounded-md bg-white p-6">
                <div>
                  <p className="font-bold">About the Application</p>
                  <p>Edit the description to provide insight into the application's purpose and functionality.</p>
                </div>
                <ReactQuill
                  value={about}
                  onChange={handleInputChange}
                  className="h-[74%] text-lg"
                  modules={modules}
                  style={{
                    borderRadius: "8px", // Editor container border radius
                  }}
                  placeholder="Enter the platform and information details"
                />
                <div className="mt-[40px] flex w-full flex-row-reverse">
                  <Button onClick={handleClickUpdate} className="mt-4">
                    Update
                  </Button>
                  <Button
                    variant="ghost"
                    className="mt-4 px-6"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col p-2">
              <hr></hr>
              <div className="ql-editor list-outside list-disc p-4">
                <p
                  dangerouslySetInnerHTML={{ __html: general.general_about }}
                  className="whitespace-[20px] h-full w-full p-4 text-justify leading-relaxed text-gray-700"
                ></p>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

AboutField.propTypes = {
  isLoading: PropTypes.bool,
};

export default AboutField;
