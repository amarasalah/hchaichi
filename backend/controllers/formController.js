const path = require("path");
const transporter = require("../config/nodemailer");
const fs = require("fs");
const ejs = require("ejs");

/**-----------------------------------------------
 * @desc    Send Email from Home page
 * @route   GET /settings/invoice
 * @method  POST
 * @access  Private
 -----------------------------------------------*/
module.exports.SendEmail = async (req, res) => {
  const { fname, lname, email, message } = req.body;

  try {
    const currentYear = new Date().getFullYear();
    const baseYear = 2024;
    const yearText =
      currentYear === baseYear ? baseYear : `${baseYear}-${currentYear}`;

    const emailvar = { yearText, fname, lname, email, message };

    const img1 = path.join(__dirname, "../Emailmodels/logos/logo-compact.png");
    const templatePath = path.join(__dirname, "../Emailmodels/form.ejs");
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
          to: process.env.adminmail,
          subject: "Email from website",
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
            return res.status(500).json({ message: error});
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({ message: "Email sended successfully"});
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
    return res.status(500).json({ message: "Error sending email", error });
  }
};
