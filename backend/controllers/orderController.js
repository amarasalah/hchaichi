const Shape = require("../models/Shape");
const Material = require("../models/Material");
const Angle = require("./../models/Angle");
const Edge = require("./../models/Edge");
const Order = require('./../models/Order');

const SettingsInvoice = require('./../models/SettingsInvoice');

const Notification = require('./../models/Notification');

const path = require("path");
const transporter = require("../config/nodemailer");
const fs = require("fs");
const ejs = require("ejs");


const {
    User,getEmptyAttributes
  } = require("../models/User");

/**-----------------------------------------------
 * @desc    Calculate Order Costs
 * @route   /product/orderprice
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
 const orderprice = async (req, res) => {
    const data = req.body;
    console.log(data);
/*     const data = {
        projectName: 'jasser',
        shapeId: '66a02f0dace04ad487f4d0b8',
        A_value: '15',
        B_value: '35',
        material: '66a29b3242dcd945d3fd84e6',
        thickness: '35',
        angles: [
          { angleId: '66a10d8d1b2fd414897b8edc', borderRadius: '30' },
          { angleId: '66a10d8d1b2fd414897b8edc', borderRadius: '30' },
          { angleId: '66a10d8d1b2fd414897b8edc', borderRadius: '30' },
          { angleId: '66a134bea3f86245f74b97bf', borderRadius: '40' } 
        ],
        angledescription: [],
        edges: [
          { edgeId: '66a18a47e98f000c017f39d6' },
          { edgeId: '66a18a47e98f000c017f39d6' },
          { edgeId: '66a18a47e98f000c017f39d6' },
          { edgeId: '66a189bde98f000c017f39d4' }
        ],
        edgeDescription: []
      } */









    const A_value= data.A_value || 0;
    const B_value= data.B_value || 0;
    const C_value= data.C_value || 0;

    let result ={}
    result.A_value=A_value;
    result.B_value=B_value;
    result.C_value=C_value;
    result.projectName =data.projectName;
    try {
        // shape
        const shape = await Shape.findById(data.shapeId, 'shapeName price discountOption fixedDiscount pourcentageDiscount vatAmount');

        const OriginalShapeCost = (A_value+ B_value+ C_value) * shape.price ;

        result.shapeName = shape.shapeName;
        result.OriginalShapeCost = OriginalShapeCost;
        result.VatShape = shape.vatAmount;


        if(shape.discountOption == 2){
            result.DiscountedShapeCost = OriginalShapeCost - (OriginalShapeCost * shape.pourcentageDiscount*0.01);
            result.DiscountShape = shape.pourcentageDiscount + "%";
            result.DiscountShapeDT = (OriginalShapeCost * shape.pourcentageDiscount*0.01);
        }else if(shape.discountOption == 3){
            result.DiscountedShapeCost = OriginalShapeCost - shape.fixedDiscount;
            result.DiscountShape = shape.fixedDiscount + "DT";
            result.DiscountShapeDT = shape.fixedDiscount;
        }else if(shape.discountOption == 1){
            result.DiscountedShapeCost = 0;
            result.DiscountShape = 0 + "DT";
            result.DiscountShapeDT = 0;
        }

        //Material
        const material = await Material.findById(data.material, 'material_name price discount_option discounted_price discounted_percentage vat_amount material materialType');
        const OriginalMaterialCost = data.thickness * material.price ;

        result.materialName = material.material_name;
        result.OriginalMaterialCost  = OriginalMaterialCost;
        result.material  = material.material;
        result.materialType  = material.materialType;
        result.thickness = data.thickness;
        result.VatMaterial = material.vat_amount;

        if(material.discount_option == 2){
            result.DiscountedMaterialCost = OriginalMaterialCost - (OriginalMaterialCost * material.discounted_percentage *0.01);
            result.DiscountMaterial = material.discounted_percentage + "%";
            result.DiscountMaterialDT = (OriginalMaterialCost * material.discounted_percentage *0.01);
        }else if(material.discount_option == 3){
            result.DiscountedMaterialCost = OriginalMaterialCost - material.discounted_price;
            result.DiscountMaterial = material.discounted_price + "DT";
            result.DiscountMaterialDT = material.discounted_price;
        }else if(material.discount_option == 1){
            result.DiscountedMaterialCost = 0;
            result.DiscountMaterial = 0 + "DT";
            result.DiscountMaterialDT = 0;
        }


        //Angles
        let NBAngleCutted = 0;
        let angles = []; // Initialize angles array

        // Process each angle
        for (const Angleelm of data.angles) {
            if (Angleelm && Angleelm.angleId != null && Angleelm.borderRadius && Angleelm.borderRadius != null && Angleelm.angleId && Angleelm.angleId !== '' && Angleelm.angleId !== 'none' && Angleelm.borderRadius !== '' && Angleelm.borderRadius !== 'none') {
            NBAngleCutted++;
            const angle = await Angle.findById(Angleelm.angleId, 'Angle_name price discount_option discounted_price discounted_percentage vat_amount border_radius');
            if (!angle) {
                // Handle case where angle is not found
                continue;
            }

            const OriginalAngleCost = Angleelm.borderRadius * angle.price;

            let angleelmResult = {};
            angleelmResult.Angle_name = angle.Angle_name;
            angleelmResult.OriginalAngleCost = OriginalAngleCost;
            angleelmResult.VatAngle = angle.vat_amount;

            if (angle.discount_option === 2) {
                angleelmResult.DiscountedAngleCost = OriginalAngleCost - (OriginalAngleCost * angle.discounted_percentage * 0.01);
                angleelmResult.DiscountAngle = angle.discounted_percentage + "%";
                angleelmResult.DiscountAngleDT = (OriginalAngleCost * angle.discounted_percentage * 0.01);
            } else if (angle.discount_option === 3) {
                angleelmResult.DiscountedAngleCost = OriginalAngleCost - angle.discounted_price;
                angleelmResult.DiscountAngle = angle.discounted_price + "DT";
                angleelmResult.DiscountAngleDT = angle.discounted_price;
            } else {
                angleelmResult.DiscountedAngleCost = OriginalAngleCost; // No discount
                angleelmResult.DiscountAngle = 0 + "DT";
                angleelmResult.DiscountAngleDT = 0;
            }

            angles.push(angleelmResult);
            }
        }

        result.NBAngleCutted = NBAngleCutted;
        result.angles = angles;




                //Edges
                let NBEdgeCutted = 0;
                let edges = []; // Initialize edges array
        
                // Process each edge
                for (const Edgeelm of data.edges) {
                    if(Edgeelm &&  Edgeelm.edgeId && Edgeelm.edgeId != null &&  Edgeelm.edgeId != '' && Edgeelm.edgeId != 'none'){
                    NBEdgeCutted++;
                    const edge = await Edge.findById(Edgeelm.edgeId, 'Edge_name price discount_option discounted_price discounted_percentage vat_amount');
                    if (!edge) {
                        // Handle case where edge is not found
                        continue;
                    }
        
                    const OriginalEdgeCost = edge.price;
        
                    let edgeelmResult = {};
                    edgeelmResult.Edge_name = edge.Edge_name;
                    edgeelmResult.OriginalEdgeCost = OriginalEdgeCost;
                    edgeelmResult.VatEdge = edge.vat_amount;
        
                    if (edge.discount_option === 2) {
                        edgeelmResult.DiscountedEdgeCost = OriginalEdgeCost - (OriginalEdgeCost * edge.discounted_percentage * 0.01);
                        edgeelmResult.DiscountEdge = edge.discounted_percentage + "%";
                        edgeelmResult.DiscountEdgeDT = (OriginalEdgeCost * edge.discounted_percentage * 0.01);
                    } else if (edge.discount_option === 3) {
                        edgeelmResult.DiscountedEdgeCost = OriginalEdgeCost - edge.discounted_price;
                        edgeelmResult.DiscountEdge = edge.discounted_price + "DT";
                        edgeelmResult.DiscountEdgeDT = edge.discounted_price;
                    } else {
                        edgeelmResult.DiscountedEdgeCost = OriginalEdgeCost; // No discount
                        edgeelmResult.DiscountEdge = 0 + "DT";
                        edgeelmResult.DiscountEdgeDT = 0;
                    }
        
                    edges.push(edgeelmResult);
                }
                }
                result.NBEdgeCutted = NBEdgeCutted;
                result.edges = edges;

        // Send the shapes as JSON response
        return res.json(result);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error retrieving order', error });
      }
  };


