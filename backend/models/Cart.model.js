const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  image: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
  size: { type: String, default: "" },
  color: { type: String, default: "" },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    coupon: {
      code: String,
      discount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: total items count
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

// Virtual: subtotal
cartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
});

// Virtual: total after discount
cartSchema.virtual("total").get(function () {
  const discount = this.coupon?.discount || 0;
  return Math.max(0, this.subtotal - discount);
});

module.exports = mongoose.model("Cart", cartSchema);
