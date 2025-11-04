import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:8080/hello")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => {
        console.error("Error fetching backend:", error);
        setMessage("Backend connection failed 😢");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🍱 Diet AI Web</h1>
      <p>Backend says: <strong>{message}</strong></p>
    </div>
  );
}

export default App;
