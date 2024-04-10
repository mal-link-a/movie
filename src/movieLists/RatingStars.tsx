import { useState, useRef, useEffect, FC } from "react";

import star_full from "../assets/star_full.svg";
import { Movie } from "../options/options.ts";
import star_empty from "../assets/star_empty.svg";

// Звездочки для блока оценки фильма
interface RatingStarsProps {
  film: Movie;
  addRatingToMovie: (movie: Movie, rate?: number) => void;
  rating: number;
}
const RatingStars: FC<RatingStarsProps> = ({
  film,
  addRatingToMovie,
  rating,
}) => {
  const [stars, setStars] = useState<number>(0); //Значение для отображения прямо вот сейчас вот
  const defaultStars = useRef<number>(0); //Базовое знаение, которое показывается, когда фильм оценили
  useEffect(() => {
    defaultStars.current = rating;
    setStars(rating);
  }, [rating]);

  function rate(rate: number) {
    defaultStars.current = rate;
    addRatingToMovie(film, rate);
  }

  //Создаём звезды
  return (
    <div className="rateStars">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <img
          key={item}
          onMouseOver={() => setStars(item + 1)}
          onMouseOut={() => setStars(defaultStars.current)}
          onClick={() => rate(item + 1)}
          className="rateStars_star"
          src={stars > item ? star_full : star_empty}
        ></img>
      ))}
    </div>
  );
};
export default RatingStars;
