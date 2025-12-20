import {
  Box,
  Container,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";

import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import WindowIcon from "@mui/icons-material/Window";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  SportsEsportsOutlined,
  ElectricBikeOutlined,
  LaptopChromebookOutlined,
  MenuBookOutlined,
  Close,
} from "@mui/icons-material";


import Links from "./Links";

const Header3 = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();

  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: 5,
      }}
    >
   
      <Box>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{
            width: 222,
            // @ts-ignore
            bgcolor: theme.palette.myColor?.main || "#f0f0f0", // fallback color
            color: theme.palette.text.secondary,
          }}
        >
          <WindowIcon />
          <Typography sx={{ padding: 0, textTransform: "capitalize", mx: 1 }}>
            Categories
          </Typography>
          <Box flexGrow={1} />
          <KeyboardArrowRightOutlinedIcon />
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          sx={{
            ".MuiPaper-root": {
              width: 220,
              // @ts-ignore
              bgcolor: theme.palette.myColor?.main || "#f0f0f0",
            },
          }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <ElectricBikeOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Bikes</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <LaptopChromebookOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Electronics</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <MenuBookOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Books</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SportsEsportsOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Games</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

   
      {useMediaQuery("(min-width:1200px)") && (
        <Stack gap={4} direction={"row"} alignItems={"center"}>
          <Links title={"Home"} />
          <Links title={"Mega Menu"} />
          <Links title={"Full Screen Menu"} />
          <Links title={"pages"} />
          <Links title={"User Account"} />
          <Links title={"Vendor Account"} />
        </Stack>
      )}

      
      {useMediaQuery("(max-width:1200px)") && (
        <IconButton onClick={toggleDrawer("right", true)}>
          <MenuIcon />
        </IconButton>
      )}

     
      <Drawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer("right", false)}
        sx={{
          ".MuiPaper-root": {
            width: 300,pr:2
          },
        }}
       >
        <Box
          sx={{
            px: 2,
            pt: 10,
            position: "relative",
            height: "100%",
          }}
        >
         
          <IconButton
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              ":hover": { color: "red", rotate: "180deg", transition: "0.3s" },
            }}
            onClick={toggleDrawer("right", false)}
          >
            <Close />
          </IconButton>

       
          {[
            { mainLink: "Home", subLinks: ["Link 1", "Link 2", "Link 3"] },
            { mainLink: "Mega menu", subLinks: ["Link 1", "Link 2", "Link 3"] },
            {
              mainLink: "Full Screen Menu",
              subLinks: ["Link 1", "Link 2", "Link 3"],
            },
            { mainLink: "Pages", subLinks: ["Link 1", "Link 2", "Link 3"] },
            {
              mainLink: "User Account",
              subLinks: ["Link 1", "Link 2", "Link 3"],
            },
            {
              mainLink: "Vendor Account",
              subLinks: ["Link 1", "Link 2", "Link 3"],
            },
          ].map((item) => (
            <Accordion key={item.mainLink} elevation={0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{item.mainLink}</Typography>
              </AccordionSummary>
              <List sx={{ py: 0, my: 0 }}>
                {item.subLinks.map((link) => (
                  <ListItem key={link} sx={{ py: 0, my: 0 }}>
                    <ListItemButton>
                      <ListItemText primary={link} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Accordion>
          ))}
        </Box>
      </Drawer>
    </Container>
  );
};

export default Header3;
