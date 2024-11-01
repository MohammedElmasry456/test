const path = require("path");
const cors = require("cors");
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const mountRoutes = require("./routes");
const { webhookCheckOut } = require("./services/orderService");

dotenv.config({ path: "./config.env" });

//connect with DB
dbConnection();

// express app
const app = express();
app.post(
  "/webhoock-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckOut
);

app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

//Middlewares
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

app.get("/", (req, res) => {
  res.send("hello world !!");
});

//Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`cant't find this route ${req.originalUrl}`, 400));
});

//global Error Handling
app.use(globalError);

const server = app.listen(process.env.PORT, () => {
  console.log(`Run at port ${process.env.PORT}`);
});

//Handle Error Outside Express
process.on("unhandledRejection", (e) => {
  console.error(`UnhandledRejectione Error: ${e.name} | ${e.message}`);
  server.close(() => {
    console.log("Server Shutting Down.....");
    process.exit(1);
  });
});
