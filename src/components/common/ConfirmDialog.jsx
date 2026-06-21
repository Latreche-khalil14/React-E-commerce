import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "error",
  onConfirm,
  onClose,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle fontWeight={600}>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} variant="outlined">{cancelLabel}</Button>
      <Button onClick={onConfirm} variant="contained" color={confirmColor}
        sx={confirmColor === "error" ? {} : { bgcolor: "#D23F57", "&:hover": { bgcolor: "#b82f45" } }}>
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
