// components/CountrySelector.js
import React, { useState, useEffect } from "react";
import Select from "react-select";
import CountryFlag from "react-country-flag";
import styles from "../../styles/body/CountrySelector.module.css";

function CountrySelector({ onCountryChange }) {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState({
    value: "default",
    label: "Default",
    code: "",
  });

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const filteredCountries = data.filter((country) =>
          ["France", "United Kingdom", "Spain"].includes(country.name.common)
        );

        const mappedLanguages = filteredCountries.map((country) => {
          let language = "";
          let languageCode = "";
          switch (country.name.common) {
            case "Default":
              language = "Default";
              languageCode = "";
              break;
            case "France":
              language = "French";
              languageCode = "fr";
              break;
            case "United Kingdom":
              language = "English";
              languageCode = "en";
              break;
            case "Spain":
              language = "Spanish";
              languageCode = "es";
              break;
            default:
              break;
          }

          return {
            value: country.cca2,
            label: language,
            code: languageCode,
          };
        });

        setLanguages(mappedLanguages);
      });
  }, []);

  const CustomOption = ({ label, value, ...props }) => (
    <div {...props.innerProps}>
      <CountryFlag
        countryCode={value}
        svg
        style={{ width: "20px", marginRight: "10px", marginLeft: "10px" }}
      />

      {label}
    </div>
  );

  const customStyles = {
    container: (provided) => ({
      ...provided,
      margin: "0 auto",
      alignitems: "center",
    }),

    control: (base) => ({
      ...base,
      backgroundColor: "transparent", // Make the dropdown's background transparent
      borderColor: "transparent",
      boxShadow: "none",
      "&:hover": {
        borderColor: "transparent",
      },
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: "transparent", // Make the dropdown's menu background transparent
    }),

    singleValue: (base) => ({
      ...base,
      color: "white !important",
    }),

    valueContainer: (base) => ({
      ...base,
      color: "white !important",
    }),

    option: (base, state) => ({
      ...base,
      color: "white", // Change text color of the dropdown items
      backgroundColor: state.isSelected ? "rgba(0, 0, 0, 0.1)" : "transparent",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
      },
    }),
  };

  const handleCountrySelect = (selectedOption) => {
    console.log(selectedOption.code);
    setSelectedLanguage(selectedOption);
    onCountryChange(selectedOption.code); // Updated to match the new prop name
  };

  return (
    <div className={styles.container}>
      <Select
        options={languages}
        components={{ Option: CustomOption }}
        value={selectedLanguage}
        onChange={handleCountrySelect} // Use the new handleCountrySelect function
        styles={customStyles}
      />
    </div>
  );
}

export default CountrySelector;
