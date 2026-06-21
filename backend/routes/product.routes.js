const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getFeaturedProducts,
} = require("../controllers/product.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/featured", getFeaturedProducts);
router.get("/", getProducts);
router.get("/:id", getProduct);

router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

router.post("/:id/reviews", protect, addReview);

module.exports = router;
