import { useState, useEffect, FC } from "react";

import { Movie } from "../../options/options.ts";
import { ratingSave } from "../../options/api.ts";

import RatedFilmItem from "./RatedFilmItem.tsx";

interface RatedFilmListProps {
  upd: [Movie, number];
  addRatingToMovie: (movie: Movie, rate?: number) => void;
}

const RatedFilmList: FC<RatedFilmListProps> = ({ upd, addRatingToMovie }) => {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  //Нужно обновиться, но с правильными данными
  useEffect(() => {
    OptimisticSave(...upd);
    ratingSave(...upd).then((res) => setMovieList(res));
  }, [upd]);

  function OptimisticSave(movie: Movie, rate: number) {
    movie.rating = rate;
    setMovieList((prev) => {
      if (prev.length === 0) {
        return [movie];
      }
      for (let i = 0; i < prev.length; i++) {
        if (prev[i].id === movie.id) {
          const data = prev.slice();
          data[i] = movie;
          return data;
        }
      }
      return [...prev, movie];
    });
  }

  return (
    <ul className="rated">
      <p>Оцененное</p>
      {movieList.map((item) => (
        <RatedFilmItem
          key={item.id}
          movie={item}
          addRatingToMovie={addRatingToMovie}
        />
      ))}
    </ul>
  );
};

export default RatedFilmList;
