const router = require("express").Router();
const {SendEmail} = require('./../controllers/formController')

router.post("/sendemail", SendEmail);

module.exports = router;