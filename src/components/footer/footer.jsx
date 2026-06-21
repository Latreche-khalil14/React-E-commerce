// @ts-nocheck
import {
  Box, Container, Divider, Grid, IconButton, Link,
  Stack, Typography,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { label: "All Products", path: "/" },
        { label: "Men",          path: "/?gender=men" },
        { label: "Women",        path: "/?gender=women" },
        { label: "Electronics",  path: "/?sort=popular" },
        { label: "New Arrivals", path: "/?sort=newest" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "My Profile",  path: "/profile" },
        { label: "My Orders",   path: "/orders" },
        { label: "Cart",        path: "/cart" },
        { label: "Login",       path: "/login" },
        { label: "Register",    path: "/register" },
      ],
    },
    {
      title: "Info",
      links: [
        { label: "Free Shipping over $99" },
        { label: "30-Day Returns" },
        { label: "Secure Payment" },
        { label: "24/7 Support" },
      ],
    },
  ];

  return (
    <Box sx={{ bgcolor: "#2B3445", pt: 6, pb: 3, borderTopLeftRadius: 12, borderTopRightRadius: 12, mt: 6 }}>
      <Container>
        <Grid container spacing={4} mb={4}>
          {/* Brand */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="#fff" fontWeight={700} mb={1}>
              🛒 E-Commerce
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.6)" mb={2}>
              Your one-stop shop for the latest fashion, electronics, and more.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#1877f2" } }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#1da1f2" } }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#e1306c" } }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Links */}
          {footerLinks.map((section) => (
            <Grid key={section.title} item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" color="#fff" fontWeight={600} mb={2}>
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.links.map((link) => (
                  <Typography
                    key={link.label}
                    variant="body2"
                    color="rgba(255,255,255,0.6)"
                    sx={link.path ? { cursor: "pointer", "&:hover": { color: "#D23F57", transition: "0.2s" } } : {}}
                    onClick={() => link.path && navigate(link.path)}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography variant="body2" color="rgba(255,255,255,0.5)">
            © 2025 E-Commerce. All rights reserved.
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.5)">
            Designed & developed by{" "}
            <Box component="span" sx={{ color: "#ff7790", fontWeight: 600 }}>
              Khalil Latreche
            </Box>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
