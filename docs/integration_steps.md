### Steps

1. Deploy behavior which implements IMarket-authenticate method

2. Market Factory creates new market with deployed config and market behavior created in 1

   - https://etherscan.io/address/0xe91fbfd66136e693e8d4c9d58be827e798e68605#code
   - MarketFactory->create(behaviorAddress)
   - this gives you create market contract address

3. Get Dev for voting

4. Vote for market approve

5. PropertyFacotry calls createAndAuthenticate, which calls market created in 1 authenticateFromPropertyFactory
   - this authenticateFromPropertyFactory calls behavior authenticate which is implemented in 1
