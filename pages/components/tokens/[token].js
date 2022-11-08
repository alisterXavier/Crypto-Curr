import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { coinDetails } from "../../_app";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import LineChart from "./Chart/chart";
import axios from "axios";
import parse from "html-react-parser";

const SelectedToken = () => {
  const [viewCoin, setViewCoin] = useContext(coinDetails);
  const [coin, setCoin] = useState();
  const period = ["3h", "24h", "7d", "30d", "3m", "1y"];
  const [timePeriod, setTimePeriod] = useState("3h");
  const [changedCoin, setChangedCoin] = useState();

  const getCoin = () => {
    const options = {
      method: "GET",
      url: `https://coinranking1.p.rapidapi.com/coin/${viewCoin}`,
      params: { referenceCurrencyUuid: "yhjMzLPhuIDl", timePeriod: "24h" },
      headers: {
        "X-RapidAPI-Key": "b34fac19dbmshb7bbf2f06859223p1a2ed9jsn1c8a3226d741",
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setCoin(response.data.data.coin);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const formatPrice = (value) => {
    return Math.abs(value) >= 1.0e9
      ? Math.abs(value / 1.0e9).toFixed(2) + "B"
      : Math.abs(value) >= 1.0e6
      ? Math.abs(value / 1.0e6).toFixed(2) + "M"
      : Math.abs(value) >= 1.0e3
      ? Math.abs(value / 1.0e3).toFixed(2) + "K"
      : Math.abs(value).toFixed(2);
  };


  useEffect(() => {
    getCoin();
  }, [viewCoin]);

  const priceChange = (price, change) => {
    setChangedCoin({
      price: price,
      change: change,
    });
  };

  const displayTag = (value) => (
    <p className="w-fit flex items-center text-xl">
      {value}
      {value > 0 ? (
        <FiArrowUpRight className="text-green-500" size={15} />
      ) : (
        <FiArrowDownRight className="text-red-500" size={15} />
      )}
    </p>
  );
  
  return (
    coin && (
      <div className="p-5 lg:mb-0 mb-28">
        <div className="">
          <div className="flex">
            <figure className="mr-1">
              <Image src={coin.iconUrl} width={25} height={25} />
            </figure>
            <h1 className="mr-2 text-2xl">{coin.name}</h1>
            <h1 className="text-gray-500 text-2xl">{coin.symbol}</h1>
          </div>
          <h1 className="text-4xl">
            $
            {changedCoin?.price
              ? formatPrice(changedCoin.price)
              : formatPrice(coin.price)}
          </h1>
          {displayTag(coin.change)}
        </div>
        <div>
          <div className="line-wrapper">
            <LineChart
              timePeriod={timePeriod}
              uuid={viewCoin}
              priceChange={(price = undefined, change = undefined) => {
                priceChange(price, change);
              }}
            />
            <ul className="timeperiod relative flex w-fit my-5">
              {period.map((p, index) => (
                <li
                  key={p}
                  className={`text-center ${
                    index === 0 ? "selected" : ""
                  } py-2`}
                  onClick={(e) => {
                    setTimePeriod(p);
                    const parent = document.querySelector(".timeperiod");
                    parent
                      .querySelector(".selected")
                      .classList.remove("selected");
                    e.target.classList.add("selected");
                  }}
                >
                  {p}
                </li>
              ))}
              <span className="slider"></span>
            </ul>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl">Stats</h1>
            <div className="flex justify-start my-5">
              <div className="mr-5">
                <h1 className="text-gray-500">Market Cap</h1>
                <h1 className="text-2xl mt-3">
                  ${formatPrice(coin.marketCap)}
                </h1>
              </div>
              <div className="mr-5">
                <h1 className="text-gray-500">24h Volume</h1>
                <h1 className="text-2xl mt-3">
                  ${formatPrice(coin["24hVolume"])}
                </h1>
              </div>
            </div>
          </div>
          <div className="">
            <div className="">
              <h1 className="text-3xl my-5">About</h1>
              {parse(coin.description)}
            </div>
            <div>
              <h1 className="text-3xl my-5">Links</h1>
              <a
                href={coin.websiteUrl}
                rel="noreferrer"
                target="_blank"
                className="underline cursor-pointer text-blue-600"
              >
                {coin.name}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SelectedToken;
