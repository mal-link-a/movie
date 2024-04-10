import { optionsGet, Movie } from "./options.ts";

//Метод для создания гостевой сессии и получения session_id, который будем хранить пока в state
export function createSessionID(): void {
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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Добавляем оценку фильму
export function addRating(movie: Movie, rate?: number): Promise<boolean> {
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
      return true;
    })
    .catch((err) => {
      console.error("error with addRatingToMovie:" + err);
      return false;
    });
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Стучимся по api с оцененными фильмами
export async function ratingSave(
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
    return getRatedMovie();
  }

  if (movie.id === 0 || rate === 0) {
    return await getRatedMovie();
  }
  console.log("ratingSave start");
  const data: Movie[] = await getRatedMovie();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === movie.id && data[i].rating === rate) {
      return data;
    }
  }
  console.log("Ждём...");
  await later(2000);
  console.log("Дождались...");
  return ratingSave(movie, rate, ++counter);
}
//Получаем оцененные фильмы API
function getRatedMovie(): Promise<[]> {
  if (sessionStorage.getItem("themoviedb_sessionID") == null) {
    return Promise.resolve([]);
  }
  const session = sessionStorage.getItem("themoviedb_sessionID");
  const url = `https://api.themoviedb.org/3/guest_session/${session}/rated/movies?language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzc5MWIyNDMzOTE4MDgxZDIzODVlYTNjZDZjN2QzZCIsInN1YiI6IjY2MGQ1Yzk4YzhhNWFjMDE3YzdiMWY2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddzL15X347LRjn73d62_iGE40jE0S6QN0N7K9-EkahE",
    },
  };
  return fetch(url, options)
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
//Просто таймер
function later(delay: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
