import { useState, useEffect } from "react";
import "../styles/_loadingScreen.scss";

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval, timeout;

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          timeout = setTimeout(() => {
            if (typeof onComplete === "function") {
              onComplete(); // Bezpieczne wywołanie funkcji
            }
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout); // Upewnij się, że timeout jest wyczyszczony
    };
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p>Ładowanie... {progress}%</p>
    </div>
  );
};

export default LoadingScreen;
