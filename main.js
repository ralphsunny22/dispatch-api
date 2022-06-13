const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const parcelsRoute = require("./routes/parcels");
const conveysRoute = require("./routes/conveys");
const sendPackagesRoute = require("./routes/sendPackages");
const receivePackagesRoute = require("./routes/receivePackages");
const packageSummaryRoute = require("./routes/packageSummaries");
const payoutSummaryRoute = require("./routes/payoutSummaries");
const orderRoute = require("./routes/orders");
const walletRoute = require("./routes/wallets");
const transitRoute = require("./routes/transits");
const riderRoute = require("./routes/riders");



//making our appln an object
const app = express()
dotenv.config()

//json & cors middleware
app.use(cors())
app.use(cookieParser())
app.use(express.json());


// prefix route entry to other routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/parcels", parcelsRoute);
app.use("/api/conveys", conveysRoute);
app.use("/api/sendPackages", sendPackagesRoute);
app.use("/api/receivePackages", receivePackagesRoute);
app.use("/api/packageSummaries", packageSummaryRoute);
app.use("/api/payoutSummaries", payoutSummaryRoute);
app.use("/api/orders", orderRoute);
app.use("/api/wallets", walletRoute);
app.use("/api/transits", transitRoute);
app.use("/api/riders", riderRoute);


//set port, mongoose db
const port = process.env.PORT || 5000
const db_uri = process.env.DB_URI

app.listen(port, console.log(`Server running on port ${port}`))

//connecting to mongodb
mongoose.connect(db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));