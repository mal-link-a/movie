//import { useState } from 'react'
import { useState, useEffect } from "react";

import { createSessionID } from "./api/createSessionID.ts";
import { addRating } from "./api/addRating.ts";
import { ViteReactHeader, WrapInternetConnection } from "./shared";
import { RatedFilmList, SearchFilmList } from "./features/movieList";
import { GenreContextProvider } from "./context";
import { Movie } from "./types";

import "./App.css";

function App() {
  //Создаём гостевой sessionID в sessionStorage
  useEffect(() => {
    createSessionID();
  }, []);

  //Меняем мувику оценку
  function addRatingToMovie(movie: Movie, rate: number): void {
    optimisticUpdate(movie, rate);
    addRating(movie, rate).catch(() => needCancelOptimistic((prev) => !prev));
  }

  const optimisticUpdate = (movie: Movie, rating: number): void => {
    if (movie.id !== 0 && rating !== 0) {
      setMovieForOptimicticUpd(movie);
      setRatedForOptimicticUpd(rating);
    }
  };

  //Данные для сверки со списком оценённых фильмов, получаемым с api
  const [movieForOptimicticUpd, setMovieForOptimicticUpd] = useState<Movie>({
    adult: false,
    genre_ids: [],
    id: 0,
    original_language: "",
    original_title: "",
    overview: "",
    popularity: 0,
    poster_path: "",
    release_date: "",
    title: "",
    video: false,
    vote_average: 0,
    vote_count: 0,
    rating: 0,
  });
  const [rateForOptimicticUpd, setRatedForOptimicticUpd] = useState<number>(0);
  const [cancelOptimistic, needCancelOptimistic] = useState<boolean>(false);

  return (
    <main className="base">
      Based.
      <WrapInternetConnection>
        <ViteReactHeader />
        <GenreContextProvider>
          <div className="filmMain">
            <SearchFilmList addRatingToMovie={addRatingToMovie} />
            <RatedFilmList
              movieForOptimicticUpd={movieForOptimicticUpd}
              rateForOptimicticUpd={rateForOptimicticUpd}
              addRatingToMovie={addRatingToMovie}
              needCancelOptimisticUpdate={cancelOptimistic}
            />
          </div>
        </GenreContextProvider>
      </WrapInternetConnection>
    </main>
  );
}

export default App;
