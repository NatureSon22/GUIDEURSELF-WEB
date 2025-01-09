import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Editor } from "@tinymce/tinymce-react"; 
import { getUniversityData } from "@/api/component-info";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/quillConfig.js"; 
import "@/quillCustom.css";

const MissionField = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [mission, setMission] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUniversityData();
        setMission(data.university_mission || "No mission available");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching university data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  

  const handleEditorChange = (content) => {
    setMission(content);
  };

  const handleClickUpdate = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/university/675cdd9756f690410f1473b8",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ universitymission: mission }),
        }
      );
      if (response.ok) {
        toast({
          title: "Success",
          description: "University mission successfully updated",
        });
        setEdit(false);
      } else {
        console.error("Failed to update mission");
      }
    } catch (error) {
      console.error("Error updating mission:", error);
    }
  };

  const handleCancel = () => {
    setEdit(false);
  };

  return (
    <Layout
      title={"University Mission"}
      subtitle={"The official mission of the university"}
      toggleEditMode={setEdit}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="fixed inset-0 flex justify-center items-center bg-[#000000cc]">
              <div className="bg-white p-6 rounded-md h-[700px] w-[60%] flex flex-col gap-3">
                <div>
                  <p className="font-bold">University Mission</p>
                  <p>The official mission of the university.</p>
                </div>
                <ReactQuill
                  value={mission}
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
            <div className="ql-editor w-[100%] h-full flex flex-col">
              <hr className="mb-[20px]" />
              <div dangerouslySetInnerHTML={{ __html: mission }} />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

MissionField.propTypes = {
  isLoading: PropTypes.bool,
};

export default MissionField;
