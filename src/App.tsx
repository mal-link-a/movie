//import { useState } from 'react'
import { useState, useEffect } from "react";

import ViteReactHeader from "./graphicComp/ViteReactHeader.tsx";
//import FilmMain from "./RatedFilmList.tsx";
import RatedFilmList from "./movieLists/rated/RatedFilmList.tsx";
import SearchFilmList from "./movieLists/search/SearchFilmList.tsx";
import WrapInternetConnection from "./wrapNoInet/WrapInternetConnection.tsx";
import { GenreContextProvider } from "./context/GenreContext.tsx";
import { Movie } from "./options/options.ts";
import { createSessionID, addRating } from "./options/api.ts";

import "./App.css";

//Метод для создания гостевой сессии и получения session_id, который будем хранить пока в state
/*function createSessionID(): void {
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
*/

function App() {
  //Создаём гостевой sessionID в sessionStorage

  function addRatingToMovie(movie: Movie, rate?: number): void {
    addRating(movie, rate).then(() => optimisticUpdate(movie, rate));
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

export default App;
