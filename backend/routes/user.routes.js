const express = require("express");
const router = express.Router();
const {
  updateProfile,
  toggleWishlist,
  getWishlist,
  getAllUsers,
  getDashboardStats,
} = require("../controllers/user.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.use(protect);

router.put("/profile", updateProfile);
router.get("/wishlist", getWishlist);
router.post("/wishlist/:productId", toggleWishlist);

// Admin
router.get("/", adminOnly, getAllUsers);
router.get("/admin/stats", adminOnly, getDashboardStats);

module.exports = router;
