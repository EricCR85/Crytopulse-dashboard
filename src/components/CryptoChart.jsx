import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          padding: "0.75rem",
          borderRadius: "6px",
          color: "var(--text-main)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "var(--text-muted)",
          }}
        >
          {payload[0].payload.date}
        </p>
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            color: "var(--accent-blue)",
            marginTop: "4px",
          }}
        >
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const CryptoChart = ({ coinId }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`,
        );

        if (!response.ok) {
          throw new Error("Unable to load chart data for this asset.");
        }

        const data = await response.json();

        const formattedData = data.prices.map(([timestamp, price]) => {
          const dateObj = new Date(timestamp);
          return {
            date: dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            price: Number(price.toFixed(2)),
          };
        });

        setChartData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (coinId) {
      fetchHistoricalData();
    }
  }, [coinId]);

  if (loading) {
    return (
      <div className="loader" style={{ height: "300px" }}>
        Loading interactive chart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-banner" style={{ margin: 0 }}>
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(71, 85, 105, 0.2)"
          />
          <XAxis
            dataKey="date"
            stroke="var(--text-muted)"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            stroke="var(--text-muted)"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            domain={["auto", "auto"]}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--accent-blue)"
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor="var(--accent-blue)"
                stopOpacity={0.0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--accent-blue)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoChart;

// import React, { useState, useEffect } from "react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";

// const CryptoChart = ({ coinId }) => {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch(
//           `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`,
//         );

//         if (!response.ok) {
//           throw new Error("Unable to load chart data for this asset.");
//         }

//         const data = await response.json();

//         const formattedData = data.prices.map(([timestamp, price]) => {
//           const dateObj = new Date(timestamp);
//           return {
//             date: dateObj.toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//             }),
//             price: Number(price.toFixed(2)),
//           };
//         });

//         setChartData(formattedData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (coinId) {
//       fetchHistoricalData();
//     }
//   }, [coinId]);

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div
//           style={{
//             backgroundColor: "var(--bg-secondary)",
//             border: "1px solid var(--border-color)",
//             padding: "0.75rem",
//             borderRadius: "6px",
//             color: "var(--text-main)",
//           }}
//         >
//           <p
//             style={{
//               margin: 0,
//               fontSize: "0.85rem",
//               color: "var(--text-muted)",
//             }}
//           >
//             {payload[0].payload.date}
//           </p>
//           <p
//             style={{
//               margin: 0,
//               fontWeight: 600,
//               color: "var(--accent-blue)",
//               marginTop: "4px",
//             }}
//           >
//             ${payload[0].value.toLocaleString()}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (loading)
//     return (
//       <div className="loader" style={{ height: "300px" }}>
//         Loading interactive chart...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="error-banner" style={{ margin: 0 }}>
//         ⚠️ {error}
//       </div>
//     );

//   return (
//     <div style={{ width: "100%", height: 350 }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart
//           data={chartData}
//           margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
//         >
//           <CartesianGrid
//             strokeDasharray="3 3"
//             stroke="rgba(71, 85, 105, 0.2)"
//           />

//           <XAxis
//             dataKey="date"
//             stroke="var(--text-muted)"
//             tick={{ fill: "var(--text-muted)", fontSize: 12 }}
//             dy={10}
//           />
//           <YAxis
//             stroke="var(--text-muted)"
//             tick={{ fill: "var(--text-muted)", fontSize: 11 }}
//             domain={["auto", "auto"]}
//             tickFormatter={(value) => `$${value.toLocaleString()}`}
//           />

//           <Tooltip content={<CustomTooltip />} />

//           <defs>
//             <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
//               <stop
//                 offset="5%"
//                 stopColor="var(--accent-blue)"
//                 stopOpacity={0.4}
//               />
//               <stop
//                 offset="95%"
//                 stopColor="var(--accent-blue)"
//                 stopOpacity={0.0}
//               />
//             </linearGradient>
//           </defs>

//           <Area
//             type="monotone"
//             dataKey="price"
//             stroke="var(--accent-blue)"
//             strokeWidth={3}
//             fillOpacity={1}
//             fill="url(#colorPrice)"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default CryptoChart;
