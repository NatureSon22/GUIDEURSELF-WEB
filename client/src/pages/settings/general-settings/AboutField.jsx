import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import the default theme CSS
import "@/quillConfig.js";  // Import the Quill config here
import "@/quillCustom.css";
import { useToast } from "@/hooks/use-toast";

const AboutField = ({ isLoading, systemabout}) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],  // Headers
      ["bold", "italic", "underline", "strike"],  // Text styling
      [{ list: "ordered" }, { list: "bullet" }],  // Lists
      [{ indent: "-1" }, { indent: "+1" }],  // Indentation
      [{ align: [] }],  // Text alignment
      ["link", "image"],  // Link and image
      ["clean"],  // Clear formatting
      [{ size: ["small", "normal" , "large", "huge"] }] 
    ],
  };
  const { toast } = useToast();
  const [about, setAbout] = useState(systemabout); 
  const [edit, setEdit] = useState(false); 

    useEffect(() => {
      const fetchSystemAbout = async () => {
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
            setAbout(data.general_about); 
          } else {
            console.error("Failed to fetch terms and conditions");
          }
        } catch (error) {
          console.error("Error fetching terms and conditions:", error);
        }
      };
  
      fetchSystemAbout();
    }, []);

    const handleInputChange = (content) => {
      setAbout(content); 
    };
  
  
    const handleClickUpdate = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/general/675cdd2056f690410f1473b7", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ general_about: about }),
        });
  
        if (response.ok) {
          toast({
            title: "Success",
            description: "System about successfully updated",
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
      title={"About"}
      subtitle={"view platforms and information details"}
      toggleEditMode={setEdit}
    >
      {isLoading ? (
        <div>Loading...</div> // You can replace this with your actual loading skeleton component
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
                  value={about}
                  onChange={handleInputChange}
                  className="h-[74%] text-lg"
                  modules={modules}
                  style={{
                    borderRadius: '8px',  // Editor container border radius
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
             <hr></hr>
             <div className="ql-editor list-disc list-outside p-4">
               <p
                 dangerouslySetInnerHTML={{ __html: about }}
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


AboutField.propTypes = {
  isLoading: PropTypes.bool,
  systemabout: PropTypes.string,
};

export default AboutField;
