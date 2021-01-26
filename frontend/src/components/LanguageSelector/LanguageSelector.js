import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";

import arrow from "../../assets/arrow-down-black.png";

const LanguageSelector = (props) => {
  const [languages, setLanguages] = useState([
    ["EN", "en"],
    ["DE", "de"],
  ]);
  const [activeLang, setActiveLang] = useState("en");

  function changeLang(language) {
    if (navigator.cookieEnabled) {
      localStorage.setItem("orbitaryLang", language);
    }
    window.location.reload();
  }

  useEffect(() => {
    const navigatorLanguage = navigator.language.substring(0, 2);
    let arPlayLang = navigatorLanguage;

    if (navigator.cookieEnabled) {
      arPlayLang = localStorage.getItem("orbitaryLang");
    }

    if (arPlayLang) {
      setActiveLang(arPlayLang);
    }
  }, [changeLang]);

 /*  let languageDropdownStyle = classNames(
    styles.languageDropdown,
    props.className,
    {
      [styles.languageDropdownLight]: props.rightSideStyle === "light",
    }
  );

  let languageDropdownBtnStyle = classNames(styles.languageDropdownBtn, {
    [styles.languageDropdownBtnLight]: props.rightSideStyle === "light",
  }); */

  const activeLan = languages.map((language) =>
    language[1] === activeLang ? language[0] : null
  );

  const langOptions = languages.map((language) =>
    language[1] !== activeLang ? (
      <div
        key={language[1]}
        className={styles.languageDropdownOption}
        onClick={() => changeLang(language[1])}
      >
        {language[0]}
      </div>
    ) : null
  );

  return (
    <div className={styles.changeLanguageWrap}>
      <div className={styles.languageSelector}>
        <div className={styles.activeLang}>{activeLan}</div>
        <span className={styles.lineBetween}>/</span>
        <div className={styles.langOptions}>{langOptions}</div>
      </div>
    </div>
  );
};

export default LanguageSelector;
