const express = require('express');
const router = express.Router();
const Exercice = require('../controllers/exerciceController.js');

router.post("",Exercice.createNewexercice)
router.get("",Exercice.listAllExercice)
router.get("/:id",Exercice.getExerciceByStudentId)
router.get("/teacher/:id",Exercice.getExerciceByTeacherId)
router.delete("/:id",Exercice.deleteExercice)
router.put("/:id",Exercice.updateExercice);
module.exports = router