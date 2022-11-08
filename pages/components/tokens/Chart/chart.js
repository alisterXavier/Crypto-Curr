import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const LineChart = ({ timePeriod, uuid, priceChange }) => {
  const myChart = useRef();
  const [history, setHistory] = useState();
  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getHistory = () => {
    const options = {
      method: "GET",
      url: `https://coinranking1.p.rapidapi.com/coin/${uuid}/history`,
      params: { referenceCurrencyUuid: "yhjMzLPhuIDl", timePeriod: timePeriod },
      headers: {
        "X-RapidAPI-Key": "b34fac19dbmshb7bbf2f06859223p1a2ed9jsn1c8a3226d741",
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setHistory({
          ...response.data.data,
          history: response.data.data.history.sort(
            (a, b) => a.timestamp - b.timestamp
          ),
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    if (history) {
      if (!myChart.current) {
        const data = {
          labels: history.history.map((d) => {
            const time = new Date(d.timestamp * 1000);
            return time.getHours() < 10
              ? "0" + time.getHours()
              : time.getHours();
          }),
          datasets: [
            {
              label: "Price",
              data: history.history.map((d) => d.price),
              pointRadius: 0,
              backgroundColor: [
                "rgba(255, 26, 104, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(0, 0, 0, 0.2)",
              ],
              borderColor: ["rgba(255, 26, 104, 1)"],
              borderWidth: 1,
            },
          ],
        };

        const config = {
          type: "line",
          data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (chart) {
                    priceChange(chart.raw);
                  },
                },
                yAlign: {},
              },
            },
            interaction: {
              intersect: false,
            },
            scales: {
              y: {
                ticks: {
                  display: false,
                },
              },
            },
          },
          plugins: [
            {
              id: "myEventCatcher",
              beforeEvent(chart, args, pluginOptions) {
                const event = args.event;
                if (event.type === "mouseout") {
                  priceChange();
                }
              },
            },
          ],
        };
        myChart.current = new Chart(document.getElementById("myChart"), config);
      } else {
        myChart.current.data.labels = history.history.map((d) => {
          const time = new Date(d.timestamp * 1000);
          return ["3h", "24h"].includes(timePeriod)
            ? `${
                time.getHours() < 10 ? "0" + time.getHours() : time.getHours()
              }:${
                time.getMinutes() < 10
                  ? `0${time.getMinutes()}`
                  : time.getMinutes()
              }`
            : ["7d", "30d", "3m"].includes(timePeriod)
            ? `${
                time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()
              }  ${Months[time.getMonth()]} ${time.getFullYear()}`
            : ["1y"].includes(timePeriod) &&
              `${Months[time.getMonth()]} ${time.getFullYear()}`;
        });
        myChart.current.data.datasets[0].data = history.history.map(
          (d) => d.price
        );
        myChart.current.update();
      }
    }
  }, [history]);

  useEffect(() => {
    getHistory();
  }, [timePeriod, uuid]);

  return (
    <div className="chart-wrapper my-5">
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default LineChart;
