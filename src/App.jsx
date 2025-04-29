import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';
import './App.css';

// Hook personnalisé pour la récupération de données
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError(error);
        setLoading(false);
        setData(null);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Composant pour la liste des pays
const CountryList = () => {
  const { data, loading, error } = useFetch('https://restcountries.com/v3.1/all');

  if (loading) {
    return <p className="container">Chargement des pays... ujzindsk,hudsincgfydhuciosklçioskplwx;husjin</p>;
  }

  if (error) {
    return <p className="container">Erreur lors du chargement des pays : {error.message}</p>;
  }

  return (
    <div className="container">
      <h2>Liste des Pays</h2>
      <ul>
        {data && data.map((country) => (
          <li key={country.cca3}>
            <Link to={`/country/${country.cca3}`}>
              <img
                src={country.flags.svg}
                alt={`Drapeau de ${country.name.common}`}
                style={{ width: '30px', marginRight: '10px' }}
              />
              {country.name.common}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant pour les détails d’un pays
const CountryDetail = () => {
  const { countryCode } = useParams();
  const { data, loading, error } = useFetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);

  if (loading) {
    return <p className="container">Chargement des détails du pays...</p>;
  }

  if (error) {
    return <p className="container">Erreur lors du chargement des détails du pays : {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p className="container">Pays non trouvé.</p>;
  }

  const country = data[0];

  return (
    <div className="container">
      <h2>
        <img
          src={country.flags.svg}
          alt={`Drapeau de ${country.name.common}`}
          style={{ width: '50px', marginRight: '10px' }}
        />
        Détails de {country.name.common}
      </h2>
      <p>Nom officiel: {country.name.official}</p>
      <p>Capitale: {country.capital && country.capital.join(', ')}</p>
      <p>Région: {country.region}</p>
      <p>Sous-région: {country.subregion}</p>
      <p>Population: {country.population.toLocaleString()}</p>
      {country.currencies && (
        <div>
          <p>Devises:</p>
          <ul>
            {Object.values(country.currencies).map((currency) => (
              <li key={currency.name}>
                {currency.name} ({currency.symbol})
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link className="back-link" to="/">← Retour à la liste des pays</Link>
    </div>
  );
};

// Composant principal de l'application
const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Accueil</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<CountryList />} />
        <Route path="/country/:countryCode" element={<CountryDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
