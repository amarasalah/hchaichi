const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const angleSchema = new Schema({
    Angle_name: String,
    OriginalAngleCost: Number,
    VatAngle: Number,
    DiscountedAngleCost: Number,
    DiscountAngle: String,
    DiscountAngleDT: Number
}, { _id: false });

const edgeSchema = new Schema({
    Edge_name: String,
    OriginalEdgeCost: Number,
    VatEdge: Number,
    DiscountedEdgeCost: Number,
    DiscountEdge: String,
    DiscountEdgeDT: Number
}, { _id: false });

const orderSchema = new Schema({
    A_value: String,
    B_value: String,
    C_value: String,
    projectName: String,
    shapeName: String,
    OriginalShapeCost: Number,
    VatShape: Number,
    DiscountedShapeCost: Number,
    DiscountShape: String,
    DiscountShapeDT: Number,
    materialName: String,
    OriginalMaterialCost: Number,
    material: String,
    materialType: String,
    thickness: String,
    VatMaterial: Number,
    DiscountedMaterialCost: Number,
    DiscountMaterial: String,
    DiscountMaterialDT: Number,
    NBAngleCutted: Number,
    angles: [angleSchema],
    NBEdgeCutted: Number,
    edges: [edgeSchema],
    quantity: Number,
    edgeDescription: String,
    angleDescription: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    addr1: String,
    addr2: String,
    town: String,
    sp: String,
    postCode: String,
    country: String,
    file: [
        {
            originalname: String,
            path: String
        }
    ],
    status: {
        type: String,
        enum: ['approved', 'denied', 'pending','canceled'],  // Enum for specific values
        default: 'pending'
      },



      receiver_company_name: { type: String, default: ''},
      receiver_logopath: { type: String },
      receiver_address: { type: String},
      receiver_geocode: { type: String },
      receiver_email: { type: String},
      receiver_phone: { type: String},
      receiver_fax: { type: String },

      ApprovedDate:{
        type:Date
      },
      DeclinedDate :{
        type:Date
      },
      FactureNum: { type: String } 





}, { timestamps: true });
// Pre-save hook to generate FactureNum
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
      const currentYear = new Date().getFullYear().toString();
      const lastOrder = await Order.findOne().sort({ createdAt: -1 });

      let nextNumber = 1;
      if (lastOrder && lastOrder.FactureNum && lastOrder.FactureNum.startsWith(currentYear)) {
          const lastNumber = parseInt(lastOrder.FactureNum.slice(currentYear.length), 10);
          nextNumber = lastNumber + 1;
      }

      this.FactureNum = `${currentYear}${String(nextNumber).padStart(4, '0')}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
