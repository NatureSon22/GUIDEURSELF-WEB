import { MdPeopleAlt } from "react-icons/md";
import { BsFillBuildingFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { FaFolder } from "react-icons/fa";
import { ImUserPlus } from "react-icons/im";
import { IoIosArrowForward } from "react-icons/io";
import { HiOutlineFolderAdd } from "react-icons/hi";
import { fetchCampuses } from "@/api/component-info.js";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/api/accounts";
import { getAllDocuments } from "@/api/documents";
import TallyReportSummary from "./TallyReportSummary";
import useToggleTheme from "@/context/useToggleTheme";

const OverViewSummary = () => {
  const { isDarkMode } = useToggleTheme((state) => state);
  const navigate = useNavigate();
  const { data: campuses = [] } = useQuery({
    queryKey: ["campuses"],
    queryFn: fetchCampuses,
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAllAccounts(),
  });

  const { data: allDocuments = [] } = useQuery({
    queryKey: ["all-documents"],
    queryFn: () => getAllDocuments(),
  });

  const handleNavigate = (path) => {
    navigate(path);
  };

  const totalCampuses = campuses.length;
  const totalAccounts = accounts.length;
  const totalDocuments = allDocuments.length;

  return (
    <div className="flex gap-5">
      <div className="flex w-[63%] flex-col gap-4">
        <div className="flex gap-5">
          <div
            className={`flex flex-1 cursor-pointer items-center justify-between rounded-xl border border-secondary-200/50 py-7 pl-7 pr-10 ${isDarkMode ? "bg-dark-base-bg" : "bg-white"} transition-colors duration-150`}
            onClick={() => handleNavigate("/accounts")}
          >
            <div
              className={`space-y-2 ${isDarkMode ? "text-dark-text-base-300" : ""} `}
            >
              <p className="w-min text-[0.92rem]">Total Users</p>
              <p className="text-3xl font-semibold">{totalAccounts}</p>
            </div>

            <div>
              <MdPeopleAlt className="text-6xl text-base-200" />
            </div>
          </div>
          <div
            className={`flex flex-1 cursor-pointer items-center justify-between rounded-xl border border-secondary-200/50 py-7 pl-7 pr-10 ${isDarkMode ? "bg-dark-base-bg" : "bg-white"} transition-colors duration-150`}
            onClick={() => handleNavigate("/campus")}
          >
            <div
              className={`space-y-2 ${isDarkMode ? "text-dark-text-base-300" : ""} `}
            >
              <p className="w-min text-[0.95rem]">Total Campuses</p>
              <p className="text-3xl font-semibold">{totalCampuses}</p>
            </div>
            <div>
              <BsFillBuildingFill className="text-5xl text-base-200" />
            </div>
          </div>
          <div
            className={`flex flex-1 cursor-pointer items-center justify-between rounded-xl border border-secondary-200/50 py-7 pl-7 pr-10 ${isDarkMode ? "bg-dark-base-bg" : "bg-white"} transition-colors duration-150`}
            onClick={() => handleNavigate("/documents/all-documents")}
          >
            <div
              className={`space-y-2 ${isDarkMode ? "text-dark-text-base-300" : ""} `}
            >
              <p className="max-w-[8rem] text-[0.95rem]">
                Total Uploaded Documents
              </p>
              <p className="text-3xl font-semibold">{totalDocuments}</p>
            </div>
            <div>
              <FaFolder className="text-5xl text-base-200" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div
            className={`group flex w-full cursor-pointer items-center justify-between rounded-xl border border-secondary-200/50 px-8 py-3 transition-colors duration-150 ${isDarkMode ? "bg-dark-base-bg" : "bg-white"} `}
          >
            <div className="flex items-center gap-5">
              <div>
                <ImUserPlus className="text-3xl text-base-200" />
              </div>
              <div>
                <Link to="/accounts/add-account">
                  <p
                    className={`text-[0.9rem] font-semibold transition-all duration-150 group-hover:text-base-200 ${isDarkMode ? "text-dark-text-base-300" : ""}`}
                  >
                    Add New User
                  </p>
                  <p
                    className={`text-[0.85rem] transition-all duration-150 group-hover:text-base-200 ${isDarkMode ? "text-dark-text-base-300" : ""} `}
                  >
                    Click here to add or create a new user
                  </p>
                </Link>
              </div>
            </div>
            <IoIosArrowForward
              className={`text-xl ${isDarkMode ? "text-dark-text-base-300" : "text-secondary-100-75"}`}
            />
          </div>

          <div
            className={`group flex w-full cursor-pointer items-center justify-between rounded-xl border border-secondary-200/50 px-8 py-3 transition-colors duration-150 ${isDarkMode ? "bg-dark-base-bg" : "bg-white"} `}
          >
            <div className="flex items-center gap-5">
              <div>
                <HiOutlineFolderAdd className="text-4xl text-base-200" />
              </div>
              <div>
                <Link to="/documents/write-document">
                  <p
                    className={`text-[0.9rem] font-semibold transition-all duration-150 group-hover:text-base-200 ${isDarkMode ? "text-dark-text-base-300" : ""}`}
                  >
                    Add New Document
                  </p>

                  <p
                    className={`text-[0.85rem] transition-all duration-150 group-hover:text-base-200 ${isDarkMode ? "text-dark-text-base-300" : ""} `}
                  >
                    Click here to add a new document
                  </p>
                </Link>
              </div>
            </div>

            <IoIosArrowForward
              className={`text-xl ${isDarkMode ? "text-dark-text-base-300" : "text-secondary-100-75"}`}
            />
          </div>
        </div>
      </div>

      <TallyReportSummary />
    </div>
  );
};

export default OverViewSummary;
