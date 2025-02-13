import ActivityLog from "../models/activityLog.js";
import UserModel from "../models/user.js";

const activitylog = async (userId, action) => {
  try {
    const user = await UserModel.findById(userId).populate("role_id campus_id");
    
    await ActivityLog.create({
      user_number: user.user_number,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      role_type: user.role_id.role_type,
      campus_name: user.campus_id.campus_name,
      action: action
    })

  } catch (error) {
    console.log(error);
  }
};

export default activitylog;