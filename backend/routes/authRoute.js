const router = require("express").Router();
const {forgotPasswordCtrl, registerClientCtrl,verifyUserAccountCtrl,loginUserCtrl ,registergoogleClientCtrl,loginGoogleClientCtrl} = require("../controllers/authUserController");
 
router.post("/register", registerClientCtrl);
router.post("/google/register", registergoogleClientCtrl);

router.post("/login", loginUserCtrl);
router.post("/google/login", loginGoogleClientCtrl);

router.post("/:id/verify/:token", verifyUserAccountCtrl);

router.post("/forgot-password", forgotPasswordCtrl);


router.post('/signout', (req, res) => {
res.clearCookie('token');
return res.status(200).json({ message: 'Signed out successfully' });
});
  




module.exports = router;