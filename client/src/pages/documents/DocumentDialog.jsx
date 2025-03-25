import { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

const DocumentDialog = ({ open, setOpen, document_url }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false); // Document finished loading
  };

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[70%] flex-col sm:max-w-[425px] lg:max-w-[900px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>File Preview</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col space-y-2">
          <p className="text-sm text-secondary-100-75">{document_url}</p>

          {/* Show loading indicator while document is loading */}
          {isLoading && <Skeleton className="w-full h-full" />}

          <div className={`${isLoading ? "hidden" : "block"} flex-1 gap-4`}>
            <iframe
              src={`https://docs.google.com/gview?url=${document_url}&embedded=true`}
              className="h-full w-full"
              onLoad={handleLoad} // Trigger when iframe finishes loading
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
