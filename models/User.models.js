const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define what a user looks like in our database
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // match:[/^[A-Za-z\s]-$/, 'Must contain only letters and spaces'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true, //Automatically generated the timethe user was created(it comes default form MongoDB)
  }
);

// Hash password
userSchema.pre("save", async function (next) {
  // if not new or recently modified continue to saving.
  if (this.isModified("password")) return next();

  // if its new or recently modilfied.
  this.password = await bcrypt.hash(this.password, 10);
});

//to compare password or login.
userSchema.methods.comparePassword = async function (representedPassword) {
  return bcrypt.compare(representedPassword, this.password);
};

// exports the schema to be used in the controller.
module.exports = mongoose.model("User", userSchema);
