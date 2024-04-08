import { useState, useEffect, FC } from "react";

import { Movie } from "./options.ts";
import RatedFilmItem from "./RatedFilmItem.tsx";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Просто ждём время
function later(delay: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}
//Обертка для addRating
interface RatedFilmListProps {
  upd: [Movie, number];
  addRatingToMovie: (movie: Movie, rate?: number) => Promise<boolean>;
}

const RatedFilmList: FC<RatedFilmListProps> = ({ upd, addRatingToMovie }) => {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  //Нужно обновиться, но с правильными данными
  useEffect(() => {
    OptimisticSave(...upd);
    ratingSave(...upd).then((res) => setMovieList(res));
  }, [upd]);

  function OptimisticSave(movie: Movie, rate: number) {
    movie.rating = rate;
    setMovieList((prev) => {
      if (prev.length === 0) {
        return [movie];
      }
      for (let i = 0; i < prev.length; i++) {
        if (prev[i].id === movie.id) {
          const data = prev.slice();
          data[i] = movie;
          return data;
        }
      }
      return [...prev, movie];
    });
    console.log("OptimisticSave3");
  }
  //Пытаемся получить список оценённых фильмов
  async function ratingSave(movie: Movie, rate: number, counter: number = 0) {
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
          addRatingToMovie={addRatingToMovie}
        />
      ))}
    </ul>
  );
};
RatedFilmList.defaultProps = {
  upd: [
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
  ],
};

export default RatedFilmList;
