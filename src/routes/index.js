import { Router } from "express";

const router = Router();

// Mount feature routers here, e.g.:
// router.use("/users", userRoutes);

router.get("/", (req, res) => {
  res.json({ message: "Viral Market API v1" });
});

export default router;
