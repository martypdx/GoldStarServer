const Router = require('express').Router;
const router = Router();
const Teacher = require('../models/teacher');

router
    .get('/', (req,res,next) => {
        Teacher.findById(req.user.id)
            .select('name bio photo classes')
            .lean()
            .then(teacher => res.send(teacher))
            .catch(next);
    });

module.exports = router;