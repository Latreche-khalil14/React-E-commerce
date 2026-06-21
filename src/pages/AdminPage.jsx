// @ts-nocheck
import { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, Paper, Stack, Tab, Tabs, TextField,
  Typography, MenuItem, Select, FormControl, InputLabel,
} from "@mui/material";
import {
  People, Inventory, ShoppingBag, AttachMoney,
  Edit, Delete, Add, Refresh,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getAllOrdersApi, updateOrderStatusApi } from "../api/orders.api";
import { getProductsApi, deleteProductApi } from "../api/products.api";
import api from "../api/axios";
import toast from "react-hot-toast";

const StatCard = ({ icon, title, value, color }) => (
  <Card sx={{ flex: 1, minWidth: 180 }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}22` }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const statusColors   = { pending: "warning", processing: "info", shipped: "primary", delivered: "success", cancelled: "error" };

const AdminPage = () => {
  const { user } = useAuth();
  const [tab, setTab]         = useState(0);
  const [stats, setStats]     = useState(null);
  const [orders, setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add product dialog
  const [addOpen, setAddOpen]     = useState(false);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "", description: "", price: "", discountPrice: "",
    stock: "", brand: "", gender: "unisex", category: "",
    images: [{ url: "", isMain: true }],
  });

  if (user?.role !== "admin") return <Navigate to="/" replace />;

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, catsRes] = await Promise.all([
        api.get("/users/admin/stats"),
        getAllOrdersApi({ limit: 20 }),
        getProductsApi({ limit: 20 }),
        api.get("/categories"),
      ]);
      setStats(statsRes.data.stats);
      setOrders(ordersRes.data.orders);
      setProducts(productsRes.data.products);
      setCategories(catsRes.data.categories);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatusApi(orderId, status);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus: status } : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProductApi(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleAddProduct = async () => {
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        discountPrice: parseFloat(newProduct.discountPrice) || 0,
        stock: parseInt(newProduct.stock),
      };
      await api.post("/products", payload);
      toast.success("Product added successfully!");
      setAddOpen(false);
      setNewProduct({ name: "", description: "", price: "", discountPrice: "", stock: "", brand: "", gender: "unisex", category: "", images: [{ url: "", isMain: true }] });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" py={10}>
      <CircularProgress sx={{ color: "#D23F57" }} />
    </Box>
  );

  return (
    <Container sx={{ py: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>Admin Dashboard</Typography>
        <Button startIcon={<Refresh />} variant="outlined" onClick={loadData}>Refresh</Button>
      </Stack>

      {/* ── Stats ── */}
      {stats && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4} flexWrap="wrap">
          <StatCard icon={<People sx={{ color: "#1976d2" }} />} title="Total Users"    value={stats.totalUsers}    color="#1976d2" />
          <StatCard icon={<Inventory sx={{ color: "#388e3c" }} />} title="Products"   value={stats.totalProducts} color="#388e3c" />
          <StatCard icon={<ShoppingBag sx={{ color: "#f57c00" }} />} title="Orders"   value={stats.totalOrders}   color="#f57c00" />
          <StatCard icon={<AttachMoney sx={{ color: "#D23F57" }} />} title="Revenue"  value={`$${stats.revenue?.toFixed(2)}`} color="#D23F57" />
        </Stack>
      )}

      {/* ── Tabs ── */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`Orders (${orders.length})`} />
        <Tab label={`Products (${products.length})`} />
      </Tabs>

      {/* ── Orders Tab ── */}
      {tab === 0 && (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper key={order._id} sx={{ p: 2.5, borderRadius: 2 }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography fontWeight={600}>{order.orderNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.user?.name} — {order.user?.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography fontWeight={700} color="#D23F57">${order.totalPrice?.toFixed(2)}</Typography>
                  <Select
                    size="small" value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    sx={{ minWidth: 130 }}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>
                        <Chip label={s} color={statusColors[s]} size="small" sx={{ textTransform: "capitalize" }} />
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {/* ── Products Tab ── */}
      {tab === 1 && (
        <>
          <Button
            variant="contained" startIcon={<Add />}
            onClick={() => setAddOpen(true)}
            sx={{ mb: 3, bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}
          >
            Add Product
          </Button>

          <Stack spacing={2}>
            {products.map((product) => (
              <Paper key={product._id} sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    component="img"
                    src={product.images?.[0]?.url || "https://via.placeholder.com/60"}
                    sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1 }}
                  />
                  <Box flex={1}>
                    <Typography fontWeight={600}>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {product.stock} · Sold: {product.sold} · Rating: {product.ratings}⭐
                    </Typography>
                  </Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {product.discountPrice > 0 ? (
                      <Box textAlign="right">
                        <Typography color="#D23F57" fontWeight={700}>${product.discountPrice.toFixed(2)}</Typography>
                        <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.secondary" }}>${product.price.toFixed(2)}</Typography>
                      </Box>
                    ) : (
                      <Typography fontWeight={700}>${product.price.toFixed(2)}</Typography>
                    )}
                    <IconButton color="error" onClick={() => handleDeleteProduct(product._id)} size="small">
                      <Delete />
                    </IconButton>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </>
      )}

      {/* ── Add Product Dialog ── */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField fullWidth label="Product Name *" value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            <TextField fullWidth multiline rows={3} label="Description *" value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            <Stack direction="row" spacing={2}>
              <TextField fullWidth label="Price *" type="number" value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
              <TextField fullWidth label="Discount Price" type="number" value={newProduct.discountPrice}
                onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField fullWidth label="Stock *" type="number" value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
              <TextField fullWidth label="Brand" value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} />
            </Stack>
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select label="Category *" value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select label="Gender" value={newProduct.gender}
                onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}>
                {["men", "women", "unisex", "kids"].map((g) => (
                  <MenuItem key={g} value={g} sx={{ textTransform: "capitalize" }}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField fullWidth label="Image URL *" value={newProduct.images[0]?.url || ""}
              onChange={(e) => setNewProduct({ ...newProduct, images: [{ url: e.target.value, isMain: true }] })}
              placeholder="https://example.com/image.jpg" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddProduct}
            sx={{ bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}>
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;
