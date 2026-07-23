const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// console.log(passportLocalMongoose);
// console.log(typeof passportLocalMongoose);

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose); //it is used because plugin implements automatically hashing,username,password,salting

module.exports = mongoose.model("User", userSchema);
