const Router = require('express').Router;
const router = Router();
const Course = require('../models/course');

router
    .get('/', (req, res, next) => {
        Course.find(req.query)
            .select('title date')
            .lean()
            .then(course => res.send(course))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Course.findById(id)
            .lean()
            .then(course => { 
                if(!course) throw {
                    code: 404,
                    error: `course ${id} does not exist`
                };
                res.send(course);
            })
            .catch(next);
    });

module.exports = router;