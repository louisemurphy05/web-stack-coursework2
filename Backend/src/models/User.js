import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User schema defining the structure of user documents in MongoDB, including fields for username, email, password,
// and timestamps. Passwords are hashed before saving, and a method is provided for comparing passwords during login.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  }, 
  { 
    timestamps: true,
    collection: "details"  // This forces the collection name to be "Details"
  }
);

// Hash password before saving
userSchema.pre("save", async function() {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);