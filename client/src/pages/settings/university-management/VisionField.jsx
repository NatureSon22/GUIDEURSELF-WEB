import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQuery and useQueryClient
import { getUniversityData } from "@/api/component-info";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/quillConfig.js"; 
import useToggleTheme from "@/context/useToggleTheme";
import "@/quillCustom.css";

const VisionField = () => {
  const { toast } = useToast();
  const { isDarkMode } = useToggleTheme((state) => state);
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
      [{ size: ["small", "large", "huge"] }] // Add font size option
    ],
  };
  const [edit, setEdit] = useState(false);

  // Use useQueryClient to invalidate and refetch data
  const queryClient = useQueryClient();

  // Fetch university data using useQuery
  const { data: university, isLoading, isError } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  const [vision, setVision] = useState("");

  // Sync the `vision` state with the fetched data
  useEffect(() => {
    if (university) {
      setVision(university.university_vision);
    }
  }, [university]);

  const handleEditorChange = (content) => {
    setVision(content);
  };

  const handleClickUpdate = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/university/675cdd9756f690410f1473b8`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ university_vision: vision }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "University vision successfully updated",
        });
        setEdit(false);

        // Invalidate and refetch the "universitysettings" query to get the latest data
        await queryClient.invalidateQueries(["universitysettings"]);
      } else {
        toast({
          title: "Failed",
          description: "University vision unsuccessfully updated",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "University vision unsuccessfully updated",
        variant: "error",
      });
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setVision(university?.university_vision || ""); // Reset to the original value
  };

  return (
    <Layout
      title={"University Vision"}
      subtitle={"The official vision of the university"}
      toggleEditMode={setEdit}
    >
      {isLoading || !university ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="fixed inset-0 flex justify-center items-center bg-[#000000cc]">
              <div className="bg-white p-6 rounded-md h-[700px] w-[60%] flex flex-col gap-3">
                <div>
                  <p className="font-bold">University Vision</p>
                  <p>The official vision of the university.</p>
                </div>
                <ReactQuill
                  value={vision}
                  onChange={handleEditorChange}
                  className="h-[74%] text-lg"
                  modules={modules}
                  style={{
                    borderRadius: '8px', 
                  }}
                  placeholder="Enter the platform and information details"
                />
                <div className="w-full mt-[55px] items-center flex flex-row-reverse">
                  <Button onClick={handleClickUpdate}>Update</Button>
                  <Button variant="ghost" className="px-6" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ql-editor p-2 h-full w-full rounded-md">
              <hr />
              <div
                dangerouslySetInnerHTML={{ __html: university.university_vision }}
                className={`p-4 text-justify leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
              ></div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

VisionField.propTypes = {
  universityvision: PropTypes.string,
};

export default VisionField;