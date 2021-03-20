import "regenerator-runtime/runtime.js";
import { contractFactory } from "@devprotocol/dev-kit";
import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers, waffle } from "hardhat";

import { abi as MarketAbi } from "../artifacts/contracts/IMarket.sol/IMarket.json";
import { abi as MarketFactoryAbi } from "../artifacts/contracts/IMarketFactory.sol/IMarketFactory.json";
import { abi as PropertyFactoryAbi } from "../artifacts/contracts/IPropertyFactory.sol/IPropertyFactory.json";
import { MARKET_FACTORY_ADDRESS, PROPERTY_FACTORY_ADDRESS } from "../constants";

import { IMarketFactory, IPropertyFactory } from "../typechain";

chai.use(solidity);
const { expect } = chai;
const provider = waffle.provider;

describe("integrate with dev protocol spec", function () {
  it("integrate with original market with dev protocol", async function () {
    const [signer] = await ethers.getSigners();

    // initialize mainnet forked factories
    const marketFactory = new ethers.Contract(MARKET_FACTORY_ADDRESS, MarketFactoryAbi, provider).connect(
      signer
    ) as IMarketFactory;
    const propertyFactory = new ethers.Contract(PROPERTY_FACTORY_ADDRESS, PropertyFactoryAbi, provider).connect(
      signer
    ) as IPropertyFactory;

    const MockMarketBehavior = await ethers.getContractFactory("MockMarketBehavior");
    // 1. Deploy behavior which implements IMarket-authenticate method
    const mockMarketBehavior = await MockMarketBehavior.deploy();
    const { hash } = await marketFactory.create(mockMarketBehavior.address);
    const txReceipt = await provider.getTransactionReceipt(hash);

    // get deployed market address from tx receipt
    const marketAddress = `0x${txReceipt.logs[0].topics[1].substring(26)}`;

    console.log(txReceipt);
    console.log(marketAddress);

    const market = new ethers.Contract(marketAddress, MarketAbi, provider).connect(signer) as IPropertyFactory;

    console.log(await market.behavior());

    // this is just create creator token without authentication
    // await propertyFactory.create("test", "test", signer.address);

    await propertyFactory.createAndAuthenticate(
      "creator token name",
      "creator token symbol",
      marketAddress, // deployed market
      "arg1",
      "arg2",
      "arg3"
    );
  });
});
