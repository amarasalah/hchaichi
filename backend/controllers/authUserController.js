const path = require("path");
const bcrypt = require("bcrypt");
const transporter = require("../config/nodemailer");
const { generateToken } = require("../config/jwt-utils");
const downloadImage = require('./../utils/downloadImage');

const {
  User,
  validateRegisterUser,
  validateLoginUser
} = require("../models/User");

const fs = require("fs");
const ejs = require("ejs");

const { Token } = require("../models/Token");


async function findTokenForUser(userId) {
  const token = await Token.findByUserId(userId);
  return token;
}


/**-----------------------------------------------
 * @desc    Register New User
 * @route   /auth/register
 * @method  POST
 * @access  public     
 ------------------------------------------------*/
module.exports.registerClientCtrl = async (req, res) => {
  const clientData = req.body;
  const pwd = req.body.password;

  try {
    const validationResult = await validateRegisterUser(clientData);

    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.message);
      return res
        .status(200)
        .json({ message: validationResult.message, result: false }); //400
    }

    // Validation passed, proceed with client registration
    var newClient = new User(clientData);
    // Encrypt the password
    const saltRounds = 10;
    newClient.password = await bcrypt.hash(pwd, saltRounds);

    await newClient.save();
    const newToken = await Token.createToken(newClient._id);

    console.log("Client data is valid and registered successfully.");

    const currentYear = new Date().getFullYear();
    const baseYear = 2024;
    const yearText =
      currentYear === baseYear ? baseYear : `${baseYear}-${currentYear}`;
    const firstName = newClient.firstName;

    // Making the link
    const activationLink = `${process.env
      .CLIENT_DOMAIN}/auth/${newClient._id}/verify/${newToken.token}`;

    const emailvar = { yearText, firstName, activationLink };

    const img1 = path.join(__dirname, "../Emailmodels/logos/logo-compact.png");

    const templatePath = path.join(__dirname, "../Emailmodels/newuser.ejs");

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
          to: newClient.email,
          subject: "Welcome to our new client",
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
            return res.status(200).json({
              message:
                "Your account created successfully and we send to you email to activate your account",
              result: true,
              email: newClient.email,
              id: newClient._id
            }); //201
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
    console.error("Error registering client:", error);
    return res
      .status(200)
      .json({ message: "Internal server error.", result: false }); //500
  }
};

/**-----------------------------------------------
 * @desc    Register New User Google
 * @route   /auth/register
 * @method  POST
 * @access  public       
 ------------------------------------------------*/
module.exports.registergoogleClientCtrl = async (req, res) => {
  const { googleId, imageUrl, email, name } = req.body;
  const clientData = {
    googleId,
    imageUrl: '', // This will be updated after downloading the image
    email,
    password: "its$fromgoogle",
    firstName: name,
    lastName: "its$fromgoogle",
    verification: true
  };
  console.log(clientData);

  try {
    const testexist = await User.emailExists(clientData.email);
    if (!testexist){
      const imageName = `${googleId}_profile.jpg`; // or any other naming convention
      const savedImagePath = await downloadImage(imageUrl, imageName);
      clientData.imageUrl = imageName;
      // Validation passed, proceed with client registration
      var newClient = new User(clientData);
      await newClient.save();
      console.log("Client data is valid and registered successfully.");

      const token = generateToken({
        id: newClient._id,
        email: newClient.email
        , role : newClient.role
        ,imageUrl:newClient.imageUrl, image:newClient.image,firstName: newClient.firstName, lastName:newClient.lastName 
      });
      // Set cookie with 60 days expiration
      res.cookie("token", token, {
        maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days in milliseconds
        httpOnly: true, // helps prevent client-side JavaScript from accessing the cookie
        secure: false // use true if you are using HTTPS
        //sameSite: 'Strict', // helps prevent CSRF attacks
      });

      console.log(req.cookies);

      return res
        .status(200)
        .json({ result: true, message: "Login successful", token,user:newClient });
    }else{
      return res
      .status(200)
      .json({ message: "This email is already registered.", result: false });
    }
  } catch (error) {
    console.error("Error registering client:", error);
    return res
      .status(200)
      .json({ message: "Internal server error.", result: false }); //500
  }
};

/**-----------------------------------------------
 * @desc    Login User
 * @route   /auth/login
 * @method  POST
 * @access  public
 ------------------------------------------------*/
