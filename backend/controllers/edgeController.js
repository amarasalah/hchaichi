const Edge = require("./../models/Edge");
const fs = require("fs");
const path = require("path");

/**-----------------------------------------------
 * @desc    Create new edge
 * @route   /product/addedge
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
const AddEdgeCtrl = async (req, res) => {
  const formData = req.body;
  console.log(req.body);
  console.log(req.files);
  const avatarEdge = req.file ? req.file.filename : null;
  try {
    const newEdge = new Edge({
      Edge_name: formData.edge_name,
      Edgedescription: formData.edgedescription,
      price: formData.price,
      discount_option: formData.discount_option,
      discounted_percentage: formData.discounted_percentage,
      discounted_price: formData.discounted_price,
      vat_amount: formData.vat_amount,
      status: formData.status,
      avatarEdge: avatarEdge
    });

    await newEdge.save();

    return res
      .status(201)
      .json({
        message: "Edge Added Successfully",
        Edge: newEdge
      });
  } catch (error) {
    console.error("Error adding edge:", error);

    	// Remove the uploaded file if there was an error
      const imagePath = req.file ? path.join(__dirname, "..", "uploads", "Edge", avatarEdge) : null;
      if (imagePath && fs.existsSync(imagePath)) {
    if (fs.existsSync(imagePath)) {
                  fs.unlinkSync(imagePath);
    }
      }


    return res
      .status(500)
      .json({ message: "There was an error adding the edge!" });
  }
};

/**-----------------------------------------------
 * @desc    Get All Edges with pagination
 * @route   /product/edges
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getEdgesWithPginationCtrl = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const filterStatus = req.query.status || "";

  try {
    const query = {};

    if (search) {
      query.$or = [
        { Edge_name: { $regex: search, $options: "i" } },
      ];
    }

    if (filterStatus) {
      query.status = filterStatus;
    }

    const edges = await Edge.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Edge.countDocuments(query); // Use the same query for counting documents

    return res.json({
      edges,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching edges', error });
  }
  };

/**-----------------------------------------------
 * @desc    Get All Edges no pagination
 * @route   /product/order/edges
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getEdgesCtrl = async (req, res) => {
    try {
      const edges = await Edge.find({status: 'available'});
      return res.status(200).json({
        edges,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching edges', error });
    }
  };



  /**-----------------------------------------------
 * @desc    Delete edge by ID
 * @route   /api/deletestaff/:id
 * @method  DELETE
 * @access  private
 ------------------------------------------------*/
 const deleteEdge = async (req, res) => {
  const edgeId = req.params.id;

  try {
    const edge = await Edge.findById(edgeId);
    if (!edge) {
      return res.status(404).json({ message: "Edge not found", result: false });
    }

    // Check if edge has an image and remove it
    if (edge.avatarEdge) {
      const imagePath = path.join(__dirname, "..", "uploads", "Edge", edge.avatarEdge);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Edge.findByIdAndDelete(edgeId);

    return res.status(200).json({ message: "Edge deleted successfully", result: true });
  } catch (error) {
    console.error("Error deleting edge:", error);
    return res.status(500).json({ message: "Internal server error.", result: false });
  }

};













/**-----------------------------------------------
 * @desc    Get edge by ID
 * @route   /product/edge/:id
 * @method  GET
 * @access  private
 ------------------------------------------------*/
 const getEdgeByID = async (req, res) => {
  const edgeId = req.params.id;

  try {
    // Find the edge by ID
    const edge = await Edge.findById(edgeId);

    if (!edge) {
      return res.status(404).json({ message: "Edge not found", result: false });
    }

    return res.status(200).json({
      message: "Edge fetched successfully",
      edge
    });
  } catch (error) {
    console.error("Error fetching edge:", error);
    return res.status(500).json({ message: "There was an error fetching the edge!" });
  }
};


/**-----------------------------------------------
 * @desc    Update edge by ID
 * @route   /product/edge/:id
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 const UpdateEdgeByID = async (req, res) => {
  const edgeId = req.params.id;
  console.log(edgeId);
  console.log(req.body);
  const avatarEdge = req.file ? req.file.filename : null;
  console.log(avatarEdge);

  console.log('------------------------------');

  const formData = req.body;

  try {
    // Find the existing edge
    const edge = await Edge.findById(edgeId);
    if (!edge) {
      return res.status(404).json({ message: "Edge not found", result: false });
    }

    // If there's a new avatar, delete the old one
    if (avatarEdge && edge.avatarEdge) {
      const oldImagePath = path.join(__dirname, "..", "uploads", "Edge", edge.avatarEdge);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }


    // Update the edge with new data
    edge.Edge_name = formData.edge_name || edge.Edge_name;
    edge.Edgedescription = formData.edgedescription || edge.Edgedescription;
    edge.price = formData.price || edge.price;
    edge.discount_option = formData.discount_option || edge.discount_option;
    edge.discounted_percentage = formData.discounted_percentage || edge.discounted_percentage;
    edge.discounted_price = formData.discounted_price || edge.discounted_price;
    edge.vat_amount = formData.vat_amount || edge.vat_amount;
    edge.status = formData.status || edge.status;
    edge.avatarEdge = avatarEdge || edge.avatarEdge;

    await edge.save();


    return res.status(200).json({
      message: "Edge updated successfully",
      material: edge
    });
  } catch (error) {
    console.error("Error updating edge:", error);

    // Remove the uploaded file if there was an error
    if (avatarEdge) {
      const imagePath = path.join(__dirname, "..", "uploads", "Edge", avatarEdge);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(500).json({ message: "There was an error updating the edge!" });
  }

};











module.exports = { UpdateEdgeByID,getEdgeByID,AddEdgeCtrl , getEdgesWithPginationCtrl,getEdgesCtrl, deleteEdge};

