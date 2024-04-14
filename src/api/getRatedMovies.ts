import { Movie } from "../types";
import { later } from "../functions/later.ts";

import { optionsGet } from "./options/options.ts";
//Пытаемся получить оцененные нами фильмы
export async function getRatedMovies(
  movie: Movie,
  rate: number,
  counter: number = 0,
) {
  if (counter > 10) {
    console.error(
      "error: не удалось загрузить файл фильмов с последней нашей оценкой.",
    );
    alert(
      "error: не удалось загрузить файл фильмов с последней оценкой. Попробуйте позже.",
    );
    return getRatedMovieRequest();
  }

  if (movie.id === 0 || rate === 0) {
    return await getRatedMovieRequest();
  }
  console.log("ratingSave start");
  const data: Movie[] = await getRatedMovieRequest();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === movie.id && data[i].rating === rate) {
      return data;
    }
  }
  console.log("Ждём...");
  await later(2000);
  console.log("Дождались...");
  return getRatedMovies(movie, rate, ++counter);
}

//fetch, получаем оцененные фильмы API
function getRatedMovieRequest(): Promise<[]> {
  if (sessionStorage.getItem("themoviedb_sessionID") == null) {
    return Promise.resolve([]);
  }
  const session = sessionStorage.getItem("themoviedb_sessionID");
  const url = `https://api.themoviedb.org/3/guest_session/${session}/rated/movies?language=en-US&page=1`;
  return fetch(url, optionsGet)
    .then((res) => res.json())
    .then((json) => {
      console.log("getFlmJSON = = ");
      console.log(json);
      if (json.results.length !== 0) {
        return json.results;
      } else {
        return [];
      }
    })
    .catch(() => {
      return [];
    });
}
