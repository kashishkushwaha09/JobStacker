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
const jobValidation=[
    body("title").trim().notEmpty().withMessage('Name is required'),
    body("description").trim().notEmpty().withMessage('Name is required'),
    body("salary").trim().notEmpty().withMessage('salary is required'),
    body("location").trim().notEmpty().withMessage('location is required'),
    body("jobType")
    .optional()
    .isIn(['Full-Time', 'Part-Time', 'Internship', 'Remote', 'Contract'])
    .withMessage("Invalid job type"),

  body("experienceLevel")
    .optional()
    .isIn(['Fresher', 'Junior', 'Mid-Level', 'Senior'])
    .withMessage("Invalid experience level"),

  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format (use YYYY-MM-DD)"),

  body("openings")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Openings must be a positive integer")
    
]
    module.exports={
        signUpValidation,signInValidation,jobValidation
    };