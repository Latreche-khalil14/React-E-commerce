// @ts-nocheck
import {
  Accordion, AccordionSummary, Box, Button, Container, Drawer,
  IconButton, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Menu, MenuItem, Stack, Typography,
  useMediaQuery, useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import WindowIcon from "@mui/icons-material/Window";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  CheckroomOutlined, DevicesOutlined, DirectionsBikeOutlined,
  SportsEsportsOutlined, MenuBookOutlined, FitnessCenterOutlined,
  ChildCareOutlined, CategoryOutlined, Close,
} from "@mui/icons-material";
import Links from "./Links";
import { getCategoriesApi } from "../../api/categories.api";

const CATEGORY_ICONS = {
  Men:         <CheckroomOutlined fontSize="small" />,
  Women:       <CheckroomOutlined fontSize="small" />,
  Electronics: <DevicesOutlined fontSize="small" />,
  Bikes:       <DirectionsBikeOutlined fontSize="small" />,
  Games:       <SportsEsportsOutlined fontSize="small" />,
  Books:       <MenuBookOutlined fontSize="small" />,
  Sports:      <FitnessCenterOutlined fontSize="small" />,
  Kids:        <ChildCareOutlined fontSize="small" />,
};

const navLinks = [
  { title: "Home",         path: "/" },
  { title: "Men",          path: "/?gender=men" },
  { title: "Women",        path: "/?gender=women" },
  { title: "Electronics",  path: "/?categorySlug=electronics" },
  { title: "Sports",       path: "/?categorySlug=sports" },
  { title: "New Arrivals", path: "/?sort=newest" },
  { title: "Sale",         path: "/?sort=price-asc" },
];

const Header3 = () => {
  const [anchorEl,   setAnchorEl]   = useState(null);
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme     = useTheme();
  const navigate  = useNavigate();
  const isDesktop = useMediaQuery("(min-width:1200px)");

  useEffect(() => {
    getCategoriesApi()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {});
  }, []);

  const handleCategoryClick = (category) => {
    setAnchorEl(null);
    setDrawerOpen(false);
    navigate(`/?categoryId=${category._id}`);
  };

  return (
    <Container sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 5 }}>

      {/* ── Categories Dropdown ── */}
      <Box>
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ width: 222, bgcolor: theme.palette.myColor?.main || "#f0f0f0", color: theme.palette.text.secondary }}
        >
          <WindowIcon />
          <Typography sx={{ textTransform: "capitalize", mx: 1 }}>Categories</Typography>
          <Box flexGrow={1} />
          <KeyboardArrowRightOutlinedIcon />
        </Button>

        <Menu
          anchorEl={anchorEl} open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          sx={{ ".MuiPaper-root": { width: 230, bgcolor: theme.palette.myColor?.main || "#f0f0f0" } }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} onClick={() => handleCategoryClick(cat)}>
              <ListItemIcon>
                {CATEGORY_ICONS[cat.name] || <CategoryOutlined fontSize="small" />}
              </ListItemIcon>
              <ListItemText>{cat.name}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* ── Desktop Nav Links ── */}
      {isDesktop && (
        <Stack gap={4} direction="row" alignItems="center">
          {navLinks.map((link) => (
            <Links key={link.title} title={link.title} path={link.path} />
          ))}
        </Stack>
      )}

      {/* ── Mobile Hamburger ── */}
      {!isDesktop && (
        <IconButton onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
      )}

      {/* ── Mobile Drawer ── */}
      <Drawer
        anchor="right" open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ ".MuiPaper-root": { width: 300, pr: 2 } }}
      >
        <Box sx={{ px: 2, pt: 10, position: "relative", height: "100%" }}>
          <IconButton
            sx={{ position: "absolute", top: 10, left: 10, ":hover": { color: "red", rotate: "180deg", transition: "0.3s" } }}
            onClick={() => setDrawerOpen(false)}
          >
            <Close />
          </IconButton>

          {navLinks.map((link) => (
            <Accordion key={link.title} elevation={0} disableGutters>
              <AccordionSummary>
                <Typography
                  sx={{ cursor: "pointer", width: "100%", py: 0.5 }}
                  onClick={() => { navigate(link.path); setDrawerOpen(false); }}
                >
                  {link.title}
                </Typography>
              </AccordionSummary>
            </Accordion>
          ))}

          <Accordion elevation={0} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>All Categories</Typography>
            </AccordionSummary>
            <List sx={{ py: 0 }}>
              {categories.map((cat) => (
                <ListItem key={cat._id} disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick(cat)}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {CATEGORY_ICONS[cat.name] || <CategoryOutlined fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText primary={cat.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Accordion>
        </Box>
      </Drawer>
    </Container>
  );
};

export default Header3;
