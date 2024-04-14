import { FC } from "react";

interface ApiFailedProps {
  onTry: () => void;
}

//Компонент если не удалось загрузить пропс
export const APIFailedComponent: FC<ApiFailedProps> = ({ onTry }) => {
  const handleTryAgain = () => {
    onTry();
  };
  return (
    <div>
      <h2>Не удалось загрузить данные</h2>
      <button type="button" onClick={handleTryAgain}>
        Попробовать снова
      </button>
    </div>
  );
};
