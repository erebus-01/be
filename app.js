const express = require('express')

const PORT = process.env.PORT || 5000;
const app = express();

app.use("/", require('./routes/AdminRoute'));
app.use("/auth/v1/", require('./routes/CustomerRoute'));

app.listen(PORT, console.log(`Server listening on ${PORT}`))