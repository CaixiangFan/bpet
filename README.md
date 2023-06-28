# BPET
Blockchain-based peer-to-peer energy trading system!

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