import { query } from "../db/query.js";

// FIND USER BY EMAIL
export const findUserByEmailModel = async (email) => {
  return await query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
};

// GET USER MAPPING (JOIN)
export const getUserMappingModel = async (user_id) => {
  return await query(
    `SELECT 
      i.id AS institute_id,
      i.name AS institute_name,
      i.city,
      i.state,
      i.type,
      i.subtype,
      r.id AS role_id,
      r.name AS role_name
     FROM user_institute_roles uir
     JOIN institutes i ON uir.institute_id = i.id
     JOIN roles r ON uir.role_id = r.id
     WHERE uir.user_id = $1`,
    [user_id]
  );
};

// GET ROLES FOR A USER IN A SPECIFIC INSTITUTE
export const getRolesByUserAndInstituteModel = async (user_id, institute_id) => {
  return await query(
    `SELECT 
      r.id AS role_id,
      r.name AS role_name
     FROM user_institute_roles uir
     JOIN roles r ON uir.role_id = r.id
     WHERE uir.user_id = $1 AND uir.institute_id = $2`,
    [user_id, institute_id]
  );
};