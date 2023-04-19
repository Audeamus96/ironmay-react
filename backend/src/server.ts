import express from "express";
const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Hello, World!")
});

app.listen({port:PORT}, () => {
    console.log("Server running on port: ", PORT)
});