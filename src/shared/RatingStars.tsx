import { useState, useRef, useEffect, FC } from "react";

// Звездочки для блока оценки фильма
interface RatingStarsProps {
  func: (rate: number) => void;
  value: number;
  imgEmpty: string;
  imgFull: string;
}

export const RatingStars: FC<RatingStarsProps> = ({
  func,
  value,
  imgEmpty,
  imgFull,
}) => {
  const [stars, setStars] = useState<number>(0); //Значение для отображения прямо вот сейчас вот
  const defaultStars = useRef<number>(0); //Базовое знаение, отображаемое по дефолту
  useEffect(() => {
    defaultStars.current = value;
    setStars(value);
  }, [value]);

  //Обработчик клика оценки вызывает полученную функцию
  function handle(rate: number) {
    defaultStars.current = rate;
    func(rate);
  }

  //Создаём звезды
  return (
    <div className="rateStars">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <img
          key={`item${item}`}
          onMouseOver={() => setStars(item + 1)}
          onMouseOut={() => setStars(defaultStars.current)}
          onClick={() => handle(item + 1)}
          className="rateStars_star"
          src={stars > item ? imgFull : imgEmpty}
        ></img>
      ))}
    </div>
  );
};
