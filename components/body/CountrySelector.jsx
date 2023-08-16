// components/CountrySelector.js
import React, { useState, useEffect } from "react";
import Select from "react-select";
import CountryFlag from "react-country-flag";

function CountrySelector() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const filteredCountries = data.filter((country) =>
          ["France", "United Kingdom", "Spain"].includes(country.name.common)
        );

        const mappedLanguages = filteredCountries.map((country) => {
          let language = "";
          switch (country.name.common) {
            case "France":
              language = "French";
              break;
            case "United Kingdom":
              language = "English";
              break;
            case "Spain":
              language = "Spanish";
              break;
            default:
              break;
          }

          return {
            value: country.cca2,
            label: language,
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
        style={{ width: "20px", marginRight: "10px" }}
      />
      {label}
    </div>
  );

  return (
    <Select
      options={languages}
      components={{ Option: CustomOption }}
      value={selectedLanguage}
      onChange={setSelectedLanguage}
    />
  );
}

export default CountrySelector;
