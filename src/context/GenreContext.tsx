import { useState, useEffect, createContext } from "react";

import { NoneProps, Genre } from "../types/options.ts";
import { сreateGenresContext } from "../api/сreateGenresContext.ts";
//Компонент контекста жанров

export const GenreContext = createContext<Genre[]>([]);
export const GenreContextProvider: React.FC<NoneProps> = (props) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  //Инициируем контекст
  useEffect(() => {
    сreateGenresContext().then((json) => setGenres(json));
  }, []);

  return (
    <GenreContext.Provider value={genres}>
      {props.children}
    </GenreContext.Provider>
  );
};
