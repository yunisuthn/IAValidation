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
// import {ROUTES} from "./Routes"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="prevalid" element={<PreValidation />} />
          <Route path="validation" element={<Validation />} />
          <Route path="retourne" element={<Retourne />} />
          <Route path="alldoc" element={<AllDoc />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="document/:id" element={<Doc />}></Route>
        <Route path="test" element={<Table />}></Route>
        <Route path="info/:id" element={<InfoPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);