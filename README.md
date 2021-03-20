### Contracts

checked following contract for PoC

- Dev
  https://etherscan.io/address/0x5caf454ba92e6f2c929df14667ee360ed9fd5b26#code

  - deposit (creatorTokenAddress, amount)
  - this check Config-lockup-lockup

- Config Address
  https://etherscan.io/address/0x1d415aa39d647834786eb9b5a333a50e9935b796#code

- Lockup
  https://etherscan.io/address/0x1440ac02e0f8a8bbe1451d98a2a6b14b6f0179b7#code

  - lockup validate msg.sender with config.token()=>Dev
  - lockup validate value is more than 0
  - lockup validate MetricsGroup hasAsset

- MetricsGroup
  https://etherscan.io/address/0xaaaf40aecb4dd88a77fc9f6dae1de34da5f18c94#code

  - hasAsset check key=>keccak256(abi.encodePacked("metricsCountPerProperty", property)) with EternalStorage getUint > 0
  - addGroup -> setMetricsCountPerProperty set the Uint
  - addGroup validate msg.sender is metricsFactory

- MetricsFactory
  https://etherscan.io/address/0xb6eb37095ae1a28aa320b9a9730f8cde8000f6d2

  - create calls addGroup
  - create validates is included in the Market address set with address validator validateGroup
  - validateGroup checks Group isGroup, deposit case -> Market group

- MarketGroup
  https://etherscan.io/address/0x3fdbb6869da47eed4de324cb0658fa2fd5f679af#code

  - isGroup checks eternal storage bool for the input address
  - addGroup sets above eternal storage bool for the addess
  - addGroup validates msg.sender is market factory

- MarketFactory
  https://etherscan.io/address/0xe91fbfd66136e693e8d4c9d58be827e798e68605#code

  - create market and set market into market group
  - so market can call metrics create

- EternalStorage
  https://etherscan.io/address/0x7f5fc5e49f7ecded3d361ef739619ecb760dcd0b#code

  - only owner can set uint for property
  - owner is Metrics Group

- PropertyFactory
  https://etherscan.io/address/0x9dfd67bf97dc48acdfbf75ad814e158816f98b0b#code

  - createAndAuthenticate creates creator token
  - createAndAuthenticate calls Market-authenticateFromPropertyFactory

- Market
  https://etherscan.io/address/0x34a7adc94c4d41c3e3469f98033b372cb2faf318#code

  - authenticateFromPropertyFactory for PropertyFactory create creator token

    - validates msg.sender is Propetyfactory
    - requires this contract is enabled
    - calls behavior-authenticate

  - authenticatedCallback calls MetricsFactory create
  - authenticatedCallback checkes sender is behavior

- Behavior (Github Market)
  https://etherscan.io/address/0x3cb902625a2b38929f807f9c841f7aecbbce7702#code

- Creator Token Sample (HiDe)
  https://etherscan.io/address/0x528010540517dd3b708d8ff7036f841fea0135b2#code

  - default token allocation is 95% creator and 5 % for project owner
    https://etherscan.io/token/0x528010540517dd3b708d8ff7036f841fea0135b2#balances
