const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {validateMovieCreate, validateMovieUpdate} = require('../middleware/validation');
const movieController = require('../controllers/movieController');

//public
router.get('/', movieController.getAll);
router.get('/:id', movieController.getById);

//protected
router.post('/', auth, validateMovieCreate, movieController.create);
router.put('/:id', auth, validateMovieUpdate, movieController.update);
router.delete('/:id', auth, movieController.remove);

module.exports = router;