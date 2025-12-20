import { AddShoppingCartOutlined } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";

export default function ProductDetails() {
  return (
    <Box  sx={{ display: "flex"  ,alignItems:"center" ,gap:2.5 , flexDirection: { xs: "column", sm: "row" },}}>
      <Box display={"flex"}>
        <img width={300} src="https://merchshop.in/wp-content/uploads/2019/06/web-developer-t-shirt-white.jpg" alt="" />
      </Box>

      <Box sx={{ textAlign: { xs: "center", sm: "left" }}}>
        <Typography variant="h5">WOMAN'S FASHION</Typography>
        <Typography my={0.4} fontSize={"22px"} color={"crimson"} variant="h6">
          {" "}
          $12.29
        </Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui aliquid
          commodi temporibus voluptatem, delectus laudantium ipsam quibusdam est
          voluptate rem.
        </Typography>

        <Stack  sx={{ justifyContent: { xs: "center", sm: "left" } }}
          direction={"row"}
          gap={1}
          my={2}>
   { ["src/images/banner-16.jpg","src/images/banner-17.jpg"].map((item) => {
    return(
     <img width={100} height={100} key={item} src={item} alt="" />
    )
    })}
        </Stack>


         <Button
          sx={{ mb: { xs: 1, sm: 0 }, textTransform: "capitalize" }}
          variant="contained"
        >
          <AddShoppingCartOutlined sx={{ mr: 1 }} fontSize="small" />
          Buy now
        </Button>
      </Box>
    </Box>
  );
}
