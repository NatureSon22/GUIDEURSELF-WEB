import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import addImage from "../../assets/add.png";
import CloseIcon from "../../assets/CloseIcon.png";
import AddProgramModal from "./AddNewProgramModal";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import "@/fluttermap.css";
import { FaPen } from "react-icons/fa6";
import EditProgramModal from "./EditNewProgramModal";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AddNewCampus = () => {
  const { toast } = useToast();
  const [position, setPosition] = useState([14.466440, 121.226080]); 
  const [loadingVisible, setLoadingVisible] = useState(false);
  const navigate = useNavigate();
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [programs, setPrograms] = useState({});
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedProgramTypeId, setSelectedProgramTypeId] = useState(null);
  const [selectedProgramIndex, setSelectedProgramIndex] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [campusImage, setCampusImage] = useState(null);
  const [campusData, setCampusData] = useState({
    campus_name: "",
    campus_code: "",
    campus_phone_number: "",
    campus_email: "",
    campus_address: "",
    campus_about: "",
    campus_cover_photo: null,
  });

  useEffect(() => {
      const fetchCampuses = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {method: "get", credentials:"include"});
          const data = await response.json();
          setCampuses(data);
        } catch (error) {
          console.error("Error fetching campuses:", error);
        }
      };
  
      fetchCampuses();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      setIsLoading(true);
    
      const { campus_name, campus_code, campus_phone_number, campus_email, campus_address, campus_about, campus_cover_photo } = campusData;
    
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      // Form validation
      if (
        !campus_name ||
        !campus_code ||
        !campus_phone_number ||
        !campus_email ||
        !campus_address ||
        !campus_about ||
        !coordinates.lat ||
        !coordinates.lng
      ) {
        setLoadingMessage("Please fill out all required fields.");
        setLoadingVisible(true);
        setIsLoading(false);
        setTimeout(() => {
          setLoadingVisible(false);
        }, 2000);
        return;
      }
    
      // Email format validation
      if (!emailRegex.test(campus_email)) {
        setLoadingMessage("Please enter a valid email address.");
        setLoadingVisible(true);
        setIsLoading(false);
        setTimeout(() => {
          setLoadingVisible(false);
        }, 2000);
        return;
      }
    
      if (!campus_cover_photo) {
        setLoadingMessage("Please upload a campus cover photo.");
        setLoadingVisible(true);
        setIsLoading(false);
        setTimeout(() => {
          setLoadingVisible(false);
        }, 2000);
        return;
      }
    
      const formData = new FormData();
      formData.append("campus_name", campusData.campus_name);
      formData.append("campus_code", campusData.campus_code);
      formData.append("campus_phone_number", campusData.campus_phone_number);
      formData.append("campus_email", campusData.campus_email);
      formData.append("campus_address", campusData.campus_address);
      formData.append("campus_about", campusData.campus_about);
      formData.append("latitude", coordinates.lat);
      formData.append("longitude", coordinates.lng);
      formData.append("campus_cover_photo", campusData.campus_cover_photo);
    
      const formattedPrograms = Object.keys(programs).map((programType) => ({
        program_type_id: programType,
        programs: programs[programType].map((program) => ({
          program_name: program.programName,
          majors: program.majors,
        })),
      }));
    
      formData.append("campus_programs", JSON.stringify(formattedPrograms));
    
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
    
        if (response.ok) {
          setIsLoading(false);
          setLoadingMessage("Adding New Campus...");
          setLoadingVisible(true);
    
          setTimeout(() => {
            setLoadingMessage("Campus has been successfully added!");
            setTimeout(() => {
              setLoadingVisible(false);
              navigate("/campus/edit-campus");
            }, 1500);
          }, 2000);
        } else {
          const errorData = await response.json();
          console.error("Error adding campus:", errorData);
    
          setLoadingMessage("Server Error, failed to add campus!");
          setLoadingVisible(true);
    
          setTimeout(() => {
            setLoadingVisible(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Network error:", error);
    
        setLoadingMessage("Network Error, failed to add campus!");
        setLoadingVisible(true);
    
        setTimeout(() => {
          setLoadingVisible(false);
        }, 2000);
      }
    };
  
    const handleEditProgram = (programTypeId, programIndex) => {
      const programType = programs[programTypeId]; // Access the programs for this programTypeId
    
      if (programType && programType[programIndex]) {
        const program = programType[programIndex]; // Get the program at the specified index
        setSelectedProgram(program);
        setSelectedProgramTypeId(programTypeId);
        setSelectedProgramIndex(programIndex);
        setEditModalOpen(true);
      } else {
        console.error("Program not found or index is out of bounds.");
      }
    };
  
    const handleSaveEditedProgram = (editedProgram) => {
      setPrograms((prev) => {
        const updatedPrograms = { ...prev };
        const programType = updatedPrograms[selectedProgramTypeId];
  
        if (programType && selectedProgramIndex >= 0 && selectedProgramIndex < programType.length) {
          programType[selectedProgramIndex] = editedProgram; // Update the program
        } else {
          console.error("Invalid program index.");
        }
  
        return updatedPrograms;
      });
  
      handleCloseEditModal(); // Close the modal
    };
  
    const handleCloseEditModal = () => {
      setEditModalOpen(false);
      setSelectedProgram(null);
      setSelectedProgramTypeId(null);
      setSelectedProgramIndex(null);
    };
  
    const handleRemoveProgram = (programType, index) => {
      setPrograms((prev) => {
        const updatedPrograms = { ...prev };
        const programCurrentType = updatedPrograms[programType]; // Access the programs for this programTypeId
    
        if (programCurrentType) {
          updatedPrograms[programType] = programCurrentType.filter((_, i) => i !== index); // Remove the program
    
          // If the program type has no programs left, delete the key
          if (updatedPrograms[programType].length === 0) {
            delete updatedPrograms[programType];
          }
        }
    
        return updatedPrograms;
      });
    };
  
    const secondHandleBack = () => {
      navigate("/campus/edit-campus");
    };
  
    const toggleModal = () => {
      setModalOpen(!isModalOpen);
    };
  
    const handleAddProgram = (newProgram) => {
      setPrograms((prev) => {
        const updatedPrograms = { ...prev };
        const { program_type_id, programs: newPrograms } = newProgram;
  
        const formattedPrograms = newPrograms.map((p) => ({
          programName: p.program_name,
          majors: p.majors || [], // Ensure majors is always an array
        }));
  
        if (updatedPrograms[program_type_id]) {
          updatedPrograms[program_type_id] = [...updatedPrograms[program_type_id], ...formattedPrograms];
        } else {
          updatedPrograms[program_type_id] = formattedPrograms;
        }
  
        return updatedPrograms;
      });
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setCampusData((prev) => ({
          ...prev,
          campus_cover_photo: file,  
        }));
    
        const reader = new FileReader();
        reader.onloadend = () => {
          setCampusImage(reader.result);  
        };
        reader.readAsDataURL(file);
      }
    };
  
  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCoordinates({ lat, lng });
      },
    });

    return coordinates.lat ? (
      <Marker position={[coordinates.lat, coordinates.lng]}>
        <Popup>
          Selected Location: <br /> Latitude: {coordinates.lat} <br /> Longitude: {coordinates.lng}
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <div className="w-full">
        {loadingVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-[400px] flex flex-col justify-center items-center gap-4 rounded-md shadow-md text-center">
            
            <p className="text-xl font-semibold text-gray-800">{loadingMessage}</p>
          </div>
            </div>
        )}
            <div className="w-[75%] flex flex-col justify-between">
              <Header
                title={"Add Campus"}
                subtitle={
                  "Ensure that all information is accurate and relevant."
                }
              />
            </div>     

      <div className="w-[100%]">
        <form className="w-[100%]" onSubmit={handleSubmit}>
          <div className="flex flex-row py-6 gap-6">
            <div className="flex flex-col w-[50%] gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium">Campus Name</h3>
                <p>Enter the official name of the campus</p>
                <Input
                  name="campus_name"
                  value={campusData.campus_name}
                  onChange={(e) => setCampusData({...campusData, campus_name: e.target.value})}
                  placeholder="Campus Name"
                  className="w-[100%] h-[40px] pl-2 pr-2 outline-none border border-gray-300 rounded-md"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium">Phone Number</h3>
                <p>Input the contact number of the campus</p>
                <Input
                name="campus_phone_number"
                value={campusData.campus_phone_number}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\+?[0-9\s]*$/.test(value)) {
                    setCampusData({ ...campusData, campus_phone_number: value });
                  }
                }}
                placeholder="+63 2 123 4567"
                className="w-[100%] h-[40px] pl-2 pr-2 outline-none border border-gray-300 rounded-md"
                type="text"
              />
              </div>
            </div>
            <div className="flex flex-col w-[50%] gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium">Campus Code</h3>
                <p>Provide a short, unique code to identify the campus</p>
                <div className="flex flex-row gap-6">
                  <p className="w-[10%] text-center flex items-center justify-center border border-gray-300 rounded-md">
                    URS
                  </p>
                  <Input
                    maxLength={3}
                    name="campus_code"
                    value={campusData.campus_code}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z]*$/.test(value)) {
                        setCampusData({ ...campusData, campus_code: value.toUpperCase() });
                      }
                    }}
                    placeholder="ABC"
                    className="w-[10%] h-[40px] outline-none text-center border border-gray-300 rounded-md"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium">Email Address</h3>
                <p>Enter the official email for campus communication</p>
                <Input
                  name="campus_email"
                  value={campusData.campus_email}
                  onChange={(e) => setCampusData({...campusData, campus_email: e.target.value})}
                  placeholder="contact@urs.edu.ph"
                  className="w-[100%] h-[40px] pl-2 pr-2 outline-none border border-gray-300 rounded-md"
                  type="text"
                />

              </div>
            </div>
          </div>

          <div className="h-[700px] py-6 flex flex-col gap-5">
            <div>
              <h3 className="text-lg font-medium">Address</h3>
              <p>Enter the complete address including street, city, province, and postal code</p>
              <Input
                  name="campus_address"
                  value={campusData.campus_address}
                  onChange={(e) => setCampusData({...campusData, campus_address: e.target.value})}
                  placeholder="Campus Address"
                  className="w-[100%] mt-3 h-[40px] pl-2 pr-2 outline-none border border-gray-300 rounded-md"
                  type="text"
                />
            </div>
            <div className="border border-gray-300 rounded-md">
              <div className="p-4">
              <h2 className="font-bold text-lg font-medium">
                PIN CAMPUS LOCATION
              </h2>
                </div>
                <MapContainer
                center={position}
                zoom={11}
                className="h-[530px] w-[100%] z-[10] outline-none border border-gray-300"
                style={{ cursor: "crosshair" }}
                scrollWheelZoom={false}
              >
                            <TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />

                {campuses
                              .filter(campus => 
                                campus.latitude && 
                                campus.longitude && 
                                !isNaN(parseFloat(campus.latitude)) && 
                                !isNaN(parseFloat(campus.longitude))
                              )
                              .map((campus, index) => (
                                <Marker
                                  key={index}
                                  position={[
                                    parseFloat(campus.latitude), 
                                    parseFloat(campus.longitude)
                                  ]}
                                >
                                  <Popup>
                                    <strong>{campus.campus_name} Campus</strong><br />
                                    {campus.campus_address}
                                  </Popup>
                                </Marker>
                              ))
                            }
                <LocationMarker />
              </MapContainer>

            </div>
          </div>

          <div className="py-6 mt-[40px] flex flex-col">
            <h3 className="text-lg font-medium">About</h3>
            <p>Provide a brief description of the campus, including any key features or services</p>
            <textarea
            name="campus_about"
            value={campusData.campus_about}
            onChange={(e) => setCampusData({...campusData, campus_about: e.target.value})}
            className="mt-2 p-2 h-[300px] resize-none text-justify outline-none text-md border border-gray-300 rounded-md"
            placeholder="Enter here the history and campus overview of the campus"
            />
          </div>

          <div className="py-6 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-medium">Campus Cover Photo</h3>
              <p>Upload an image of the campus (JPEG or PNG)</p>
              <Input
                name="campus_cover_photo"
                type="file"
                accept="image/*"
                className="mt-2 py-1 cursor-pointer"
                onChange={handleImageUpload}  
              />
            </div>

            <div className="w-[100%] h-[500px] border border-dashed rounded-md flex items-center justify-center">
              {campusImage ? (
                <img
                  src={campusImage}
                  alt="Campus Preview"
                  className="h-[100%] w-[100%] object-fit rounded-md"
                />
              ) : (
                <p className="text-gray-400">No image uploaded</p>
              )}
            </div>
          </div>


          <div className="py-6 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-medium">Academic Programs</h3>
              <p>Add all academic programs offered by the campus</p>
            </div>
            <div className="flex flex-col gap-3 border border-gray-300 rounded-md p-2">
              <div className="flex flex-col gap-2">
                {Object.keys(programs).map((programType) => (
                  <div key={programType} className="flex flex-col gap-2">
                    <p>{programType} Programs</p>
                    {programs[programType].map((program, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 p-2 border rounded-md w-[100%]"
                      >
                        <div className="flex flex-row justify-between w-[100%] pr-[10px]">
                          <h3 className="text-lg">{program.programName}</h3>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              className="text-base-200-70"
                              onClick={() => handleEditProgram(programType, index)}
                            >
                              <FaPen className="w-[18px] h-[18px] text-secondary-200-70" alt="Edit Program" />
                            </button>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => handleRemoveProgram(programType, index)}
                            >
                              <img src={CloseIcon} className="w-[20px] h-[20px]" alt="Remove Program" />
                            </button>
                          </div>
                        </div>
                        {program.majors.length > 0 && (
                          <>
                            <p className="text-sm ml-4">Major in:</p>
                            <ul className="list-disc ml-8">
                              {program.majors.map((major, majorIndex) => (
                                <li key={majorIndex} className="text-base list-none">{major}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>


              <div className="flex justify-end w-[100%]">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleModal();
                  }}a
                  className="w-[12%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 bg-gray-200  hover:bg-gray-200 transition duration-300"
                >
                  <img className="w-[30px] h-[30px]" src={addImage} alt="Add Program" />
                  Add Program
                </Button>
              </div>
            </div>
          </div>

        {selectedProgram && (
            <EditProgramModal
              isOpen={isEditModalOpen}
              onClose={handleCloseEditModal}
              program={selectedProgram}
              onSave={handleSaveEditedProgram}
              programtype={selectedProgramTypeId}
            />
          )}
          <AddProgramModal 
            isOpen={isModalOpen} 
            onClose={toggleModal} 
            onAddProgram={handleAddProgram} 
            existingPrograms={programs}  />
          <div className="">  
            <p className="text-justify">
            Note: All contents, instructions, and details provided in the Add Campus Form are hereby deemed legitimate and accurate, ensuring that administrators can rely on this information for correctly managing campus data in the GuideURSelf system. The form’s fields and their instructions have been structured to capture essential and relevant campus information, aligning with system requirements for virtual tours and campus management.
            </p>
          </div>

          <div className="p-6 flex justify-end gap-[10px]">
            <Button  
              type="button"
              onClick={secondHandleBack}
              className="text-base-200 bg-white shadow-none hover:bg-secondary-350 w-[100px] p-2 border-none"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="border border-base-200 bg-base-200 text-white w-[100px] p-2 rounded-md hover:bg-base-200"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddNewCampus;