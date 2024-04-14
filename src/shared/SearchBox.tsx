import { FC, useState } from "react";

//Поиск
interface SearchBoxProps {
  startSearch: (str: string, isSamePage: boolean) => void;
  page: number;
  maxPages: number;
  switchPage: (isIncrement: boolean) => void;
}

//Поле ввода поиска
export const SearchBox: FC<SearchBoxProps> = ({
  startSearch, //Функция старта поиска
  page, //Страница поиска
  switchPage, //Функция отображения и изменения страницы поиска
  maxPages, //Всего страниц поиска
}) => {
  const [search, setSearch] = useState<string>("return");

  //Принимаем изменения поля ввода
  const submitSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    startSearch(e.target.value, false);
  };

  //Меняем номера страниц
  const handleMinusPage = (): void => {
    switchPage(false);
  };

  const handlePlusPage = (): void => {
    switchPage(true);
  };

  return (
    <div className="search__box">
      <div>
        <input type="text" value={search} onChange={submitSearch}></input>
      </div>
      <div className="search__box__buttons">
        <button onClick={handleMinusPage}>{`<<<`}</button>
        <p>
          {` ${page}  `}
          <br />
          {`из ${maxPages}`}
        </p>{" "}
        <button onClick={handlePlusPage}>{`>>>`}</button>
      </div>
    </div>
  );
};
