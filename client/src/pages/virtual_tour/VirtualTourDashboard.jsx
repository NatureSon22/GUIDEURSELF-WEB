import  Header from "@/components/Header";
import VirtualTourInfo from "./VirtualTourInfo";
import VirtualTourLogTable from "./VirtualTourLogTable";


const VirtualTourDashboard = () => {

    return (
    <div className="w-full flex flex-col w-[100%]">
        <div className="flex flex-col">
        <div className="w-[100%] flex flex-col justify-between">
        <Header
            title={"Manage Virtual Tour"}
            subtitle={"For seamless updating of the campus virtual tours, you can add, edit, and archive the contents."}
        />
        </div>
        <VirtualTourInfo />
        </div>
        <Header
            classame="mb-4"
            title={"Updates Log"}
            subtitle={"This section lists the most recent updates and changes made by administration across different campuses."}
        />
        <VirtualTourLogTable />
    </div>
    )
}

export default VirtualTourDashboard;