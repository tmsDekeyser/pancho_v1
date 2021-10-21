const DIFFICULTY = 3;

const STARTING_BALANCE = 100;
const DIVIDEND = 20;
const DIVIDEND_PTX = 4; //When applying per transaction based div and reward
const REWARD = 50;
const REWARD_PTX = 2;

const NOM_MULTIPLIER = 3;

const IP_BOOTSTRAP = 'zigurat-pancho-demo.herokuapp.com/';
const IP_PEER = '127.0.0.1';

const GENESIS_DATA = {
  index: 0,
  timestamp: 1000000,
  lastHash: '0xplaceholder',
  nonce: 0,
  hash: '',
  data: {
    knowledge: '0xknowledge',
    connector: '0xconnector',
    feedback: '0xfeedback',
  },
};

module.exports = {
  DIFFICULTY,
  STARTING_BALANCE,
  DIVIDEND,
  DIVIDEND_PTX,
  REWARD,
  REWARD_PTX,
  NOM_MULTIPLIER,
  IP_BOOTSTRAP,
  IP_PEER,
  GENESIS_DATA,
};