module.exports.loginUserCtrl = async (req, res) => {
  try {
    const validationResult = await validateLoginUser(req.body);
    //console.log(req.body)
    //console.log(validationResult)
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.message);
      return res
        .status(200)
        .json({ message: validationResult.message, result: false }); //400
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .json({ result: false, message: "This email address is not exist." }); //400
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res
        .status(200)
        .json({ result: false, message: "invalid password" }); //400
    }
    const foundToken = await findTokenForUser(user._id);

    if (!foundToken) {
      const token = generateToken({ id: user._id, email: user.email, role : user.role,imageUrl:user.imageUrl, image:user.image,firstName: user.firstName, lastName:user.lastName   });
      //console.log("Token: " + token);

      // Set cookie with 60 days expiration
      res.cookie("token", token, {
        maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days in milliseconds
        httpOnly: true, // helps prevent client-side JavaScript from accessing the cookie
        secure: false // use true if you are using HTTPS
        //sameSite: 'Strict', // helps prevent CSRF attacks
      });

      console.log(req.cookies);

      return res
        .status(200)
        .json({ result: true, message: "Login successful", token,user });
    } else {
      return res.status(200).json({
        result: false,
        message: "Please check your email and activate your account."
      });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ message: "Internal server error.", result: false }); //500
  }
};

/**-----------------------------------------------
 * @desc    Login Client Google
 * @route   /auth/login
 * @method  POST
 * @access  public
 ------------------------------------------------*/
 module.exports.loginGoogleClientCtrl = async (req, res) => {
  try {
    const clientData = {
      email: req.body.email,
    };

    const client = await User.findOne({ email: clientData.email });
    if (!client) {
      return res
        .status(200)
        .json({ result: false, message: "This user address is not exist." }); //400
    }
    //console.log(client.role);
      const token = generateToken({ id: client._id, email: client.email , role : client.role,imageUrl:client.imageUrl, image:client.image,firstName: client.firstName, lastName:client.lastName });
      //console.log("Token: " + token);

      // Set cookie with 60 days expiration
      res.cookie("token", token, {
        maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days in milliseconds
        httpOnly: true, // helps prevent client-side JavaScript from accessing the cookie
        secure: false // use true if you are using HTTPS
        //sameSite: 'Strict', // helps prevent CSRF attacks
      });

      //console.log("req.cookies: " + req.cookies);

      return res
        .status(200)
        .json({ result: true, message: "Login successful", token,client });

  } catch (error) {
    return res
      .status(200)
      .json({ message: "Internal server error.", result: false }); //500
  }
};



/**-----------------------------------------------
 * @desc    Verify User Account
 * @route   /auth/:id/verify/:token
 * @method  POST
 * @access  public
 ------------------------------------------------*/

module.exports.verifyUserAccountCtrl = async (req, res) => {
  try {
    console.log(req.params);
    const { id, token } = req.params;

    // Validate input
    /*     if (!id || !token) {
      return res.status(200).json({ message: 'Missing id or token' });
    } */

    // Find the token for the given client id
    const foundToken = await findTokenForUser(id);

    if (!foundToken || foundToken.token !== token || !id || !token) {
      return res.status(200).json({ message: "Link invalid or expired" }); //400
    }

    // Update the verification status of the client
    await User.updateVerificationStatus(id);

    // Delete the token after successful verification
    await Token.deleteToken(foundToken._id);

    return res
      .status(200)
      .json({ message: "Your account has been activated successfully!" });
  } catch (error) {
    console.error("Error verifying user account:", error);
    return res.status(200).json({ message: "Link invalid or expired" }); //500
  }
};

/**-----------------------------------------------
 * @desc    Forgot Password
 * @route   /auth/forgot-password
 * @method  POST
 * @access  public
 ------------------------------------------------*/
 module.exports.forgotPasswordCtrl = async (req, res) => {
  const { email } = req.body;
  console.log(email);
   try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(200).json({ result: false, message: "This email address does not exist." });
      }
      const halfpassword1 = Math.random().toString(36).slice(-8);

      const newPassword = "PASSword@2024" + halfpassword1
      const saltRounds = 10;
      user.password = await bcrypt.hash(newPassword, saltRounds);
      await user.save();




      const currentYear = new Date().getFullYear();
      const baseYear = 2024;
      const yearText = currentYear === baseYear ? baseYear : `${baseYear}-${currentYear}`;

      const fname = user.firstName;

      const emailvar = { yearText, fname , email, newPassword };
  
      const img1 = path.join(__dirname, "../Emailmodels/logos/logo-compact.png");
      const templatePath = path.join(__dirname, "../Emailmodels/reset_password.ejs");

      fs.readFile(templatePath, "utf8", (error, template) => {
        if (error) {
          //return res.render("error", { error });
          return res.status(500).json({ message: error }); //400
        }
  
        try {
          // Render the template with the variables
          const htmlContent = ejs.render(template, emailvar); // emailvar
          //console.log(htmlContent);
  
          const mailOptions = {
            from: process.env.sendermail,
            to: email,
            subject: "Password Reset",
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
                return res.status(200).json({ message: "Error sending email", result: false });
            } else {
                console.log("Email sent: " + info.response);
                return res.status(200).json({
                    message: "A new password has been sent to your email address.",
                    result: true
                });
            }
        });

        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({ message: "Error sending email"}); //500
        }
      });



























  } catch (error) {
      console.error("Error in forgot password:", error);
      return res.status(200).json({ message: "Internal server error.", result: false });
  } 
};
