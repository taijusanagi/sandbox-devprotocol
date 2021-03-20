import "regenerator-runtime/runtime.js";

import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers, waffle } from "hardhat";

import { abi as DevAbi } from "../artifacts/contracts/interface/devprotocol/IDev.sol/IDev.json";
import { abi as MarketAbi } from "../artifacts/contracts/interface/devprotocol/IMarket.sol/IMarket.json";
import { abi as MarketFactoryAbi } from "../artifacts/contracts/interface/devprotocol/IMarketFactory.sol/IMarketFactory.json";
import { abi as PropertyFactoryAbi } from "../artifacts/contracts/interface/devprotocol/IPropertyFactory.sol/IPropertyFactory.json";
import { abi as VoteCounterAbi } from "../artifacts/contracts/interface/devprotocol/IVoteCounter.sol/IVoteCounter.json";

import { abi as UniswapV2Router01 } from "../artifacts/contracts/interface/uniswap/IUniswapV2Router01.sol/IUniswapV2Router01.json";

import {
  DEV_ADDRESS,
  SAMPLE_PROPERTY_ADDRESS,
  MARKET_FACTORY_ADDRESS,
  PROPERTY_FACTORY_ADDRESS,
  VOTE_COUNTER_ADDRESS,
  UNISWAP_V2_ROUTER_ADDRESS,
  MOCK_DEAD_LINE,
} from "../constants";

import { IDev, IMarket, IMarketFactory, IPropertyFactory, IVoteCounter, IUniswapV2Router01 } from "../typechain";

chai.use(solidity);
const { expect } = chai;
const provider = waffle.provider;

describe("integrate with dev protocol spec", function () {
  it("integrate with original market with dev protocol", async function () {
    const [signer] = await ethers.getSigners();

    const dev = new ethers.Contract(DEV_ADDRESS, DevAbi, provider).connect(signer) as IDev;
    const marketFactory = new ethers.Contract(MARKET_FACTORY_ADDRESS, MarketFactoryAbi, provider).connect(
      signer
    ) as IMarketFactory;
    const propertyFactory = new ethers.Contract(PROPERTY_FACTORY_ADDRESS, PropertyFactoryAbi, provider).connect(
      signer
    ) as IPropertyFactory;
    const voteCounter = new ethers.Contract(VOTE_COUNTER_ADDRESS, VoteCounterAbi, provider).connect(
      signer
    ) as IVoteCounter;
    const uniswapV2Router = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, UniswapV2Router01, provider).connect(
      signer
    ) as IUniswapV2Router01;

    // simple swap logic, 1 ETH should be much enough to get 100 DEV at 2021-Mar-20
    const swapOutputDevAmount = "100000000000000000000"; // 100DEV
    const halfDevAmount = "50000000000000000000"; // 50DEV for voting power, 15DEV for new property staking
    const ethAmount = "1000000000000000000"; // 1ETH

    const wethAddress = await uniswapV2Router.WETH();
    const path = [wethAddress, DEV_ADDRESS];
    await uniswapV2Router.swapETHForExactTokens(swapOutputDevAmount, path, signer.address, MOCK_DEAD_LINE, {
      value: ethAmount,
    });

    await dev.deposit(SAMPLE_PROPERTY_ADDRESS, halfDevAmount);
    const MockMarketBehavior = await ethers.getContractFactory("MockMarketBehavior");

    // 1. Deploy behavior which implements IMarket-authenticate method
    const mockMarketBehavior = await MockMarketBehavior.deploy();
    const marketFactoryCreateTx = await marketFactory.create(mockMarketBehavior.address);
    const marketFactoryCreateTxReceipt = await provider.getTransactionReceipt(marketFactoryCreateTx.hash);
    const marketAddress = `0x${marketFactoryCreateTxReceipt.logs[0].data.substring(26)}`;

    // this is to check market is deployed properly
    const market = new ethers.Contract(marketAddress, MarketAbi, provider).connect(signer) as IMarket;
    expect(await market.behavior()).to.equal(mockMarketBehavior.address);

    await voteCounter.voteMarket(marketAddress, SAMPLE_PROPERTY_ADDRESS, true);
    expect(await market.enabled()).to.equal(true);

    const name = "name";
    const symbol = "symbol";
    const repository = "repository";
    const propertyCreateAndAuthenticateTx = await propertyFactory.createAndAuthenticate(
      name,
      symbol,
      marketAddress, // deployed market
      repository,
      "",
      ""
    );
    const propertyCreateAndAuthenticateTxReceipt = await provider.getTransactionReceipt(
      propertyCreateAndAuthenticateTx.hash
    );
    const propertyAddress = propertyCreateAndAuthenticateTxReceipt.logs[2].data.substring(26);
    await mockMarketBehavior.register(repository, marketAddress, propertyAddress);
    await dev.deposit(propertyAddress, halfDevAmount);
  });
});
