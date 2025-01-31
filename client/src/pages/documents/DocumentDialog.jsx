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

const DocumentDialog = ({ open, setOpen, document_url }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[70%] flex-col sm:max-w-[425px] lg:max-w-[900px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>File Preview</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col space-y-2">
          <p className="text-sm text-secondary-100-75">{document_url}</p>
          <div className="flex-1 gap-4">
            <iframe
              src={`https://docs.google.com/gview?url=${document_url}&embedded=true`}
              className="h-full w-full"
            ></iframe>
          </div>
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

DocumentDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  document_url: PropTypes.string,
};

export default DocumentDialog;
