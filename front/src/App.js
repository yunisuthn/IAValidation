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
import Signup from "./Components/login/signing";
import PrivateRoute from "./Components/login/PrivateRoute";
import { Provider } from "react-redux";
import ErrorBoundary from "./Components/login/ErrorBoundary";
// import {ROUTES} from "./Routes"
import store from './Components/redux/store'

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store} >
        <BrowserRouter>
            <Routes>
              <Route path="/" index element = {<Login/>}/>
              
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="accueil" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="prevalidation" element={<PrivateRoute><PreValidation /></PrivateRoute>} />
                <Route path="validation" element={<PrivateRoute><Validation /></PrivateRoute>} />
                <Route path="retourne" element={<PrivateRoute><Retourne /></PrivateRoute>} />
                <Route path="alldoc" element={<PrivateRoute><AllDoc /></PrivateRoute>} />
                {/* <Route path="*" element={<NoPage />} /></PrivateRoute> */}
              </Route>
              <Route path="*" element={<NoPage />} />
              <Route path="document/:validation/:id" element={<PrivateRoute><Doc /></PrivateRoute>}></Route>
              <Route path="test" element={<PrivateRoute><Table /></PrivateRoute>}></Route>
              <Route path="info/:id" element={<PrivateRoute><InfoPage /></PrivateRoute>}></Route>
              <Route path="/signup" element={<Signup/>} />
            </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);