const express = require('express');
const app = express();
const userRouter = require("./routers/users");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/users", userRouter);

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));