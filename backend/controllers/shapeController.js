//const multer = require('multer');
const Shape = require("../models/Shape");
const fs = require('fs');
const path = require('path');

/* function getRandomNumber(maxLength) {
  const max = Math.pow(10, maxLength) - 1;
  return Math.floor(Math.random() * max);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomNum = getRandomNumber(7);
    cb(null, `${file.fieldname + '-' + randomNum + '-' + Date.now() + ext}`);
  }
});

const upload = multer({ storage }); */



/**-----------------------------------------------
 * @desc    Get All Shapes with pagination
 * @route   /product/shapes
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getShapesWithPginationCtrl = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const filterStatus = req.query.status || "";

  try {
    const query = {};

    if (search) {
      query.$or = [
        { shapeName: { $regex: search, $options: "i" } },
      ];
    }

    if (filterStatus) {
      query.status = filterStatus;
    }

    const shapes = await Shape.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Shape.countDocuments(query);

    return res.json({
      shapes,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shapes', error });
  }
};

/**-----------------------------------------------
 * @desc    Get All Shapes no pagination
 * @route   /product/order/shapes
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getShapesCtrl = async (req, res) => {
  try {
    const shapes = await Shape.find({ status: 'available' });
    return res.status(200).json({
      shapes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error fetching shapes', error });
  }
};





/**-----------------------------------------------
 * @desc    Add New Shape
 * @route   /product/addshape
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
 const addShapeCtrl = async (req, res) => {
  try {
    const formData = req.body;
    console.log(req.body);
    console.log(req.files);

    const avatarShape = req.files['avatarShape'] ? req.files['avatarShape'][0].filename : null;
    const avatarEdge = req.files['avatarEdge'] ? req.files['avatarEdge'][0].filename : null;
    const avatarAngles = req.files['avatarAngles'] ? req.files['avatarAngles'][0].filename : null;
    const avatarDimensions = req.files['avatarDimensions'] ? req.files['avatarDimensions'][0].filename : null;

    const newShape = new Shape({
      avatarShapeImg: avatarShape,
      avatarEdgeImg: avatarEdge,
      avatarAnglesImg:avatarAngles,
      avatarDimensionsImg:avatarDimensions,
      shapeName: formData.shape_name,
      shapedescription: formData.shapedescription,
      minA: formData.min_A,
      maxA: formData.max_A,
      minB: formData.min_B,
      maxB: formData.max_B,
      minC: formData.min_C,
      maxC: formData.max_C,
      price: formData.price,
      discountOption: formData.discount_option,
      fixedDiscount: formData.discounted_price,
      pourcentageDiscount: formData.discounted_percentage,
      vatAmount: formData.vat_amount,
      status: formData.status,
      NB_Angle:formData.NB_Angle
    });


    // Save the shape with custom validation
    await newShape.save();

    return res.status(200).json({ message: 'Shape added successfully!', newShape });
  } catch (error) {
    console.log(error);

    // Remove the uploaded file if there was an error
    const imagePath1 = req.files['avatarShape'] ? path.join(__dirname, "..", "uploads", "shape", avatarShape) : null;
    if (imagePath1 && fs.existsSync(imagePath1)) {
      if (fs.existsSync(imagePath1)) {
        fs.unlinkSync(imagePath1);
      }
    }

    const imagePath2 = req.files['avatarEdge'] ? path.join(__dirname, "..", "uploads", "shape", avatarEdge) : null;
    if (imagePath2 && fs.existsSync(imagePath2)) {
      if (fs.existsSync(imagePath2)) {
        fs.unlinkSync(imagePath2);
      }
    }

    const imagePath3 = req.files['avatarAngles'] ? path.join(__dirname, "..", "uploads", "shape", avatarAngles) : null;
    if (imagePath3 && fs.existsSync(imagePath3)) {
      if (fs.existsSync(imagePath3)) {
        fs.unlinkSync(imagePath3);
      }
    }

    const imagePath4 = req.files['avatarDimensions'] ? path.join(__dirname, "..", "uploads", "shape", avatarDimensions) : null;
    if (imagePath4 && fs.existsSync(imagePath4)) {
      if (fs.existsSync(imagePath4)) {
        fs.unlinkSync(imagePath4);
      }
    }


    return res.status(500).json({ message: 'Error adding shape', error });
  }
};

/**-----------------------------------------------
 * @desc    Delete Shape by ID
 * @route   /product/deleteshape/:id
 * @method  DELETE
 * @access  private     
 ------------------------------------------------*/
 const deleteShapeCtrl = async (req, res) => {
  const shapeId = req.params.id;
  
  try {
    const shape = await Shape.findById(shapeId);
    if (!shape) {
      return res.status(404).json({ message: "Shape not found", result: false });
    }

      // Check if shape has an image and remove it
      if (shape.avatarShapeImg) {
          const imagePath = path.join(__dirname, "..", "uploads", "shape", shape.avatarShapeImg);
          console.log(imagePath);
          if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
          }
          }
          if (shape.avatarEdgeImg) {
          const imagePath = path.join(__dirname, "..", "uploads", "shape", shape.avatarEdgeImg);
          console.log(imagePath);
          if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
          }
          }
          if (shape.avatarAnglesImg) {
          const imagePath = path.join(__dirname, "..", "uploads", "shape", shape.avatarAnglesImg);
          console.log(imagePath);
          if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
          }
          }
      
    if (shape.avatarDimensionsImg) {
      const imagePath = path.join(__dirname, "..", "uploads", "shape", shape.avatarDimensionsImg);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Shape.findByIdAndDelete(shapeId);

    return res.status(200).json({ message: "Shape deleted successfully", result: true });
  } catch (error) {
    console.error("Error deleting shape:", error);
    return res.status(500).json({ message: "Internal server error.", result: false });
  }
};




