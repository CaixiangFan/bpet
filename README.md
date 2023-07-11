# BPET
This repo contains all components of a blockchain-based peer-to-peer energy trading system.
Go [here](https://youtu.be/znqniwMcKd0) to watch a demonstration of the BPET system.
- back: The backend of BPET created by `NestJs` provides all microservices including `admin, etk, poolmarket, and registry`. It provides services to frontend via a `gateway`.
- contracts: BPET's smart contracts developed with `Hardhat` include `EnergyToken, Payment, PoolMarket, and Registry`.
- front: The frontend web application developed with `NextJs`.
# Deploy
1. Check if local Besu blockchain network is running.
```
docker ps
```
2. Run a local Besu network. Enter `quorum-test-network` directory and run
```
./run
```
3. Write `Deployer.s.sol` and deploy `bpet` smart contracts
```
forge script script/Deployer.s.sol:Deployer --fork-url http://localhost:8545 --broadcast

```
4. Launch `bpet` application.
