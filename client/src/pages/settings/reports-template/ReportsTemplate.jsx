import Header from "@/components/Header";
import ReportTemplateField from "./ReportTemplateField";
import TemplatesField from "./TemplatesField";

const ReportsTemplate = () => {
  return (
    <div className="space-y-5">
      <Header
        title="Reports Template"
        subtitle="Manage and upload document templates for report generation"
      />

      <ReportTemplateField />

      <TemplatesField />
    </div>
  );
};

export default ReportsTemplate;
