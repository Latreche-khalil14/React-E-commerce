// @ts-nocheck
import { useState } from "react";
import {
  Avatar, Box, Button, Container, Divider, Paper,
  Stack, Tab, Tabs, TextField, Typography,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { updatePasswordApi } from "../api/auth.api";
import api from "../api/axios";
import toast from "react-hot-toast";

import usePageTitle from "../hooks/usePageTitle";

const ProfilePage = () => {
  usePageTitle("My Profile");
  const { user, updateUser } = useAuth();

  const [tab, setTab] = useState(0);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name:  user?.name  || "",
    phone: user?.phone || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Profile Update ────────────────────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) { toast.error("Name is required"); return; }
    setProfileLoading(true);
    try {
      const res = await api.put("/users/profile", profileForm);
      updateUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Password Update ───────────────────────────────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      await updatePasswordApi({
        currentPassword: passwordForm.currentPassword,
        newPassword:     passwordForm.newPassword,
      });
      toast.success("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>My Account</Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* ── Avatar Card ── */}
        <Paper sx={{ p: 3, borderRadius: 2, textAlign: "center", minWidth: 200, height: "fit-content" }}>
          <Avatar
            src={user?.avatar?.url}
            sx={{ width: 100, height: 100, mx: "auto", mb: 2, fontSize: 40, bgcolor: "#D23F57" }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Typography fontWeight={600}>{user?.name}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
          <Box mt={1}>
            <Typography
              variant="caption"
              sx={{
                bgcolor: user?.role === "admin" ? "#D23F57" : "#2B3445",
                color: "#fff", px: 1.5, py: 0.4, borderRadius: 1,
              }}
            >
              {user?.role?.toUpperCase()}
            </Typography>
          </Box>
        </Paper>

        {/* ── Tabs ── */}
        <Box flex={1}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="Profile Info" />
            <Tab label="Change Password" />
          </Tabs>

          {/* Profile Info Tab */}
          {tab === 0 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Personal Information</Typography>
              <form onSubmit={handleProfileSave}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth label="Full Name" value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                  <TextField
                    fullWidth label="Email Address" value={user?.email || ""}
                    disabled helperText="Email cannot be changed"
                  />
                  <TextField
                    fullWidth label="Phone Number" value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+213 555 000 000"
                  />
                  <Button
                    type="submit" variant="contained" disabled={profileLoading}
                    sx={{ alignSelf: "flex-start", bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}
                  >
                    {profileLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </Stack>
              </form>
            </Paper>
          )}

          {/* Change Password Tab */}
          {tab === 1 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Change Password</Typography>
              <form onSubmit={handlePasswordChange}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth type="password" label="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                  <TextField
                    fullWidth type="password" label="New Password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required helperText="Minimum 6 characters"
                  />
                  <TextField
                    fullWidth type="password" label="Confirm New Password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                  <Button
                    type="submit" variant="contained" disabled={passwordLoading}
                    sx={{ alignSelf: "flex-start", bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}
                  >
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </Stack>
              </form>
            </Paper>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default ProfilePage;
