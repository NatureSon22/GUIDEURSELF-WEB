import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/quillConfig.js"; 
import "@/quillCustom.css";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQuery and useQueryClient
import { getUniversityData } from "@/api/component-info";

const AboutField = () => {
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

  const [about, setAbout] = useState("");

  // Sync the `about` state with the fetched data
  useEffect(() => {
    if (university) {
        setAbout(university.university_about);
    }
  }, [university]);

  const handleEditorChange = (content) => {
    setAbout(content);
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
          body: JSON.stringify({ university_about: about }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "University about successfully updated",
        });
        setEdit(false);

        // Invalidate and refetch the "universitysettings" query to get the latest data
        await queryClient.invalidateQueries(["universitysettings"]);
      } else {
        console.error("Failed to update university about");
        alert("Failed to update university about. Please try again.");
      }
    } catch (error) {
      console.error("Error updating university about:", error);
      alert("Error updating university about. Please try again.");
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setAbout(university?.university_about || ""); // Reset to the original value
  };

  return (
    <Layout
      title={"University About"}
      subtitle={"Overview of the About of the university"}
      toggleEditMode={setEdit}
    >
      {isLoading || !university ? (
        <div className="space-y-4">
          <Skeleton className="w-[240px] h-[40px]" />
          <Skeleton className="w-[90%] h-[300px] mt-4" />
        </div>
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="fixed inset-0 flex justify-center items-center bg-[#000000cc]">
              <div className="bg-white p-6 rounded-md h-[700px] w-[60%] flex flex-col gap-3">
                <div>
                  <p className="font-bold">University About</p>
                  <p>Overview of the About of the university.</p>
                </div>
                <ReactQuill
                  value={about}
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
              <div className="ql-editor list-disc list-outside p-4">
                <div
                  dangerouslySetInnerHTML={{ __html: university.university_about }}
                  className="p-4 h-full w-full text-gray-700 text-justify leading-relaxed"
                ></div>
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