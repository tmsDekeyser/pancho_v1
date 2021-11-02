# Pancho demo application

A local simulation of a blockchain where a bootstrapping server and multiple peers can function as full nodes in a peer-to-peer network, mining blocks, posting and verifying cryptocurrency transactions and keeping a distributed ledger synced across the p2p network.

It uses the square money principle where coins or tokens are exchanged normally, but every transaction from sender to recipient also increases every participant's so-called flow, which stores most of the value, parameter equally. This way a system is set up where both parties are rewarded for setting up a transaction.

Additionally, with the mining of each block, not only a mining reward is handed out but also a dividend to every known address that has been involved in a transaction recorded on the blockchain.

API endpoints documentation is provided here: https://documenter.getpostman.com/view/9743412/UV5RnLcP#a94d450d-3372-447b-9962-98d8c409f5eb when using authentication, https://documenter.getpostman.com/view/9743412/UV5RnLcP#a94d450d-3372-447b-9962-98d8c409f5eb when using no authentication. You can run it in Postman and use Environments to easily switch between different peers.

Different modes of operation are possible, based on possible combinations of the NODE_ENV and PEER environment variables. A summary is given below for each of the 4 quadrants.

For all modes, first clone the repository and run `npm install` from the root directory.

Demo Videos:
https://www.loom.com/share/32573c38868f4def91dfd7ca31081fb4
https://www.loom.com/share/562c32c6c3e9491d9d3fb40c41bdc1bc

# Bootstrapping server in production

Run the `npm start` command, this will run the application with `NODE_ENV = production`and `PEER = false`.

In the client folder, we need to check the constants.js file. Here we need to fill in the projects domain as the API_URL constant. The NO_AUTH parameter has to stay false.

In the server folder, we have a similar file with constants: config/config.js. There, IP_BOOTSTRAP has to be set to the url (without protocol) or IP address of the domain you use.

Also in the server/config folder, we have to change the EDIT_default.json and EDIT_production.json files: rename them to default.json and production.json and fill in the missing parameters (the mongoURI for the database you use to store user profiles and JWT_SECRET for the json web tokens).

(Optional: in the server/src/local folder you can remove all the text files that have a port number added, only keeping blockchainJSON.txt and walletJSON.txt)

# Peer in production

Run the `npm run start-peer` command, this will run the application with `NODE_ENV = production`and `PEER = true`.

In the client folder, we need to check the constants.js file. Here we need to fill in the projects domain as the API_URL constant. The NO_AUTH parameter has to be set to true if you want to use a local version of the web app frontend.

In the server folder, we have a similar file with constants: config/config.js. There, IP_BOOTSTRAP has to be set to the url (without protocol) or IP address of the domain you use and IP_PEER is set to your own IP address or localhost.

(Optional: In the server/config folder, we can remove the EDIT_default.json and EDIT_production.json files as we are not running the deployed web application.)

(Optional: in the server/src/local folder you can remove all the text files that have a port number added, only keeping blockchainJSON.txt and walletJSON.txt)

# Bootstrapping server in development

Run the `npm run dev` command, this will run the application with `NODE_ENV = development`and `PEER = false`.

In the client folder, we need to check the constants.js file. Here we need to fill in localhost as the API_URL constant. The NO_AUTH parameter has to stay false.

In the server folder, we have a similar file with constants: config/config.js. It is pre-configured for development, nothing needs to be changed.

Also in the server/config folder, we have to change the EDIT_default.json and file: rename them to default.json and fill in the missing parameters (the mongoURI for the database you use to store user profiles and JWT_SECRET for the json web tokens). The production files can be deleted.

(Optional: in the server/src/local folder you can remove the text files that do not have a port number added, this means deleting blockchainJSON.txt and walletJSON.txt)

# Peer in development

Run the `npm run dev-peer` command, this will run the application with `NODE_ENV = development`and `PEER = true`.

In the client folder, we need to check the constants.js file. Here we need to fill in localhost as the API_URL constant. The NO_AUTH parameter has to be set to true.

In the server folder, we have a similar file with constants: config/config.js. It is pre-configured for development, nothing needs to be changed.

(Optional: In the server/config folder, we can remove the EDIT_default.json and EDIT_production.json files as we are not running the deployed web application.)

(Optional: in the server/src/local folder you can remove the text files that do not have a port number added, this means deleting blockchainJSON.txt and walletJSON.txt)
