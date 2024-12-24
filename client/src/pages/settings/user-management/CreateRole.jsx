import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import PropTypes from "prop-types";
import PERMISSIONS from "@/data/permissions";
import Permissions from "./Permissions";

const CreateRole = ({ openDialog, setOpenDialog }) => {

  return (
    <Dialog open={openDialog}>
      <DialogContent className="grid gap-5 md:max-w-[850px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Set Default Permissions</DialogTitle>
          <DialogDescription>
            Control access and permissions for roles
          </DialogDescription>
        </DialogHeader>

        <div>
          <Input id="role" placeholder="Enter role name" />

          <div className="container my-5 max-h-[400px] overflow-y-auto border">
            {PERMISSIONS.map((module, i) => {
              return <Permissions key={i} module={module} />;
            })}
          </div>
        </div>

        <DialogFooter className="ml-auto">
          <Button
            variant="ghost"
            className="text-base-200"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-base-200">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

CreateRole.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  setOpenDialog: PropTypes.func.isRequired,
};

export default CreateRole;
