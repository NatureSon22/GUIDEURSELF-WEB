const RoleSchema = new Schema({
  role_type: { type: String, required: true },
  permissions: [
    {
      module: { type: String, required: true },
      access: { type: [String], required: true },
    },
  ],
});

export { UserSchema, RoleSchema };
