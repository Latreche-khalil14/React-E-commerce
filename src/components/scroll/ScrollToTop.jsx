import { KeyboardArrowUp } from "@mui/icons-material";
import { Fab, Zoom, useScrollTrigger } from "@mui/material";

const ScrollToTop = () => {
  const trigger = useScrollTrigger({ threshold: 100 });

  return (
    <Zoom in={trigger}>
      <Fab
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        variant="extended"
        size="medium"
        sx={{ position: "fixed", bottom: 33, right: 33, zIndex: 999 }}
        color="primary"
        aria-label="scroll to top"
      >
        <KeyboardArrowUp fontSize="medium" />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTop;
