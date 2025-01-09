import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import "@/quillConfig.js"; 
import "@/quillCustom.css";
import { useToast } from "@/hooks/use-toast";

const PoliciesField = ({isLoading, systempolicy}) => {
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
  const { toast } = useToast();
  const [edit, setEdit] = useState(false);
  const [policies, setPolicy] = useState(systempolicy);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/general/675cdd2056f690410f1473b7", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setPolicy(data.privacy_policies); 
        } else {
          console.error("Failed to fetch terms and conditions");
        }
      } catch (error) {
        console.error("Error fetching terms and conditions:", error);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  const handleInputChange = (content) => {
    setPolicy(content); 
  };

  const handleClickUpdate = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/general/675cdd2056f690410f1473b7", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ privacy_policies: policies }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "System privacy policy successfully updated",
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
      title={"Privacy Policy"}
      subtitle={"Adjust privacy settings to ensure compliance."}
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
                  <p className="font-bold">Privacy Policy</p>
                  <p>Adjust privacy settings to ensure compliance.</p>
                </div>
                <ReactQuill
                  value={policies}
                  onChange={handleInputChange}
                  className="h-[74%] text-lg"
                  modules={modules}
                  style={{
                    borderRadius: '8px',
                    fontSize: '20px',
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
                  dangerouslySetInnerHTML={{ __html: policies }}
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

PoliciesField.propTypes = {
  isLoading: PropTypes.bool,
  systempolicy: PropTypes.string,
};

export default PoliciesField;
