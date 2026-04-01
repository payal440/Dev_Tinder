const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());

const authRouter = require("./Routes/auth")
const profileRouters = require("./Routes/profile")
const requestRouter = require("./Routes/Request")
const userRouter = require("./Routes/user")

app.use("/",authRouter)
app.use("/",profileRouters)
app.use("/",requestRouter)
app.use("/", userRouter)

connectDb()
  .then(() => {
    console.log("✅ database connection established...");
    app.listen(8080, () => {
      console.log("🚀 server is running on port 8080");
    });
  })
  .catch((err) => {
    console.log("❌ database cannot be connected!!");
    console.error(err);   // IMPORTANT
  });
