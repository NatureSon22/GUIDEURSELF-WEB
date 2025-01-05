import { Schema, model } from "mongoose";

const ReportTemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  template_url: {
    type: String,
    required: true,
  },
});

const ReportTemplate = model("ReportTemplate", ReportTemplateSchema);

export default ReportTemplate;
