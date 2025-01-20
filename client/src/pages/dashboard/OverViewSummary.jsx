import { MdPeopleAlt } from "react-icons/md";
import { BsFillBuildingFill } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { ImUserPlus } from "react-icons/im";
import { IoIosArrowForward } from "react-icons/io";
import { HiOutlineFolderAdd } from "react-icons/hi";

const OverViewSummary = () => {
  return (
    <div className="flex gap-5">
      <div className="flex flex-1 cursor-pointer items-center justify-between rounded-xl border border-secondary-200/50 bg-white pl-7 pr-10">
        <div className="space-y-2">
          <p className="w-min text-[0.92rem]">Total Users</p>
          <p className="text-3xl font-semibold">3,698</p>
        </div>

        <div>
          <MdPeopleAlt className="text-6xl text-base-200" />
        </div>
      </div>

      <div className="flex flex-1 cursor-pointer items-center justify-between rounded-xl border border-secondary-200/50 bg-white pl-7 pr-10">
        <div className="space-y-2">
          <p className="w-min text-[0.95rem]">Total Campuses</p>
          <p className="text-3xl font-semibold">3,698</p>
        </div>
        <div>
          <BsFillBuildingFill className="text-5xl text-base-200" />
        </div>
      </div>

      <div className="flex flex-1 cursor-pointer items-center justify-between rounded-xl border border-secondary-200/50 bg-white pl-7 pr-10">
        <div className="space-y-2">
          <p className="max-w-[8rem] text-[0.95rem]">
            Total Uploaded Documents
          </p>
          <p className="text-3xl font-semibold">1,589</p>
        </div>
        <div>
          <FaFolder className="text-5xl text-base-200" />
        </div>
      </div>

      <div className="flex-3 flex min-w-[520px] flex-col gap-4">
        <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-secondary-200/50 bg-white px-8 py-3">
          <div className="flex items-center gap-5">
            <div>
              <ImUserPlus className="text-3xl text-base-200" />
            </div>
            <div>
              <p className="text-[0.9rem] font-semibold transition-all duration-150 group-hover:text-base-200">
                Add New User
              </p>
              <p className="text-[0.85rem] transition-all duration-150 group-hover:text-base-200">
                To add or create a new user, just click here
              </p>
            </div>
          </div>

          <IoIosArrowForward className="text-xl text-secondary-100-75" />
        </div>

        <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-secondary-200/50 bg-white px-8 py-3">
          <div className="flex items-center gap-5">
            <div>
              <HiOutlineFolderAdd className="text-4xl text-base-200" />
            </div>
            <div>
              <p className="text-[0.9rem] font-semibold transition-all duration-150 group-hover:text-base-200">
                Add New Document
              </p>
              <p className="text-[0.85rem] transition-all duration-150 group-hover:text-base-200">
                To add or create a new document, just click here
              </p>
            </div>
          </div>

          <IoIosArrowForward className="text-xl text-secondary-100-75" />
        </div>
      </div>
    </div>
  );
};

export default OverViewSummary;
