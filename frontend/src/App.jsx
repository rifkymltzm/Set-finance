import React, { useState } from "react";
import api from "./services/api";

function App() {
  const [status, setStatus] = useState("Idle");
  const [responseLog, setResponseLog] = useState(null);

  const testBackendConnection = async () => {
    setStatus("Mengirim permintaan ke Django...");
    setResponseLog(null);

    // Membuat data dummy user acak untuk test register ke Djoser
    const randomId = Math.floor(Math.random() * 1000);
    const testData = {
      email: `testuser_${randomId}@setfinance.com`,
      username: `tester_${randomId}`,
      password: "SuperSecretPassword123!",
    };

    try {
      // Menembak endpoint registrasi user bawaan Djoser
      const response = await api.post("/auth/users/", testData);

      setStatus("✅ KONEKSI BERHASIL!");
      setResponseLog({
        message: "Django Backend merespons dengan sukses melalui Djoser.",
        statusText: `${response.status} ${response.statusText}`,
        dataData: response.data,
      });
    } catch (error) {
      setStatus("❌ KONEKSI GAGAL!");
      setResponseLog({
        message: error.message,
        detail:
          error.response?.data ||
          "Tidak ada respons dari server. Pastikan Django sudah dijalankan dan CORS diizinkan.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-white font-sans">
      <div className="w-full max-w-xl rounded-2xl bg-slate-800 p-8 shadow-xl border border-slate-700">
        <h1 className="text-3xl font-extrabold text-center text-emerald-400 mb-2">
          Set Finance
        </h1>
        <p className="text-slate-400 text-center text-sm mb-6">
          Connectivity Integration Test (React + Tailwind ↔ Django + Djoser)
        </p>

        <div className="flex justify-center mb-6">
          <button
            onClick={testBackendConnection}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-900 font-bold rounded-xl transition duration-200 shadow-lg shadow-emerald-500/20"
          >
            Ping Backend (Register Dummy)
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Status:
            </span>
            <p
              className={`text-lg font-medium mt-1 ${status.includes("✅") ? "text-emerald-400" : status.includes("❌") ? "text-red-400" : "text-amber-400"}`}
            >
              {status}
            </p>
          </div>

          {responseLog && (
            <div className="mt-4 rounded-lg bg-slate-950 p-4 border border-slate-800 font-mono text-xs overflow-x-auto">
              <span className="text-slate-500 block mb-2">
                // Server Response Log
              </span>
              <pre className="text-slate-300">
                {JSON.stringify(responseLog, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
