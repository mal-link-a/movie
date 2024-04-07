import { useState, useEffect, FC } from "react";

import { Movie } from "./options.ts";
import RatedFilmItem from "./RatedFilmItem.tsx";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~ВЫПИЛИТЬ В ОТДЕЛЬНЫЙ ФАЙЛ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function addRatingToMovie(id: number, rate: number): Promise<boolean> {
  const session = sessionStorage.getItem("themoviedb_sessionID"); //sessionID тоже вывести в отдельный файл
  const url = `https://api.themoviedb.org/3/movie/${id}/rating?guest_session_id=${session}`;
  console.log("Пытаемся оценить фильм с id = " + id + " и url=" + url);
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
      console.log(json);
      return true;
    })
    .catch((err) => {
      console.error("error with addRatingToMovie:" + err);
      throw err;
    });
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Просто ждём время
function later(delay: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}
//Обертка для addRating

interface RatedFilmListProps {
  upd: [number, number];
}

const RatedFilmList: FC<RatedFilmListProps> = ({ upd }) => {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  //Нужно обновиться, но с правильными данными
  useEffect(() => {
    ratingSave(upd[0], upd[1]).then((res) => setMovieList(res));
  }, [upd]);

  //Изменили рейтинг фильму в уже оцененных, обновимся
  const handleAddRating = (id: number, rate: number): void => {
    addRatingToMovie(id, rate);
    ratingSave(id, rate).then((res) => setMovieList(res));
  };

  //Пытаемся получить список оценённых фильмов
  async function ratingSave(id: number, rate: number, counter: number = 0) {
    if (counter > 10) {
      console.error(
        "error: не удалось загрузить файл фильмов с последней нашей оценкой",
      );
      return getRatedMovie();
    }
    if (id === 0 || rate === 0) {
      return await getRatedMovie();
    }
    console.log("ratingSave start");
    const data: Movie[] = await getRatedMovie();
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id && data[i].rating === rate) {
        return data;
      }
    }
    console.log("Ждём...");
    await later(2000);
    console.log("Дождались...");
    return ratingSave(id, rate, ++counter);
  }
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

  return (
    <ul className="rated">
      <p>Оцененное</p>
      {movieList.map((item) => (
        <RatedFilmItem
          key={item.id}
          movie={item}
          handleAddRating={handleAddRating}
        />
      ))}
    </ul>
  );
};
RatedFilmList.defaultProps = { upd: [0, 0] };

export default RatedFilmList;
