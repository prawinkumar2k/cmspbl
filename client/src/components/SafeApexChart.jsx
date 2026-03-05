import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const SafeApexChart = ({ options, series, width = "100%", height = 350, hidden = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Ensure the global Apex registry exists to prevent "t.put" errors
    if (typeof window !== 'undefined') {
      window.Apex = window.Apex || {};
      window.Apex.charts = window.Apex.charts || [];
    }

    let isMounted = true;

    const initChart = async () => {
      if (hidden || !chartRef.current || !isMounted) return;

      try {
        // Cleanup previous instance if any
        if (chartInstance.current) {
          try {
            if (typeof chartInstance.current.destroy === 'function') {
              chartInstance.current.destroy();
            }
          } catch (e) {
            console.warn("Cleanup error before re-render:", e);
          }
          chartInstance.current = null;
        }

        // Wait a bit for DOM to be fully ready and layouts to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!isMounted || !chartRef.current) return;

        const chart = new ApexCharts(chartRef.current, {
          ...options,
          series,
          chart: {
            ...options.chart,
            width,
            height,
            id: options.chart?.id || `chart-${Math.random().toString(36).substring(2, 9)}`
          },
        });

        chartInstance.current = chart;
        await chart.render();
      } catch (err) {
        if (isMounted) {
          console.error("ApexCharts failed to render:", err);
        }
      }
    };

    initChart();

    return () => {
      isMounted = false;
      if (chartInstance.current) {
        try {
          if (typeof chartInstance.current.destroy === 'function') {
            chartInstance.current.destroy();
          }
        } catch (e) {
          // Silent cleanup failure on unmount
        }
        chartInstance.current = null;
      }
    };
  }, [options, series, width, height, hidden]);

  return !hidden ? <div ref={chartRef} style={{ minHeight: height }} /> : null;
};

export default SafeApexChart;
