// @ts-nocheck
import {
  Box, Button, Card, CardActions, CardContent, CardMedia,
  Chip, Container, Dialog, IconButton,
  Pagination, Rating, Stack, Typography, useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Close } from "@mui/icons-material";
import ProductSkeleton from "../common/ProductSkeleton";
import ProductDetails from "./ProductDetails";
import { getProductsApi } from "../../api/products.api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "popular",    label: "Most Popular" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating",     label: "Top Rated" },
];

const Main = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalItems, setTotalItems]     = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen]                 = useState(false);
  const [wishlist, setWishlist]         = useState([]);

  // Read filters from URL
  const genderFilter   = searchParams.get("gender")       || "all";
  const searchQuery    = searchParams.get("search")       || "";
  const sortBy         = searchParams.get("sort")         || "newest";
  const categoryId     = searchParams.get("categoryId")   || "";
  const categorySlug   = searchParams.get("categorySlug") || "";
  const currentPage    = parseInt(searchParams.get("page") || "1");

  const theme       = useTheme();
  const { addToCart }      = useCart();
  const { isAuthenticated } = useAuth();
  const navigate    = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [genderFilter, searchQuery, sortBy, currentPage, categoryId, categorySlug]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { limit: 12, sort: sortBy, page: currentPage };
      if (genderFilter !== "all") params.gender       = genderFilter;
      if (searchQuery)            params.search       = searchQuery;
      if (categoryId)             params.category     = categoryId;
      if (categorySlug)           params.categorySlug = categorySlug;

      const res = await getProductsApi(params);
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
      setTotalItems(res.data.total);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all" || value === "" || value === null) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete("page"); // reset page on filter change
    setSearchParams(next);
  };

  const handlePageChange = (_, page) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", page);
    setSearchParams(next);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    await addToCart(product._id, 1);
  };

  const toggleWishlist = (productId) => {
    if (!isAuthenticated) { toast.error("Please login"); return; }
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const getProductImage = (product) => {
    const main = product.images?.find((img) => img.isMain) || product.images?.[0];
    return main?.url || "https://via.placeholder.com/333x277?text=No+Image";
  };

  return (
    <Container sx={{ py: 9 }}>
      {/* ── Header Row ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={3}>
        <Box>
          <Typography variant="h6">
            {searchQuery    ? `Results for "${searchQuery}"` :
             categorySlug   ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Products` :
             genderFilter !== "all" ? `${genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)}'s Collection` :
             "Selected Products"}
          </Typography>
          <Typography fontWeight={300} variant="body2" color="text.secondary">
            {totalItems > 0 ? `${totalItems} products found` : "All our new arrivals in an exclusive brand selection"}
          </Typography>
        </Box>

        {/* Gender Filter */}
        <ToggleButtonGroup
          value={genderFilter} exclusive
          onChange={(_, v) => v && setFilter("gender", v)}
          sx={{ ".Mui-selected": { border: "1px solid rgba(233,69,96,0.5) !important", color: "#e94560", backgroundColor: "initial" } }}
        >
          <ToggleButton sx={{ color: theme.palette.text.primary }} value="all">All Products</ToggleButton>
          <ToggleButton sx={{ mx: "16px !important", color: theme.palette.text.primary }} value="men">MEN</ToggleButton>
          <ToggleButton sx={{ color: theme.palette.text.primary }} value="women">WOMEN</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* ── Sort Row ── */}
      <Stack direction="row" gap={1} mt={2} flexWrap="wrap">
        {SORT_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            onClick={() => setFilter("sort", opt.value)}
            variant={sortBy === opt.value ? "filled" : "outlined"}
            sx={{
              cursor: "pointer",
              ...(sortBy === opt.value && { bgcolor: "#D23F57", color: "#fff", "&:hover": { bgcolor: "#b82f45" } }),
            }}
          />
        ))}
      </Stack>

      {/* ── Active Search Badge ── */}
      {searchQuery && (
        <Stack direction="row" alignItems="center" gap={1} mt={2}>
          <Typography variant="body2">Searching:</Typography>
          <Chip
            label={searchQuery}
            onDelete={() => setFilter("search", null)}
            color="error" variant="outlined" size="small"
          />
        </Stack>
      )}

      {/* ── Products Grid ── */}
      {loading ? (
        <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </Stack>
      ) : products.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography color="text.secondary" variant="h6">
            {searchQuery ? `No products found for "${searchQuery}"` : "No products found."}
          </Typography>
          {searchQuery && (
            <Button sx={{ mt: 2, color: "#D23F57" }} onClick={() => setFilter("search", null)}>
              Clear search
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
            {products.map((product) => (
              <Card
                key={product._id}
                sx={{
                  maxWidth: 333, mt: 6, position: "relative",
                  ":hover .MuiCardMedia-root": { rotate: "0.8deg", scale: "1.1", transition: "0.35s" },
                }}
              >
                {/* Discount Badge */}
                {product.discountPercent > 0 && (
                  <Chip
                    label={`-${product.discountPercent}%`} size="small"
                    sx={{ position: "absolute", top: 10, left: 10, zIndex: 1, bgcolor: "#D23F57", color: "#fff", fontWeight: 700 }}
                  />
                )}

                {/* Wishlist Button */}
                <IconButton
                  size="small"
                  onClick={() => toggleWishlist(product._id)}
                  sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "#fff" } }}
                >
                  {wishlist.includes(product._id)
                    ? <FavoriteIcon fontSize="small" sx={{ color: "#D23F57" }} />
                    : <FavoriteBorderIcon fontSize="small" />}
                </IconButton>

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, bgcolor: "rgba(0,0,0,0.35)", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1 }}>
                    <Typography color="#fff" fontWeight={700} variant="h6">Out of Stock</Typography>
                  </Box>
                )}

                <CardMedia sx={{ height: 277 }} image={getProductImage(product)} title={product.name} />

                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography gutterBottom variant="h6" sx={{ maxWidth: 190, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                      {product.name}
                    </Typography>
                    <Box textAlign="right">
                      {product.discountPrice > 0 ? (
                        <>
                          <Typography variant="subtitle1" color="#D23F57" fontWeight={700}>${product.discountPrice.toFixed(2)}</Typography>
                          <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.secondary" }}>${product.price.toFixed(2)}</Typography>
                        </>
                      ) : (
                        <Typography variant="subtitle1" fontWeight={700}>${product.price.toFixed(2)}</Typography>
                      )}
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {product.shortDescription || product.description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                  <Stack direction="row" gap={1}>
                    <Button
                      sx={{ textTransform: "capitalize" }} size="small"
                      onClick={() => handleOpenDetails(product)}
                      disabled={!product.inStock}
                    >
                      <AddShoppingCartOutlinedIcon sx={{ mr: 0.5 }} fontSize="small" />
                      Add
                    </Button>
                    <Button
                      component={Link}
                      to={`/products/${product._id}`}
                      size="small" variant="outlined"
                      sx={{ textTransform: "capitalize", borderColor: "divider" }}
                    >
                      Details
                    </Button>
                  </Stack>
                  <Rating precision={0.5} value={product.ratings} readOnly size="small" />
                </CardActions>
              </Card>
            ))}
          </Stack>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={6}>
              <Pagination
                count={totalPages} page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ ".MuiPaginationItem-root.Mui-selected": { bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } } }}
              />
            </Box>
          )}
        </>
      )}

      {/* ── Product Details Dialog ── */}
      <Dialog
        sx={{ ".MuiPaper-root": { minWidth: { xs: "100%", md: 800 } } }}
        open={open} onClose={() => setOpen(false)}
      >
        <IconButton
          sx={{ ":hover": { color: "red", rotate: "180deg", transition: "0.3s" }, position: "absolute", top: 0, right: 10 }}
          onClick={() => setOpen(false)}
        >
          <Close />
        </IconButton>
        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onClose={() => setOpen(false)}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default Main;
