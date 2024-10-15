require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Change to 8545 if using Ganache CLI
      accounts: [
        "0xba6694589138085592b020a9469284b1271a2e666e58dd274d5aff7231c8cfa9",
       "0xbdf6bdaf1fe6d8dce14bc67186ddca0cd6bc849aaf8f47a0372a81074643ec47",
       "0x888d91371e949626d113f66d6f8dea7d66d3c524d846efe3e16a97a41b0fb583",
       "0x8f31e46f960c4a9080197b03101b46772d427d1b55d2d2913337257ff35cceb0",
       "0x351dc8b66882d508cd41a082fa8785f48917606401356999faccc52d89f44cd8",
       "0x6670b00b6449343c85fd18f23d2d2f7990f87eaa4c01bd4dfdb49f42c5041b38",
      ],
    },
  },
};