/**-----------------------------------------------
 * @desc    Get shape by ID
 * @route   /product/shape/:id
 * @method  GET
 * @access  private
 ------------------------------------------------*/
 const getShapeByID = async (req, res) => {
  const shapeId = req.params.id;
  try {
    // Find the shape by ID
    const shape = await Shape.findById(shapeId);

    if (!shape) {
      return res.status(404).json({ message: "Shape not found", result: false });
    }

    return res.status(200).json({
      message: "Shape fetched successfully",
      shape
    });
  } catch (error) {
    console.error("Error fetching shape:", error);
    return res.status(500).json({ message: "There was an error fetching the shape!" });
  }
};




/**-----------------------------------------------
 * @desc    Update shape by ID
 * @route   /product/shape/:id
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 const UpdateShapeByID = async (req, res) => {
  const shapeId = req.params.id;
  console.log(shapeId);
  console.log(req.body);
  const avatarShape = req.files['avatarShape'] ? req.files['avatarShape'][0].filename : null;
  const avatarEdge = req.files['avatarEdge'] ? req.files['avatarEdge'][0].filename : null;
  const avatarAngles = req.files['avatarAngles'] ? req.files['avatarAngles'][0].filename : null;
  const avatarDimensions = req.files['avatarDimensions'] ? req.files['avatarDimensions'][0].filename : null;
  //console.log(avatarShape);

  console.log('------------------------------');

  const formData = req.body;
    // Handle "null" string values
    const sanitizeValue = (value) => {
      return value === "null" || value === "" ? null : value;
    };
  

  try {
    // Find the existing shape
    const shape = await Shape.findById(shapeId);
    if (!shape) {
      return res.status(404).json({ message: "Shape not found", result: false });
    }

    // If there's a new avatar, delete the old one
    if (avatarShape && shape.avatarShapeImg) {
      const oldImagePath1 = path.join(__dirname, "..", "uploads", "Shape", shape.avatarShapeImg);
      if (fs.existsSync(oldImagePath1)) {
        fs.unlinkSync(oldImagePath1);
      }
    }


    if (avatarEdge && shape.avatarEdgeImg) {
      const oldImagePath2 = path.join(__dirname, "..", "uploads", "Shape", shape.avatarEdgeImg);
      if (fs.existsSync(oldImagePath2)) {
        fs.unlinkSync(oldImagePath2);
      }
    }

    if (avatarAngles && shape.avatarAnglesImg) {
      const oldImagePath3 = path.join(__dirname, "..", "uploads", "Shape", shape.avatarAnglesImg);
      if (fs.existsSync(oldImagePath3)) {
        fs.unlinkSync(oldImagePath3);
      }
    }

    if (avatarDimensions && shape.avatarDimensionsImg) {
      const oldImagePath4 = path.join(__dirname, "..", "uploads", "Shape", shape.avatarDimensionsImg);
      if (fs.existsSync(oldImagePath4)) {
        fs.unlinkSync(oldImagePath4);
      }
    }

    // Update the shape with new data
    shape.shapeName = formData.shape_name || shape.shapeName;
    shape.shapedescription = formData.shapedescription || shape.shapedescription;
    shape.price = formData.price || shape.price;
    shape.discountOption = formData.discount_option || shape.discountOption;
    shape.pourcentageDiscount = formData.discounted_percentage || shape.pourcentageDiscount;
    shape.fixedDiscount = formData.discounted_price || shape.fixedDiscount;
    shape.vatAmount = formData.vat_amount || shape.vatAmount;
    shape.status = formData.status || shape.status;
    shape.NB_Angle = formData.NB_Angle || shape.NB_Angle;

    shape.avatarShapeImg = avatarShape || shape.avatarShapeImg;
    shape.avatarEdgeImg = avatarEdge || shape.avatarEdgeImg;
    shape.avatarAnglesImg = avatarAngles || shape.avatarAnglesImg;
    shape.avatarDimensionsImg = avatarDimensions || shape.avatarDimensionsImg;

    shape.minA = sanitizeValue(formData.min_A) || shape.minA;
    shape.maxA = sanitizeValue(formData.max_A) || shape.maxA;

    shape.minB = sanitizeValue(formData.min_B) || shape.minB;
    shape.maxB = sanitizeValue(formData.max_B) || shape.maxB;

    shape.minC = sanitizeValue(formData.min_C) || shape.minC;
    shape.maxC = sanitizeValue(formData.max_C) || shape.maxC;

    await shape.save();


    return res.status(200).json({
      message: "Shape updated successfully",
      shape
    });
  } catch (error) {
    console.error("Error updating shape:", error);
    
    // Remove the uploaded file if there was an error
    const imagePath1 = req.files['avatarShape'] ? path.join(__dirname, "..", "uploads", "shape", avatarShape) : null;
    if (imagePath1 && fs.existsSync(imagePath1)) {
      if (fs.existsSync(imagePath1)) {
        fs.unlinkSync(imagePath1);
      }
    }

    const imagePath2 = req.files['avatarEdge'] ? path.join(__dirname, "..", "uploads", "shape", avatarEdge) : null;
    if (imagePath2 && fs.existsSync(imagePath2)) {
      if (fs.existsSync(imagePath2)) {
        fs.unlinkSync(imagePath2);
      }
    }

    const imagePath3 = req.files['avatarAngles'] ? path.join(__dirname, "..", "uploads", "shape", avatarAngles) : null;
    if (imagePath3 && fs.existsSync(imagePath3)) {
      if (fs.existsSync(imagePath3)) {
        fs.unlinkSync(imagePath3);
      }
    }

    const imagePath4 = req.files['avatarDimensions'] ? path.join(__dirname, "..", "uploads", "shape", avatarDimensions) : null;
    if (imagePath4 && fs.existsSync(imagePath4)) {
      if (fs.existsSync(imagePath4)) {
        fs.unlinkSync(imagePath4);
      }
    }

    return res.status(500).json({ message: "There was an error updating the shape!" });
  }

};













module.exports = { UpdateShapeByID,getShapeByID,addShapeCtrl, deleteShapeCtrl,getShapesCtrl,getShapesWithPginationCtrl};