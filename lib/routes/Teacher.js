const Router = require('express').Router;
const router = Router();
const Teacher = require('../models/teacher');

router
    .get('/', (req,res,next) => {
        Teacher.findById(req.user.id)
            .select('name photo courses')
            .lean()
            .then(teacher => res.send(teacher))
            .catch(next);
    })
    .put('/', (req, res, next) => {
        Teacher.findByIdAndUpdate(req.user.id, req.body, { new: true })
            .then(updated => {
                delete updated.hash;
                res.send(updated);
            })
            .catch(next);
    });

module.exports = router;