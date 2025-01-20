import  Header from "@/components/Header";
import VirtualTourInfo from "./VirtualTourInfo";


const VirtualTourDashboard = () => {

    return (
    <div className="w-full flex flex-col w-[100%]">
        <div className="w-[100%] flex flex-col justify-between">
        <Header
            title={"Manage Virtual Tour"}
            subtitle={"For seamless updating of the campus virtual tours, you can add, edit, and archive the contents."}
        />
        </div>
        <VirtualTourInfo />
    </div>
    )
}

export default VirtualTourDashboard;