import Header from "@/components/Header";
import ReportsTabInfo from "@/components/ReportsTabInfo";
import ReportsTab from "@/components/ReportsTab";

const Reports = () => {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <Header
        title="Reports"
        subtitle="Access, review, and generate reports on user account records"
      />

      <div className="grid grid-cols-2 gap-3">
        {ReportsTabInfo.map((info, i) => (
          <ReportsTab key={i} {...info} />
        ))}
      </div>

      <iframe
        src="https://docs.google.com/gview?url=https://res.cloudinary.com/dtv9zeo30/raw/upload/v1736059473/templates/wc1789tovbezszoyobl7.docx&embedded=true"
        className="w-full h-full
        "
      ></iframe>
    </div>
  );
};

export default Reports;
