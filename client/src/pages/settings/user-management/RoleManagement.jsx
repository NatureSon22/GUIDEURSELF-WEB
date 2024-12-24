import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiAddLargeFill } from "react-icons/ri";
import { useState } from "react";
import CreateRole from "./CreateRole";

const RoleManagement = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex gap-4">
        <Input placeholder="Name of the user type" />
        <Button
          variant="outline"
          className="text-secondary-100-75"
          onClick={() => {
            setOpen(true);
          }}
        >
          <RiAddLargeFill /> Create
        </Button>
      </div>

      <CreateRole openDialog={open} setOpenDialog={setOpen} />
    </div>
  );
};

export default RoleManagement;
