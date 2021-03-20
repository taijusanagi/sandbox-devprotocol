import { contractFactory } from "@devprotocol/dev-kit";
import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

chai.use(solidity);
const { expect } = chai;

describe("integrate with dev protocol", function () {
  it("check", async function () {
    console.log(contractFactory);
  });
});
