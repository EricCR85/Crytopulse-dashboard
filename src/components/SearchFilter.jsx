import { Search, Star } from "lucide-react";

const SearchFilter = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  showWatchlistOnly,
  setShowWatchlistOnly,
}) => {
  return (
    <div className="controls-container">
      <div className="search-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <select
        className="sort-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="market_cap_desc">Market Cap: High to Low</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="change_desc">24h Gainers</option>
      </select>

      <button
        onClick={() => setShowWatchlistOnly(!showWatchlistOnly)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0.75rem",
          backgroundColor: showWatchlistOnly
            ? "rgba(234, 179, 8, 0.15)"
            : "var(--bg-primary)",
          border: `1px solid ${
            showWatchlistOnly ? "#eab308" : "var(--border-color)"
          }`,
          borderRadius: "8px",
          color: showWatchlistOnly ? "#eab308" : "var(--text-main)",
          cursor: "pointer",
          fontWeight: "600",
          transition: "all 0.2s",
        }}
      >
        <Star
          size={16}
          fill={showWatchlistOnly ? "#eab308" : "none"}
          stroke={showWatchlistOnly ? "#eab308" : "currentColor"}
        />
        {showWatchlistOnly ? "Showing Watchlist" : "Filter by Watchlist"}
      </button>
    </div>
  );
};

export default SearchFilter;
