import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Container from "./components/Container";

const App = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};
export default App;
