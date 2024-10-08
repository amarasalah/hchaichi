const Angle = require("./../models/Angle");
const fs = require("fs");
const path = require("path");

// Preprocess border_radius field
function processBorderRadius(border_radius) {
  // Convert the string to an array of numbers
  let border_radiusArray = border_radius.split(",").map(Number);

  // Remove duplicate values
  border_radiusArray = [...new Set(border_radiusArray)];

  // Sort the array in ascending order
  border_radiusArray.sort((a, b) => a - b);

  return border_radiusArray;
}

/**-----------------------------------------------
 * @desc    Create new angle
 * @route   /product/addangle
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
const AddAngleCtrl = async (req, res) => {
  const formData = req.body;
  console.log(req.body);
  console.log(req.files);
  const avatarAngle = req.file ? req.file.filename : null;
  try {
    const newAngle = new Angle({
      Angle_name: formData.angle_name,
      Angledescription: formData.angledescription,
      border_radius: processBorderRadius(formData.border_radius), // Array.isArray(formData.border_radius) ? formData.border_radius : [formData.border_radius],
      price: formData.price,
      discount_option: formData.discount_option,
      discounted_percentage: formData.discounted_percentage,
      discounted_price: formData.discounted_price,
      vat_amount: formData.vat_amount,
      status: formData.status,
      avatarAngle: avatarAngle
    });

    await newAngle.save();

    return res
      .status(201)
      .json({
        message: "Angle Added Successfully",
        Angle: newAngle
      });
  } catch (error) {
    console.error("Error adding angle:", error);

    	// Remove the uploaded file if there was an error
      const imagePath = req.file ? path.join(__dirname, "..", "uploads", "Angle", avatarAngle) : null;
      if (imagePath && fs.existsSync(imagePath)) {
    if (fs.existsSync(imagePath)) {
                  fs.unlinkSync(imagePath);
    }
      }


    return res
      .status(500)
      .json({ message: "There was an error adding the angle!" });
  }
};

/**-----------------------------------------------
 * @desc    Get All Angles with pagination
 * @route   /product/angles
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getAnglesWithPginationCtrl = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const filterStatus = req.query.status || "";

  try {
    const query = {};

    if (search) {
      query.$or = [
        { Angle_name: { $regex: search, $options: "i" } },
      ];
    }

    if (filterStatus) {
      query.status = filterStatus;
    }

    const angles = await Angle.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Angle.countDocuments(query); // Use the same query for counting documents

    return res.json({
      angles,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching angles', error });
  }
  };

/**-----------------------------------------------
 * @desc    Get All Angles no pagination
 * @route   /product/order/angles
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getAnglesCtrl = async (req, res) => {
    try {
      const angles = await Angle.find({status: 'available'});
      return res.status(200).json({
        angles,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching angles', error });
    }
  };



    /**-----------------------------------------------
 * @desc    Delete angle by ID
 * @route   /api/deleteangle/:id
 * @method  DELETE
 * @access  private
 ------------------------------------------------*/
 const deleteAngle = async (req, res) => {
  const angleId = req.params.id;

  try {
    const angle = await Angle.findById(angleId);
    if (!angle) {
      return res.status(404).json({ message: "Angle not found", result: false });
    }

    // Check if angle has an image and remove it
    if (angle.avatarAngle) {
      const imagePath = path.join(__dirname, "..", "uploads", "Angle", angle.avatarAngle);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    //await Angle.findByIdAndDelete(angleId);

    return res.status(200).json({ message: "Angle deleted successfully", result: true });
  } catch (error) {
    console.error("Error deleting angle:", error);
    return res.status(500).json({ message: "Internal server error.", result: false });
  }

};





/**-----------------------------------------------
 * @desc    Update angle by ID
 * @route   /product/angle/:id
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 const UpdateAngleByID = async (req, res) => {
  const angleId = req.params.id;
  console.log(angleId);
  console.log(req.body);
  const avatarAngle = req.file ? req.file.filename : null;
  console.log(avatarAngle);

  console.log('------------------------------');

  const formData = req.body;

  try {
    // Find the existing angle
    const angle = await Angle.findById(angleId);
    if (!angle) {
      return res.status(404).json({ message: "Angle not found", result: false });
    }

    // If there's a new avatar, delete the old one
    if (avatarAngle && angle.avatarAngle) {
      const oldImagePath = path.join(__dirname, "..", "uploads", "Angle", angle.avatarAngle);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }


    // Update the angle with new data
    angle.Angle_name = formData.angle_name || angle.Angle_name;
    angle.Angledescription = formData.angledescription || angle.Angledescription;
    angle.border_radius = processBorderRadius(formData.border_radius) || angle.border_radius;
    angle.price = formData.price || angle.price;
    angle.discount_option = formData.discount_option || angle.discount_option;
    angle.discounted_percentage = formData.discounted_percentage || angle.discounted_percentage;
    angle.discounted_price = formData.discounted_price || angle.discounted_price;
    angle.vat_amount = formData.vat_amount || angle.vat_amount;
    angle.status = formData.status || angle.status;
    angle.avatarAngle = avatarAngle || angle.avatarAngle;

    await angle.save();


    return res.status(200).json({
      message: "Angle updated successfully",
      material: angle
    });
  } catch (error) {
    console.error("Error updating angle:", error);

    // Remove the uploaded file if there was an error
    if (avatarAngle) {
      const imagePath = path.join(__dirname, "..", "uploads", "Angle", avatarAngle);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(500).json({ message: "There was an error updating the angle!" });
  }

};


/**-----------------------------------------------
 * @desc    Get angle by ID
 * @route   /product/angle/:id
 * @method  GET
 * @access  private
 ------------------------------------------------*/
 const getAngleByID = async (req, res) => {
  const angleId = req.params.id;

  try {
    // Find the angle by ID
    const angle = await Angle.findById(angleId);

    if (!angle) {
      return res.status(404).json({ message: "Angle not found", result: false });
    }

    return res.status(200).json({
      message: "Angle fetched successfully",
      angle
    });
  } catch (error) {
    console.error("Error fetching angle:", error);
    return res.status(500).json({ message: "There was an error fetching the angle!" });
  }
};




module.exports = { getAngleByID,UpdateAngleByID,AddAngleCtrl , getAnglesWithPginationCtrl,getAnglesCtrl, deleteAngle};

