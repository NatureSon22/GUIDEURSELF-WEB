import { useNetworkState } from "@uidotdev/usehooks";
import PropTypes from "prop-types";
import { MdSignalWifiStatusbarConnectedNoInternet } from "react-icons/md";

const NetworkLayer = ({ children }) => {
  const { online } = useNetworkState();

  return online ? (
    children
  ) : (
    <div className="grid place-items-center">
      <div className="grid place-items-center">
        <MdSignalWifiStatusbarConnectedNoInternet className="text-primary-500 text-6xl" />
        <p className="mt-3 text-center text-[1.2rem]">You&apos;re offline</p>
        <p className="mt-1 text-center text-[0.9rem] text-secondary-100/60">
          Check your network connection and try again
        </p>
      </div>
    </div>
  );
};

NetworkLayer.propTypes = {
  children: PropTypes.node,
};

export default NetworkLayer;
