const User = require("../models/User");
const Document = require("../models/Documentation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password, isAdmin = false } = req.body; // Default to false if not provided

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with hashed password and isAdmin field
    user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    // Save user to the database
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id },'jwt', {
      expiresIn: "1h",
    });

    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare provided password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, 'jwt', {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id,msg:'looged in' });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.userInfo = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if requester is admin
    const requesterId = req.user.id; // Assuming req.user is set by isAuth middleware
    const requester = await User.findById(requesterId);

    // Find user by ID
    const user = await User.findById(userId).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if requester is admin or is requesting their own info
    if (!requester.isAdmin && requesterId !== userId) {
      return res
        .status(403)
        .json({
          message:
            "Access denied. You are not authorized to view this information.",
        });
    }

    // Find documents associated with the user
    const documents = await Document.find({ userId: userId });

    // Respond with user information and associated documents
    res.json({ user, documents });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user info with admin check
exports.deleteUserInfo = async (req, res) => {
  const userIdToDelete = req.params.id;

  try {
    // Check if the requesting user is an admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          error: "Access denied. Only admins can delete user information.",
        });
    }

    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(userIdToDelete);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Respond with a success message
    res.json({
      message: "User information deleted successfully.",
      deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user information:", error);
    res.status(500).json({ error: "Error deleting user information." });
  }
};
exports.getUserRole = async (req, res) => {
  console.log("hello");
  // try {
  //   // Assuming you have user ID from the authenticated token
  //   const userId = req.user.id;

  //   // Find the user in the database by ID
  //   const user = await User.findById(userId);

  //   // Check if user exists
  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }


  //   // Respond with the user's role
  //   res.status(200).json({ isAdmin: user.isAdmin });
  // } catch (error) {
  //   console.error("Error fetching user role:", error);
  //   res.status(500).json({ message: 'Server error' });
  // }
};
