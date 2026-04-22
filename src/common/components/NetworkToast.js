import React, { useEffect, useState } from "react";

const NetworkToast = ({ status }) => {
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    if (status.message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!visible) return null;

  return (
    <div
      className={`toast ${
        !status.isOnline ? "toast-error" : status.isSlow ? "toast-warning" : "toast-success"
      } show`}
    >
      {status.message}
    </div>
  );
};

export default NetworkToast;










