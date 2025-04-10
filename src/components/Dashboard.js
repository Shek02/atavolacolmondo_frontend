import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import countries from "world_countries_lists/data/countries/it/countries.json"; // Importa il file JSON con i paesi in italiano
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // qui metti il tuo dominio/backend
  headers: {
    "Content-Type": "application/json"
    // puoi aggiungere anche Authorization o altri header se vuoi
  }
});

const Dashboard = ({ auth }) => {
  const [countriesList, setCountriesList] = useState([]); // Stato per memorizzare i paesi
  const [selectedCountry, setSelectedCountry] = useState(null); // Paese selezionato
  const [searchQuery, setSearchQuery] = useState(""); // Stato per memorizzare la query di ricerca
  const [savedCountry, setSavedCountry] = useState([]); // Stato per memorizzare la lista degli stati

  const fetchData = async () => {
    try {
      // Eseguiamo una richiesta GET alla rotta "/getAll"
      const response = await api.get('/getAll');
      // Logghiamo la risposta ricevuta dal server
      setSavedCountry(response.data.states);

      const states = response.data.states;
      const fileredCountry = countries.map(co => {
        const findCountry = states.find(item => item.name === co.name);
        if (findCountry) {
          return { ...co, quantity: findCountry.quantity };  // Se il paese è trovato, aggiungi la quantità
        } else {
          return { ...co, quantity: 0 };  // Se il paese non è trovato, la quantità è 0
        }
      });

      // Ordina i paesi con quantity > 0 (i paesi trovati) in cima alla lista
      const sortedCountries = [
        ...fileredCountry.filter(country => country.quantity > 0),  // Paesi con quantity > 0
        ...fileredCountry.filter(country => country.quantity === 0)  // Paesi con quantity 0
      ];

      setCountriesList(sortedCountries);  // Imposta la lista finale ordinata
    } catch (error) {
      console.error('Errore durante la richiesta GET:', error);
    }
  };

  const handleAddOrCreateState = async (stateName) => {
    try {
      const response = await api.post("/addOrUpdateQuantity", { name: stateName });
      if (response.data) {
        fetchData(); // Ricarica i dati dopo aver aggiunto o aggiornato la quantità
      }
    } catch (error) {
      console.error("Errore durante la richiesta POST:", error);
    }
  };

  useEffect(() => {
    // Carica la lista dei paesi al caricamento del componente
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    // Aggiorna la query di ricerca
    setSearchQuery(event.target.value);
  };

  // Filtra i paesi in base alla query di ricerca
  const filteredCountries = countriesList.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcolare la quantità totale
  const totalQuantity = countriesList.reduce((acc, country) => acc + country.quantity, 0);

  // Trova il paese con la quantità maggiore
  const countryWithMaxQuantity = countriesList.reduce((max, country) => {
    return country.quantity > max.quantity ? country : max;
  }, { quantity: 0 });

  return (
    <div className="container h-screen p-4 bg-gray-100">
      <div className="row mb-6">
        <div className="col-12">
          <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">Seleziona un Paese</h3>
          <div className="flex justify-center mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Cerca un Paese"
              className="w-4/5 p-3 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Visualizza il Paese con la Quantità Maggiore */}
      {countryWithMaxQuantity.quantity > 0 && (
        <div className="mb-6 p-4 bg-blue-100 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold text-gray-700 text-center">
            Paese con la Quantità Maggiore:{" "}
            <span className="text-blue-500">{countryWithMaxQuantity.name}</span>
          </h4>
          <p className="text-center text-gray-600">Quantità: {countryWithMaxQuantity.quantity}</p>
        </div>
      )}

      {/* Visualizza la Quantità Totale */}
      <div className="mb-6 text-center">
        <h4 className="text-xl font-semibold text-gray-700">
          Quantità Totale: <span className="text-blue-500">{totalQuantity}</span>
        </h4>
      </div>

      <div className="col-12">
        <div className="max-h-96 overflow-y-scroll border border-gray-300 rounded-lg shadow-lg">
          <ul className="space-y-2">
            {filteredCountries.map((country) => (
              <li
                key={country.alpha2}
                className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center">
                  <img
                    src={`https://flagcdn.com/w20/${country.alpha2.toLowerCase()}.png`}
                    alt={country.name}
                    className="w-8 h-5 mr-4 rounded"
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">{country.name}</span>
                    <span className="text-sm text-gray-600">Quantità: {country.quantity}</span>
                  </div>
                </div>
                <button
                  className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-all duration-300"
                  onClick={() => { handleAddOrCreateState(country.name) }}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedCountry && (
        <div className="col-12 mt-6">
          <h4 className="text-xl font-semibold text-gray-700">Paese Selezionato:</h4>
          <p className="text-lg text-gray-800">{selectedCountry.name}</p>
        </div>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Dashboard);
