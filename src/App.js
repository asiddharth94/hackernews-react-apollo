import { Route, Routes } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import LinkList from "./components/LinkList";
import CreateLink from "./components/CreateLink";

function App() {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Routes>
          <Route path="/" element={<LinkList />} />
          <Route path="/create" element={<CreateLink />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
