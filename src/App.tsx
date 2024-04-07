//import { useState } from 'react'
import { useState, useEffect } from "react";

import ViteReactHeader from "./ViteReactHeader.tsx";
//import FilmMain from "./RatedFilmList.tsx";
import RatedFilmList from "./RatedFilmList.tsx";
import SearchFilmList from "./SearchFilmList.tsx";
import WrapInternetConnection from "./WrapInternetConnection.tsx";
import { GenreContextProvider } from "./GenreContext.tsx";
import { optionsGet } from "./options.ts";

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
  useEffect(() => {
    createSessionID();
  }, []);
  //Данные для сверки со списком оценённых фильмов, получаемым с api
  const [upd, setRateFlag] = useState<[number, number]>([0, 0]);
  const ratedNeedUpdate = (id?: number, rate?: number): void => {
    if (id && rate) {
      setRateFlag([id, rate]);
    }
  };

  return (
    <main className="base">
      Based.
      <WrapInternetConnection>
        <ViteReactHeader />
        <GenreContextProvider>
          <div className="filmMain">
            <SearchFilmList ratedNeedUpdate={ratedNeedUpdate} />
            <RatedFilmList upd={upd} />
          </div>
        </GenreContextProvider>
      </WrapInternetConnection>
    </main>
  );
}

export default App;
