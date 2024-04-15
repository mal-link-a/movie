import { useState, useEffect, useContext, FC, useRef, Fragment } from "react";

import { Spinner, APIFailedComponent } from "../../../shared";
import { GenreContext } from "../../../context";
import { debounce } from "../../../functions/debounce.ts";
import { Movie, SearchListType } from "../../../types";
import { searchMovie } from "../../../api/searchMovie.ts";
import { SearchBox } from "../../../shared/SearchBox.tsx";

import { SearchFilmItem } from "./SearchFilmItem.tsx";

interface SearctFilmListProps {
  addRatingToMovie: (movie: Movie, rate: number) => void;
}

export const SearchFilmList: FC<SearctFilmListProps> = ({
  addRatingToMovie,
}) => {
  const search = useRef<string>("return"); //Поле поиска
  const [page, setPage] = useState<number>(1); //Страница поиска
  const maxPages = useRef<number>(10); //Максимум страниц на нынешний search
  const [filmData, setFilmData] = useState<Movie[]>([]); // Массив с фильмами
  const [type, setType] = useState<SearchListType>(SearchListType.Waiting); // Тип необходимых к показу данных

  //Пытаемся начать поиск
  const startSearch = (str: string, isSamePage: boolean): void => {
    if (str.length === 0) {
      setType(SearchListType.Waiting);
    } else {
      search.current = str;
      setType(SearchListType.Updating);
      if (!isSamePage) {
        setPage(1);
      }
      searchMovie(str, page).then((json) => {
        if (json.results.length === 0) {
          setType(SearchListType.SuccessNoResults);
        } else {
          setType(SearchListType.Success);
          maxPages.current = json.total_pages;
          setFilmData(json.results);
        }
      });
    }
  };

  const debouncedStartSearch = debounce(startSearch, 1200);

  useEffect(() => {
    startSearch(search.current, true);
  }, [page]);

  useEffect(() => {
    if (type === "Updating") {
      startSearch(search.current, false);
    }
  }, [type]);

  const switchPage = (isIncrement: boolean) => {
    if (isIncrement && page <= maxPages.current) {
      setPage((prev) => prev + 1);
    } else if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  //Функция перезагрузки контента search
  const reUpdate = () => {
    setType(SearchListType.Updating);
  };

  const genres = useContext(GenreContext);

  //Отображение контента
  const movieList = () => {
    switch (type) {
      case SearchListType.Waiting: {
        //Пустое поле поиска, и не идёт поиск
        return <p>Поиск фильмов на themoviedb.org</p>;
      }
      case SearchListType.Updating: {
        //Идёт какой-то поиск, но в процессе
        return <Spinner />;
      }
      case SearchListType.Success: {
        //Получили всю дату
        return (
          <>
            <p>База, id = 2</p>
            <ul className="searchList__ul">
              {filmData.map((movie) => (
                <Fragment key={movie.id}>
                  <SearchFilmItem
                    movie={movie}
                    genres={genres}
                    addRatingToMovie={addRatingToMovie}
                  />
                </Fragment>
              ))}
            </ul>
          </>
        );
      }
      case SearchListType.SuccessNoResults: {
        //Получили дату пустой массив
        return <p>Поиск не дал результатов</p>;
      }
      case SearchListType.ErrApi: {
        //Апи вернула ошибку
        return <APIFailedComponent onTry={reUpdate} />;
      }
    }
  };
  return (
    <div className="search">
      Поиск фильмов из отдельного tsx
      <SearchBox
        startSearch={debouncedStartSearch}
        page={page}
        switchPage={switchPage}
        maxPages={maxPages.current}
      />
      <div key={type} className="search_list">
        {movieList()}
      </div>
    </div>
  );
};
