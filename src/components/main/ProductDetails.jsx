// @ts-nocheck
import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Box, Button, Chip, Rating, Stack, Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductDetails({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const mainImage = product.images?.[selectedImage]?.url
    || product.images?.[0]?.url
    || "https://via.placeholder.com/300";

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      onClose?.();
      navigate("/login");
      return;
    }
    const success = await addToCart(product._id, 1, selectedSize, selectedColor);
    if (success) onClose?.();
  };

  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 2.5,
      flexDirection: { xs: "column", sm: "row" }, p: 3,
    }}>
      {/* Images */}
      <Box>
        <Box display="flex" justifyContent="center">
          <img
            width={280}
            height={280}
            src={mainImage}
            alt={product.name}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        </Box>
        {product.images?.length > 1 && (
          <Stack direction="row" gap={1} mt={1} justifyContent="center">
            {product.images.map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img.url}
                alt=""
                onClick={() => setSelectedImage(i)}
                sx={{
                  width: 60, height: 60, objectFit: "cover", borderRadius: 1,
                  cursor: "pointer",
                  border: selectedImage === i ? "2px solid #D23F57" : "2px solid transparent",
                  transition: "border 0.2s",
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Details */}
      <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
        <Typography variant="h5" fontWeight={600}>{product.name}</Typography>

        {product.brand && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Brand: {product.brand}
          </Typography>
        )}

        <Stack direction="row" alignItems="center" gap={1} mt={1}
          sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}>
          <Rating value={product.ratings} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            ({product.numReviews} reviews)
          </Typography>
        </Stack>

        <Box mt={1}>
          {product.discountPrice > 0 ? (
            <Stack direction="row" gap={1} alignItems="center"
              sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}>
              <Typography fontSize="22px" color="crimson" fontWeight={700}>
                ${product.discountPrice.toFixed(2)}
              </Typography>
              <Typography sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                ${product.price.toFixed(2)}
              </Typography>
              <Chip label={`-${product.discountPercent}%`} size="small" sx={{ bgcolor: "#D23F57", color: "#fff" }} />
            </Stack>
          ) : (
            <Typography fontSize="22px" fontWeight={700}>${product.price.toFixed(2)}</Typography>
          )}
        </Box>

        <Typography variant="body1" mt={1} color="text.secondary">
          {product.description}
        </Typography>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <Box mt={2}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Size:</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap"
              sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}>
              {product.sizes.map((size) => (
                <Chip
                  key={size} label={size} variant="outlined"
                  onClick={() => setSelectedSize(size)}
                  sx={{
                    cursor: "pointer",
                    borderColor: selectedSize === size ? "#D23F57" : undefined,
                    color: selectedSize === size ? "#D23F57" : undefined,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Colors */}
        {product.colors?.length > 0 && (
          <Box mt={2}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Color:</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap"
              sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}>
              {product.colors.map((color) => (
                <Chip
                  key={color} label={color} variant="outlined"
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    cursor: "pointer",
                    borderColor: selectedColor === color ? "#D23F57" : undefined,
                    color: selectedColor === color ? "#D23F57" : undefined,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Stock Info */}
        <Typography variant="body2" mt={1.5}
          color={product.stock > 0 ? "success.main" : "error.main"} fontWeight={500}>
          {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : "✗ Out of Stock"}
        </Typography>

        <Button
          variant="contained"
          disabled={!product.inStock}
          onClick={handleAddToCart}
          sx={{
            mt: 2, mb: { xs: 1, sm: 0 }, textTransform: "capitalize",
            bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" },
          }}
        >
          <AddShoppingCartOutlined sx={{ mr: 1 }} fontSize="small" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </Box>
    </Box>
  );
}
