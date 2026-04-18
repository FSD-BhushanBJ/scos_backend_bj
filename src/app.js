import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import roleRoutes from "./routes/role.route.js";
import instituteRoutes from "./routes/institute.route.js";
import mappingRoutes from "./routes/mapping.route.js";
import tenantRoutes from "./routes/tenant.route.js";
import { initRoutes } from "./route_manager/routeManager.js";


const app = express();

app.use(cors());
app.use(express.json());

// central routes 
initRoutes(app);


//  root route (fix your original issue)
app.get("/", (req, res) => {
  res.send("Backend is running ");
});

// test route
app.get("/check", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM public.users");
    res.json(data.rows);
  } catch (err) {
    console.error(err);
    res.json({ error: err.message });
  }
});

export default app;