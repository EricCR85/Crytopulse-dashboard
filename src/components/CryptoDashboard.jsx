import React, { useState, useEffect } from "react";
import CryptoTable from "./CryptoTable";
import CryptoChart from "./CryptoChart";
import SearchFilter from "./SearchFilter";
import "../CryptoApp.css";

const CryptoDashboard = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [selectedCoinName, setSelectedCoinName] = useState("Bitcoin");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("crypto_watchlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem("crypto_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false",
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch live market data. Please try again later.",
          );
        }

        const data = await response.json();
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleWatchlist = (coinId) => {
    setWatchlist((prev) => {
      if (prev.includes(coinId)) {
        return prev.filter((id) => id !== coinId); 
      } else {
        return [...prev, coinId]; 
      }
    });
  };

  const filteredCoins = coins
    .filter((coin) => {
      const matchesSearch =
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      if (showWatchlistOnly) {
        return matchesSearch && watchlist.includes(coin.id);
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price_desc") return b.current_price - a.current_price;
      if (sortBy === "price_asc") return a.current_price - b.current_price;
      if (sortBy === "change_desc")
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
      return b.market_cap - a.market_cap; 
    });

  const handleCoinSelect = (id, name) => {
    setSelectedCoin(id);
    setSelectedCoinName(name);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>CryptoPulse Dashboard</h1>
        <p className="subtitle">
          Real-time market tracking powered by CoinGecko
        </p>
      </header>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <main className="dashboard-grid">
        <section className="chart-section">
          <h2>{selectedCoinName} Historical Price (7D Trend)</h2>
          <CryptoChart coinId={selectedCoin} />
        </section>

        <section className="list-section">
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showWatchlistOnly={showWatchlistOnly}
            setShowWatchlistOnly={setShowWatchlistOnly}
          />

          {loading && coins.length === 0 ? (
            <div className="loader">Loading live market data...</div>
          ) : (
            <CryptoTable
              coins={filteredCoins}
              selectedCoin={selectedCoin}
              onCoinSelect={handleCoinSelect}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              showWatchlistOnly={showWatchlistOnly}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default CryptoDashboard;


