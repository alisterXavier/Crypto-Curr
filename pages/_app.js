import { createContext, useEffect, useState } from "react";
import "../styles/globals.css";
import "../styles/globals.sass";
import Navbar from "./components/Navbar";
import axios from "axios";
import Router, { useRouter } from "next/router";

export const coinsProvider = createContext();
export const coinDetails = createContext();

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [coins, setCoins] = useState();
  const [viewCoin, setViewCoin] = useState();

  const options = {
    method: "GET",
    url: "https://coinranking1.p.rapidapi.com/coins",
    params: {
      referenceCurrencyUuid: "yhjMzLPhuIDl",
      timePeriod: "24h",
      "tiers[0]": "1",
      orderBy: "marketCap",
      orderDirection: "desc",
      limit: "50",
      offset: "0",
    },
    headers: {
      "X-RapidAPI-Key": "b34fac19dbmshb7bbf2f06859223p1a2ed9jsn1c8a3226d741",
      "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
    },
  };

  const getCoins = async () => {
    axios
      .request(options)
      .then(function (response) {
        setCoins(response.data.data.coins);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    const {pathname} = Router
    if(pathname === '/'){
      Router.push('components/swap')
    }
  })
  useEffect(() => {
    if(viewCoin){
      router.push(`/components/tokens/${viewCoin}`)
    }
  }, [viewCoin])

  useEffect(() => {
    getCoins()
  }, []);
  return (
    <coinsProvider.Provider value={[coins, setCoins]}>
      <coinDetails.Provider value={[viewCoin, setViewCoin]}>
        <Navbar />
        <Component {...pageProps} />
      </coinDetails.Provider>
    </coinsProvider.Provider>
  );
}

export default MyApp;
