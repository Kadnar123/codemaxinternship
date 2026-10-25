const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Registration failed"
            });
        }

        res.json({
            message: "Registration successful"
        });
    });
});

module.exports = router;