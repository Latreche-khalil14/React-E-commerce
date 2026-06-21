// @ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box, Breadcrumbs, Button, Chip, CircularProgress, Container,
  Divider, Grid, IconButton, Rating, Skeleton, Stack, Tab, Tabs,
  TextField, Typography, Avatar,
} from "@mui/material";
import {
  AddShoppingCartOutlined, FavoriteBorder, Favorite,
  NavigateNext, ArrowBack,
} from "@mui/icons-material";
import { getProductApi, addReviewApi } from "../api/products.api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { addToCart }       = useCart();
  const { isAuthenticated } = useAuth();

  const [product,      setProduct]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState(0);
  const [selectedImg,  setSelectedImg]  = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor,setSelectedColor]= useState("");
  const [qty,          setQty]          = useState(1);
  const [inWishlist,   setInWishlist]   = useState(false);
  const [adding,       setAdding]       = useState(false);

  // Review form
  const [reviewRating,  setReviewRating]  = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting,    setSubmitting]    = useState(false);

  usePageTitle(product?.name || "Product");

  useEffect(() => {
    setLoading(true);
    getProductApi(id)
      .then((res) => setProduct(res.data.product))
      .catch(() => { toast.error("Product not found"); navigate("/"); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error("Please login first"); navigate("/login"); return; }
    setAdding(true);
    await addToCart(product._id, qty, selectedSize, selectedColor);
    setAdding(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error("Please login to leave a review"); return; }
    if (!reviewComment.trim()) { toast.error("Please write a comment"); return; }
    setSubmitting(true);
    try {
      await addReviewApi(product._id, { rating: reviewRating, comment: reviewComment });
      toast.success("Review submitted!");
      setReviewComment("");
      // Reload product for updated reviews
      const res = await getProductApi(id);
      setProduct(res.data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Container sx={{ py: 6 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        <Skeleton variant="rectangular" width="100%" height={450} sx={{ borderRadius: 2 }} />
        <Box flex={1}><Skeleton variant="text" height={50} /><Skeleton variant="text" height={30} width="60%" /><Skeleton variant="text" height={80} /></Box>
      </Stack>
    </Container>
  );

  if (!product) return null;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const mainImg      = product.images?.[selectedImg]?.url || "https://via.placeholder.com/450";

  return (
    <Container sx={{ py: 5 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Typography
          variant="body2" color="text.secondary" sx={{ cursor: "pointer", "&:hover": { color: "#D23F57" } }}
          onClick={() => navigate("/")}
        >
          Home
        </Typography>
        {product.category && (
          <Typography
            variant="body2" color="text.secondary" sx={{ cursor: "pointer", "&:hover": { color: "#D23F57" } }}
            onClick={() => navigate(`/?categoryId=${product.category._id}`)}
          >
            {product.category.name}
          </Typography>
        )}
        <Typography variant="body2" color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Stack direction={{ xs: "column", md: "row" }} spacing={5}>
        {/* ── Images ── */}
        <Box sx={{ flex: 1 }}>
          <Box
            component="img" src={mainImg} alt={product.name}
            sx={{ width: "100%", maxHeight: 450, objectFit: "cover", borderRadius: 2, mb: 1.5 }}
          />
          {product.images?.length > 1 && (
            <Stack direction="row" gap={1} flexWrap="wrap">
              {product.images.map((img, i) => (
                <Box
                  key={i} component="img" src={img.url} alt=""
                  onClick={() => setSelectedImg(i)}
                  sx={{
                    width: 70, height: 70, objectFit: "cover", borderRadius: 1, cursor: "pointer",
                    border: selectedImg === i ? "2px solid #D23F57" : "2px solid transparent",
                    transition: "border 0.2s", opacity: selectedImg === i ? 1 : 0.7,
                    "&:hover": { opacity: 1 },
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* ── Details ── */}
        <Box flex={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h4" fontWeight={700} flex={1}>{product.name}</Typography>
            <IconButton onClick={() => setInWishlist(!inWishlist)} sx={{ color: inWishlist ? "#D23F57" : "inherit" }}>
              {inWishlist ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Stack>

          {product.brand && (
            <Typography variant="body2" color="text.secondary">Brand: <strong>{product.brand}</strong></Typography>
          )}

          <Stack direction="row" alignItems="center" gap={1} mt={1}>
            <Rating value={product.ratings} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">({product.numReviews} reviews)</Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Price */}
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Typography variant="h4" fontWeight={700} color={product.discountPrice > 0 ? "#D23F57" : "inherit"}>
              ${displayPrice.toFixed(2)}
            </Typography>
            {product.discountPrice > 0 && (
              <>
                <Typography variant="h6" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                  ${product.price.toFixed(2)}
                </Typography>
                <Chip label={`-${product.discountPercent}%`} size="small" sx={{ bgcolor: "#D23F57", color: "#fff", fontWeight: 700 }} />
              </>
            )}
          </Stack>

          <Typography variant="body1" color="text.secondary" mt={2}>{product.description}</Typography>

          <Divider sx={{ my: 2 }} />

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <Box mb={2}>
              <Typography variant="body2" fontWeight={600} mb={1}>Size:</Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {product.sizes.map((s) => (
                  <Chip key={s} label={s} variant="outlined" onClick={() => setSelectedSize(s)}
                    sx={{ cursor: "pointer", borderColor: selectedSize === s ? "#D23F57" : undefined, color: selectedSize === s ? "#D23F57" : undefined, fontWeight: selectedSize === s ? 700 : 400 }} />
                ))}
              </Stack>
            </Box>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <Box mb={2}>
              <Typography variant="body2" fontWeight={600} mb={1}>Color:</Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {product.colors.map((c) => (
                  <Chip key={c} label={c} variant="outlined" onClick={() => setSelectedColor(c)}
                    sx={{ cursor: "pointer", borderColor: selectedColor === c ? "#D23F57" : undefined, color: selectedColor === c ? "#D23F57" : undefined, fontWeight: selectedColor === c ? 700 : 400 }} />
                ))}
              </Stack>
            </Box>
          )}

          {/* Quantity */}
          <Stack direction="row" alignItems="center" gap={2} mb={2}>
            <Typography variant="body2" fontWeight={600}>Qty:</Typography>
            <Stack direction="row" alignItems="center" gap={1}>
              <IconButton size="small" onClick={() => setQty(Math.max(1, qty - 1))}
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>-</IconButton>
              <Typography fontWeight={700} minWidth={28} textAlign="center">{qty}</Typography>
              <IconButton size="small" onClick={() => setQty(Math.min(product.stock, qty + 1))}
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>+</IconButton>
            </Stack>
            <Typography variant="body2" color={product.stock > 0 ? "success.main" : "error.main"} fontWeight={500}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Typography>
          </Stack>

          <Stack direction="row" gap={2}>
            <Button
              variant="contained" size="large" disabled={!product.inStock || adding}
              onClick={handleAddToCart}
              sx={{ flex: 1, bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" }, py: 1.5 }}
            >
              <AddShoppingCartOutlined sx={{ mr: 1 }} />
              {adding ? "Adding..." : "Add to Cart"}
            </Button>
          </Stack>
        </Box>
      </Stack>

      {/* ── Tabs: Description / Reviews ── */}
      <Box mt={6}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tab label="Description" />
          <Tab label={`Reviews (${product.numReviews})`} />
        </Tabs>

        {/* Description */}
        {tab === 0 && (
          <Box py={3}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2 }}>
              {product.description}
            </Typography>
            {product.tags?.length > 0 && (
              <Stack direction="row" gap={1} mt={2} flexWrap="wrap">
                {product.tags.map((tag) => (
                  <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
                ))}
              </Stack>
            )}
          </Box>
        )}

        {/* Reviews */}
        {tab === 1 && (
          <Box py={3}>
            {/* Existing reviews */}
            {product.reviews?.length === 0 ? (
              <Typography color="text.secondary" mb={3}>No reviews yet. Be the first!</Typography>
            ) : (
              <Stack spacing={2} mb={4}>
                {product.reviews.map((review, i) => (
                  <Paper key={i} sx={{ p: 2.5, borderRadius: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: "#D23F57", width: 36, height: 36, fontSize: 14 }}>
                        {review.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box flex={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={600}>{review.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Stack>
                        <Rating value={review.rating} readOnly size="small" sx={{ my: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}

            {/* Write a review */}
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" fontWeight={600} mb={2}>Write a Review</Typography>
            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview}>
                <Stack spacing={2} maxWidth={500}>
                  <Box>
                    <Typography variant="body2" mb={0.5}>Your Rating:</Typography>
                    <Rating value={reviewRating} onChange={(_, v) => setReviewRating(v)} />
                  </Box>
                  <TextField
                    multiline rows={3} fullWidth label="Your Review"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="contained" disabled={submitting}
                    sx={{ alignSelf: "flex-start", bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}>
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </Stack>
              </form>
            ) : (
              <Typography variant="body2" color="text.secondary">
                <Link to="/login" style={{ color: "#D23F57" }}>Sign in</Link> to write a review.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProductPage;
