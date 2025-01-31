import { Outlet } from "react-router-dom";
import NetworkLayer from "@/layer/NetworkLayer";

const Container = () => {
  return (
    <NetworkLayer>
      <Outlet></Outlet>
    </NetworkLayer>
  );
};

export default Container;
