require('dotenv').config();
const express=require('express');
const path=require("path");
const app=express();
const cron = require('node-cron');
const deactivateExpiredJobs = require('./utils/deactivateExpiredJobs');
const mongoose=require('mongoose');
const mongoDbURL=process.env.MONGO_URL;
const errorMiddleware=require('./middlewaress/errorHandler');
const authRoute=require('./routes/authRoutes');
const profileRoute=require('./routes/profileRoutes');
const postRoute=require('./routes/postRoutes');
const jobRoute=require('./routes/jobRoutes');
const applicationRoute=require('./routes/applicationRoutes');
const orderRoute=require('./routes/orderRoutes');
const savedJobsRoute=require('./routes/savedJobsRoutes');
const adminRoute=require('./routes/adminRoutes');
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads/pdfs", express.static(path.join(__dirname, "uploads/pdfs")));

app.use(express.json());

app.use('/api/auth',authRoute);
app.use('/api/profile',profileRoute);
app.use('/api/post',postRoute);
app.use('/api/job',jobRoute);
app.use('/api/application',applicationRoute);
app.use('/api/order',orderRoute);
app.use('/api/saved-jobs',savedJobsRoute);
app.use('/api/admin',adminRoute);
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});
app.use(errorMiddleware);
const connectToMongo=async()=>{
    try {
        await mongoose.connect(mongoDbURL);
        console.log("Connected to mongoose successfully!");
        app.listen(3000,()=>{
            console.log("app listening on the localhost 3000 successfully!");
        })
        // Run every minute
cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled job: deactivateExpiredJobs');
  deactivateExpiredJobs();
});
    } catch (error) {
        console.error(error);
        console.error("Mongoose connection error!");
    }
}
connectToMongo();
