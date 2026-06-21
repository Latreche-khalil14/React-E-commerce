import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Button, Container, TextField, Typography, Paper,
  InputAdornment, IconButton, Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, ShoppingCartOutlined } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../api/auth.api";
import toast from "react-hot-toast";

import usePageTitle from "../hooks/usePageTitle";

const LoginPage = () => {
  usePageTitle("Sign In");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={3}>
          <ShoppingCartOutlined sx={{ fontSize: 48, color: "#D23F57" }} />
          <Typography variant="h5" fontWeight={600} mt={1}>
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Please login to your account.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            autoComplete="email"
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" }, py: 1.5 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">OR</Typography>
        </Divider>

        <Box textAlign="center">
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "#D23F57", fontWeight: 600 }}>
              Create one
            </Link>
          </Typography>
        </Box>

        {/* Demo credentials */}
        <Box mt={3} p={2} bgcolor="action.hover" borderRadius={2}>
          <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
            Demo Credentials:
          </Typography>
          <Typography variant="caption" display="block">Admin: admin@ecommerce.com / admin123456</Typography>
          <Typography variant="caption" display="block">User: user@ecommerce.com / user123456</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
