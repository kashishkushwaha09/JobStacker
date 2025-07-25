const crypto = require("crypto");
const razorpay = require("../utils/razorpayInstance");
const Order = require("../models/orderModel");
const Job= require("../models/jobModel");
const Profile=require("../models/profileModel");
const premiumPlans= require("../config/premiumPlans");
const { AppError } = require("../utils/appError");

const createOrder=async (req,res,next)=>{
    try {
        const profileId=req.profile._id;
         const { userType, email} = req.body;

    if (!userType || !email || !profileId) {
      throw new AppError("Missing required fields",400);
    }
     const plan = premiumPlans[userType];

    if (!plan) {
      throw new AppError("Invalid user type",400);
    }

    const options = {
      amount: 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}_${userType}`,
    };
     const order = await razorpay.orders.create(options);

    const newOrder = new Order({
      orderId: order.id,
      email,
      userType,
      profileId,
      status: "pending",
    });

    await newOrder.save();
     res.status(201).json({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      description: plan.description,
      key: process.env.RAZORPAY_KEY_ID, 
    });
    } catch (error) {
       console.error("Error creating Razorpay order:", error); 
        if (!(error instanceof AppError)) {
               error = new AppError(error.message, 500);
           }
           next(error);
    }
}

const verifyPayment=async(req,res,next)=>{
     try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
         await Order.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          status: "failed",
        }
      );
        throw new AppError( "Signature verification failed",400);
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        status: "completed"
      },
      { new: true }
    );
   if (updatedOrder) {
      const { profileId, userType } = updatedOrder;

      if (userType === "applicant") {
        await Profile.findByIdAndUpdate(profileId, {
          hasPremiumAccess: true,
          profileViewCount: 0,
        });
      } else if (userType === "recruiter") {
        await Profile.findByIdAndUpdate(profileId, {
           hasPremiumAccess: true,
        });
        await Job.updateMany(
    { postedBy: profileId },
    { isFeatured: true }
  );
      }
    }
    res.json({ message: "Payment verified successfully", order: updatedOrder });
  } catch (error) {
    console.error("Payment verification error:", error);
     if (!(error instanceof AppError)) {
               error = new AppError(error.message, 500);
           }
           next(error);
  }
}

module.exports={
    createOrder,verifyPayment
}