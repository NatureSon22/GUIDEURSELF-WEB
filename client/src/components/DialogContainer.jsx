import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Description, DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import PropTypes from "prop-types";

const DialogContainer = ({ openDialog, style = {}, children }) => {
  return (
    <Dialog open={openDialog}>
      <DialogContent
        className={`grid place-items-center ${style?.width || "sm:max-w-[425px]"} [&>button]:hidden focus-within:outline-none `}
      >
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
          <Description aria-describedby={undefined}></Description>
        </VisuallyHidden>

        {children}
      </DialogContent>
    </Dialog>
  );
};

DialogContainer.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default DialogContainer;
