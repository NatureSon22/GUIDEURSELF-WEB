import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import addImage from "../../assets/add.png";
import CloseIcon from "../../assets/CloseIcon.png";
import AddProgramModal from "./AddProgramModal";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AddNewCampus = () => {
  const [position, setPosition] = useState([14.466440, 121.226080]); 
  const [loadingVisible, setLoadingVisible] = useState(false);
  const navigate = useNavigate();
  const [loadingMessage, setLoadingMessage] = useState("");
  const [marker, setMarker] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [programs, setPrograms] = useState({ undergraduate: [], graduate: [] });
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
          const response = await fetch("http://localhost:3000/api/campuses", {method: "get", credentials:"include"});
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

  const { campus_name, campus_code, campus_phone_number, campus_email, campus_address, campus_about, campus_cover_photo } = campusData;

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

    setTimeout(() => {
      setLoadingVisible(false);
    }, 2000);
    return;
  }

  if (!campus_cover_photo) {
    setLoadingMessage("Please upload a campus cover photo.");
    setLoadingVisible(true);

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

  const formattedPrograms = [
    {
      program_type_id: "undergraduate",
      programs: programs.undergraduate.map((program) => ({
        program_name: program.programName,
        majors: program.majors,
      })),
    },
    {
      program_type_id: "graduate",
      programs: programs.graduate.map((program) => ({
        program_name: program.programName,
        majors: program.majors,
      })),
    },
  ];

  formData.append("campus_programs", JSON.stringify(formattedPrograms));

  console.log("Form Data Being Sent:", {
    campus_name,
    campus_code,
    campus_phone_number,
    campus_email,
    campus_address,
    campus_about,
    latitude: coordinates.lat,
    longitude: coordinates.lng,
    campus_cover_photo,
    campus_programs: formattedPrograms,
  });

  try {
    const response = await fetch("http://localhost:3000/api/campuses", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (response.ok) {
      setLoadingMessage("Adding New Campus...");
      setLoadingVisible(true);

      setTimeout(() => {
        setLoadingMessage("Campus has been successfully added!");
        setTimeout(() => {
          setLoadingVisible(false);
          navigate("/campus"); 
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
    console.error("Error adding campus:", error);

    setLoadingMessage("Server Error, failed to add campus!");
    setLoadingVisible(true);

    setTimeout(() => {
      setLoadingVisible(false);
    }, 2000);
  }
};
  
  const handleRemoveProgram = (type, index) => {
    setPrograms((prev) => {
      const updatedPrograms = { ...prev };
      updatedPrograms[type] = updatedPrograms[type].filter((_, i) => i !== index);
      return updatedPrograms;
    });
  };

  const secondHandleBack = () => {
        navigate("/campus");  
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
  

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleAddProgram = (newProgram) => {
    setPrograms((prev) => {
      const updatedPrograms = { ...prev };
      const { program_type_id, programs } = newProgram;
  
      const formattedPrograms = programs.map((p) => ({
        programName: p.program_name,
        majors: p.majors,
      }));
  
      if (updatedPrograms[program_type_id]) {
        updatedPrograms[program_type_id].push(...formattedPrograms);
      } else {
        updatedPrograms[program_type_id] = formattedPrograms;
      }
  
      return updatedPrograms;
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
            <div className="bg-white p-6 rounded-md shadow-md text-center">
                <p className="text-xl font-semibold text-gray-800">{loadingMessage}</p>
            </div>
            </div>
        )}
      <div className="w-full p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add Campus</h2>
          <p className="text-gray-600 mt-2">Ensure that all information is accurate and relevant.</p>
        </div>
      </div>

      <div className="w-[100%]">
        <form className="w-[100%]" onSubmit={handleSubmit}>
          <div className="flex flex-row p-6 gap-6">
            <div className="flex flex-col w-[50%] gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium">Campus Name</h3>
                <p>Enter the official name of the campus</p>
                <input
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
                <input
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
                  <input
                    name="campus_code"
                    value={campusData.campus_code}
                    onChange={(e) => setCampusData({...campusData, campus_code: e.target.value})}
                    placeholder="BIN"
                    className="w-[10%] h-[40px] outline-none text-center border border-gray-300 rounded-md"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium">Email Address</h3>
                <p>Enter the official email for campus communication</p>
                <input
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
                <input
                  name="campus_address"
                  value={campusData.campus_address}
                  onChange={(e) => setCampusData({...campusData, campus_address: e.target.value})}
                  placeholder="F5MQ+62W, Manila E Rd, Binangonan, 1940 Rizal"
                  className="w-[100%] h-[40px] pl-2 pr-2 outline-none border border-gray-300 rounded-md"
                  type="text"
                />
                </div>
                <MapContainer
                center={position}
                zoom={11}
                className="h-[530px] w-[100%] outline-none border border-gray-300"
                style={{ cursor: "crosshair" }}
              >
                            <TileLayer url={`https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=c5319e635a224bbe8fd69f82a629bd97`} />

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

          <div className="p-6 flex flex-col">
            <h3 className="text-lg font-medium">About</h3>
            <p>Provide a brief description of the campus, including any key features or services</p>
            <textarea
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
              <input
                name="campus_cover_photo"
                type="file"
                accept="image/*"
                className="mt-2"
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


          <div className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-medium">Academic Programs</h3>
              <p>Add all academic programs offered by the campus</p>
            </div>
            <div className="flex flex-col gap-3 border border-gray-300 rounded-md p-2">
              <div className="flex flex-col gap-2 ">
                <p>Graduate Programs</p>
                {programs.graduate.map((program, index) => (
                  <div key={index} className="flex flex-col gap-2 p-2 border rounded-md w-[100%]">
                    <div className="flex flex-row justify-between w-[100%] pr-[10px]">
                    <h3 className="text-lg">{program.programName}</h3>
                    <button
                      onClick={() => handleRemoveProgram("graduate", index)}
                      className="text-red-500 mt-2 self-start"
                    >
                      <img src={CloseIcon} className="w-[20px] h-[20px]" alt="" />
                    </button>
                    </div>
                    <p className="ml-[20px] text-sm">Major in:</p>
                    <ul>
                      {program.majors.map((major, i) => (
                        <li className="ml-[20px] text-l" key={i}>{major}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 ">
                <p>Undergraduate Programs</p>
                {programs.undergraduate.map((program, index) => (
                  <div key={index} className="flex flex-col gap-2 p-2 border rounded-md w-[100%]">
                    <div className="flex flex-row justify-between w-[100%] pr-[10px]">
                    <h3 className="text-lg">{program.programName}</h3>
                    <button
                      onClick={() => handleRemoveProgram("undergraduate", index)}
                      className="text-red-500 mt-2 self-start"
                    >
                      <img src={CloseIcon} className="w-[20px] h-[20px]" alt="" />
                    </button>
                    </div>
                    <p className="ml-[20px] text-sm">Major in:</p>
                    <ul>
                      {program.majors.map((major, i) => (
                        <li className="ml-[20px] text-l" key={i}>{major}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex justify-end w-[100%]">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleModal();
                  }}a
                  className="w-[12%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300"
                >
                  <img className="w-[30px] h-[30px]" src={addImage} alt="Add Program" />
                  Add Program
                </button>
              </div>
            </div>
          </div>

          <AddProgramModal isOpen={isModalOpen} onClose={toggleModal} onAddProgram={handleAddProgram} />
          <div className="pr-6 pl-6">  
            <p className="text-justify">
            Note: All contents, instructions, and details provided in the Add Campus Form are hereby deemed legitimate and accurate, ensuring that administrators can rely on this information for correctly managing campus data in the GuideURSelf system. The form’s fields and their instructions have been structured to capture essential and relevant campus information, aligning with system requirements for virtual tours and campus management.
            </p>
          </div>

          <div className="p-6 flex justify-end gap-[10px]">
            <button  
              type="button"
              onClick={secondHandleBack}
              className="text-blue-500 w-[100px] p-2 border-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white w-[100px] p-2 rounded-md"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddNewCampus;