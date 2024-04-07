import { useState, useEffect, useContext, FC, useRef } from "react";

import { Spinner } from "./Spinner.tsx";
import APIFailedComponent from "./APIFailedComponent.tsx";
import FilmSearch from "./FilmSearch.tsx";
import SearchFilmItem from "./SearchFilmItem.tsx";
import { GenreContext } from "./GenreContext.tsx";
import { debounce } from "./debounce.ts";

interface Movie {
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  rating: number;
}

const optionsSimple = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzc5MWIyNDMzOTE4MDgxZDIzODVlYTNjZDZjN2QzZCIsInN1YiI6IjY2MGQ1Yzk4YzhhNWFjMDE3YzdiMWY2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddzL15X347LRjn73d62_iGE40jE0S6QN0N7K9-EkahE",
  },
};

function addRatingToMovie(id?: number, rate?: number): Promise<boolean> {
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
      console.log("Успешная оценка!");
      console.log(json);
      return true;
    })
    .catch((err) => {
      console.error("error with addRatingToMovie:" + err);
      return false;
    });
}

interface SearctFilmListProps {
  ratedNeedUpdate: (id?: number, rate?: number) => void;
}
const SearchFilmList: FC<SearctFilmListProps> = ({ ratedNeedUpdate }) => {
  const search = useRef<string>("return"); //Поле поиска
  const [page, setPage] = useState<number>(1); //Страница поиска
  const maxPages = useRef<number>(10); //Максимум страниц на нынешний search
  const [filmData, setFilmData] = useState<Movie[]>([]); // Массив с фильмами
  const [type, setType] = useState<number>(0); // Тип необходимых к показу данных
  //Начать поиск
  const startSearch = (str: string, isSamePage: boolean = false): void => {
    search.current = str;
    setType(1);
    if (!isSamePage) {
      setPage(1);
    }
    const url = `https://api.themoviedb.org/3/search/movie?query=${str}&include_adult=false&language=en-US&page=${page}`;
    fetch(url, optionsSimple)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.results.length === 0) {
          setType(3);
        } else {
          setType(2);
          console.log(json.total_pages);
          maxPages.current = json.total_pages;
          setFilmData(json.results);
        }
      });
  };

  const debouncedStartSearch = debounce(startSearch, 1200);

  useEffect(() => {
    startSearch(search.current, true);
  }, [page]);
  useEffect(() => {
    console.log("type изменился =" + type);
    if (type === 0) {
      startSearch(search.current);
    }
  }, [type]);
  const switchPage = (isIncrement: boolean) => {
    if (isIncrement) {
      if (page <= maxPages.current) {
        setPage((prev) => prev + 1);
      }
    } else if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const genres = useContext(GenreContext);
  const taskList = () => {
    switch (type) {
      case 0: {
        //Пустое поле поиска, и не идёт поиск
        return <p>Поиск фильмов на themoviedb.org</p>;
      }
      case 1: {
        //Идёт какой-то поиск, но в процессе
        return <Spinner />;
      }
      case 2: {
        //Получили всю дату
        return (
          <>
            <p>База, id = 2</p>
            <ul className="filmList">
              {filmData.map((movie) => (
                <>
                  <SearchFilmItem
                    movie={movie}
                    genres={genres}
                    addRatingToMovie={addRatingToMovie}
                    ratedNeedUpdate={ratedNeedUpdate}
                  />
                </>
              ))}
            </ul>
          </>
        );
      }
      case 3: {
        //Получили дату пустой массив
        return <p>Поиск не дал результатов</p>;
      }
      case 4: {
        //Апи вернула ошибку
        return <APIFailedComponent setType={setType} />;
      }
    }
  };
  return (
    <div className="search">
      Поиск фильмов из отдельного tsx
      <FilmSearch
        startSearch={debouncedStartSearch}
        page={page}
        switchPage={switchPage}
        maxPages={maxPages.current}
      />
      <div className="search_list">{taskList()}</div>
    </div>
  );
};

export default SearchFilmList;
