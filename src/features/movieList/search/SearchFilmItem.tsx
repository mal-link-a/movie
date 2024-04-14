import { FC } from "react";

import { RatingStars } from "../../../shared";
import { Movie, Genre } from "../../../types";
import poster_none from "../assets/poster_none.png";
import star_empty from "../assets/star_empty.svg";
import star_full from "../assets/star_full.svg";

import "./SearchFilmItem.css";

interface SearchFilmItemProps {
  movie: Movie;
  genres: Genre[];
  addRatingToMovie: (movie: Movie, rate: number) => void;
}

const SearchFilmItem: FC<SearchFilmItemProps> = ({
  movie,
  genres,
  addRatingToMovie,
}) => {
  //Путь для выгрузки логотипа
  const logoPath: string =
    "https://image.tmdb.org/t/p/w300_and_h450_bestv2/" + movie.poster_path;

  //Получим список жанров для итема фильма
  const getGenresByID = () => {
    return genres
      .filter((element) => movie.genre_ids.includes(element.id))
      .reduce(function (currentSum, currentObj) {
        return currentSum + ", " + currentObj.name;
      }, "")
      .slice(2);
  };

  //Поведение звезд оценки
  const addRating = (rate: number) => {
    addRatingToMovie(movie, rate);
  };

  return (
    <li className="searchItem">
      <div className="film">
        <img
          className="film_poster"
          src={movie.poster_path ? logoPath : poster_none}
          alt="logo"
        ></img>
        <h2 className="film_name"> {movie.title}</h2>
        <p className="film_original-name">{`${movie.original_language}: ${movie.original_title}`}</p>
        <p className="film_releaseDate">{movie.release_date}</p>
        <p className="film_genres">{getGenresByID()}</p>
        <p className="film_adult">{movie.adult ? "18+" : ""}</p>
        <p className="film_description">Описание: {movie.overview}</p>
        <p className="film_popularity">Популярность: {movie.popularity}</p>
        <p className="film_votes">Оценка: {movie.vote_average}</p>
        <p className="film_voteCount">Оценено {movie.vote_count} раз</p>
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

export default SearchFilmItem;
