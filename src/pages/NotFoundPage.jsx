import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import usePageTitle from "../hooks/usePageTitle";

const NotFoundPage = () => {
  usePageTitle("404 - Page Not Found");
  return (
    <Container maxWidth="sm">
      <Box
        display="flex" flexDirection="column" alignItems="center"
        justifyContent="center" minHeight="70vh" textAlign="center" gap={2}
      >
        {/* Big 404 */}
        <Typography
          variant="h1"
          fontWeight={900}
          sx={{
            fontSize: { xs: "7rem", md: "10rem" },
            background: "linear-gradient(135deg, #D23F57, #ff7790)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" maxWidth={360}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>

        <Button
          component={Link} to="/" variant="contained" size="large"
          sx={{ mt: 2, px: 5, py: 1.5, bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
