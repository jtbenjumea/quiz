var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

// GET home page
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload
router.param('quizId', quizController.load);

// Definición de rutas
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/author', 						quizController.author);

module.exports = router;
