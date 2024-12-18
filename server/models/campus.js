import { Schema, model } from "mongoose";

const CampusSchema = new Schema(
  {
    campus_name: {
      type: String,
      required: true,
    },
    campus_code: {
      type: String,
      required: true,
    },
    campus_phone_number: {
      type: String,
      required: true,
    },
    campus_email: {
      type: String,
      required: true,
    },
    campus_address: {
      type: String,
      required: true,
    },
    campus_cover_photo_url: {
      type: String,
      required: false,
    },
    campus_about: {
      type: String,
      required: false,
    },
    campus_programs: [
      {
        program_type_id: {
          type: String,
          required: true,
        },
        programs: [
          {
            program_name: {
              type: String,
              required: true,
            },
            majors: [
              {
                type: String,
                required: true,
              },
            ],
          },
        ],
      },
    ],
    campus_offices: [
      {
        office_name: {
          type: String,
          required: true,
        },
        office_email: {
          type: String,
          required: true,
        },
        office_number: {
          type: String,
          required: true,
        },
        office_head: {
          type: String,
          required: true,
        },
      },
    ],
    colleges: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const CampusModel = model("Campus", CampusSchema);

export default CampusModel;
