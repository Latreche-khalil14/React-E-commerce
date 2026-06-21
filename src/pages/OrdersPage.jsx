import { useEffect, useState } from "react";
import {
  Box, Button, Chip, Container, Paper, Stack, Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getMyOrdersApi } from "../api/orders.api";
import EmptyState from "../components/common/EmptyState";
import usePageTitle from "../hooks/usePageTitle";
import toast from "react-hot-toast";

const statusColors = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const OrdersPage = () => {
  usePageTitle("My Orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrdersApi()
      .then((res) => setOrders(res.data.orders))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Container sx={{ py: 6 }}>
      <Typography>Loading orders...</Typography>
    </Container>
  );

  if (orders.length === 0) {
    return (
      <Container>
        <EmptyState
          icon="📦"
          title="No orders yet"
          subtitle="You haven't placed any orders. Start shopping and your orders will appear here."
          actionLabel="Start Shopping"
          actionPath="/"
        />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>My Orders</Typography>
      <Stack spacing={2}>
        {orders.map((order) => (
          <Paper key={order._id} sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography fontWeight={600}>{order.orderNumber}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </Typography>
                <Typography variant="body2" mt={0.5}>
                  {order.items.length} item(s)
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip
                  label={order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  color={statusColors[order.orderStatus] || "default"}
                  size="small"
                />
                <Typography fontWeight={600} color="#D23F57">
                  ${order.totalPrice.toFixed(2)}
                </Typography>
                <Button
                  variant="outlined" size="small"
                  component={Link} to={`/orders/${order._id}`}
                >
                  View Details
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default OrdersPage;
