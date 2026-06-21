import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box, Button, Chip, Container, Divider, Paper, Stack, Typography,
} from "@mui/material";
import { getOrderApi, cancelOrderApi } from "../api/orders.api";
import usePageTitle from "../hooks/usePageTitle";
import toast from "react-hot-toast";

const statusColors = {
  pending: "warning", processing: "info", shipped: "primary",
  delivered: "success", cancelled: "error",
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageTitle(order ? `Order ${order.orderNumber}` : "Order Details");

  useEffect(() => {
    getOrderApi(id)
      .then((res) => setOrder(res.data.order))
      .catch(() => toast.error("Order not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    try {
      const res = await cancelOrderApi(id, "Cancelled by customer");
      setOrder(res.data.order);
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot cancel order");
    }
  };

  if (loading) return <Container sx={{ py: 6 }}><Typography>Loading...</Typography></Container>;
  if (!order) return <Container sx={{ py: 6 }}><Typography>Order not found</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={600}>{order.orderNumber}</Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Chip
          label={order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
          color={statusColors[order.orderStatus] || "default"}
        />
      </Stack>

      <Stack spacing={3}>
        {/* Items */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Items Ordered</Typography>
          {order.items.map((item, i) => (
            <Box key={i}>
              <Stack direction="row" spacing={2} alignItems="center" py={1}>
                <Box component="img" src={item.image || "https://via.placeholder.com/60"}
                  sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1 }} />
                <Box flex={1}>
                  <Typography fontWeight={500}>{item.name}</Typography>
                  {item.size && <Typography variant="body2" color="text.secondary">Size: {item.size}</Typography>}
                  <Typography variant="body2">Qty: {item.quantity}</Typography>
                </Box>
                <Typography fontWeight={600}>${(item.price * item.quantity).toFixed(2)}</Typography>
              </Stack>
              {i < order.items.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>

        {/* Shipping */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Shipping Address</Typography>
          <Typography>{order.shippingAddress.fullName}</Typography>
          <Typography color="text.secondary">{order.shippingAddress.phone}</Typography>
          <Typography color="text.secondary">
            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
          </Typography>
          <Typography color="text.secondary">{order.shippingAddress.country}</Typography>
        </Paper>

        {/* Pricing */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Order Summary</Typography>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>${order.itemsPrice.toFixed(2)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Shipping</Typography>
              <Typography>{order.shippingPrice === 0 ? "FREE" : `$${order.shippingPrice.toFixed(2)}`}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Tax</Typography>
              <Typography>${order.taxPrice.toFixed(2)}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={700} variant="h6">Total</Typography>
              <Typography fontWeight={700} variant="h6" color="#D23F57">
                ${order.totalPrice.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" component={Link} to="/orders">Back to Orders</Button>
          {["pending", "processing"].includes(order.orderStatus) && (
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel Order
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default OrderDetailPage;
