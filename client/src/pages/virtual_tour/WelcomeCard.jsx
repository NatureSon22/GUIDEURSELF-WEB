import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import "@/fluttermap.css";  
  
  const WelcomeCard = ({ onClose }) => { // Destructure onClose properly
    return (
      <Dialog style={{ borderRadius: "15px !important" }} className="w-[900px] custom-dialog outline-none" open={true} onOpenChange={onClose}> {/* Use onOpenChange for closing */}
        <DialogContent className="w-[900px]">
          <DialogHeader>
            <DialogTitle className="my-[30px] text-center">Welcome to Build Mode!</DialogTitle>
            <DialogDescription className="text-justify">
              Welcome Admin! Here you have full control to design and customize the virtual tour
              experience.
              <hr className="my-4 invisible" />
              In Build Mode, you can:
            <ol>
                <li className="my-2">
                1. <strong>Visualize the Tour:</strong> See campus tour as users, allowing you to expercience the journey
                firsthand.
                </li>
                <li className="my-2">
                2. <strong>Add and Edit:</strong> Easily add new places, update existing ones, and adjust position on the
                campus map. 
                </li>
                <li className="my-2">
                3. <strong>Enhance User Expercience:</strong> Create hotspots, and media, and integrate accessibility
                features to make tours engaging and inclusive.
                </li>
                <li className="my-2">
                4. <strong>Test and Save:</strong> Preview changes in real-time and save drafts to perfect each tour before
                publishing.
                </li>
            </ol>
            <hr className="my-4 invisible" />

            Enjoy building a vibrant, user-friendly tour expercience!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default WelcomeCard;
  