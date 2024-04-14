import { useState, useEffect, ReactNode } from "react";

interface NoneProps {
  children: ReactNode;
}

export const WrapInternetConnection: React.FC<NoneProps> = (props) => {
  const [isOnline, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
  }, []);
  window.addEventListener("online", () => {
    setOnline(true);
  });
  window.addEventListener("offline", () => {
    setOnline(false);
  });
  if (isOnline) {
    return props.children;
  } else {
    return (
      <h1>Нет сети. Проверьте настройки подключения и попробуйте снова.</h1>
    );
  }
};
