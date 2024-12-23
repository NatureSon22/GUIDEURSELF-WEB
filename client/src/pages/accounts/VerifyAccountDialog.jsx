import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PropTypes from "prop-types";
import Spinner from "@/components/Spinner";
import { FaCheckCircle } from "react-icons/fa";
import { Description, DialogTitle } from "@radix-ui/react-dialog";

const VerifyAccountDialog = ({ openDialog, setOpenDialog, isPending }) => {
  return (
    <Dialog open={openDialog}>
      <DialogContent className="grid place-items-center sm:max-w-[425px] [&>button]:hidden">
        <DialogTitle></DialogTitle>
        <Description aria-describedby={undefined} ></Description>

        <div className="grid place-items-center gap-3">
          {isPending ? (
            <Spinner />
          ) : (
            <FaCheckCircle className="text-[3.2rem] text-base-200" />
          )}

          <p className="mt-5 text-[0.95rem] font-semibold text-base-300">
            {isPending
              ? "Sending verification ..."
              : "Verification has been successfully sent"}
          </p>

          {isPending && (
            <Button
              variant="outline"
              className="w-full border-secondary-100/50 text-secondary-100-75"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

VerifyAccountDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  setOpenDialog: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
};

export default VerifyAccountDialog;
