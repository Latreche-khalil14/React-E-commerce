import { Component } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            display="flex" flexDirection="column" alignItems="center"
            justifyContent="center" minHeight="70vh" textAlign="center" gap={2}
          >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "#D23F57" }} />
            <Typography variant="h4" fontWeight={700}>Something went wrong</Typography>
            <Typography variant="body1" color="text.secondary">
              An unexpected error occurred. We&apos;re sorry for the inconvenience.
            </Typography>
            {import.meta.env.DEV && this.state.error && (
              <Box
                sx={{
                  mt: 1, p: 2, bgcolor: "grey.100", borderRadius: 2,
                  width: "100%", textAlign: "left", overflowX: "auto",
                }}
              >
                <Typography variant="caption" component="pre" color="error.main">
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained" size="large" onClick={this.handleReset}
              sx={{ mt: 2, bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}
            >
              Go back to Home
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
