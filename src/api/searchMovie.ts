import { ApiSearch } from "../types";

import { optionsGet } from "./options/options.ts";
//Начать поиск фильмов
export async function searchMovie(
  str: string,
  page: number,
): Promise<ApiSearch> {
  const url = `https://api.themoviedb.org/3/search/movie?query=${str}&include_adult=false&language=en-US&page=${page}`;
  return fetch(url, optionsGet)
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
}
