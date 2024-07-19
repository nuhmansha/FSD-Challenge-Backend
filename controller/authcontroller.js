const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Assuming JWT is used later

module.exports = {
  userSignupPost: async (req, res) => {
    console.log("Signup request received");

    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      console.log(existingUser,"existuser");
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      console.log(newUser,"new");

      // Handle successful signup (e.g., send confirmation email, redirect)
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error.message);
      // Handle errors more informatively based on error type
      res.status(500).json({ message: "Internal server error" }); // Generic for now
    }
  },
};
