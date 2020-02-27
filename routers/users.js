
const router = require('express').Router();
const { validateStore } = require("../middlewares/validator");
const { auth } = require('../middlewares/auth')
const {
  store,
  login,
  me,
  updateUser,
  deleteStore,
  index,
  updateItSelf,
  deleteItSelf
} = require('../controllers/userController')

router.post("/", validateStore, store);
router.post("/login", login);
router.get("/me", auth, me);
router.get("/", auth, index);
router.put("/", auth, updateItSelf);
router.put("/:idUser", auth, updateUser);
router.delete("/", auth, deleteItSelf);
router.delete("/:idUser", auth, deleteStore);

module.exports = router;

