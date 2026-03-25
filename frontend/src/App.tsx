import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { CssBaseline, AppBar, Toolbar, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { store } from "./store/store";
import {
  StaysListPage,
  StayDetailsPage,
  CheckoutPage,
  ConfirmationPage,
} from "./pages";
import logo from "./assets/logo.png";
import "./App.scss";

function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Router>
          <AppBar position="sticky" className="appBar">
            <Toolbar>
              <Box className="appBarBrand">
                <Box
                  component="img"
                  src={logo}
                  alt="Lateral logo"
                  className="appLogo"
                />
              </Box>
            </Toolbar>
          </AppBar>

          <Box className="appContent">
            <Routes>
              <Route path="/" element={<StaysListPage />} />
              <Route path="/stays/:id" element={<StayDetailsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
            </Routes>
          </Box>
        </Router>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
