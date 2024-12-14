import React, { useState, useEffect } from 'react';
import { getLiveStockData } from '../api'; 
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsStock from 'highcharts/modules/stock';
import './Dashboard.css';

// Initialize Highcharts modules
HighchartsStock(Highcharts);

const Dashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [searchSymbol, setSearchSymbol] = useState(() => {
    const localStock = localStorage.getItem("ticker");
    return localStock || 'AAPL';
  });
  const [stockData, setStockData] = useState({});
  const [selectedStockData, setSelectedStockData] = useState({ symbol: '', company: '', chartData: [] });

  const tickerData = Object.entries(stockData).map(([symbol, data]) => ({
    symbol,
    price: (data.price || 0).toFixed(2),
    change: (data.change || 0).toFixed(2),
    company: data.company || '',
  }));

  // Fetch live stock data for multiple stocks
  const fetchAllStocks = async () => {
    try {
      const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'WMT', 'HD', 'NFLX', 'IBM'];
      const responses = await Promise.all(stocks.map(stock => getLiveStockData(stock, selectedTimeframe)));

      const newData = {};
      responses.forEach((response, index) => {
        if (response?.success && response?.liveData?.length > 0) {
          const latestData = response.liveData[response.liveData.length - 1];
          const prevData = response.liveData[0];
          const priceChange = ((latestData.close - prevData.close) / prevData.close) * 100;
          newData[stocks[index]] = {
            price: latestData.close || 0,
            change: priceChange || 0,
            company: response.company,
          };
        }
      });

      setStockData(newData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  // Fetch candlestick chart data for a specific stock
  const handleSearch = async () => {
    if (!searchSymbol) return;
    localStorage.setItem("ticker", searchSymbol);

    try {
      const response = await getLiveStockData(searchSymbol.toUpperCase(), selectedTimeframe);
      if (response?.success && response?.liveData?.length > 0) {
        setSelectedStockData({
          symbol: searchSymbol,
          company: response.company,
          chartData: response.liveData.map(data => [
            data.date * 1000,
            data.open,
            data.high,
            data.low,
            data.close,
          ]),
        });
      }
    } catch (error) {
      alert('Error fetching stock data:', error);
    }
  };

  // Periodically fetch live stock data
  useEffect(() => {
    fetchAllStocks();
    handleSearch();

    const interval = setInterval(fetchAllStocks, 60000); 
    return () => clearInterval(interval); 
  }, [selectedTimeframe]);

  // Render stock cards
  const renderStockCards = () => {
    return Object.entries(stockData).slice(0, 5).map(([symbol, data]) => (
      <div key={symbol} className="stock-card">
        <h2>{data.company}</h2>
        <div className={`price ${data.change > 0 ? 'positive' : data.change < 0 ? 'negative' : ''}`}>
          ${(data.price || 0).toFixed(2)}
        </div>
        <div className={`change ${data.change > 0 ? 'positive' : data.change < 0 ? 'negative' : ''}`}>
          {(data.change || 0).toFixed(2)}%
        </div>
      </div>
    ));
  };

  // Chart options for Highcharts
  const chartOptions = {
    chart: { type: 'candlestick', backgroundColor: '#1E1E1E', height: 400,  animation: true,},
    navigator: {
      enabled: true,
      series: {
        color: '#4CAF50',
        lineWidth: 1
      },
      xAxis: {
        labels: {
          style: { color: '#808080' }
        }
      }
    },
    title: { text: `${selectedStockData.company} Stock Price`, style: { color: '#FFFFFF' } },
    xAxis: {
      type: 'datetime',
      labels: {
        style: { color: '#808080' },
        format: selectedTimeframe === '1D' ? '{value:%H:%M}' : 
                selectedTimeframe === '1W' ? '{value:%a, %b %d}' :
                selectedTimeframe === '1M' ? '{value:%b %d}' :
                '{value:%d %b %Y}'
      },
      gridLineColor: '#333333',
      lineColor: '#333333',
      tickColor: '#333333'
    },
    yAxis: { title: { text: 'Price', style: { color: '#808080' } }, labels: { style: { color: '#808080' } } },
    series: [
      {
        type: 'candlestick',
        name: selectedStockData.symbol,
        data: selectedStockData.chartData,
        upColor: 'green',
        color: '#db0413',
      },
    ],

    credits: { enabled: false },
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="ticker-wrap">
        <div className="ticker">
          {[...tickerData, ...tickerData].map((stock, index) => (
            <div key={index} className="ticker-item">
              <span className="ticker-symbol">{stock.company}</span>
              <span className="ticker-price">${stock.price}</span>
              <span className={`ticker-change ${parseFloat(stock.change) >= 0 ? 'positive' : 'negative'}`}>
                {stock.change} %
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="stock-cards-container">{renderStockCards()}</div>
      <div className="search-section">
        <input
          type="text"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
          placeholder="Enter stock symbol..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
        <div className="timeframe-buttons">
          {['1D', '1W', '1M', '1Y'].map((tf) => (
            <button key={tf} className={selectedTimeframe === tf ? 'active' : ''} onClick={() => setSelectedTimeframe(tf)}>
              {tf}
            </button>
          ))}
        </div>
      </div>
      {selectedStockData.symbol && (
        <div className="chart-container">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
