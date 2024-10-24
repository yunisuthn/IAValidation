import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/pages/Layout";
import Home from "./Components/pages/Home";
import Doc from "./Components/pages/Doc";
import NoPage from "./Components/pages/NoPage";
import "./App.css"
import PreValidation from "./Components/pages/Prevalidation";
import Validation from "./Components/pages/Validation";
import Retourne from "./Components/pages/Retourne";
import AllDoc from "./Components/pages/AllDocument";
import './i18n'
import Table from "./Components/test/table";
import InfoPage from "./Components/test/InfoPage";
import Login from "./Components/login/login";
import AddUser from "./Components/login/AddUser";
import PrivateRoute from "./Components/login/PrivateRoute";
import { Provider } from "react-redux";
import ErrorBoundary from "./Components/login/ErrorBoundary";
import ForgotPassword from "./Components/login/ForgotPassword";
import ResetPassword from "./Components/login/ResetPassword";
// import {ROUTES} from "./Routes"
import store from './Components/redux/store'
import Validated from "./Components/pages/Validated";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import User from "./Components/login/User";

export default function App() {

  // Step 1: Define your custom theme with the new font
  const theme = createTheme({
    typography: {
      fontFamily: `'Hanken Grotesk', sans-serif`, // Use the desired font
    },
    // You can also override specific typography variants
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: `'Hanken Grotesk', sans-serif`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: `'Hanken Grotesk', sans-serif`,
          },
        },
      },
      // Add more component-specific overrides if needed
    },
  });
  return (
    <ErrorBoundary>
      <Provider store={store} >
        <ThemeProvider theme={theme}>
          <BrowserRouter>
              <Routes>
                <Route path="/" index element = {<Login/>}/>
                
                <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                  <Route path="accueil" element={<PrivateRoute><Home /></PrivateRoute>} />
                  <Route path="prevalidation" element={<PrivateRoute><PreValidation /></PrivateRoute>} />
                  <Route path="validation" element={<PrivateRoute><Validation /></PrivateRoute>} />
                  <Route path="retourne" element={<PrivateRoute><Retourne /></PrivateRoute>} />
                  <Route path="validated" element={<PrivateRoute><Validated /></PrivateRoute>} />
                  <Route path="alldoc" element={<PrivateRoute><AllDoc /></PrivateRoute>} />
                  <Route path="user" element= {<PrivateRoute><User/></PrivateRoute>} />
                  <Route path="/signup" element={<PrivateRoute><AddUser/></PrivateRoute>} />
                  {/* <Route path="*" element={<NoPage />} /></PrivateRoute> */}
                </Route>
                <Route path="*" element={<NoPage />} />
                <Route path="document/:validation/:id" element={<PrivateRoute><Doc /></PrivateRoute>}></Route>
                <Route path="test" element={<PrivateRoute><Table /></PrivateRoute>}></Route>
                <Route path="info/:id" element={<PrivateRoute><InfoPage /></PrivateRoute>}></Route>
                <Route path="forgotPassword" element={<ForgotPassword/>}/>
                <Route path="reset-password/:token" element={<ResetPassword/>}/>
              </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);