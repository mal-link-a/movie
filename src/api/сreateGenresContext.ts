import { Genre } from "../types/";

import { optionsGet } from "./options/options.ts";

export const сreateGenresContext = (): Promise<Genre[]> => {
  const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
  return fetch(url, optionsGet)
    .then((res) => res.json())
    .then((json) => {
      return json.genres;
    })
    .catch((err) => console.error("error with CreateGenresContext:" + err));
};
