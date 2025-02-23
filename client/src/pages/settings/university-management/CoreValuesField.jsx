import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/quillConfig.js"; 
import "@/quillCustom.css";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { getUniversityData } from "@/api/component-info";

const CoreValuesField = () => {
  const { toast } = useToast();
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
      [{ size: ["small", "normal", "large", "huge"] }] // Add font size option
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

  const [coreValues, setCoreValues] = useState("");

  // Sync the `coreValues` state with the fetched data
  useEffect(() => {
    if (university) {
      setCoreValues(university.university_core_values);
    }
  }, [university]);

  const handleEditorChange = (content) => {
    setCoreValues(content);
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
          body: JSON.stringify({ university_core_values: coreValues }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "University core values successfully updated",
        });
        setEdit(false);

        // Invalidate and refetch the "universitysettings" query to get the latest data
        await queryClient.invalidateQueries(["universitysettings"]);
      } else {
        toast({
          title: "Failed",
          description: "University core values unsuccessfully updated",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "University core values unsuccessfully updated",
        variant: "error",
      });m
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setCoreValues(university?.university_core_values || ""); // Reset to the original value
  };

  return (
    <Layout
      title={"University Core Values"}
      subtitle={"The core values of the university"}
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
                  <p className="font-bold">University Core Values</p>
                  <p>The core values of the university.</p>
                </div>
                <ReactQuill
                  value={coreValues}
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
            <div className="p-2 h-full flex flex-col">
              <hr />
              <div
                dangerouslySetInnerHTML={{ __html: university.university_core_values }}
                className="ql-editor list-disc list-outside p-4 text-gray-700 text-justify leading-relaxed"
              ></div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

CoreValuesField.propTypes = {
  universityCoreValues: PropTypes.string,
};

export default CoreValuesField;