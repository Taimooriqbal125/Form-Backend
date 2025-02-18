const { check, validationResult } = require("express-validator");

const siginupmiddleware = [
    check("name", "Name is required").not().isEmpty(),
    check("username", "Username is required").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("phone", "Invalid phone number").isMobilePhone(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Proceed if no errors
    },
];

module.exports = siginupmiddleware;
