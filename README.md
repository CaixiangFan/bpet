# BPET

This repo contains all components of a blockchain-based peer-to-peer energy trading system.
Watch [this video](https://youtu.be/znqniwMcKd0) for a demonstration of the functioning BPET system.

- back: The backend of BPET created by `NestJs` provides all microservices including `admin, etk, poolmarket, and registry`. It provides services to frontend via a `gateway`.
- contracts: BPET's smart contracts developed with `Hardhat` include `EnergyToken, Payment, PoolMarket, and Registry`.
- front: The frontend web application developed with `NextJs`.

# Deploy

1. Check if local Besu blockchain network is running.

```
docker ps
```

2. Run a [local Besu network](https://github.com/Consensys/quorum-dev-quickstart/tree/master). Enter `quorum-test-network` directory and run

```
./run
```

3. Foundry: Write `Deployer.s.sol` and deploy `bpet` smart contracts:

```
forge script script/Deployer.s.sol:Deployer --fork-url http://localhost:8545 --broadcast

```

Hardhat: run `scripts/1-deploy.ts` to deploy contracts.

4. Go to each component folder and install JavaScript dependencies:

```
yarn install
```

5. Go to `front` and manually build the `.next` application:

```
yarn next build
```

6. Add proper environment varibles to `.env` files in each component folder. Use `docker compose` to launch the `bpet` application:

```
docker compose up -d
```

The first time to launch the application may take a few minutes to build images.

7. (optional) Bring down all services:

```
docker compose down
```
