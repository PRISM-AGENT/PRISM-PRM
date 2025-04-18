/**
 * Assistant Routes
 * Handles assistant-related API endpoints
 */

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const assistantController = require('../controllers/assistantController');

const router = express.Router();

/**
 * @route POST /api/assistant/query
 * @desc 🧠 Process a query with the assistant AI
 * @access Private
 */
router.post('/query',
  protect,
  assistantController.processQuery
);

/**
 * @route POST /api/assistant/create
 * @desc Create a new assistant
 * @access Private
 */
router.post('/create', protect, assistantController.createAssistant);

/**
 * @route GET /api/assistant/list
 * @desc List available assistants
 * @access Public
 */
router.get('/list', assistantController.listAssistants);

/**
 * @route PUT /api/assistant/:id
 * @desc Update an existing assistant
 * @access Private
 */
router.put('/:id', protect, assistantController.updateAssistant);

module.exports = router; 