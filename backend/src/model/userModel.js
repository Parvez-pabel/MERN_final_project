const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// it will be modified

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // blogs: [
  //     {
  //         type: Schema.Types.ObjectId,
  //         ref: "Blog",
  //     },
  // ],
  // comments: [
  //     {
  //         type: Schema.Types.ObjectId,
  //         ref: "Comment",
  //     },
  // ],

  // profilePic: String,
  // bio: String,
  // location: String,
});



//password hashing

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const hashPassword = await bcrypt.hash(user.password, 10);
  user.password = hashPassword;
  next();
});
//password validation
UserSchema.methods.comparePassword = function (givenPassword) {
  return bcrypt.compare(givenPassword, this.password);
  
};

const User = model("User", UserSchema);

module.exports = User;
