const mongoose = require("mongoose");

const MotherMaterialSchema = new mongoose.Schema(
  {
    mother_material_name: {
      type: String,
      required: true,
      unique: true
    },
  }
);

const MotherMaterial = mongoose.model("MotherMaterial", MotherMaterialSchema);

module.exports = MotherMaterial;
