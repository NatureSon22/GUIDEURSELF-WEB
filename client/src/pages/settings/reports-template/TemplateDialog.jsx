import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PropTypes from "prop-types";

const TemplateDialog = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[70%] flex-col sm:max-w-[425px] lg:max-w-[900px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>File Preview</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="h-full flex-1 gap-4 py-4">
          <iframe
            src="https://docs.google.com/gview?url=https://ucarecdn.com/73ab671f-defd-4b09-b0a9-9281f858a4a2/&embedded=true"
            className="h-full w-full"
          ></iframe>
        </div>
        <DialogFooter>
          <Button className="bg-base-200" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

TemplateDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default TemplateDialog;
