
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";


import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";


const IconSection = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery("(min-width:600px)");

  return (
    <Container sx={{ mt: 3, bgcolor: theme.palette.mode === "dark" ? "#000" : "#fff" }}>
      <Stack
        direction="row"
        alignItems="center"
        sx={{ flexWrap: "wrap" }}
        divider={isLargeScreen ? <Divider orientation="vertical" flexItem /> : null}
      >
       
        <MyBox
          icon={<ElectricBoltIcon fontSize="large" />}
          title="Fast Delivery"
          subTitle="Start from $10"
        />
        <MyBox
          icon={<WorkspacePremiumOutlinedIcon fontSize="large" />}
          title="Money Guarantee"
          subTitle="7 Days Back"
        />
        <MyBox
          icon={<AccessAlarmOutlinedIcon fontSize="large" />}
          title="365 Days"
          subTitle="For free return"
        />
        <MyBox
          icon={<CreditScoreOutlinedIcon fontSize="large" />}
          title="Payment"
          subTitle="Secure system"
        />
      </Stack>
    </Container>
  );
};

export default IconSection;


const MyBox = ({ icon, title, subTitle }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery("(min-width:600px)");

  return (
    <Box
      sx={{
        width: 250,
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: isLargeScreen ? "center" : "left",
        gap: 3,
        py: 1.6,
      }}
    >
 
      {icon}

   
      <Box>
        <Typography variant="body1">{title}</Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 300,
            color: theme.palette.text.secondary,
          }}
        >
          {subTitle}
        </Typography>
      </Box>
    </Box>
  );
};
