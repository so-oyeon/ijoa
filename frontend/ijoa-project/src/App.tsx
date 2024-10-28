import { BrowserRouter } from "react-router-dom";
import RenderRoutes from "./router/routes";

const App = () => {
  return (
    <BrowserRouter>
      <RenderRoutes />
    </BrowserRouter>
  );
};

export default App;
