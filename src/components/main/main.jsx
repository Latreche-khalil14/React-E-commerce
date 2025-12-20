import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Rating,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { Close } from "@mui/icons-material";
import ProductDetails from "./ProductDetails";

const Main = () => {

  const [alignment, setAlignment] = React.useState("left");

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const theme = useTheme();


   const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Container sx={{ py: 9 }}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        gap={3}
      >
       
        <Box>
          <Typography variant="h6">Selected Products</Typography>
          <Typography fontWeight={300} variant="body1">
            All our new arrivals in an exclusive brand selection
          </Typography>
        </Box>

       
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
          sx={{
            ".Mui-selected": {
              border: "1px solid rgba(233, 69, 96, 0.5) !important",
              color: "#e94560",
              backgroundColor: "initial",
            },
          }}
        >
          <ToggleButton
            sx={{ color: theme.palette.text.primary }}
            className="mybutton"
            color="error"
            value="left"
            aria-label="left aligned"
          >
            All Products
          </ToggleButton>

          <ToggleButton
            sx={{ mx: "16px !important", color: theme.palette.text.primary }}
            className="mybutton"
            color="error"
            value="center"
            aria-label="centered"
          >
            MEN category
          </ToggleButton>

          <ToggleButton
            sx={{ color: theme.palette.text.primary }}
            className="mybutton"
            color="error"
            value="right"
            aria-label="right aligned"
          >
            Women category
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        justifyContent={"space-between"}
      >
        {["aaa", "bbb", "ccc"].map((item) => {
          return (
            <Card
              key={item}
              sx={{
                maxWidth: 333,
                mt: 6,
                ":hover .MuiCardMedia-root ": {
                  rotate: "0.8deg",
                  scale: "1.1",
                  transition: "0.35s",
                },
              }}
            >
              <CardMedia
                sx={{ height: 277 }}
                image="https://merchshop.in/wp-content/uploads/2019/06/web-developer-t-shirt-white.jpg"
                title="green iguana"
              />

              <CardContent>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography gutterBottom variant="h6" component="div">
                    T-shirt
                  </Typography>

                  <Typography variant="subtitle1" component="p">
                    $12.99
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button sx={{ textTransform: "capitalize" }} size="large" onClick={handleClickOpen}>
                  <AddShoppingCartOutlinedIcon
                    sx={{ mr: 1 }}
                    fontSize="small"
                  />
                  add to card
                </Button>
                <Rating precision={0.5} name="read-only" value={4.5} readOnly />
              </CardActions>
            </Card>
          );
        })}
      </Stack>

       <Dialog
        sx={{ ".MuiPaper-root": { minWidth: { xs: "100%", md: 800 } } }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      <IconButton
            sx={{
              ":hover": { color: "red", rotate: "180deg", transition: "0.3s" },
              position: "absolute",
              top: 0,
              right: 10,
            }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
          <ProductDetails/>
      </Dialog>
      
    </Container>
  );
};

export default Main;
