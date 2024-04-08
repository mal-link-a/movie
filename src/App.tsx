//import { useState } from 'react'
import { useState, useEffect } from "react";

import ViteReactHeader from "./ViteReactHeader.tsx";
//import FilmMain from "./RatedFilmList.tsx";
import RatedFilmList from "./RatedFilmList.tsx";
import SearchFilmList from "./SearchFilmList.tsx";
import WrapInternetConnection from "./WrapInternetConnection.tsx";
import { GenreContextProvider } from "./GenreContext.tsx";
import { optionsGet, Movie } from "./options.ts";

import "./App.css";

//Метод для создания гостевой сессии и получения session_id, который будем хранить пока в state
function createSessionID(): void {
  if (sessionStorage.getItem("themoviedb_sessionID") == null) {
    const url = "https://api.themoviedb.org/3/authentication/guest_session/new";
    fetch(url, optionsGet)
      .then((res) => res.json())
      .then((json) => {
        console.log();
        sessionStorage.setItem("themoviedb_sessionID", json.guest_session_id);
      })
      .catch((err) => console.error("error with createSessionID:" + err));
  }
}

function App() {
  //Создаём гостевой sessionID в sessionStorage

  function addRatingToMovie(movie: Movie, rate?: number): Promise<boolean> {
    const session = sessionStorage.getItem("themoviedb_sessionID"); //sessionID тоже вывести в отдельный файл
    const url = `https://api.themoviedb.org/3/movie/${movie.id}/rating?guest_session_id=${session}`;
    //Тут меняем стейты и прочее, и прочее, чтобы он сразу всё показывал
    console.log("Пытаемся оценить фильм с id = " + movie.id + " и url=" + url);
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzc5MWIyNDMzOTE4MDgxZDIzODVlYTNjZDZjN2QzZCIsInN1YiI6IjY2MGQ1Yzk4YzhhNWFjMDE3YzdiMWY2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddzL15X347LRjn73d62_iGE40jE0S6QN0N7K9-EkahE",
      },
      body: `{"value":${rate}}`,
    };
    return fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        console.log("Успешная оценка!");
        console.log(json);
        optimisticUpdate(movie, rate);
        return true;
      })
      .catch((err) => {
        console.error("error with addRatingToMovie:" + err);
        return false;
      });
  }
  useEffect(() => {
    createSessionID();
  }, []);
  //Данные для сверки со списком оценённых фильмов, получаемым с api
  const [upd, setUpd] = useState<[Movie, number]>([
    {
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
    },
    0,
  ]);
  const optimisticUpdate = (movie: Movie, rating: number = 0): void => {
    if (movie.id !== 0 && rating !== 0) {
      console.log("Передали дату для optimisticUpdate");
      setUpd([movie, rating]);
    }
  };

  return (
    <main className="base">
      Based.
      <WrapInternetConnection>
        <ViteReactHeader />
        <GenreContextProvider>
          <div className="filmMain">
            <SearchFilmList addRatingToMovie={addRatingToMovie} />
            <RatedFilmList upd={upd} addRatingToMovie={addRatingToMovie} />
          </div>
        </GenreContextProvider>
      </WrapInternetConnection>
    </main>
  );
}
/*
const FilmMain: FC = () => {
  const [filmsRated, setFilmsRated] = useState<Movie[]>([]);
  const [filmsSearched, setFilmsSearched] = useState<Movie[]>([]);
};*/

export default App;
