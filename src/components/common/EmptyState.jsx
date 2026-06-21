import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const EmptyState = ({ icon, title, subtitle, actionLabel, actionPath, onAction }) => (
  <Box
    display="flex" flexDirection="column" alignItems="center"
    justifyContent="center" py={10} textAlign="center" gap={1.5}
  >
    <Box sx={{ fontSize: 80, lineHeight: 1, mb: 1 }}>{icon}</Box>
    <Typography variant="h5" fontWeight={600}>{title}</Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary" maxWidth={360}>
        {subtitle}
      </Typography>
    )}
    {(actionLabel && actionPath) && (
      <Button
        component={Link} to={actionPath} variant="contained" size="large"
        sx={{ mt: 2, px: 4, bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}
      >
        {actionLabel}
      </Button>
    )}
    {(actionLabel && onAction) && (
      <Button
        onClick={onAction} variant="contained" size="large"
        sx={{ mt: 2, px: 4, bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}
      >
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
