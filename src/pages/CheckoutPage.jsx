import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, Container, Divider, FormControl, FormControlLabel,
  FormLabel, Paper, Radio, RadioGroup, Stack, TextField, Typography,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { createOrderApi } from "../api/orders.api";
import toast from "react-hot-toast";

import usePageTitle from "../hooks/usePageTitle";

const CheckoutPage = () => {
  usePageTitle("Checkout");
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", country: "Algeria", zipCode: "",
  });

  const handleAddressChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const shipping = cartTotal > 99 ? 0 : 9.99;
  const tax = Math.round(cartTotal * 0.1 * 100) / 100;
  const total = cartTotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ["fullName", "phone", "street", "city", "state"];
    const missing = required.filter((f) => !address[f]);
    if (missing.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await createOrderApi({ shippingAddress: address, paymentMethod });
      clearCart(); // ← تفريغ السلة في الـ frontend state
      toast.success("Order placed successfully!");
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>Checkout</Typography>

      <form onSubmit={handleSubmit}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          {/* Shipping Form */}
          <Box flex={1}>
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Shipping Address</Typography>
              <Stack spacing={2}>
                <TextField fullWidth required label="Full Name" name="fullName" value={address.fullName} onChange={handleAddressChange} />
                <TextField fullWidth required label="Phone" name="phone" value={address.phone} onChange={handleAddressChange} />
                <TextField fullWidth required label="Street Address" name="street" value={address.street} onChange={handleAddressChange} />
                <Stack direction="row" spacing={2}>
                  <TextField fullWidth required label="City" name="city" value={address.city} onChange={handleAddressChange} />
                  <TextField fullWidth required label="State / Province" name="state" value={address.state} onChange={handleAddressChange} />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField fullWidth label="Country" name="country" value={address.country} onChange={handleAddressChange} />
                  <TextField fullWidth label="ZIP Code" name="zipCode" value={address.zipCode} onChange={handleAddressChange} />
                </Stack>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 600, mb: 1 }}>Payment Method</FormLabel>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <FormControlLabel value="cash_on_delivery" control={<Radio />} label="Cash on Delivery" />
                  <FormControlLabel value="credit_card" control={<Radio />} label="Credit Card (coming soon)" disabled />
                  <FormControlLabel value="paypal" control={<Radio />} label="PayPal (coming soon)" disabled />
                </RadioGroup>
              </FormControl>
            </Paper>
          </Box>

          {/* Order Summary */}
          <Paper sx={{ p: 3, borderRadius: 2, height: "fit-content", minWidth: { md: 320 } }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Order Summary</Typography>
            {cart.items.map((item) => (
              <Stack key={item._id} direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 180 }}>
                  {item.name} × {item.quantity}
                </Typography>
                <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
              </Stack>
            ))}
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>${cartTotal.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Shipping</Typography>
                <Typography>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Tax</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={700} variant="h6">Total</Typography>
                <Typography fontWeight={700} variant="h6" color="#D23F57">${total.toFixed(2)}</Typography>
              </Stack>
            </Stack>

            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              sx={{ mt: 3, bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" }, py: 1.5 }}
            >
              {loading ? "Placing Order..." : `Place Order • $${total.toFixed(2)}`}
            </Button>
          </Paper>
        </Stack>
      </form>
    </Container>
  );
};

export default CheckoutPage;
