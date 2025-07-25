const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const orderSchema=new Schema({
     orderId: {
    type: String,
    required: true,
    unique: true,
  },
    email:{
        type:String, required:true, match: [/.+@.+\..+/, 'Invalid email format']
    },
    status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  userType: {
    type: String,
    enum: ['recruiter', 'applicant'],
    required: true,
  },
  profileId: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  }
},{timestamps:true});
module.exports=mongoose.model("Order",orderSchema);