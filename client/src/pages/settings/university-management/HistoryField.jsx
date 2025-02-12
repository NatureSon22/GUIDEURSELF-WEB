import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Editor } from "@tinymce/tinymce-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/quillConfig.js"; 
import "@/quillCustom.css";

const HistoryField = () => {
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
  const [history, setHistory] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/university/675cdd9756f690410f1473b8`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        setHistory(data.university_history || ""); 
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching university history:", error);
      }
    };
    fetchHistory();
  }, []);

  const handleEditorChange = (content) => {
    setHistory(content);
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
          body: JSON.stringify({ university_history: history }),
        }
      );
      if (response.ok) {
        toast({
          title: "Success",
          description: "University history successfully updated",
        });
        setEdit(false); 
      } else {
        console.error("Failed to update university history");
      }
    } catch (error) {
      console.error("Error updating university history:", error);
    }
  };

  const handleCancel = () => {
    setEdit(false);
  };

  return (
    <Layout
      title={"History"}
      subtitle={"Overview of the History of the university"}
      toggleEditMode={setEdit}
    >
      {isLoading ? (
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
                  <p className="font-bold">University History</p>
                  <p>Overview of the History of the university.</p>
                </div>
                <ReactQuill
                  value={history}
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
                  dangerouslySetInnerHTML={{ __html: history }}
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

HistoryField.propTypes = {
  isLoading: PropTypes.bool,
};

export default HistoryField;
