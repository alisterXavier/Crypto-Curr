import { FiSettings } from "react-icons/fi";
import { TfiAngleDown } from "react-icons/tfi";
import { HiOutlineXMark } from "react-icons//hi2";
import { AiOutlineSearch } from "react-icons/ai";
import { useContext, useEffect, useRef, useState } from "react";
import { coinsProvider } from "../_app";
import Image from "next/image";
import axios from "axios";

const api = "692E1298-4A04-4DDB-AAD3-861BA8138CA7";
var convertTimeout = 0;

const Swap = () => {
  const [coins, setCoins] = useContext(coinsProvider);
  const [fromCoin, setFromCoin] = useState();
  const [toCoin, setToCoin] = useState();
  const [selectCoin, setSelectCoin] = useState();
  const [swap, setSwap] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const currChange = useRef();
  const fromRef = useRef();
  const toRef = useRef();

  const convertApi = (from = fromCoin.symbol, to = toCoin.symbol, id) => {
    if (convertTimeout) clearTimeout(convertTimeout);
    convertTimeout = setTimeout(async () => {
      await axios
        .get(
          `https://rest.coinapi.io/v1/exchangerate/${from}/${to}?apikey=${api}`
        )
        .then((res) => {
          var amt;
          setIsConverting(false);
          if (id === "to") {
            amt = res.data.rate * toRef.current.value;
            fromRef.current.value = amt.toFixed(2);
          } else {
            amt = res.data.rate * fromRef.current.value;
            toRef.current.value = amt.toFixed(2);
          }
        });
    }, 1500);
  };

  const convertion = async (e) => {
    var to, from;
    var id = e.currentTarget.getAttribute("data-input");
    if (fromCoin && toCoin) {
      if (id === "from") {
        from = fromCoin.symbol;
        to = toCoin.symbol;
      } else {
        from = toCoin.symbol;
        to = fromCoin.symbol;
      }
      setIsConverting(true);
      convertApi(from, to, id);
    }
  };

  const handleClick = (e) => {
    currChange.current = e.currentTarget.getAttribute("data-coin");
    toggleCoinSelection();
  };

  const handelSwap = () => {
    const value = !swap;
    setSwap(value);
  };

  const toggleCoinSelection = (e) => {
    setSelectCoin(!selectCoin);
  };

  const changeCoin = (e) => {
    const value = coins.filter(
      (c) => c.uuid === e.currentTarget.getAttribute("data-selected")
    );
    const set = {
      to: () => {
        setToCoin(value[0]);
      },
      from: () => {
        setFromCoin(value[0]);
      },
    };
    set[currChange.current]();
    toggleCoinSelection();
  };

  useEffect(() => {
    if (
      fromCoin &&
      toCoin &&
      (fromRef.current.value > 0 || toRef.current.value > 0)
    ) {
      if (swap) convertApi(toCoin.symbol, fromCoin.symbol, "to");
      else convertApi(undefined, undefined, "from");
    }
  }, [fromCoin, toCoin]);
  
  return (
    <div className="container flex justify-center items-center p-5">
      <div className="bg-black swap-wrapper p-2 flex flex-col ">
        <div className="flex justify-between items-center w-full my-2">
          <h1 className="font-semibold">Swap</h1>
          <FiSettings size={20} className="cursor-pointer" />
        </div>
        <div
          className={`relative flex flex-col ${
            swap ? "flex-col-reverse" : ""
          } items-center`}
        >
          <label className="convert-input relative mx-3 my-1 flex pl-5">
            <input
              type="text"
              className={`bg-transparent text-3xl font-semibold ${
                selectCoin && "disable-user"
              }`}
              data-input="from"
              placeholder="0"
              ref={fromRef}
              onChange={convertion}
            />
            <div
              className="from-cypto-options crypto-options text-xl absolute flex items-center"
              onClick={handleClick}
              data-coin="from"
              style={{ backgroundColor: !fromCoin && "#4c82fb" }}
            >
              {fromCoin ? (
                <span className="flex items-center">
                  <figure className="mr-1">
                    <Image src={fromCoin.iconUrl} width={25} height={25} />
                  </figure>
                  <p className="font-semibold mr-2">{fromCoin.symbol}</p>
                </span>
              ) : (
                <p>Select a token</p>
              )}
              <TfiAngleDown className="ml-1" size={15} />
            </div>
          </label>
          <label className="convert-input relative mx-3 flex pl-5">
            <input
              type="text"
              className={`bg-transparent text-3xl font-semibold ${
                selectCoin && "disable-user"
              }`}
              placeholder="0"
              ref={toRef}
              data-input="to"
              onChange={convertion}
            />
            <div
              className="to-cypto-options crypto-options text-xl absolute flex items-center"
              style={{ backgroundColor: !toCoin && "#4c82fb" }}
              onClick={handleClick}
              data-coin="to"
            >
              {toCoin ? (
                <span className="flex items-center">
                  <figure className="mr-1">
                    <Image src={toCoin.iconUrl} width={25} height={25} />
                  </figure>
                  <p className="font-semibold mr-2">{toCoin.symbol}</p>
                </span>
              ) : (
                <p>Select a token</p>
              )}
              <TfiAngleDown className="ml-1" size={15} />
            </div>
          </label>
          <div
            className="switch absolute top-1/2 left-1/2"
            onClick={handelSwap}
          >
            <TfiAngleDown size={20} />
          </div>
        </div>
        <button className="font-semibold connect-wallet my-2">
          Connect Wallet
        </button>
      </div>
      <div
        className={`cryptos-wrapper fixed z-20 justify-center items-center ${
          selectCoin && "active"
        }`}
        onClick={toggleCoinSelection}
      >
        <div
          className="cryptos flex flex-col justify-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex items-center justify-between p-5">
            <h1>Select a token</h1>
            <HiOutlineXMark
              size={20}
              onClick={toggleCoinSelection}
              className="cursor-pointer"
            />
          </div>
          <div className="flex justify-start flex-col items-center">
            <div className="search-token relative w-full px-2">
              <label className="flex">
                <AiOutlineSearch size={20} />
                <input
                  type="text"
                  className="bg-transparent"
                  placeholder="Search name or paste address"
                />
              </label>
            </div>
            <ul className="flex flex-wrap">
              <li className="p-5 cursor-pointer">ETH</li>
              <li className="p-5 cursor-pointer">DAI</li>
              <li className="p-5 cursor-pointer">USDC</li>
              <li className="p-5 cursor-pointer">WBTC</li>
              <li className="p-5 cursor-pointer">WETH</li>
              <li className="p-5 cursor-pointer">USDT</li>
            </ul>
            <div
              className="divider"
              style={{ backgroundColor: "#232632" }}
            ></div>
            <ul className="coins-list w-full ">
              {coins?.map((c, index) => {
                return (
                  <li
                    key={c.symbol}
                    className="flex cursor-pointer"
                    data-selected={c.uuid}
                    onClick={changeCoin}
                  >
                    <figure className="mx-3 items-center py-3">
                      <Image src={c.iconUrl} width={35} height={35} />
                    </figure>
                    <div>
                      <p className="font-semibold text-xl">{c.name}</p>
                      <p className="text-gray-500 text-sm font-thin">
                        {c.symbol}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
