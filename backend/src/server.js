require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

connectDB();

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
