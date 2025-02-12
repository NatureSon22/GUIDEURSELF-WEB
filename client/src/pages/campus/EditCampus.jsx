import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import addImage from "../../assets/add.png";
import CloseIcon from "../../assets/CloseIcon.png";
import AddProgramModal from "./AddProgramModal";
import Pin from "../../assets/pin.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const EditCampus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campus, setCampus] = useState(null);
    const [position, setPosition] = useState([14.466440, 121.226080]); // Default: Manila, Philippines
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [campuses, setCampuses] = useState([]);
    const [isLoading, isSetLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
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
      campus_programs: [], 
    });
    
    const secondHandleBack = () => {
        navigate("/campus/edit");  
    };

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
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

        useEffect(() => {
            const fetchCampuses = async () => {
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {method: "get", credentials:"include"});
                const data = await response.json();
                setCampuses(data); // Store fetched campuses
              } catch (error) {
                console.error("Error fetching campuses:", error);
              }
            };
        
            fetchCampuses();
          }, []);

          console.log(id);
          console.log("Submitting campus data:", campusData);
          console.log("Coordinates:", coordinates);


          useEffect(() => {
            const fetchCampus = async () => {
                try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses/${id}`, {
                    method: "get",
                    credentials: "include",
                });
                const data = await response.json();

                setCampus(data);

                setCampusData({
                    campus_name: data.campus_name || "",
                    campus_code: data.campus_code || "",
                    campus_phone_number: data.campus_phone_number || "",
                    campus_email: data.campus_email || "",
                    campus_address: data.campus_address || "",
                    campus_about: data.campus_about || "",
                    campus_cover_photo: null,
                    campus_programs: data.campus_programs || [],
                });

                // Set image and coordinates
                if (data.campus_cover_photo_url) {
                    setCampusImage(data.campus_cover_photo_url);
                }
                if (data.latitude && data.longitude) {
                    setCoordinates({ lat: data.latitude, lng: data.longitude });
                    setPosition([data.latitude, data.longitude]);
                }

                } catch (error) {
                console.error("Error fetching campus:", error);
                }
            };

            fetchCampus();
            }, [id]);

            const handleSaveChanges = async (e) => {
                e.preventDefault();  // Prevent form reload

                isSetLoading(true);
                
                const formData = new FormData();
                formData.append('campus_name', campusData.campus_name);
                formData.append('campus_code', campusData.campus_code);
                formData.append('campus_phone_number', campusData.campus_phone_number);
                formData.append('campus_email', campusData.campus_email);
                formData.append('campus_address', campusData.campus_address);
                formData.append('campus_about', campusData.campus_about);
                formData.append('latitude', coordinates.lat);  // Pull from coordinates
                formData.append('longitude', coordinates.lng);
                formData.append('campus_programs', JSON.stringify(campusData.campus_programs));
              
                if (campusData.campus_cover_photo) {
                    formData.append('campus_cover_photo', campusData.campus_cover_photo);  // Use correct image
                }
              
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses/${id}`, {
                        method: 'PUT',
                        credentials: 'include',
                        body: formData,
                    });
              
                    if (response.ok) {
                      setLoadingMessage("Saving New Changes...");
                      setLoadingVisible(true);
                
                      setTimeout(() => {
                        setLoadingMessage("Campus has been successfully edited!");
                        setTimeout(() => {
                          isSetLoading(false);
                          setLoadingVisible(false);
                          navigate("/campus/edit"); // Navigate back to campus list
                        }, 1500);
                      }, 2000);// Redirect to the campus list after update
                    } else {
                        const errorData = await response.json();
                        alert('Failed to update campus');
                        console.error('Update failed', errorData);
                    }
                } catch (error) {
                    console.error('Error during update', error);
                    alert('Error updating campus');
                }
            };

            

            const handleRemoveProgram = (programTypeId, programIndex) => {
              const updatedPrograms = campusData.campus_programs.map((programType) => {
                if (programType.program_type_id === programTypeId) {
                  const updatedProgramsList = programType.programs.filter((_, index) => index !== programIndex);
            
                  // If there are no more programs for this type, remove the program type entirely
                  if (updatedProgramsList.length === 0) {
                    return null; // Return null to remove this program type
                  }
            
                  return {
                    ...programType,
                    programs: updatedProgramsList,
                  };
                }
            
                return programType;
              });
            
              // Filter out any program types that are null (i.e., removed)
              const filteredPrograms = updatedPrograms.filter((programType) => programType !== null);
            
              setCampusData({ ...campusData, campus_programs: filteredPrograms });
            };
            

    const handleAddProgram = (newProgram) => {
        setCampusData((prevData) => {
          const updatedPrograms = [...prevData.campus_programs];
          
          // Check if program type already exists
          const existingIndex = updatedPrograms.findIndex(
            (item) => item.program_type_id === newProgram.program_type_id
          );
          
          if (existingIndex > -1) {
            // Append to existing program type
            updatedPrograms[existingIndex].programs.push(...newProgram.programs);
          } else {
            // Add as new program type
            updatedPrograms.push(newProgram);
          }
      
          return {
            ...prevData,
            campus_programs: updatedPrograms,
          };
        });
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
                <Loading />
                <p className="text-xl font-semibold text-gray-800">{loadingMessage}</p>
              </div>
            </div>
        )}
      <div className="w-full p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Campus</h2>
          <p className="text-gray-600 mt-2">Ensure that all information is accurate and relevant.</p>
        </div>
      </div>

      <div className="w-[100%]">
        <form className="w-[100%]" onSubmit={handleSaveChanges}>
          <div className="flex flex-row p-6 gap-6">
            <div className="flex flex-col w-[50%] gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium">Campus Name</h3>
                <p>Enter the official name of the campus</p>
                <Input
                  name="campus_name"
                  value={campusData.campus_name}
                  onChange={(e) => setCampusData({...campusData, campus_name: e.target.value})}
                  placeholder="Binangonan"
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
                  onChange={(e) => setCampusData({...campusData, campus_phone_number: e.target.value})}
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
                    name="campus_code"
                    maxLength={3}
                    value={campusData.campus_code}
                    onChange={(e) => setCampusData({...campusData, campus_code: e.target.value.toUpperCase()})} 
                    placeholder="BIN"
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

          <div className="h-[700px] p-6 flex flex-col gap-5">
            <div>
              <h3 className="text-lg font-medium">Address</h3>
              <p>Enter the complete address including street, city, province, and postal code</p>
            </div>
            <div className="border border-gray-300 rounded-md">
              <div className="p-4">
                <Input
                  name="campus_address"
                  value={campusData.campus_address}
                  onChange={(e) => setCampusData({...campusData, campus_address: e.target.value})}
                  placeholder="F5MQ+62W, Manila E Rd, Binangonan, 1940 Rizal"
                  className="w-[100%] h-[40px] pl-2 pr-2 outline-none border border-gray-300 rounded-md"
                  type="text"
                />
                </div>
                <MapContainer
                center={coordinates.lat ? [coordinates.lat, coordinates.lng] : position}
                zoom={11}
                className="h-[530px] w-[100%] outline-none border border-gray-300"
                style={{ cursor: "crosshair" }}
                zoomControl={false}
                attributionControl={false}
                >
                <TileLayer
                    url={`https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=c5319e635a224bbe8fd69f82a629bd97`}
                />

                    {campuses.map((campus, index) => (
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

          <div className="p-6 flex flex-col">
            <h3 className="text-lg font-medium">About</h3>
            <p>Provide a brief description of the campus, including any key features or services</p>
            <Textarea
            name="campus_about"
            value={campusData.campus_about}
            onChange={(e) => setCampusData({...campusData, campus_about: e.target.value})}
            className="mt-2 p-2 h-[300px] resize-none outline-none border border-gray-300 rounded-md"
            placeholder="Enter here the history and campus overview of the campus"
            />
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div>
                <h3 className="text-lg font-medium">Campus Cover Photo</h3>
                <p>Upload an image of the campus (JPEG or PNG)</p>
                <Input
                name="campus_cover_photo"
                type="file"
                accept="image/*"
                className="mt-2 py-1 cursor-pointer"
                onChange={handleImageUpload}  // Use existing handler
                />
            </div>

            <div className="w-[100%] h-[500px] border border-dashed rounded-md flex items-center justify-center">
                {campusImage ? (
                <img
                    src={campusImage}
                    alt="Campus Preview"
                    className="h-[100%] w-[100%] object-cover rounded-md"
                />
                ) : (
                <p className="text-gray-400">No image uploaded</p>
                )}
            </div>
            </div>

            <div className="p-6 flex flex-col gap-5">
                <div>
                <h3 className="text-lg font-medium">Academic Programs</h3>
                <p>Add all academic programs offered by the campus</p>
                </div>
                <div className="flex flex-col gap-3 border border-gray-300 rounded-md p-3">
                {campusData.campus_programs.map((programType) => (
                <div key={programType._id} className="flex flex-col gap-4">
                    <h3 className="text-lg font-medium">
                    {programType.program_type_id.charAt(0).toUpperCase() + programType.program_type_id.slice(1)} Programs
                    </h3>
                    <div className="flex flex-col gap-4 border rounded-md p-4">
                    {programType.programs.map((program, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-medium">{program.program_name}</h4>
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() => handleRemoveProgram(programType.program_type_id, index)}
                          >
                            <img src={CloseIcon} className="w-[20px] h-[20px]" alt="Remove Program" />
                          </button>
                        </div>
                        {/* Conditionally render "Major in:" only if there are majors */}
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
                </div>
                ))}

                    
                    <div className="flex justify-end w-[100%]">
                    <Button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleModal();
                    }}
                    className="w-[12%] pr-2 text-md h-10 flex justify-start items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 bg-gray-200  hover:bg-gray-200 transition duration-300"
                    >
                    <img className="w-[30px] h-[30px]" src={addImage} alt="Add Program" />
                    Add Program
                    </Button>           
                </div>
                </div>
                
            </div>

            <AddProgramModal isOpen={isModalOpen} onClose={toggleModal} onAddProgram={handleAddProgram} />

          <div className="p-6 flex justify-end gap-[10px]">
            <Button  
              type="button"
              disabled={isLoading}
              onClick={secondHandleBack}
              className="text-base-200 bg-white shadow-none hover:bg-secondary-350 w-[100px] p-2 border-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="border border-base-200 bg-base-200 text-white w-[100px] p-2 rounded-md hover:bg-base-200"
              >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampus;
