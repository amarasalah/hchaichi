const router = require("express").Router();
const createMulterConfig = require('./../config/multerConfig');
const getImg = require("./../utils/getImage");


//shape
const upload = createMulterConfig('uploads/shape/');
//const { addShapeCtrl, deleteShapeCtrl, getShapesCtrl,getShapesImg,getShapesWithPginationCtrl, upload } = require('../controllers/shapeController');
const { UpdateShapeByID,getShapeByID,addShapeCtrl, deleteShapeCtrl, getShapesCtrl,getShapesWithPginationCtrl} = require('../controllers/shapeController');
// Route to get image by name
router.get('/image/shape/:filename', (req, res) => getImg(req, res, "uploads/shape")); //getShapesImg
//route to get all shapes
router.get('/shapes', getShapesWithPginationCtrl);
router.get('/order/shapes', getShapesCtrl);
router.post('/addshape', upload.fields([{ name: 'avatarShape' }, { name: 'avatarEdge' }, { name: 'avatarAngles' }, { name: 'avatarDimensions' }]), addShapeCtrl);
router.delete('/deleteshape/:id', deleteShapeCtrl);
router.get('/shape/:id', getShapeByID);
router.put('/shape/:id', upload.fields([{ name: 'avatarShape' }, { name: 'avatarEdge' }, { name: 'avatarAngles' }, { name: 'avatarDimensions' }]), UpdateShapeByID);


//material
const {UpdateMaterialByID,getMaterialByID,AddMaterialCtrl,getMaterialsWithPginationCtrl,getMaterialsCtrl,deleteMaterial} = require("../controllers/materialController");
const uploadM = createMulterConfig('uploads/Material/');
// Route to get image by name
router.get('/image/material/:filename', (req, res) => getImg(req, res, "uploads/Material"));
router.post("/addmaterial", uploadM.single('avatarMaterial'),AddMaterialCtrl);
router.get('/materials', getMaterialsWithPginationCtrl);
router.get('/order/materials', getMaterialsCtrl);
// Route to delete a material by ID
router.delete("/deletematerial/:id",deleteMaterial);
router.get('/material/:id', getMaterialByID);
router.put('/material/:id', uploadM.single('avatarMaterial'), UpdateMaterialByID);



//material type
const {UpdateMaterialTypeByID,AddMaterialTypeCtrl,getMaterialTypesCtrl,getMaterialTypesWithPginationCtrl,deleteMaterialType,getMaterialTypeByID} = require("../controllers/materialtypeController");
const uploadMT = createMulterConfig('uploads/MaterialType/');
// Route to get image by name
router.get('/image/materialtype/:filename', (req, res) => getImg(req, res, "uploads/MaterialType"));
router.post("/addmaterialtype", uploadMT.single('avatarMaterialType'),AddMaterialTypeCtrl);
/* router.get('/materialtypes', getMaterialTypesWithPginationCtrl); */
router.get('/order/materialtypes', getMaterialTypesCtrl);
router.get('/materialtypes', getMaterialTypesWithPginationCtrl);
// Route to delete a materialtype by ID
router.delete("/deletematerialtype/:id",deleteMaterialType);
router.get('/materialtype/:id', getMaterialTypeByID);
router.put('/materialtype/:id', uploadMT.single('avatarMaterialType'), UpdateMaterialTypeByID);


//angle
const {getAngleByID,UpdateAngleByID ,AddAngleCtrl,getAnglesWithPginationCtrl,getAnglesCtrl,deleteAngle} = require("./../controllers/angleController");
const uploadA = createMulterConfig('uploads/Angle/');
// Route to get image by name
router.get('/image/angle/:filename', (req, res) => getImg(req, res, "uploads/Angle"));
router.post("/addangle", uploadA.single('avatarAngle'),AddAngleCtrl);
router.get('/angles', getAnglesWithPginationCtrl);
router.get('/order/angles', getAnglesCtrl);
// Route to delete a angle by ID
router.delete("/deleteangle/:id",deleteAngle);
router.get('/angle/:id', getAngleByID);
router.put('/angle/:id', uploadA.single('avatarAngle'), UpdateAngleByID);


//edge
const {UpdateEdgeByID,getEdgeByID,AddEdgeCtrl,getEdgesWithPginationCtrl,getEdgesCtrl,deleteEdge} = require("./../controllers/edgeController");
const uploadE = createMulterConfig('uploads/Edge/');
// Route to get image by name
router.get('/image/edge/:filename', (req, res) => getImg(req, res, "uploads/Edge"));
router.post("/addedge", uploadE.single('avatarEdge'),AddEdgeCtrl);
router.get('/edges', getEdgesWithPginationCtrl);
router.get('/order/edges', getEdgesCtrl);
// Route to delete a edge by ID
router.delete("/deleteedge/:id",deleteEdge);
router.get('/edge/:id', getEdgeByID);
router.put('/edge/:id', uploadE.single('avatarEdge'), UpdateEdgeByID);


//order
const uploadO = createMulterConfig('uploads/Order/');
router.get('/image/order/:filename', (req, res) => getImg(req, res, "uploads/Order"));
const {DeleteFileCtrl, UpdateFileNameCtrl,GetOrderIDCtrl,UpdateOrderCtrlbyuser,DeleteOrderCtrlbyuser,orderprice,orderuserverif,userverifexist, saveOrder, getOrdersWithPginationCtrl,CancelOrder, GetOrderCtrl, ApproveorderOrderCtrl, DeclineorderOrderCtrl, GetOrderCtrlbyuser} = require('./../controllers/orderController');
router.post("/orderprice", orderprice);
router.get("/userorderverif/:id", orderuserverif);
router.get("/userexists/:id", userverifexist);
//router.post("/saveorderdata/:userId", saveOrder);
router.post("/saveorderdata/:userId", uploadO.array('files', 10), saveOrder);

router.get('/orders', getOrdersWithPginationCtrl);
router.get('/allorders', getOrdersWithPginationCtrl);
router.post("/cancelorder/:id", CancelOrder);
router.get("/order/:id", GetOrderCtrl);
router.get("/orderdetails/:id", GetOrderIDCtrl);
router.get("/order/:id/:userId", GetOrderCtrlbyuser);

router.post("/approveorder",ApproveorderOrderCtrl);
router.post("/declineorder", DeclineorderOrderCtrl);

router.put("/order/:id", UpdateOrderCtrlbyuser);

router.put("/order/:id/file/:index", UpdateFileNameCtrl);
router.delete("/order/:id/file/:index", DeleteFileCtrl);

router.delete("/deleteorder/:id",DeleteOrderCtrlbyuser);

module.exports = router;

