import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(255,252,246,0.92)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,0,0,0.06)",
              color: "hsl(0 0% 7%)",
              fontFamily: "Geist, sans-serif",
            },
          }}
        />
      </CartProvider>
    </div>
  );
}

export default App;
