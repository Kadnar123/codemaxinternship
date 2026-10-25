const express=require("express");
//install express
const cors=require("cors");//communicate frontend with backend
const db=require("./db");//used database file
const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(cors());
app.use(express.json());
// Register authentication routes
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
    res.send("Backend is working!");
});
app.get("/api/auth/test", (req, res) => {
    res.send("Auth route is working!");
});


app.listen(5000, () => {
    console.log("Server running on port 5000");
});