/**-----------------------------------------------
 * @desc    Verif Order user information
 * @route   /product/userorderverif
 * @method  Get
 * @access  private     
 ------------------------------------------------*/
  const orderuserverif = async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await getEmptyAttributes(userId);
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error retrieving order', error });
    }
  };

  /**-----------------------------------------------
 * @desc    Verif  user existance
 * @route   /product/userexists/:id
 * @method  Get
 * @access  private     
 ------------------------------------------------*/
 const userverifexist = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (user) {
            return res.json({ success: true, userExists: true });
        }else {
            return res.json({ success: true, userExists: false });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Error retrieving user', error });
    }
  };


    /**-----------------------------------------------
 * @desc    Save  user order
 * @route   /product/saveorderdata/:userId
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
 const saveOrder = async (req, res) => {
  const uploadedFiles = req.files;
  const filePaths = uploadedFiles.map(file => path.join(__dirname, "..", "uploads", "Order", file.filename));

    try {
        const userId = req.params.userId;
        //const orderData = req.body;
        const orderData = JSON.parse(req.body.orderData);
        const files = req.files;

        // Fetch user information and filter fields
        const user = await User.findById(userId).select('firstName lastName email phone addr1 addr2 town sp postCode country');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const settings = await SettingsInvoice.findOne({});
        if (!settings) {
          return res.status(404).json({ message: 'Settings not found' });
        }

        // Ensure edgeDescription and angleDescription are strings
        const edgeDescription = Array.isArray(orderData.edgeDescription) ? '' : orderData.edgeDescription;
        const angleDescription = Array.isArray(orderData.angleDescription) ? '' : orderData.angleDescription;

        // Add user details to orderData
        const order = {
            ...orderData,
            userId: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            addr1: user.addr1,
            addr2: user.addr2,
            town: user.town,
            sp: user.sp,
            postCode: user.postCode,
            country: user.country,
            edgeDescription: edgeDescription,
            angleDescription: angleDescription,
            file: files.map(file => ({
              originalname: file.originalname,
              path: file.filename
            })),
            receiver_company_name: settings.company_name,
            receiver_logopath:  settings.logopath,
            receiver_address: settings.address,
            receiver_geocode: settings.geocode,
            receiver_email: settings.email,
            receiver_phone: settings.phone,
            receiver_fax: settings.fax



        };

        const newOrder = new Order(order);
        await newOrder.save();

        const admins = await User.find({ role: 'admin' });
        const notifications = admins.map(admin => ({
          recipient: admin._id,
          sender: userId,
          type: 'order',
          orderId: newOrder._id,
          content: 'A new order has been created.',
          status: 'unread'
        }));
        // Save all notifications to the database
        await Notification.insertMany(notifications);




        return res.status(200).json({ message: 'Order saved successfully', order: newOrder });
    } catch (error) {
        console.error(error);

        // Delete uploaded files if there was an error
        filePaths.forEach(filePath => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });


        return res.status(500).json({ message: 'Failed to save order', error });
    }
  };

  /**-----------------------------------------------
 * @desc    Get All Orders with pagination
 * @route   /product/orders
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getOrdersWithPginationCtrl = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filterStatus = req.query.status || "";
    const search = req.query.search || "";
    const userId = req.query.userId;
    //console.log(userId);

    try {
        const query = {};


        if (search) {
            query.$or = [
               
                { projectName: { $regex: search, $options: 'i' } } // Search by projectName (case-insensitive)
            ];
        }
        
        if (filterStatus) {
            query.status = filterStatus;
        }
 
        if (userId) {
            query.userId = userId;
        }

            if (!userId) {
                if (search) {
                    query.$or.push(
                        { firstName: { $regex: search, $options: 'i' } }, // Search by firstName (case-insensitive)
                        { lastName: { $regex: search, $options: 'i' } }  // Search by lastName (case-insensitive)
                    );
                }
            }

       

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    
        const count = await Order.countDocuments(query); // Use the same query for counting documents
    
        return res.json({
            orders,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};


  /**-----------------------------------------------
 * @desc    Cancel user order by ID
 * @route   /product/cancelorder/:id
 * @method  POST
 * @access  private
 ------------------------------------------------*/
 const CancelOrder = async (req, res) => {
    const orderId = req.params.id;
  
    try {
        const order = await Order.findByIdAndUpdate(orderId, { status: 'canceled' }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
  
      return res.status(200).json({ message: "Order canceled successfully", result: true });
    } catch (error) {
      console.error("Error canceling order:", error);
      return res.status(500).json({ message: "Internal server error.", result: false });
    }
  
  };


  
  /**-----------------------------------------------
 * @desc    Get user order by ID
 * @route   /product/order/:id
 * @method  GET
 * @access  private
 ------------------------------------------------*/
 const GetOrderCtrl = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.query.userId;
    //console.log(orderId);
    //console.log(userId);
  
    try {
        const order = await Order.findOne({ _id: orderId, userId: userId });

        //console.log(order);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

  
      return res.status(200).json({ order });
    } catch (error) {
      console.error("Internal server error.", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  
  };


    /**-----------------------------------------------
 * @desc    Get user order by ID
 * @route   /product/order/:id
 * @method  GET
 * @access  private
 ------------------------------------------------*/
 const GetOrderIDCtrl = async (req, res) => {
  const orderId = req.params.id;
  //console.log(orderId);
  //console.log(userId);

  try {
      const order = await Order.findOne({ _id: orderId });

      //console.log(order);

      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }


    return res.status(200).json({ order });
  } catch (error) {
    console.error("Internal server error.", error);
    return res.status(500).json({ message: "Internal server error." });
  }

};

  /**-----------------------------------------------
 * @desc    Approve an order
 * @route   POST /product/approveorder
 * @method  POST
 * @access  private
 ------------------------------------------------*/
 const ApproveorderOrderCtrl = async (req, res) => {
    const { id } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(id, { status: 'approved',ApprovedDate:Date.now() }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const currentYear = new Date().getFullYear();
        const baseYear = 2024;
        const yearText = currentYear === baseYear ? baseYear : `${baseYear}-${currentYear}`;
        const firstName = order.firstName;
        const orderID = id;
        const projectName = order.projectName ;
        const emailvar = { yearText, firstName, orderID, projectName};

        const img1 = path.join(__dirname, "../Emailmodels/logos/logo-compact.png");
        const templatePath = path.join(__dirname, "../Emailmodels/ApprovedOrder.ejs");


        fs.readFile(templatePath, "utf8", (error, template) => {
            if (error) {
              //return res.render("error", { error });
              return res.status(200).json({ message: error, result: false }); //400
            }
      
            try {
              // Render the template with the variables
              const htmlContent = ejs.render(template, emailvar); // emailvar
              //console.log(htmlContent);
      
              const mailOptions = {
                from: process.env.sendermail,
                to: order.email,
                subject: "Your order has been approved!",
                html: htmlContent,
                attachments: [
                  {
                    filename: "image1.png",
                    path: img1,
                    cid: "unique@image.1"
                  }
                ]
              };
      
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error(error);
                  return res.status(200).json({ message: error, result: false });
                } else {
                  console.log("Email sent: " + info.response);
                  return res.json({ message: 'Order approved successfully', order });
                }
              });
            } catch (error) {
              console.error(error);
              return res
                .status(200)
                .json({ message: "Error sending email", result: false }); //500
            }
          });
  
    } catch (error) {
        return res.status(500).json({ message: 'Error approving order', error });
    }
  };

  /**-----------------------------------------------
 * @desc    Decline an order
 * @route   POST /product/declineorder
 * @method  POST
 * @access  private
 ------------------------------------------------*/
 const DeclineorderOrderCtrl = async (req, res) => {
    const { id } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(id, { status: 'denied', DeclinedDate:Date.now() }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const currentYear = new Date().getFullYear();
        const baseYear = 2024;
        const yearText = currentYear === baseYear ? baseYear : `${baseYear}-${currentYear}`;
        const firstName = order.firstName;
        const orderID = id;
        const projectName = order.projectName ;
        const emailvar = { yearText, firstName, orderID, projectName};

        const img1 = path.join(__dirname, "../Emailmodels/logos/logo-compact.png");
        const templatePath = path.join(__dirname, "../Emailmodels/DeclineOrder.ejs");


        fs.readFile(templatePath, "utf8", (error, template) => {
            if (error) {
              //return res.render("error", { error });
              return res.status(200).json({ message: error, result: false }); //400
            }
      
            try {
              // Render the template with the variables
              const htmlContent = ejs.render(template, emailvar); // emailvar
              //console.log(htmlContent);
      
              const mailOptions = {
                from: process.env.sendermail,
                to: order.email,
                subject: "Your order has been declined!",
                html: htmlContent,
                attachments: [
                  {
                    filename: "image1.png",
                    path: img1,
                    cid: "unique@image.1"
                  }
                ]
              };
      
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error(error);
                  return res.status(200).json({ message: error, result: false });
                } else {
                  console.log("Email sent: " + info.response);
                  return res.json({ message: 'Order declined successfully', order });
                }
              });
            } catch (error) {
              console.error(error);
              return res
                .status(200)
                .json({ message: "Error sending email", result: false }); //500
            }
          });
    
    } catch (error) {
        return res.status(500).json({ message: 'Error declining order', error });
    }
  };

    /**-----------------------------------------------
 * @desc    Cancel user order by ID
 * @route   /product/order/:id
 * @method  GET
 * @access  private
 ------------------------------------------------*/
 const GetOrderCtrlbyuser = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.params.userId;
  
    try {
        const order = await Order.findOne({ _id: orderId, userId: userId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

  
      return res.status(200).json({ order });
    } catch (error) {
      //console.error("Internal server error.", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  
  };


/**-----------------------------------------------
 * @desc    Cancel user order by ID
 * @route   /product/order/:id
 * @method  GET
 * @access  private
 ------------------------------------------------*/
 const DeleteOrderCtrlbyuser = async (req, res) => {
  try {
      const orderId = req.params.id;

      // Find the order by ID
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Delete all files associated with the order
      order.file.forEach((file) => {
        const filePath = path.join(__dirname, "..", "uploads", "Order", file.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // Delete the order from the database
      await Order.findByIdAndDelete(orderId);


      // Delete all notifications related to the deleted order
      await Notification.deleteMany({ orderId: orderId });

      return res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
  } catch (error) {
      console.error('Error deleting order and notifications:', error);
      return res.status(500).json({ message: 'Server error' });
  }
};


/**-----------------------------------------------
 * @desc    Update user order by ID
 * @route   /product/order/:id
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
const UpdateOrderCtrlbyuser = async (req, res) => {
  const orderId = req.params.id;
  console.log(orderId);
  //console.log(req.body);

  //console.log('------------------------------');

  const formData = req.body;

  try {
    // Find the existing order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found", result: false });
    }



    // Update the order with new data
    order.projectName = formData.projectName || order.projectName;
    order.quantity = formData.quantity || order.quantity;
    order.edgeDescription = formData.edgeDescription || order.edgeDescription;
    order.angleDescription = formData.angleDescription || order.angleDescription;
    order.firstName = formData.firstName || order.firstName;
    order.lastName = formData.lastName || order.lastName;
    order.email = formData.email || order.email;
    order.phone = formData.phone || order.phone;
    order.addr1 = formData.addr1 || order.addr1;
    order.addr2 = formData.addr2 || order.addr2;

    order.town = formData.town || order.town;
    order.sp = formData.sp || order.sp;
    order.postCode = formData.postCode || order.postCode;
    order.country = formData.country || order.country;
    order.receiver_company_name = formData.receiver_company_name || order.receiver_company_name;

    order.receiver_address = formData.receiver_address || order.receiver_address;
    order.receiver_geocode = formData.receiver_geocode || order.receiver_geocode;
    order.receiver_email = formData.receiver_email || order.receiver_email;
    order.receiver_phone = formData.receiver_phone || order.receiver_phone;
    order.receiver_fax = formData.receiver_fax || order.receiver_fax;


    //await order.save();
    console.log(order);


    return res.status(200).json({
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ message: "There was an error updating the order!" });
  }
};


/**-----------------------------------------------
 * @desc    Update file name in order
 * @route   /product/order/:id/file/:index
 * @method  PUT
 ------------------------------------------------*/
 const UpdateFileNameCtrl = async (req, res) => {
  const { id, index } = req.params;
  const { originalname } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found", result: false });
    }

    if (order.file[index]) {
      order.file[index].originalname = originalname;
      await order.save();
      return res.status(200).json({
        message: "File name updated successfully",
      });
    } else {
      return res.status(404).json({ message: "File not found", result: false });
    }
  } catch (error) {
    console.error("Error updating file name:", error);
    return res.status(500).json({ message: "There was an error updating the file name!" });
  }
};

/**-----------------------------------------------
 * @desc    Delete file in order
 * @route   /product/order/:id/file/:index
 * @method  DELETE
 ------------------------------------------------*/
const DeleteFileCtrl = async (req, res) => {
  const { id, index } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found", result: false });
    }

    if (order.file[index]) {
      const filePath = order.file[index].path;

      // Remove the file from the array
      order.file.splice(index, 1);
      await order.save();
      //console.log(order);

      if (filePath) {
        const imagePath = path.join(__dirname, "..", "uploads", "Order", filePath);
        console.log(imagePath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      


      return res.status(200).json({
        message: "File deleted successfully",
      });
    } else {
      return res.status(404).json({ message: "File not found", result: false });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({ message: "There was an error deleting the file!" });
  }
};

  module.exports = {DeleteFileCtrl, UpdateFileNameCtrl,GetOrderIDCtrl,UpdateOrderCtrlbyuser,DeleteOrderCtrlbyuser,orderprice,orderuserverif,userverifexist,saveOrder,getOrdersWithPginationCtrl, CancelOrder, GetOrderCtrl, ApproveorderOrderCtrl, DeclineorderOrderCtrl,GetOrderCtrlbyuser};