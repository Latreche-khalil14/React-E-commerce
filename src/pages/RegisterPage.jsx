import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box, Button, Container, TextField, Typography, Paper,
  InputAdornment, IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, ShoppingCartOutlined } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { registerApi } from "../api/auth.api";
import toast from "react-hot-toast";

import usePageTitle from "../hooks/usePageTitle";

const RegisterPage = () => {
  usePageTitle("Create Account");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi({ name: form.name, email: form.email, password: form.password });
      login(res.data);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join us today and start shopping!
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Full Name" name="name"
            value={form.name} onChange={handleChange}
            margin="normal" autoFocus
          />
          <TextField
            fullWidth label="Email Address" name="email" type="email"
            value={form.email} onChange={handleChange} margin="normal"
          />
          <TextField
            fullWidth label="Password" name="password"
            type={showPassword ? "text" : "password"}
            value={form.password} onChange={handleChange} margin="normal"
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
          <TextField
            fullWidth label="Confirm Password" name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword} onChange={handleChange} margin="normal"
          />

          <Button
            type="submit" fullWidth variant="contained" size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" }, py: 1.5 }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#D23F57", fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
