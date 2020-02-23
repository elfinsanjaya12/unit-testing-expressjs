
const router = require('express').Router();
const { validateStore } = require("../middlewares/validator");
const { auth } = require('../middlewares/auth')
const {
  store,
  login,
  me,
  updateUser,
  deleteStore,
  index
} = require('../controllers/userController')

router.post("/", validateStore, store);
router.post("/login", login);
router.get("/me", auth, me);
router.get("/", auth, index);
router.put("/", auth, updateUser);
router.delete("/", auth, deleteStore);

module.exports = router;

