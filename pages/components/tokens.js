import Image from "next/image";
import { useContext } from "react";
import { coinDetails, coinsProvider } from "../_app";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { useRouter } from "next/router";

const Tokens = () => {
  const router = useRouter();
  const [coins, setCoins] = useContext(coinsProvider);
  const [viewCoin, setViewCoin] = useContext(coinDetails);
  
  return (
    <div className="tokens w-full">
      <div className="tokens-wrapper mx-auto">
        <div className="m-3">
          <h1 className="text-4xl">Top tokens</h1>
        </div>
        <div className="tokens-table w-full p-3">
          <div className="token-table-wrapper w-full h-full">
            <ul className="header flex justify-around lg:justify-start items-center" height="50">
              <li className="index text-gray-500">
                <p className="mx-auto w-fit">#</p>
              </li>
              <li className="token text-gray-500">
                <p className="mr-auto w-fit">Tokens</p>
              </li>
              <li className="price text-gray-500 hover:text-gray-600 cursor-pointer">
                <p className="ml-auto w-fit">Price</p>
              </li>
              <li className=" change text-gray-500 hover:text-gray-600 cursor-pointer">
                <p className="ml-auto w-fit">Change</p>
              </li>
            </ul>
            <ul>
              {coins
                ?.sort((a, b) => a.rank - b.rank)
                .slice(0, 49)
                .map((c, index) => {
                  return (
                    <li
                      className="token-row flex items-center"
                      key={index}
                      onClick={() => {
                        setViewCoin(c.uuid);
                        router.push(`tokens/${c.name}`);
                      }}
                    >
                      <ul className="w-full">
                        <li className="flex justify-around lg:justify-start">
                          <div className="index">
                            <p className="mx-auto w-fit">{index + 1}</p>
                          </div>
                          <div className="flex items-center token">
                            <figure className="mr-1">
                              <Image src={c.iconUrl} width={30} height={30} />
                            </figure>
                            <div className="flex flex-col ml-2">
                              <p className="">{c.name}</p>
                              <p className="text-gray-600 text-sm">{c.symbol}</p>
                            </div>
                          </div>
                          <div className="price">
                            <p className="ml-auto w-fit">
                              ${parseFloat(c.price).toFixed(2)}
                            </p>
                            <p className="ml-auto w-fit flex items-center change-sm">
                              {c.change}
                              {c.change > 0 ? (
                                <FiArrowUpRight
                                  className="text-green-500"
                                  size={15}
                                />
                              ) : (
                                <FiArrowDownRight
                                  className="text-red-500"
                                  size={15}
                                />
                              )}
                            </p>
                          </div>
                          <div className="change">
                            <p className="ml-auto w-fit flex items-center">
                              {c.change}
                              {c.change > 0 ? (
                                <FiArrowUpRight
                                  className="text-green-500"
                                  size={15}
                                />
                              ) : (
                                <FiArrowDownRight
                                  className="text-red-500"
                                  size={15}
                                />
                              )}
                            </p>
                          </div>
                        </li>
                      </ul>
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

export default Tokens;
