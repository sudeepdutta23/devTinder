const express = require('express');
const app = express();
const PORT = process.env.PORT || 7777;

app.get("/user", (req, res, next) => {
    res.send({
        firstName: "Sudeep",
        lastName: "Dutta",
        age: 25
    });
})

app.post("/user", (req, res, next) => {
    console.log(req.body);
    res.send('Data successfuly saved to database!');
})

app.delete("/user", (req, res, next) => {
    console.log(req.body);
    res.send('Deleted Successfully!');
})

app.use("/test", (req, res, next) => {
    res.send('hello from the server');
})

app.use("/", (req, res, next) => {
    res.send('Namaste Sudeep');
})

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
})