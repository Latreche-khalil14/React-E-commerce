// @ts-nocheck
import { ExpandMore, ShoppingCartOutlined } from "@mui/icons-material";
import {
  Avatar, Badge, Container, Divider, IconButton, InputBase,
  List, ListItem, ListItemText, Menu, MenuItem, Stack,
  Typography, useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getCategoriesApi } from "../../api/categories.api";
import toast from "react-hot-toast";

const Search = styled("div")(({ theme }) => ({
  flexGrow: 0.4,
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #777",
  "&:hover": { border: "1px solid #333" },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "266px",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "330px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#777",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: { width: "20ch" },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const categoryOptions = ["All Categories", "CAR", "Clothes", "Electronics"];

const Header2 = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const [categoryAnchor,   setCategoryAnchor]   = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({ name: "All Categories", id: null });
  const [apiCategories,    setApiCategories]    = useState([]);
  const [userAnchor,       setUserAnchor]       = useState(null);
  const [searchQuery,      setSearchQuery]      = useState("");

  useEffect(() => {
    getCategoriesApi()
      .then((res) => setApiCategories(res.data.categories))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("search", searchQuery.trim());
      if (selectedCategory.id) params.set("categoryId", selectedCategory.id);
      navigate(`/?${params.toString()}`);
    }
  };

  const handleLogout = () => {
    logout();
    setUserAnchor(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <Container sx={{ my: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {/* Logo */}
      <Stack alignItems="center" sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        <ShoppingCartOutlined />
        <Typography variant="body2">E-commerce</Typography>
      </Stack>

      {/* Search */}
      <Search sx={{ display: "flex", borderRadius: "22px", justifyContent: "space-between" }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>

        <StyledInputBase
          placeholder="Search products…"
          inputProps={{ "aria-label": "search" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />

        <div>
          <List
            component="nav"
            sx={{
              bgcolor: theme.palette.myColor?.main,
              borderBottomRightRadius: 22,
              borderTopRightRadius: 22,
              p: 0,
            }}
          >
            <ListItem
              onClick={(e) => setCategoryAnchor(e.currentTarget)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemText
                sx={{ width: 93, textAlign: "center" }}
                secondary={selectedCategory.name}
              />
              <ExpandMore sx={{ fontSize: "16px" }} />
            </ListItem>
          </List>

          <Menu
            anchorEl={categoryAnchor}
            open={Boolean(categoryAnchor)}
            onClose={() => setCategoryAnchor(null)}
          >
            {/* All Categories option */}
            <MenuItem
              selected={!selectedCategory.id}
              onClick={() => { setSelectedCategory({ name: "All Categories", id: null }); setCategoryAnchor(null); }}
              sx={{ fontSize: "13px" }}
            >
              All Categories
            </MenuItem>
            {/* Dynamic categories from API */}
            {apiCategories.map((cat) => (
              <MenuItem
                key={cat._id}
                selected={selectedCategory.id === cat._id}
                onClick={() => { setSelectedCategory({ name: cat.name, id: cat._id }); setCategoryAnchor(null); }}
                sx={{ fontSize: "13px" }}
              >
                {cat.name}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Search>

      {/* Cart & User */}
      <Stack direction="row" alignItems="center">
        {/* Cart */}
        <IconButton aria-label="cart" onClick={() => navigate("/cart")}>
          <StyledBadge badgeContent={cartCount} color="error">
            <ShoppingCartIcon />
          </StyledBadge>
        </IconButton>

        {/* User */}
        {isAuthenticated ? (
          <>
            <IconButton onClick={(e) => setUserAnchor(e.currentTarget)}>
              <Avatar
                src={user?.avatar?.url}
                sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "#D23F57" }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={userAnchor}
              open={Boolean(userAnchor)}
              onClose={() => setUserAnchor(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem disabled>
                <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { navigate("/profile"); setUserAnchor(null); }}>
                My Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate("/orders"); setUserAnchor(null); }}>
                My Orders
              </MenuItem>
              {user?.role === "admin" && (
                <MenuItem onClick={() => { navigate("/admin"); setUserAnchor(null); }}>
                  Admin Dashboard
                </MenuItem>
              )}
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <IconButton onClick={() => navigate("/login")}>
            <Person2OutlinedIcon />
          </IconButton>
        )}
      </Stack>
    </Container>
  );
};

export default Header2;
