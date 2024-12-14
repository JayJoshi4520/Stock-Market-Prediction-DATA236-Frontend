import React, { useState, useEffect } from 'react';
import { getLiveStockData } from '../api';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './TechnicalAnalysis.css';

const TechnicalAnalysis = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState(() => {
    const localStock = localStorage.getItem("ticker");
    return localStock || 'AAPL';
  });
  const [technicalIndicators, setTechnicalIndicators] = useState({ ma20: 0, rsi: 0, bbWidth: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLiveStockData(searchSymbol, selectedTimeframe);
        if (data.success) {
          processStockData(data);
        }
      } catch (error) {
        console.error('Error fetching technical data:', error);
      }
    };
  
    fetchData();
  }, [selectedTimeframe, searchSymbol]); // Add `searchSymbol` dependency
  

  const processStockData = (data) => {
    let processedPrices;
      processedPrices = data.liveData.map(item => ({
        time: new Date(item.date).getTime(),
        price: item.close,
      }));

    const prices = processedPrices.map(p => p.price);
    const ma20 = calculateMA(prices, Math.min(20, prices.length));
    const rsi = calculateRSI(prices, Math.min(14, prices.length));
    const bbWidth = calculateBollingerBandWidth(prices, Math.min(20, prices.length));

    setTechnicalIndicators({
      ma20: ma20.toFixed(2),
      rsi: rsi.toFixed(2),
      bbWidth: bbWidth.toFixed(2),
    });

    const chartDataArray = prepareChartData(processedPrices, ma20);
    setChartData(chartDataArray);
  };

  const prepareChartData = (processedPrices) => {
    const prices = processedPrices.map(p => p.price);
  
    return processedPrices.map((p, i) => {
      const ma20 = i >= 19 ? calculateMA(prices.slice(0, i + 1), 20) : NaN;
      const stdDev = i >= 19 ? calculateStdDev(prices.slice(0, i + 1), 20) : NaN;
  
      return {
        time: p.time,
        price: p.price,
        ma20: ma20,
        upperBand: ma20 && stdDev ? ma20 + 2 * stdDev : NaN,
        lowerBand: ma20 && stdDev ? ma20 - 2 * stdDev : NaN,
      };
    });
  };
  const renderChart = () => {
    const options = {
      chart: {
        type: 'line',
        height: 350,
        backgroundColor: '#1E1E1E',
        style: {
          fontFamily: 'Arial, sans-serif'
        }
      },
      title: {
        text: `${searchSymbol} TECHNICAL ANALYSIS`,
        style: { color: '#FFFFFF' }
      },
      xAxis: {
        type: 'datetime',
        labels: {
          style: { color: '#808080' },
          formatter: function() {
            if (selectedTimeframe === '1W') {
              return Highcharts.dateFormat('%a', this.value);
            } else if (selectedTimeframe === '1D') {
              return Highcharts.dateFormat('%H:%M', this.value);
            } else if (selectedTimeframe === '1M') {
              return Highcharts.dateFormat('%b %d', this.value);
            } else {
              return Highcharts.dateFormat('%b %Y', this.value);
            }
          }
        },
        tickInterval: selectedTimeframe === '1W' ? 24 * 3600 * 1000 : undefined, // One day interval for weekly view
        gridLineColor: '#333333',
        ordinal: false // Disable ordinal positioning
      },
      yAxis: {
        title: { 
          text: 'Price',
          style: { color: '#808080' }
        },
        labels: { 
          style: { color: '#808080' }
        },
        gridLineColor: '#333333'
      },
      series: [
        {
          name: 'Price',
          data: chartData.map(d => [d.time, d.price]),
          color: '#4CAF50'
        },
        {
          name: 'MA(20)',
          data: chartData.map(d => [d.time, d.ma20]),
          color: '#00BCD4'
        },
        {
          name: 'Upper Band',
          data: chartData.map(d => [d.time, d.upperBand]),
          color: '#FFA726',
          dashStyle: 'shortdash'
        },
        {
          name: 'Lower Band',
          data: chartData.map(d => [d.time, d.lowerBand]),
          color: '#FFA726',
          dashStyle: 'shortdash'
        }
      ],
      legend: {
        itemStyle: { color: '#808080' },
        itemHoverStyle: { color: '#FFFFFF' }
      },
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
      tooltip: {
        backgroundColor: '#1E1E1E',
        style: { color: '#FFFFFF' },
        xDateFormat: selectedTimeframe === '1D' ? '%H:%M:%S' :
                    selectedTimeframe === '1W' ? '%A, %b %d' :
                    selectedTimeframe === '1M' ? '%b %d, %Y' :
                    '%b %Y',
        shared: true
      },
      plotOptions: {
        series: {
          marker: {
            enabled: selectedTimeframe === '1W'
          }
        }
      }
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
  };

  return (
    <div className="technical-analysis">
      <div className="indicator-cards">
        <div className="indicator-card">
          <h3>Moving Average (20)</h3>
          <div className="indicator-value">{technicalIndicators.ma20}$</div>
        </div>
        <div className="indicator-card">
          <h3>RSI (14)</h3>
          <div className="indicator-value">{technicalIndicators.rsi}%</div>
        </div>
        <div className="indicator-card">
          <h3>Bollinger Band Width</h3>
          <div className="indicator-value">{technicalIndicators.bbWidth}%</div>
        </div>
      </div>
      <div className="timeframe-buttons">
        <button className={selectedTimeframe === '1D' ? 'active' : ''} onClick={() => setSelectedTimeframe('1D')}>1D</button>
        <button className={selectedTimeframe === '1W' ? 'active' : ''} onClick={() => setSelectedTimeframe('1W')}>1W</button>
        <button className={selectedTimeframe === '1M' ? 'active' : ''} onClick={() => setSelectedTimeframe('1M')}>1M</button>
        <button className={selectedTimeframe === '1Y' ? 'active' : ''} onClick={() => setSelectedTimeframe('1Y')}>1Y</button>
      </div>
      {renderChart()}
    </div>
  );
};

// Technical indicator calculation functions
function calculateMA(prices, period) {
  if (prices.length < period) return NaN;
  return prices.slice(-period).reduce((a, b) => a + b, 0) / period;
}

function calculateRSI(prices, period) {
  if (prices.length < period + 1) return NaN;
  let gains = 0;
  let losses = 0;
  
  for (let i = prices.length - period; i < prices.length; i++) {
    const difference = prices[i] - prices[i - 1];
    if (difference >= 0) gains += difference;
    else losses -= difference;
  }

  if (losses === 0) return 100;
  
  const rs = gains / losses;
  
  return 100 - (100 / (1 + rs));
}

function calculateStdDev(prices, period) {
  if (prices.length < period) return NaN;
  
  const mean = calculateMA(prices.slice(-period), period);
  
  const squaredDiffs = prices.slice(-period).map(price => Math.pow(price - mean, 2));
  
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / period);
}

function calculateBollingerBandWidth(prices, period) {
  if (prices.length < period) return NaN;
  
  const ma = calculateMA(prices.slice(-period), period);
  
  const stdDev = calculateStdDev(prices.slice(-period), period);
  
  return ((2 * stdDev) / ma) * 100;
}

export default TechnicalAnalysis;




