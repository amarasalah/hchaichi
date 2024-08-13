const MaterialType = require("../models/MaterialType");
const fs = require("fs");
const path = require("path");


/**-----------------------------------------------
 * @desc    Create new material type
 * @route   /product/addmaterialtype
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
const AddMaterialTypeCtrl = async (req, res) => {
  const formData = req.body;
  //console.log(req.body);
  //console.log(req.files);
  const avatarMaterialType = req.file ? req.file.filename : null;
  try {
    const newMaterialType = new MaterialType({
      materialType_name: formData.materialType_name,
      materialTypedescription: formData.materialTypedescription,
      material: formData.material,
      avatarMaterialType: avatarMaterialType
    });

    await newMaterialType.save();

    return res
      .status(201)
      .json({
        message: "Material Type Added Successfully",
        material: newMaterialType
      });
  } catch (error) {
    console.error("Error adding material type:", error);

    const imagePath = req.file ? path.join(__dirname, "..", "uploads", "MaterialType", avatarMaterialType) : null;
    // Remove the uploaded file if there was an error
    if (imagePath && fs.existsSync(imagePath)) {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res
      .status(500)
      .json({ message: "There was an error adding the material type!" });
  }
};

/**-----------------------------------------------
 * @desc    Get All Material Types with pagination
 * @route   /product/materialtypes
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
/*  const getMaterialTypesWithPginationCtrl = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const skip = (page - 1) * limit;
  
      const materialtypes = await MaterialType.find({})
                                .skip(Number(skip))
                                .limit(Number(limit));
  
      const totalMaterials = await Material.countDocuments();
  
      return res.status(200).json({
        materialtypes,
        totalMaterials,
        totalPages: Math.ceil(totalMaterials / limit),
        currentPage: Number(page)
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching material types', error });
    }
  }; */

/**-----------------------------------------------
 * @desc    Get All Materials no pagination
 * @route   /product/order/materials
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getMaterialTypesCtrl = async (req, res) => {
    try {
      const materialtypes = await MaterialType.find({});
      return res.status(200).json({
        materialtypes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching material types', error });
    }
  };



/**-----------------------------------------------
 * @desc    Get All MaterialTypes with pagination
 * @route   /product/materialtypes
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getMaterialTypesWithPginationCtrl = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const filterStatus = req.query.status || "";

  try {
    const query = {};

    if (search) {
      query.$or = [
        { materialType_name: { $regex: search, $options: "i" } },
      ];
    }

    if (filterStatus) {
      query.status = filterStatus;
    }

    const materialtypes = await MaterialType.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await MaterialType.countDocuments(query); // Use the same query for counting documents

    return res.json({
      materialtypes,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching material types', error });
  }
  };

/**-----------------------------------------------
 * @desc    Delete materialtype by ID
 * @route   /product/deletematerialtype/:id
 * @method  DELETE
 * @access  private
 ------------------------------------------------*/
 const deleteMaterialType = async (req, res) => {
  const materialtypeId = req.params.id;

  try {
    const materialtype = await MaterialType.findById(materialtypeId);
    if (!materialtype) {
      return res.status(404).json({ message: "Material Type not found", result: false });
    }

    // Check if materialtype has an image and remove it
    if (materialtype.avatarMaterialType) {
      const imagePath = path.join(__dirname, "..", "uploads", "MaterialType", materialtype.avatarMaterialType);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await MaterialType.findByIdAndDelete(materialtypeId);

    return res.status(200).json({ message: "Material Type deleted successfully", result: true });
  } catch (error) {
    console.error("Error deleting material type:", error);
    return res.status(500).json({ message: "Internal server error.", result: false });
  }

};


/**-----------------------------------------------
 * @desc    Get materialtype by ID
 * @route   /product/materialtype/:id
 * @method  GET
 * @access  private
 ------------------------------------------------*/
const getMaterialTypeByID = async (req, res) => {
  const materialtypeId = req.params.id;

  try {
    // Find the material type by ID
    const materialtype = await MaterialType.findById(materialtypeId);

    if (!materialtype) {
      return res.status(404).json({ message: "Material Type not found", result: false });
    }

    return res.status(200).json({
      message: "Material Type fetched successfully",
      material: materialtype
    });
  } catch (error) {
    console.error("Error fetching material type:", error);
    return res.status(500).json({ message: "There was an error fetching the material type!" });
  }
};



/**-----------------------------------------------
 * @desc    Update materialtype by ID
 * @route   /product/materialtype/:id
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 const UpdateMaterialTypeByID = async (req, res) => {
  const materialtypeId = req.params.id;
  //console.log(materialtypeId);
  //console.log(req.body);
  const avatarMaterialType = req.file ? req.file.filename : null;
  //console.log(avatarMaterialType);

  //console.log('------------------------------');

  const formData = req.body;

  try {
    // Find the existing material type
    const materialtype = await MaterialType.findById(materialtypeId);
    if (!materialtype) {
      return res.status(404).json({ message: "Material Type not found", result: false });
    }

    // If there's a new avatar, delete the old one
    if (avatarMaterialType && materialtype.avatarMaterialType) {
      const oldImagePath = path.join(__dirname, "..", "uploads", "MaterialType", materialtype.avatarMaterialType);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the material type with new data
    materialtype.materialType_name = formData.materialType_name || materialtype.materialType_name;
    materialtype.materialTypedescription = formData.materialTypedescription || materialtype.materialTypedescription;
    materialtype.material = formData.material || materialtype.material;
    materialtype.avatarMaterialType = avatarMaterialType || materialtype.avatarMaterialType;

    await materialtype.save();

    return res.status(200).json({
      message: "Material Type updated successfully",
      material: materialtype
    });
  } catch (error) {
    console.error("Error updating material type:", error);

    // Remove the uploaded file if there was an error
    if (avatarMaterialType) {
      const imagePath = path.join(__dirname, "..", "uploads", "MaterialType", avatarMaterialType);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(500).json({ message: "There was an error updating the material type!" });
  }

};












module.exports = {UpdateMaterialTypeByID, AddMaterialTypeCtrl,getMaterialTypesCtrl, getMaterialTypesWithPginationCtrl, deleteMaterialType,getMaterialTypeByID};

