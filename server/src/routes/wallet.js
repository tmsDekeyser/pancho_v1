const express = require('express');
const router = express.Router();
const {
  getWalletInfoMain,
  getWalletInfoByAddress,
  getContactsMain,
  postContactsMain,
  getUserBadges,
  getBadgesByAddress,
} = require('../controllers/walletController');

const { protect } = require('../middleware/auth');

//Routes

router.route('/wallet-info').get(protect, getWalletInfoMain);

router.route('/wallet-info/:address').get(getWalletInfoByAddress);

router.route('/badges').get(protect, getUserBadges);
// Does not strictly need to be protected, but we use to get user.

router.route('/badges/:address').get(getBadgesByAddress);

router
  .route('/contacts')
  .get(protect, getContactsMain)
  .post(protect, postContactsMain);

module.exports = router;
