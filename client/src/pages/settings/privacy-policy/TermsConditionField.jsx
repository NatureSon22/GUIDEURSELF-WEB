import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/quillConfig.js"; 
import "@/quillCustom.css";
import { useToast } from "@/hooks/use-toast";

const TermsConditionsField = ({isLoading, systemconditions}) => {
    const modules = {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
          [{ size: ["small", "normal" , "large", "huge"] }] // Add font size option
        ],
      };
  const { toast } = useToast();
  const [edit, setEdit] = useState(false);
  const [conditions, setConditions] = useState(systemconditions);

  useEffect(() => {
    const fetchTermsConditions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/general/675cdd2056f690410f1473b7`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setConditions(data.terms_conditions); 
        } else {
          console.error("Failed to fetch terms and conditions");
        }
      } catch (error) {
        console.error("Error fetching terms and conditions:", error);
      } 
    };

    fetchTermsConditions();
  }, []);

  
  const handleInputChange = (content) => {
    setConditions(content); 
  };

  const handleClickUpdate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/general/675cdd2056f690410f1473b7`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ terms_conditions: conditions }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "System terms of service successfully updated",
        });
        setEdit(false);
      } else {
        console.error("Failed to update terms and conditions");
        alert("Failed to update the terms. Please try again.");
      }
    } catch (error) {
      console.error("Error updating terms and conditions:", error);
      alert("Error updating terms and conditions. Please try again.");
    }
  };

  
  const handleCancel = () => {
    setEdit(false);
  };

  return (
    <Layout
      title={"Terms of Service"}
      subtitle={"Modify the terms users must agree to."}
      toggleEditMode={setEdit}
    >
      {isLoading ? (
        <Skeleton className="w-[100%] h-[700px] rounded-md bg-secondary-200/40 py-24" />
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="fixed inset-0 flex justify-center items-center bg-[#000000cc]">
              <div className="bg-white p-6 rounded-md h-[700px] w-[60%] flex flex-col gap-3">
                <div>
                  <p className="font-bold">Terms of Service</p>
                  <p>Modify the terms users must agree to.</p>
                </div>
                <ReactQuill
                  value={conditions}
                  onChange={handleInputChange}
                  className="h-[74%] text-lg"
                  modules={modules}
                  style={{
                    borderRadius: '8px', 
                  }}
                  placeholder="Enter the platform and information details"
                />
                <div className="w-full mt-[40px] flex flex-row-reverse">
                  <Button onClick={handleClickUpdate} className="mt-4">
                    Update
                  </Button>
                  <Button variant="ghost" className="mt-4 px-6" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2 h-full flex flex-col">
              <hr />
              <div className="ql-editor list-disc list-outside p-4">
                <p
                  dangerouslySetInnerHTML={{ __html: conditions }}
                  className="p-4 h-full w-full text-gray-700 text-justify whitespace-[20px] leading-relaxed"
                ></p>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

TermsConditionsField.propTypes = {
  isLoading: PropTypes.bool,
  systemconditions: PropTypes.string
};

export default TermsConditionsField;
