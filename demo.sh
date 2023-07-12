# change the network name to deploy to a different network
# based on the hardhat.config.js file
network="localhost"    

# deploy tokens
yarn hardhat run scripts/deploy_yellow.js --network $network
yarn hardhat run scripts/deploy_red.js --network $network
yarn hardhat run scripts/deploy_blue.js --network $network

# deploy pool
yarn hardhat run scripts/deploy_pool.js --network $network

# feed pool
yarn hardhat run scripts/feed_pool.js --network $network
