import ActivityLog from "../models/activityLog.js";
import UserModel from "../models/user.js";

const activitylog = async (userId, action) => {
  try {
// <<<<<<< HEAD
    // Populate both `role_id` and `campus_id`
    const user = await UserModel.findById(userId).populate("role_id campus_id");

    if (!user) {
      console.log("User not found, activity log not saved.");
      return;
    }

    // Ensure campus_id is populated
    const campusName = user.campus_id?.campus_name || "Unknown Campus"; 
    
// >>>>>>> 6abb09a36b3390c699d0eceaf51c584919c3c6fe
    await ActivityLog.create({
      user_number: user.user_number,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
// <<<<<<< HEAD
      role_type: user.role_id?.role_type || "Unknown Role",
      campus_name: campusName,
      action: action
    });

  } catch (error) {
    console.log("Error saving activity log:", error);
  }
};

export default activitylog;
// =======
//       role_type: user.role_id.role_type,
//       campus_name: user.campus_id.campus_name,
//       action: action
//     })

//   } catch (error) {
//     console.log(error);
//   }
// };

// export default activitylog;
// >>>>>>> 6abb09a36b3390c699d0eceaf51c584919c3c6fe
