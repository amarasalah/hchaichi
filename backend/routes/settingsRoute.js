const router = require("express").Router();
const createMulterConfig = require('./../config/multerConfig');
const getImg = require("./../utils/getImage");



const {AddMotherMaterialSettings,DeleteMotherMaterialSettings,GetMotherMaterials,settingsGeneral,GetsettingsGeneral, getInvoiceSettings, updateInvoiceSettings,} = require('./../controllers/settingsController');// saveInvoiceSettings


router.get('/image/:filename', (req, res) => getImg(req, res, "uploads/Settings")); //getShapesImg
const upload = createMulterConfig('uploads/Settings/');

router.put("/general", settingsGeneral);
router.get("/general", GetsettingsGeneral);


router.get('/invoice', getInvoiceSettings);
router.put('/invoice', upload.single('logo'), updateInvoiceSettings);
//router.post('/invoice', upload.single('logo'), saveInvoiceSettings);

router.get("/mother-material", GetMotherMaterials);
router.delete("/mother-material/:id", DeleteMotherMaterialSettings);
router.post("/mother-material", AddMotherMaterialSettings);

module.exports = router;