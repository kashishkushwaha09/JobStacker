const {body}=require('express-validator');


 const signUpValidation=[   body('name').notEmpty().withMessage('name is required'),
        body("email")
        .isEmail()
        .withMessage("Enter a valid email").normalizeEmail(),
        body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
        .matches(/[A-Z]/).withMessage('Must include at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Must include at least one lowercase letter')
        .matches(/\d/).withMessage('Must include at least one number')
    ]
const signInValidation=[
    body("email")
        .isEmail()
        .withMessage("Enter a valid email").normalizeEmail(),
        body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
        .matches(/[A-Z]/).withMessage('Must include at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Must include at least one lowercase letter')
        .matches(/\d/).withMessage('Must include at least one number')
]
    module.exports={
        signUpValidation,signInValidation
    };