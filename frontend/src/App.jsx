import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Sedang menyambungkan ke backend...");

  useEffect(() => {
    // Melakukan fetch ke backend Django
    fetch("http://127.0.0.1:8000/api/test/")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage(
          "Gagal terhubung ke backend. Periksa CORS atau pastikan Django menyala.",
        );
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>SetFinance Connection Test</h1>
      <div className="card">
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4caf50" }}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default App;
