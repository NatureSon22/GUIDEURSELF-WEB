import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import WorldMap from "./WorldMap";
import CampusCard from "./CampusCard";
import { useState, useEffect } from "react"; 
import WelcomeCard from "./WelcomeCard"
import SlideBar from "./SlideBar";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { loggedInUser } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const BuildMode = () => {
  const [position] = useState([14.46644, 121.22608]);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [isWelcomeCardOpen, setIsWelcomeCardOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcomeCard');
    if (!hasSeenWelcome) {
      setIsWelcomeCardOpen(true);
      sessionStorage.setItem('hasSeenWelcomeCard', 'true');
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

  const handleExitBuildMode = () => {
    setLoadingMessage("Exiting Build Mode");
    setLoadingVisible(true);

      setTimeout(() => {
        setLoadingVisible(false);
        navigate("/virtual-tour");
    }, 3000);
  };

  const closeWelcomeCard = () => {
    setIsWelcomeCardOpen(false)
  };

  const handleCampusSelect = (campus) => {
    setSelectedCampus(campus); // Update state with the selected campus
  };


  return (
    <div className="flex min-h-screen">
      {loadingVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 flex flex-col justify-center w-[400px] gap-4 items-center rounded-md shadow-md text-center">
            <Loading />
            <p className="text-xl font-semibold text-gray-800">{loadingMessage}</p>
          </div>
        </div>
      )}
      {isWelcomeCardOpen && <WelcomeCard onClose={closeWelcomeCard} />}
      <SlideBar userData={data} onCampusSelect={handleCampusSelect} exitBuildMode={handleExitBuildMode} />
      <WorldMap userData={data} campus={selectedCampus}/>
    </div>
  );
};

export default BuildMode;
