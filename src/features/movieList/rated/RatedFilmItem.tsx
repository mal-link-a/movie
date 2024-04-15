import { FC } from "react";

import { Movie } from "../../../types/";
import { RatingStars } from "../../../shared/";
import poster_none from "../assets/poster_none.png";
import star_empty from "../assets/star_empty.svg";
import star_full from "../assets/star_full.svg";

import "./RatedFilmItem.css";

interface RatedFilmItemProps {
  movie: Movie;
  addRatingToMovie: (movie: Movie, rate: number) => void;
}

function rateClass(rate: number) {
  if (rate <= 3) return "ratingCol0";
  if (rate <= 5) return "ratingCol1";
  if (rate <= 7) return "ratingCol2";
  return "ratingCol3";
}

export const RatedFilmItem: FC<RatedFilmItemProps> = ({
  movie,
  addRatingToMovie,
}) => {
  //Обработчик оценки в компоненте оценки
  const addRating = (rate: number) => {
    addRatingToMovie(movie, rate);
  };

  const logoPath: string =
    "https://image.tmdb.org/t/p/w300_and_h450_bestv2/" + movie.poster_path;

  return (
    <li key={movie.id} className="rated__item">
      <div className={`rated__item__div ${rateClass(movie.rating)}`}>
        <img
          className="rated__item__div_poster"
          src={movie.poster_path ? logoPath : poster_none}
          alt="logo"
        ></img>
        <h2 className="rated__item__div_name"> {movie.title}</h2>
        <RatingStars
          func={addRating}
          value={movie.rating}
          imgEmpty={star_empty}
          imgFull={star_full}
        />
      </div>
    </li>
  );
};
