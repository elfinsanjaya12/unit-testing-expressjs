const express = require('express');
const app = express();
const userRouter = require("./routers/users");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  return res.status(200).json({
    message: "Welcome to Backend API"
  });
});

app.use("/api/v1/users", userRouter);

const port = 3000;
app.listen(port, () => console.log(`Server Running on port ${port}!`));

module.exports = app;