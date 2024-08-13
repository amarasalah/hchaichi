const Material = require("../models/Material");
const fs = require("fs");
const path = require("path");

// Preprocess thickness field
function processThickness(thickness) {
  // Convert the string to an array of numbers
  let thicknessArray = thickness.split(",").map(Number);

  // Remove duplicate values
  thicknessArray = [...new Set(thicknessArray)];

  // Sort the array in ascending order
  thicknessArray.sort((a, b) => a - b);

  return thicknessArray;
}

/**-----------------------------------------------
 * @desc    Create new material
 * @route   /product/addmaterial
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
const AddMaterialCtrl = async (req, res) => {
  const formData = req.body;
  console.log(req.body);
  console.log(req.files);
  const avatarMaterial = req.file ? req.file.filename : null;
  try {
    const newMaterial = new Material({
      material_name: formData.material_name,
      materialdescription: formData.materialdescription,
      thickness: processThickness(formData.thickness), // Array.isArray(formData.thickness) ? formData.thickness : [formData.thickness],
      price: formData.price,
      discount_option: formData.discount_option,
      discounted_percentage: formData.discounted_percentage,
      discounted_price: formData.discounted_price,
      vat_amount: formData.vat_amount,
      status: formData.status,
      material: formData.material,
      avatarMaterial: avatarMaterial,
      materialType: formData.materialtype
    });

    await newMaterial.save();

    return res
      .status(201)
      .json({
        message: "Material Added Successfully",
        material: newMaterial
      });
  } catch (error) {
    console.error("Error adding material:", error);
    const imagePath = req.file ? path.join(__dirname, "..", "uploads", "Material",avatarMaterial) : null;
    // Remove the uploaded file if there was an error
    if (imagePath && fs.existsSync(imagePath)) {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    return res
      .status(500)
      .json({ message: "There was an error adding the material!" });
  }
};

/**-----------------------------------------------
 * @desc    Get All Materials with pagination
 * @route   /product/materials
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getMaterialsWithPginationCtrl = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const filterStatus = req.query.status || "";

  try {
    const query = {};

    if (search) {
      query.$or = [
        { material_name: { $regex: search, $options: "i" } },
      ];
    }

    if (filterStatus) {
      query.status = filterStatus;
    }

    const materials = await Material.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Material.countDocuments(query); // Use the same query for counting documents

    return res.json({
      materials,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials', error });
  }
  };

/**-----------------------------------------------
 * @desc    Get All Materials no pagination
 * @route   /product/order/materials
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getMaterialsCtrl = async (req, res) => {
    try {
      //const materials = await Material.find({});
      const materials = await Material.find({status: 'available'}).sort({ material: 1 });
      return res.status(200).json({
        materials,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching materials', error });
    }
  };




        /**-----------------------------------------------
 * @desc    Delete material by ID
 * @route   /product/deletematerial/:id
 * @method  DELETE
 * @access  private
 ------------------------------------------------*/
 const deleteMaterial = async (req, res) => {
  const materialId = req.params.id;

  try {
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Material not found", result: false });
    }

    // Check if material has an image and remove it
    if (material.avatarMaterial) {
      const imagePath = path.join(__dirname, "..", "uploads", "Material", material.avatarMaterial);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Material.findByIdAndDelete(materialId);

    return res.status(200).json({ message: "Material deleted successfully", result: true });
  } catch (error) {
    console.error("Error deleting material:", error);
    return res.status(500).json({ message: "Internal server error.", result: false });
  }

};





/**-----------------------------------------------
 * @desc    Get material by ID
 * @route   /product/material/:id
 * @method  GET
 * @access  private
 ------------------------------------------------*/
 const getMaterialByID = async (req, res) => {
  const materialId = req.params.id;

  try {
    // Find the material by ID
    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).json({ message: "Material not found", result: false });
    }

    return res.status(200).json({
      message: "Material fetched successfully",
      material
    });
  } catch (error) {
    console.error("Error fetching material:", error);
    return res.status(500).json({ message: "There was an error fetching the material!" });
  }
};


/**-----------------------------------------------
 * @desc    Update material by ID
 * @route   /product/material/:id
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 const UpdateMaterialByID = async (req, res) => {
  const materialId = req.params.id;
  console.log(materialId);
  console.log(req.body);
  const avatarMaterial = req.file ? req.file.filename : null;
  console.log(avatarMaterial);

  console.log('------------------------------');

  const formData = req.body;

  try {
    // Find the existing material
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Material not found", result: false });
    }

    // If there's a new avatar, delete the old one
    if (avatarMaterial && material.avatarMaterial) {
      const oldImagePath = path.join(__dirname, "..", "uploads", "Material", material.avatarMaterial);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }


    // Update the material with new data
    material.material_name = formData.material_name || material.material_name;
    material.materialdescription = formData.materialdescription || material.materialdescription;
    material.thickness = processThickness(formData.thickness) || material.thickness;
    material.price = formData.price || material.price;
    material.discount_option = formData.discount_option || material.discount_option;
    material.discounted_percentage = formData.discounted_percentage || material.discounted_percentage;
    material.discounted_price = formData.discounted_price || material.discounted_price;
    material.vat_amount = formData.vat_amount || material.vat_amount;
    material.status = formData.status || material.status;
    material.materialType = formData.materialtype || material.materialType;
    material.avatarMaterial = avatarMaterial || material.avatarMaterial;
    material.material = formData.material || material.material;

    await material.save();


    return res.status(200).json({
      message: "Material updated successfully",
       material
    });
  } catch (error) {
    console.error("Error updating material:", error);

    // Remove the uploaded file if there was an error
    if (avatarMaterial) {
      const imagePath = path.join(__dirname, "..", "uploads", "Material", avatarMaterial);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(500).json({ message: "There was an error updating the material!" });
  }

};









module.exports = { UpdateMaterialByID,getMaterialByID,AddMaterialCtrl , getMaterialsWithPginationCtrl,getMaterialsCtrl, deleteMaterial};
