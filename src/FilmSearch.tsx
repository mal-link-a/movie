import { FC, useState } from "react";

//Поиск
interface FilmSearchProps {
  startSearch: (str: string, isSamePage: boolean) => void;
  page: number;
  switchPage: (isIncrement: boolean) => void;
  maxPages: number;
}

//Поле ввода поиска
const FilmSearch: FC<FilmSearchProps> = ({
  startSearch,
  page,
  switchPage,
  maxPages,
}) => {
  const [search, setSearch] = useState<string>("return");
  //Принимаем изменения поля ввода
  const submitSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    startSearch(search, false);
  };

  const handleMinusPage = (): void => {
    switchPage(false);
  };
  const handlePlusPage = (): void => {
    switchPage(true);
  };
  return (
    <div className="search__box">
      <div>
        <h3>Введите название фильма...</h3>
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
export default FilmSearch;
