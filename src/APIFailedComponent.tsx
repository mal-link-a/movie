import { FC } from "react";

interface ApiFailedProps {
  setType: (newType: number) => void;
}

//Компонент если не удалось загрузить пропс
const APIFailedComponent: FC<ApiFailedProps> = ({ setType }) => {
  const handleTryAgain = () => {
    setType(0);
  };
  return (
    <div>
      <h2>Не удалось загрузить данные с сервера</h2>
      <button type="button" onClick={handleTryAgain}>
        Попробовать снова
      </button>
    </div>
  );
};

export default APIFailedComponent;
