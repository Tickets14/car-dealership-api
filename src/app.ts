import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors.js";
import { errorHandler, AppError } from "./middleware/error-handler.js";

// Buyer routes
import buyerCarsRoutes from "./routes/buyer/cars.routes.js";
import buyerInquiriesRoutes from "./routes/buyer/inquiries.routes.js";
import buyerSubmissionsRoutes from "./routes/buyer/submissions.routes.js";
import buyerPrequalifyRoutes from "./routes/buyer/prequalify.routes.js";
import buyerSettingsRoutes from "./routes/buyer/settings.routes.js";
import buyerTestimonialsRoutes from "./routes/buyer/testimonials.routes.js";

// Admin routes
import adminAuthRoutes from "./routes/admin/auth.routes.js";
import adminCarsRoutes from "./routes/admin/cars.routes.js";
import adminSubmissionsRoutes from "./routes/admin/submissions.routes.js";
import adminInquiriesRoutes from "./routes/admin/inquiries.routes.js";
import adminNotificationsRoutes from "./routes/admin/notifications.routes.js";
import adminTestimonialsRoutes from "./routes/admin/testimonials.routes.js";
import adminSettingsRoutes from "./routes/admin/settings.routes.js";
import adminDashboardRoutes from "./routes/admin/dashboard.routes.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Buyer routes
app.use("/api/cars", buyerCarsRoutes);
app.use("/api/inquiries", buyerInquiriesRoutes);
app.use("/api/seller-submissions", buyerSubmissionsRoutes);
app.use("/api/pre-qualify", buyerPrequalifyRoutes);
app.use("/api/settings", buyerSettingsRoutes);
app.use("/api/testimonials", buyerTestimonialsRoutes);

// Admin routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/cars", adminCarsRoutes);
app.use("/api/admin/submissions", adminSubmissionsRoutes);
app.use("/api/admin/inquiries", adminInquiriesRoutes);
app.use("/api/admin/notifications", adminNotificationsRoutes);
app.use("/api/admin/testimonials", adminTestimonialsRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// 404 catch-all
app.use((_req, _res, next) => {
  next(new AppError("Not Found", 404));
});

// Global error handler
app.use(errorHandler);

export default app;
