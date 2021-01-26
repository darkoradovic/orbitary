import dictionary from "./dictionary.json";

const Dictionary = {
  get language() {
    return this._lang;
  },

  set language(value) {
    this._lang = value;
  },

  trs(text) {
    return dictionary[this.language][text];
  },
};

let orbitaryLang = "en";

if (typeof window !== "undefined" && navigator.cookieEnabled) {
  const langStorage = localStorage.getItem("orbitaryLang");

  let navLang = navigator.language.substring(0, 2);
  let lang;

  if (navLang === "de" || navLang === "en") {
    lang = navLang;
  } else {
    lang = "en";
  }

  orbitaryLang = langStorage ? langStorage : lang;
} else if (typeof window !== "undefined") {
  orbitaryLang = navigator.language.substring(0, 2);
}

Dictionary.language = orbitaryLang;

export default Dictionary;
