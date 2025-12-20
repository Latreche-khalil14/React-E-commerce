
import Header3 from "./components/header/Header3";
import Header1 from "./components/header/Header1";
import Header2 from "./components/header/Header2";
import Main from "./components/main/main";
import Hero from "./components/hero/Hero";
// @ts-ignore
import Footer from"./components/footer/Footer";
import ScrollToTop from"./components/scroll/ScrollToTop";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Box } from "@mui/material";


function App() {
  const [theme, colorMode] = useMode(); 

  return (
    <ColorModeContext.Provider 
// @ts-ignore
    value={colorMode}>
      <ThemeProvider 
// @ts-ignore
      theme={theme}>
        <CssBaseline />
        <Header1 />
        <Header2 />
         <Header3 />

         <Box bgcolor={theme.
// @ts-ignore
         palette.bg.main}>

           <Hero />

     <Main />
         </Box>
        
       <Footer/>
        <ScrollToTop />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
