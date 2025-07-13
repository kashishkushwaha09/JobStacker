require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const mongoDbURL=process.env.MONGO_URL;
const errorMiddleware=require('./middlewaress/errorHandler');
const authRoute=require('./routes/authRoutes');
app.use(express.json());

app.use('/api/auth',authRoute);
app.use(errorMiddleware);
const connectToMongo=async()=>{
    try {
        await mongoose.connect(mongoDbURL);
        console.log("Connected to mongoose successfully!");
        app.listen(3000,()=>{
            console.log("app listening on the localhost 3000 successfully!");
        })
    } catch (error) {
        console.error(error);
        console.error("Mongoose connection error!");
    }
}
connectToMongo();