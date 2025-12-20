import {
  ExpandMore,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material";

import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const Links = ({ title }) => {
  return (
    <Box

      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        ":hover .show-when-hover": { display: "block" }, 
        ":hover": { cursor: "pointer" },
      }}
    >
      
      <Typography variant="body1">{title}</Typography>

    
      <ExpandMore sx={{ fontSize: "16px", ml: 1 }} />

    
      <Box
        className="show-when-hover"
        sx={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "none",
          minWidth: "170px",
          zIndex: 2,
        }}
      >
        <Paper sx={{ mt: 2 }}>
          <nav aria-label="secondary mailbox folders">
            <List>

           
              <ListItem disablePadding>
                <ListItemButton sx={{ display: "flex", p: 0, px: 1.5 }}>
                  <ListItemText
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "15px",
                        fontWeight: 300,
                      },
                    }}
                    primary="Dashboard"
                  />
                  <Box flexGrow={1} />
                </ListItemButton>
              </ListItem>

              
              <ListItem
                disablePadding
                sx={{
                  position: "relative",
                  ":hover .sub-link": { display: "block" },  
                }}
              >
                <ListItemButton sx={{ display: "flex", p: 0, px: 1.5 }}>
                  <ListItemText
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "15px",
                        fontWeight: 300,
                      },
                    }}
                    primary="products"
                  />
                  <Box flexGrow={1} />
                  <KeyboardArrowRightOutlined fontSize="small" />
                </ListItemButton>

              
                <Box
                  className="sub-link"
                  sx={{
                    display: "none",
                    position: "absolute",
                    top: 0,
                    left: "100%",
                  }}
                >
                  <Paper sx={{ ml: 1, minWidth: 150 }}>
                    <nav>
                      <List>

                       
                        <ListItem disablePadding>
                          <ListItemButton sx={{ display: "flex", p: 0, px: 1.5 }}>
                            <ListItemText
                              sx={{
                                "& .MuiTypography-root": {
                                  fontSize: "15px",
                                  fontWeight: 300,
                                },
                              }}
                              primary="Add Product"
                            />
                            <Box flexGrow={1} />
                          </ListItemButton>
                        </ListItem>

                       
                        <ListItem disablePadding>
                          <ListItemButton sx={{ display: "flex", p: 0, px: 1.5 }}>
                            <ListItemText
                              sx={{
                                "& .MuiTypography-root": {
                                  fontSize: "15px",
                                  fontWeight: 300,
                                },
                              }}
                              primary="Edit Product"
                            />
                            <Box flexGrow={1} />
                          </ListItemButton>
                        </ListItem>

                      </List>
                    </nav>
                  </Paper>
                </Box>
              </ListItem>

             
              <ListItem disablePadding>
                <ListItemButton sx={{ display: "flex", p: 0, px: 1.5 }}>
                  <ListItemText
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "15px",
                        fontWeight: 300,
                      },
                    }}
                    primary="orders"
                  />
                  <Box flexGrow={1} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton sx={{ display: "flex", p: 0, px: 1.5 }}>
                  <ListItemText
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "15px",
                        fontWeight: 300,
                      },
                    }}
                    primary="Profile"
                  />
                  <Box flexGrow={1} />
                </ListItemButton>
              </ListItem>

            </List>
          </nav>
        </Paper>
      </Box>
    </Box>
  );
};

export default Links;
