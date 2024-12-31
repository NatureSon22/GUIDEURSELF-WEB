import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import addImage from "../../assets/add.png";
import AddProgramModal from "./AddProgramModal";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AddNewCampus = () => {
  const [position, setPosition] = useState([14.466440, 121.226080]); // Default: Manila, Philippines
  const [marker, setMarker] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [programs, setPrograms] = useState({ undergraduate: [], graduate: [] });
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [campusImage, setCampusImage] = useState(null);const [campusData, setCampusData] = useState({
    campus_name: "",
    campus_code: "",
    campus_phone_number: "",
    campus_email: "",
    campus_address: "",
    campus_about: "",
    campus_cover_photo: null,
  });

  

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    formData.append("campus_programs", JSON.stringify(programs));

    try {
      const response = await fetch("/api/campus", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        alert("Campus added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error adding campus:", errorData);
        alert("Failed to add campus.");
      }
    } catch (error) {
      console.error("Error adding campus:", error);
      alert("Failed to add campus.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    setPrograms((prevPrograms) => {
      const updatedPrograms = { ...prevPrograms };
      if (newProgram.type === "undergraduate") {
        updatedPrograms.undergraduate.push(newProgram);
      } else if (newProgram.type === "graduate") {
        updatedPrograms.graduate.push(newProgram);
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
                  placeholder="F5MQ+62W, Manila E Rd, Binangonan, 1940 Rizal"
                  className="w-[100%] h-[40px] pl-2 pr-2 outline-none border border-gray-300 rounded-md"
                  type="text"
                />
              </div>
              <MapContainer
              center={position}
              zoom={13}
              className="h-[530px] w-[100%] outline-none border border-gray-300"
              style={{ cursor: "crosshair" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>

            </div>
          </div>

          <div className="p-6 flex flex-col">
            <h3 className="text-lg font-medium">About</h3>
            <p>Provide a brief description of the campus, including any key features or services</p>
            <textarea
            name="campus_about"
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
                onChange={handleImageUpload}  // Attach the handler
              />
            </div>

            <div className="w-[100%] h-[500px] border border-dashed rounded-md flex items-center justify-center">
              {campusImage ? (
                <img
                  src={campusImage}
                  alt="Campus Preview"
                  className="w-[100%] h-[500px] object-fill rounded-md"
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
            <div>
              <p>Graduate Programs</p>
              {programs.graduate && programs.graduate.length > 0 ? (
                programs.graduate.map((program, index) => (
                  <div key={index} className="p-2 border-b">
                    <h3>{program.programName}</h3> {/* Use programName here */}
                    <p>Major in:</p>
                    <ul>
                      {program.majors.map((major, i) => (
                        <li key={i}>{major}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No graduate programs available</p>  // A fallback message if no graduate programs are added
              )}
            </div>

            <div>
              <p>Undergraduate Programs</p>
              {programs.undergraduate.map((program, index) => (
                <div key={index} className="p-2 border-b">
                  <h3>{program.programName}</h3> {/* Use programName here */}
                  <p>Major in:</p>
                  <ul>
                    {program.majors.map((major, i) => (
                      <li key={i}>{major}</li>
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
                  }}
                  className="w-[12%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300"
                >
                  <img className="w-[30px] h-[30px]" src={addImage} alt="Add Program" />
                  Add Program
                </button>
              </div>
            </div>
          </div>

          <AddProgramModal isOpen={isModalOpen} onClose={toggleModal} onAddProgram={handleAddProgram} />
          <div className="pr-6 pl-6">  {/* Caution Notes */}
            <p className="text-justify">
            Note: All contents, instructions, and details provided in the Add Campus Form are hereby deemed legitimate and accurate, ensuring that administrators can rely on this information for correctly managing campus data in the GuideURSelf system. The form’s fields and their instructions have been structured to capture essential and relevant campus information, aligning with system requirements for virtual tours and campus management.
            </p>
          </div>

          <div className="p-6 flex justify-end gap-[10px]">
            <button
              type="button"
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