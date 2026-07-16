import React from "react";
import { Star } from "lucide-react";

const CryptoTable = ({
  coins,
  selectedCoin,
  onCoinSelect,
  watchlist,
  onToggleWatchlist,
  showWatchlistOnly,
}) => {
  const formatCurrency = (val) => {
    if (val >= 1) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(val);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
    }).format(val);
  };

  return (
    <div className="table-wrapper">
      <table className="crypto-table">
        <thead>
       
          <tr>
            <th style={{ width: "50px" }}></th>
            <th>Asset</th>
            <th>Price</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {coins.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  padding: "2rem",
                }}
              >
                {showWatchlistOnly
                  ? "Your watchlist is empty! Star some coins to add them."
                  : "No coins match your search."}
              </td>
            </tr>
          ) : (
            coins.map((coin) => {
              const isSelected = coin.id === selectedCoin;
              const isPositive = coin.price_change_percentage_24h >= 0;
              const isFavorited = watchlist.includes(coin.id);

              return (
                <tr
                  key={coin.id}
                  className={`coin-row ${isSelected ? "selected" : ""}`}
                  onClick={() => onCoinSelect(coin.id, coin.name)}
                >
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(coin.id);
                    }}
                  >
                    <Star
                      size={18}
                      style={{
                        cursor: "pointer",
                        fill: isFavorited ? "#eab308" : "none",
                        stroke: isFavorited ? "#eab308" : "var(--text-muted)",
                        transition: "transform 0.1s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.transform = "scale(1.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
                    />
                  </td>
                  <td>
                    <div className="coin-info">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="coin-icon"
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{coin.name}</div>
                        <span className="coin-symbol">{coin.symbol}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {formatCurrency(coin.current_price)}
                  </td>
                  <td className={isPositive ? "price-up" : "price-down"}>
                    {isPositive ? "+" : ""}
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;


