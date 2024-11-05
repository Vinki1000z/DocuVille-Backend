const express = require('express');
console.log("Attempting to load userConetroller from ../controllers/userController");
const {
  registerUser,
  loginUser,
  deleteUserInfo,
  getUserRole
} = require('../controllers/userController');
console.log("After Attempting to load userController from ../controllers/userController");

const router = express.Router();
const { body } = require('express-validator');
const { isAuth } = require("../middleware/is-Auth");

// POST request to register a new user
router.post('/signup', [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
  body('password', 'Please enter a password of at least 5 characters.')
    .isLength({ min: 5 })
    .trim(),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    })
], registerUser);

// POST request to login a user
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .trim(),
], loginUser);

// GET request to get specific user info
// router.get("/users/:id", isAuth,isAdmin, userInfo);
router.get('/users/role', getUserRole);

router.delete('/users/:id', isAuth, deleteUserInfo);

module.exports = router;
