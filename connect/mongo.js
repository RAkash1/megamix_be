const mongoose = require("mongoose");

const connect = () => {
  console.log(process.env.MONGO_URL)
  return mongoose.connect(process.env.MONGO_URL)
  .then(console.log("<-------> connection successfull <------->"))
  .catch((err) => console.log(err));
};

module.exports = connect;