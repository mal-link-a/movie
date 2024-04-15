import { useState, useEffect, FC } from "react";

import { Movie } from "../../../types";
import { getRatedMovies } from "../../../api/getRatedMovies.ts";

import { RatedFilmItem } from "./RatedFilmItem.tsx";

import "./RatedFilmList.css";

interface RatedFilmListProps {
  movieForOptimicticUpd: Movie;
  rateForOptimicticUpd: number;
  addRatingToMovie: (movie: Movie, rate: number) => void;
  needCancelOptimisticUpdate: boolean;
}

export const RatedFilmList: FC<RatedFilmListProps> = ({
  movieForOptimicticUpd,
  rateForOptimicticUpd,
  addRatingToMovie,
  needCancelOptimisticUpdate,
}) => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [movieListBackup, setMovieListBackup] = useState<Movie[]>([]);

  useEffect(() => {
    setMovieList(movieListBackup);
  }, [needCancelOptimisticUpdate]);

  //Нужно обновиться, но с правильными данными
  useEffect(() => {
    setMovieListBackup(movieList);
    optimisticUpdate(movieForOptimicticUpd, rateForOptimicticUpd);
    getRatedMovies(movieForOptimicticUpd, rateForOptimicticUpd).then((res) =>
      setMovieList(res),
    );
  }, [movieForOptimicticUpd, rateForOptimicticUpd]);

  //Добавляем в state фильм, который мы оценили, прежде чем сервак обработает
  function optimisticUpdate(movie: Movie, rate: number) {
    if (movie.id === 0) {
      return;
    }
    const newData = { ...movie, rating: rate };
    //movie.rating = rate;
    setMovieList((prev) => {
      //Если у нас пустой лист
      if (prev.length === 0) {
        return [newData];
      }
      //Если тот же фильм уже есть в списке
      for (let i = 0; i < prev.length; i++) {
        if (prev[i].id === newData.id) {
          const data = prev.slice();
          data[i] = newData;
          return data;
        }
      }
      //Если фильма в списке нет
      return [...prev, newData];
    });
  }

  return (
    <ul key="ratedList" className="rated">
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
