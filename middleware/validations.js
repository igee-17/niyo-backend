const { param, body } = require('express-validator');
const { validationResult } = require('express-validator');

// Validation middleware
const validate = (validations) => async (req, res, next) => {
    for (let validation of validations) {
        await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    res.status(422).json({ errors: errors.array() });
};

const getTaskValidation = validate([
    param('id').isInt().withMessage('Task ID must be an integer')
])

const createTaskValidation = validate([
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('completed').isBoolean().optional().withMessage('Completed must be a boolean value (true/false)')
])

const modifyTaskValidation = validate([
    param('id').isInt().withMessage('Task ID must be an integer'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('status').optional().isIn(['in-progress', 'in-review', 'completed']).withMessage('Invalid status value, status can only either be in-progress, in-review or completed')
])

module.exports = {
    validate, getTaskValidation, createTaskValidation, modifyTaskValidation
}
