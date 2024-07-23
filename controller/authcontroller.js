const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to create a JWT
const createJWT = (userId) => {
  const payload = { user: { id: userId } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Helper function to handle Google user signups/logins
const handleGoogleUser = async (email, firstName, lastName) => {
  let user = await User.findOne({ email });
  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();
  }
  return user;
};

module.exports = {
  userSignupPost: async (req, res) => {
    console.log("Signup request received");

    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existingUser = await User.findOne({ email }).exec();
      console.log(existingUser, "Existing user");
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      console.log(newUser, "New user");

      
    } catch (error) {
      console.error("Signup error:", error.message);
      res.status(500).json({ message: "An error occurred" });
    }
  },

  userLoginPost: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login request received", email, password);

      if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await User.findOne({ email }).exec();
      console.log(user, "User found");
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch, "Password match");

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = createJWT(user.id);
      res.json({ token });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ message: "An error occurred" });
    }
  },

  googleSignupPost: async (req, res) => {
    console.log("Google Signup request received");

    try {
      const { idToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const {
        email,
        given_name: firstName,
        family_name: lastName,
      } = ticket.getPayload();

      const user = await handleGoogleUser(email, firstName, lastName);

      const token = createJWT(user.id);
      res.json({ token });
    } catch (error) {
      console.error("Google Signup error:", error.message);
      res.status(500).json({ message: "An error occurred" });
    }
  },

  googleLoginPost: async (req, res) => {
    console.log("Google Login request received");

    try {
      const { idToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const {
        email,
        given_name: firstName,
        family_name: lastName,
      } = ticket.getPayload();

      let user = await User.findOne({ email });

      if (!user) {
        // If user does not exist, create a new one
        user = await handleGoogleUser(email, firstName, lastName);
      }

      const token = createJWT(user.id);
      res.json({ token });
    } catch (error) {
      console.error("Google Login error:", error.message);
      res.status(500).json({ message: "An error occurred" });
    }
  },
};
