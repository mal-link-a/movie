import { useState, useEffect, createContext } from "react";

import { optionsGet, NoneProps } from "../options/options.ts";
//Компонент контекста жанров
interface Genre {
  id: number;
  name: string;
}

export const GenreContext = createContext<Genre[]>([]);
const GenreContextProvider: React.FC<NoneProps> = (props) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  const CreateGenresContext = (): void => {
    const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
    fetch(url, optionsGet)
      .then((res) => res.json())
      .then((json) => {
        setGenres(json.genres);
      })
      .catch((err) => console.error("error with CreateGenresContext:" + err));
  };

  //Инициируем контекст
  useEffect(() => {
    CreateGenresContext();
  }, []);

  return (
    <GenreContext.Provider value={genres}>
      {props.children}
    </GenreContext.Provider>
  );
};
export { GenreContextProvider };
