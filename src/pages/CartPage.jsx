// @ts-nocheck
import { useState } from "react";
import {
  Box, Button, Container, Divider, IconButton, InputAdornment,
  LinearProgress, OutlinedInput, Paper, Stack, Typography,
} from "@mui/material";
import { Add, Remove, Delete, ShoppingCartOutlined, LocalOffer } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/common/ConfirmDialog";
import usePageTitle from "../hooks/usePageTitle";

const CartPage = () => {
  usePageTitle("Shopping Cart");

  const { cart, updateItem, removeItem, clearCart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Confirm dialog state
  const [confirmOpen,    setConfirmOpen]    = useState(false);
  const [confirmTarget,  setConfirmTarget]  = useState(null);
  const [couponCode,     setCouponCode]     = useState("");
  const [couponApplied,  setCouponApplied]  = useState(false); // { type: "item"|"clear", id? }

  const askRemoveItem = (itemId) => {
    setConfirmTarget({ type: "item", id: itemId });
    setConfirmOpen(true);
  };
  const askClearCart = () => {
    setConfirmTarget({ type: "clear" });
    setConfirmOpen(true);
  };
  const handleConfirm = () => {
    if (confirmTarget?.type === "item")  removeItem(confirmTarget.id);
    if (confirmTarget?.type === "clear") clearCart();
    setConfirmOpen(false);
    setConfirmTarget(null);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setCouponApplied(true);
      toast.success("Coupon applied! $10 off your order");
    } else {
      toast.error("Invalid coupon code");
    }
  };
  const couponDiscount = couponApplied ? 10 : 0;

  // ── Not logged in ───────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <ShoppingCartOutlined sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" mb={1}>Please log in to view your cart</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to see items you&apos;ve added
        </Typography>
        <Button variant="contained" component={Link} to="/login"
          sx={{ bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}>
          Sign In
        </Button>
      </Container>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────
  if (!cart || cart.items.length === 0) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <ShoppingCartOutlined sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" mb={1}>Your cart is empty</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Looks like you haven&apos;t added anything yet
        </Typography>
        <Button variant="contained" component={Link} to="/"
          sx={{ bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}>
          Start Shopping
        </Button>
      </Container>
    );
  }

  const shipping = cartTotal > 99 ? 0 : 9.99;
  const tax      = Math.round(cartTotal * 0.1 * 100) / 100;
  const total    = Math.max(0, cartTotal + shipping + tax - couponDiscount);

  // Progress toward free shipping
  const freeShippingThreshold = 99;
  const progress = Math.min((cartTotal / freeShippingThreshold) * 100, 100);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>
        Shopping Cart
        <Typography component="span" variant="h6" color="text.secondary" ml={1} fontWeight={400}>
          ({cart.totalItems} {cart.totalItems === 1 ? "item" : "items"})
        </Typography>
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* ── Cart Items ── */}
        <Box flex={1}>
          {cart.items.map((item) => (
            <Paper key={item._id} sx={{ p: 2, mb: 2, borderRadius: 2, transition: "box-shadow 0.2s", "&:hover": { boxShadow: 3 } }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  component="img"
                  src={item.image || "https://via.placeholder.com/80"}
                  alt={item.name}
                  sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1, flexShrink: 0 }}
                />
                <Box flex={1} minWidth={0}>
                  <Typography fontWeight={500} noWrap>{item.name}</Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {item.size  && <Typography variant="caption" color="text.secondary" sx={{ bgcolor: "action.hover", px: 0.8, borderRadius: 1 }}>Size: {item.size}</Typography>}
                    {item.color && <Typography variant="caption" color="text.secondary" sx={{ bgcolor: "action.hover", px: 0.8, borderRadius: 1 }}>Color: {item.color}</Typography>}
                  </Stack>
                  <Typography color="#D23F57" fontWeight={600} mt={0.3}>${item.price.toFixed(2)}</Typography>
                </Box>

                {/* Qty controls */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconButton size="small" onClick={() => updateItem(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography fontWeight={700} minWidth={28} textAlign="center">{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => updateItem(item._id, item.quantity + 1)}
                    sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                    <Add fontSize="small" />
                  </IconButton>
                </Stack>

                <Typography fontWeight={700} minWidth={72} textAlign="right">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>

                <IconButton color="error" size="small" onClick={() => askRemoveItem(item._id)}
                  sx={{ "&:hover": { bgcolor: "error.light", color: "#fff" } }}>
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>
            </Paper>
          ))}

          <Button variant="outlined" color="error" size="small" onClick={askClearCart}>
            Clear All
          </Button>
        </Box>

        {/* ── Order Summary ── */}
        <Paper sx={{ p: 3, borderRadius: 2, height: "fit-content", minWidth: { md: 320 } }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Order Summary</Typography>

          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>${cartTotal.toFixed(2)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Shipping</Typography>
              <Typography color={shipping === 0 ? "success.main" : "inherit"} fontWeight={shipping === 0 ? 600 : 400}>
                {shipping === 0 ? "FREE 🎉" : `$${shipping.toFixed(2)}`}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Tax (10%)</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={700} variant="h6">Total</Typography>
              <Typography fontWeight={700} variant="h6" color="#D23F57">
                ${total.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>

          {/* Coupon Code */}
          <Box mt={2}>
            <OutlinedInput
              fullWidth size="small"
              placeholder="Coupon code (try SAVE10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={couponApplied}
              startAdornment={<InputAdornment position="start"><LocalOffer fontSize="small" /></InputAdornment>}
              endAdornment={
                <InputAdornment position="end">
                  <Button size="small" disabled={couponApplied || !couponCode}
                    onClick={handleApplyCoupon}
                    sx={{ color: "#D23F57", fontWeight: 700 }}>
                    {couponApplied ? "Applied ✓" : "Apply"}
                  </Button>
                </InputAdornment>
              }
            />
            {couponApplied && (
              <Typography variant="caption" color="success.main" mt={0.5} display="block">
                🎉 $10 discount applied!
              </Typography>
            )}
          </Box>

          {/* Free shipping progress */}
          {shipping > 0 && (
            <Box mt={2}>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary">Progress to FREE shipping</Typography>
                <Typography variant="caption" color="text.secondary">${cartTotal.toFixed(2)} / $99</Typography>
              </Stack>
              <LinearProgress
                variant="determinate" value={progress}
                sx={{ borderRadius: 5, height: 6, bgcolor: "action.hover",
                  "& .MuiLinearProgress-bar": { bgcolor: "#D23F57" } }}
              />
              <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                Add ${(99 - cartTotal).toFixed(2)} more for FREE shipping!
              </Typography>
            </Box>
          )}

          <Button
            fullWidth variant="contained" size="large"
            onClick={() => navigate("/checkout")}
            sx={{ mt: 3, bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" }, py: 1.5, fontWeight: 700 }}
          >
            Proceed to Checkout — ${total.toFixed(2)}
          </Button>
          <Button fullWidth variant="outlined" component={Link} to="/" sx={{ mt: 1.5 }}>
            Continue Shopping
          </Button>
        </Paper>
      </Stack>

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        open={confirmOpen}
        title={confirmTarget?.type === "clear" ? "Clear entire cart?" : "Remove item?"}
        message={
          confirmTarget?.type === "clear"
            ? "All items will be removed from your cart. This cannot be undone."
            : "This item will be removed from your cart."
        }
        confirmLabel={confirmTarget?.type === "clear" ? "Clear All" : "Remove"}
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
      />
    </Container>
  );
};

export default CartPage;
