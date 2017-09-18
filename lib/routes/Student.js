const Router = require('express').Router;
const router = Router();
const Student = require('../models/student');

router
    .get('/', (req,res, next) => {
        Student.findById(req.student.id)
            .select('name photo classes')
            .lean()
            .then(student => res.send(student))
            .catch(next);
    });

module.exports = router;