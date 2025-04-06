import DialogContainer from "@/components/DialogContainer";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import { FaCircleExclamation } from "react-icons/fa6";

const AccountDialog = ({
  label,
  openDialog,
  isLoading,
  onCancelClick,
  onConfirmClick,
}) => {
  return (
    <DialogContainer openDialog={openDialog}>
      <div className="flex flex-col items-center gap-5">
        <FaCircleExclamation className="text-[2.5rem] text-base-200" />
        <p className="text-center text-[0.9rem] font-semibold">{label}</p>
        <div className="flex w-full gap-4">
          <Button
            variant="outline"
            className="flex-1 border-secondary-200 py-1 text-secondary-100-75"
            onClick={onCancelClick}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 border border-base-200 bg-base-200/10 py-1 text-base-200 shadow-none hover:bg-base-200/10"
            onClick={onConfirmClick}
            disabled={isLoading}
          >
            Proceed
          </Button>
        </div>
      </div>
    </DialogContainer>
  );
};

AccountDialog.propTypes = {
  label: PropTypes.string,
  openDialog: PropTypes.bool,
  isLoading: PropTypes.bool,
  onCancelClick: PropTypes.func,
  onConfirmClick: PropTypes.func,
};

export default AccountDialog;
