import { optionsGet } from "./options/options.ts";

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
