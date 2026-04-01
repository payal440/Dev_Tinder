// const mongoose = require('mongoose')

// const connectDb = async () => {
//   await mongoose.connect(
//     "mongodb://localhost:27017/devTinder"
//   );
// };
// module.exports = connectDb;



// const mongoose = require('mongoose')
// const connectDb = async () => {
//   await mongoose.connect(
//     "mongodb+srv://payal:payal>@cluster0.ywaczaj.mongodb.net/"
//     //"mongodb+srv://payal:payal@cluster0.exky1mm.mongodb.net/"
//   );
// };
// module.exports = connectDb;


const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(
      // "mongodb+srv://payalmalakar:payal777@cluster0.qk1xsb4.mongodb.net/Devtinder?appName=Cluster0"
      // 'mongodb+srv://payalmalakar:payal777@cluster0.qk1xsb4.mongodb.net/Devtinder?retryWrites=true&w=majority'
    'mongodb://127.0.0.1:27017/devTinder'
    );
    console.log("✅ Database connected");
  } catch (err) {
    console.log("❌ Database connection failed:", err.message);
    throw err; // 🔥 MUST ADD THIS
  }
};

module.exports = connectDb;
