const SettingsGeneral = require("../models/SettingsGeneral");
const SettingsInvoice = require('../models/SettingsInvoice');
const MotherMaterial = require('../models/MotherMaterial');
const fs = require("fs");
const path = require("path");
/**-----------------------------------------------
 * @desc    Edit General Settings
 * @route   /settings/general
 * @method  PUT
 * @access  private    
 ------------------------------------------------*/
module.exports.settingsGeneral = async (req, res) => {
  try {
    console.log(req.body);
    const { meta_title, meta_description, meta_keywords } = req.body;

    // Create a new settings document
    /*         const newSettings = new SettingsGeneral({
          meta_title,
          meta_description,
          meta_keywords,
        });
        console.log(newSettings);
    
        // Save the document to the database
        await newSettings.save(); */
    // Find the first settings document and update it
    const updatedSettings = await SettingsGeneral.findOneAndUpdate(
      {},
      { meta_title, meta_description, meta_keywords },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    return res.status(201).json({ message: "Settings saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
/**-----------------------------------------------
 * @desc    Get General Settings
 * @route   /settings/general
 * @method  Get
 * @access  private    
 ------------------------------------------------*/
module.exports.GetsettingsGeneral = async (req, res) => {
    try {
        const settings = await SettingsGeneral.findOne({});
        if (!settings) {
          return res.status(404).json({ message: 'Settings not found' });
        }
        return res.status(200).json(settings);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
};




/**-----------------------------------------------
 * @desc    Get Invoice Settings
 * @route   GET /settings/invoice
 * @access  Private
 -----------------------------------------------*/
module.exports.getInvoiceSettings = async (req, res) => {
    try {
      const settings = await SettingsInvoice.findOne({});
      if (!settings) {
        return res.status(404).json({ message: 'Settings not found' });
      }
      return res.status(200).json(settings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  /**-----------------------------------------------
   * @desc    Update Invoice Settings
   * @route   PUT /settings/invoice
   * @access  Private
   -----------------------------------------------*/
  module.exports.updateInvoiceSettings = async (req, res) => {
    let newFilePath = null;
    if (req.file) {
      newFilePath = path.join(__dirname, "..", "uploads", "Settings", req.file.filename);
    }
    try {
      const {
        company_name, owner, address, geocode, email, phone, fax
      } = req.body;

      console.log(req.body);


      if(req.file){
        const settings = await SettingsInvoice.findOne({});
        if (!settings) {
          return res.status(404).json({ message: 'Settings not found' });
        }
        const imagePath = path.join(__dirname, "..", "uploads", "Settings", settings.logopath);
        console.log(imagePath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      
      }
  
      const updatedSettings = await SettingsInvoice.findOneAndUpdate(
        {},
        { company_name, owner, address, geocode, email, phone, fax,logopath: req.file ? req.file.filename : undefined },
        { new: true }
      );
  
      if (!updatedSettings) {
        return res.status(404).json({ message: 'Settings not found' });
      }
  
      return res.status(200).json({ message: 'Settings updated successfully', settings: updatedSettings });
    } catch (error) {
      console.error(error);
      if (newFilePath && fs.existsSync(newFilePath)) {
        fs.unlinkSync(newFilePath);
      }


      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  /**-----------------------------------------------
   * @desc    Save Invoice Settings (for initial setup if no settings exist)
   * @route   POST /settings/invoice
   * @access  Private
   -----------------------------------------------*/
/*   module.exports.saveInvoiceSettings = async (req, res) => {
    try {
        console.log(req.body);
      const {
        company_name, owner, address, geocode, email, phone, fax
      } = req.body;
  
      const newSettings = new SettingsInvoice({
        company_name, owner, address, geocode, email, phone, fax,logopath: req.file ? req.file.filename : undefined
      });
  
      await newSettings.save();
  
      return res.status(201).json({ message: 'Settings saved successfully', settings: newSettings });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }; */



/**-----------------------------------------------
 * @desc    Get Material Settings
 * @route   GET /settings/invoice
 * @access  Private
 -----------------------------------------------*/
 module.exports.SaveMotherMaterialSettings = async (req, res) => {

};

/**-----------------------------------------------
 * @desc    Get all MotherMaterials
 * @route   GET /settings/mother-material
 * @access  Private
 -----------------------------------------------*/
 module.exports.GetMotherMaterials = async (req, res) => {
  try {
    const materials = await MotherMaterial.find({});
    return res.status(200).json(materials);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch materials.' });
  }
 };
 
/**-----------------------------------------------
 * @desc    DELETE Material Settings
 * @route   DELETE /settings/mother-material
 * @access  Private
 -----------------------------------------------*/
 module.exports.DeleteMotherMaterialSettings = async (req, res) => {
  try {
    const { id } = req.params;
    await MotherMaterial.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete material.' });
  }
 };
 
/**-----------------------------------------------
 * @desc    Add Material Settings
 * @route   POST /settings/mother-material
 * @access  Private
 -----------------------------------------------*/
 module.exports.AddMotherMaterialSettings = async (req, res) => {
  try {
    
    const  MM_name  = req.body.mother_material_name;
    //console.log(MM_name);
    const newMaterial = new MotherMaterial({ mother_material_name : MM_name });
    await newMaterial.save();
    return res.status(201).json(newMaterial);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'MotherMaterial could not be saved.' });
  }
 };
 











