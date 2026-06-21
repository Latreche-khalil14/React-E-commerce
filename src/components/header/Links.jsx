// @ts-nocheck
import { ExpandMore } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Links = ({ title, path = "/" }) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(path)}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        py: 0.5,
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 0,
          height: "2px",
          bgcolor: "#D23F57",
          transition: "width 0.25s ease",
        },
        "&:hover::after": { width: "100%" },
        "&:hover": { color: "#D23F57" },
        transition: "color 0.2s",
      }}
    >
      <Typography variant="body1">{title}</Typography>
      <ExpandMore sx={{ fontSize: "16px", ml: 0.5 }} />
    </Box>
  );
};

export default Links;
