import { FC } from "react";

import RatingStars from "./RatingStars.tsx";
import poster_none from "./assets/poster_none.png";

interface Movie {
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  rating: number;
}

interface Genre {
  id: number;
  name: string;
}
interface SearchFilmItemProps {
  movie: Movie;
  genres: Genre[];
  addRatingToMovie: (id?: number, rate?: number) => Promise<boolean>;
  ratedNeedUpdate: (id?: number, rate?: number) => void;
}

const SearchFilmItem: FC<SearchFilmItemProps> = ({
  movie,
  genres,
  addRatingToMovie,
  ratedNeedUpdate,
}) => {
  //Жанры

  //Путь для выгрузки логотипа
  const logoPath: string =
    "https://image.tmdb.org/t/p/w300_and_h450_bestv2/" + movie.poster_path;
  //Получим жанры для фильма
  const getGenresByID = () => {
    return genres
      .filter((element) => movie.genre_ids.includes(element.id))
      .reduce(function (currentSum, currentObj) {
        return currentSum + ", " + currentObj.name;
      }, "")
      .slice(2);
  };
  return (
    <li key={movie.id} className="listItem">
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
          filmID={movie.id}
          addRating={addRatingToMovie}
          ratedNeedUpdate={ratedNeedUpdate}
          rating={movie.rating}
        />
      </div>
    </li>
  );
};

export default SearchFilmItem;
