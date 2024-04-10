import { useState, useEffect, useContext, FC, useRef } from "react";

import { Spinner } from "../../graphicComp/Spinner.tsx";
import APIFailedComponent from "../../graphicComp/APIFailedComponent.tsx";
import { GenreContext } from "../../context/GenreContext.tsx";
import { debounce } from "../../options/debounce.ts";
import { Movie, optionsGet } from "../../options/options.ts";

import SearchFilmItem from "./SearchFilmItem.tsx";
import FilmSearch from "./FilmSearch.tsx";

interface SearctFilmListProps {
  addRatingToMovie: (movie: Movie, rate?: number) => void;
}
const SearchFilmList: FC<SearctFilmListProps> = ({ addRatingToMovie }) => {
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
    fetch(url, optionsGet)
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
