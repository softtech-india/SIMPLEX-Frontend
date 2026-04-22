import { useEffect, useState } from "react";

export default function useNetworkStatus(desiredMbps = 1.5) {
  const [status, setStatus] = useState({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    isSlow: false,
    message: "",
  });
  // const [trend, setTrend] = useState([]); // Array of {time, speed}
  useEffect(() => {
    let intervalId;

    const checkConnection = async () => {
      const isOnline = navigator.onLine;
      let isSlow = false;
      let speedMbps = null;
      let message = "";

      if (isOnline) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
          //  If supported, use Network Information API
          const speed = connection.downlink; // Mbps
          speedMbps = speed;
          const type = connection.effectiveType;

          if (speed < desiredMbps || ["2g", "slow-2g"].includes(type)) {
            isSlow = true;
            message = `⚠️ Your connection seems slower than usual. Kindly verify your internet speed.Slow network detected (${type}, ~${speed} Mbps).`;
          } else {
            message = "✅ Welcome back online! Your inventory is synced and good to go!";
          }
        } else {
          //  Fallback: manual speed test
          try {
            const testUrl = "/ping.png"; // small static file in /public
            const fileSizeKB = 50; // Adjust based on test file size (KB)
            const startTime = performance.now();
            await fetch(testUrl + "?cacheBust=" + Date.now(), { cache: "no-store" });
            const endTime = performance.now();

            const durationSec = (endTime - startTime) / 1000;
            const speedMbps = (fileSizeKB / 1024) / durationSec * 8; // convert KB to Mbps
            // setTrend(prev => [...prev, {time: Date.now(), speed: speedMbps}]);

            if (speedMbps < desiredMbps) {
              isSlow = true;
              message = `⚠️ We have detected a slow network connection. Kindly verify your internet speed. Slow network detected (~${speedMbps.toFixed(2)} Mbps).`;
            } else {
              message = "✅ Great news! Your network is restored. Your inventory is synced and good to go!";
            }
          } catch {
            message = "🚫 No internet connection. Please check your network connection.";
          }
        }
      } else {
        message = "🚫 No internet connection. Please check your network connection.";
      }

      setStatus({ isOnline, isSlow, message });
    };

    // Run immediately
    checkConnection();

    // Listen to online/offline
    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    // Periodic check for bandwidth every 15s
    intervalId = setInterval(checkConnection, 25000);

    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
      clearInterval(intervalId);
    };
  }, [desiredMbps]);

  return status;
}




