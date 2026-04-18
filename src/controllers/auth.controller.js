import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import {
  findUserByEmailModel,
  getUserMappingModel,
  getRolesByUserAndInstituteModel,
} from "../models/authModel.js";
import { MESSAGES } from "../constants/messages.js";
import { errorResponse, successResponse } from "../responses/responseHandler.js";

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Find user
    const userResult = await findUserByEmailModel(email);

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = userResult.rows[0];

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return errorResponse(res, MESSAGES.INVALID_CREDENTIALS);
    }
    // 4. Get institute + role mappings
    const mappingResult = await getUserMappingModel(user.id);

    // 5. No mapping → not associated with any institute
    if (mappingResult.rows.length === 0) {
      return errorResponse(res, MESSAGES.NO_INSTITUTE);
    }

    // 6. Group roles under each institute
    const instituteMap = {};

    mappingResult.rows.forEach((row) => {
      if (!instituteMap[row.institute_id]) {
        instituteMap[row.institute_id] = {
          institute_id: row.institute_id,
          name: row.institute_name,
          city: row.city,
          state: row.state,
          type: row.type,
          subtype: row.subtype,
          roles: [],
        };
      }
      instituteMap[row.institute_id].roles.push({
        role_id: row.role_id,
        role_name: row.role_name,
      });
    });

    const institutes = Object.values(instituteMap);

    // 7. Determine flow
    //    - 1 institute + 1 role  → dashboard
    //    - 1 institute + N roles → role_selection
    //    - N institutes          → institute_selection (select-institute endpoint decides next step)
    let flow = "";

    if (institutes.length === 1) {
      flow = institutes[0].roles.length === 1 ? "dashboard" : "role_selection";
    } else {
      flow = "institute_selection";
    }

    // 8. Generate JWT
    const token = generateToken({ id: user.id, email: user.email });

    // 9. Build clean user object
    const responseUser = {
      id: user.id,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      email: user.email,
    };

    // 10. Respond
    return successResponse(res, {
      token,
      flow,
      user: responseUser,
      institutes,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── SELECT INSTITUTE ────────────────────────────────────────────────────────
// Called after user picks an institute from the institute_selection screen.
// Protected route — requires Bearer JWT.
//
// Scenarios handled:
//   Thor  → multiple institutes, each has 1 role  → flow: "dashboard"
//   Tony  → multiple institutes, each has N roles → flow: "role_selection"
export const selectInstitute = async (req, res) => {
  try {
    const { institute_id } = req.body;
    const user_id = req.user.id; // from JWT (set by protect middleware)

    if (!institute_id) {
      return res.status(400).json({
        success: false,
        message: "institute_id is required",
      });
    }

    // 1. Get roles for this user in the selected institute
    const rolesResult = await getRolesByUserAndInstituteModel(user_id, institute_id);

    if (rolesResult.rows.length === 0) {
      return errorResponse(res, MESSAGES.NO_ROLE);
    }

    const roles = rolesResult.rows;

    // 2. Decide next flow
    const flow = roles.length === 1 ? "dashboard" : "role_selection";

    // 3. Respond
    return successResponse(res, {
      flow,
      institute_id,
      roles,
    });

  } catch (error) {
    console.error("Select Institute Error:", error);
    return errorResponse(res, "Server error");
  }
};