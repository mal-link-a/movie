import { Movie } from "../types";

//Добавляем оценку фильму
export function addRating(movie: Movie, rate?: number): Promise<undefined> {
  const session = sessionStorage.getItem("themoviedb_sessionID"); //sessionID тоже вывести в отдельный файл
  const url = `https://api.themoviedb.org/3/movie/${movie.id}/rating?guest_session_id=${session}`;
  //Тут меняем стейты и прочее, и прочее, чтобы он сразу всё показывал
  console.log("Пытаемся оценить фильм с id = " + movie.id + " и url=" + url);

  //Bcgjkmpetncz уникальный options для запроса
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
    .then((res) => {
      console.log("res.status = " + res.status);
      if (res.status !== 201) {
        throw Error;
      }
      return res.json();
    })
    .then((json) => {
      console.log("Успешная оценка!");
      console.log(json);

      return undefined;
    })
    .catch((err) => {
      console.error("error with addRatingToMovie:" + err);
      throw err;
    });
}
