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
                if (!course) throw {
                    code: 404,
                    error: `course ${id} does not exist`
                };
                res.send(course);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        const course = new Course(req.body);
        course.save()
            .then(course => res.send(course))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(course => res.send(course))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Course.findByIdAndRemove(req.params.id)
            .then(response => {
                res.send({removed: response ? true: false});
            })
            .catch(next);
    })

    .post('/:id/students', (req, res, next) => {
        Course.findByIdAndUpdate(req.params.id, {
            $addToSet: { roster: {$each: req.body}}
        },{new: true})
            .then(course => {
                res.send(course.roster);
            })
            .catch(next);
    })

    .delete('/:id/students/:studentId', (req, res, next) => {
        const {id, studentId} = req.params;
        Course.findByIdAndUpdate(id, {
            $pull: { roster: {_id: studentId}}
        },{new: true, runValidators: true})
            .then(({students}) => {
                res.send({studentCount: students.length});
            })
            .catch(next);
    })

    .post('/:id/sets', (req, res, next) => {
        Course.findByIdAndUpdate(req.params.id, {
            $addToSet: { flashcardSets: {$each: req.body}}
        },{new: true})
            .then(course => {
                res.send(course.flashcardSets);
            })
            .catch(next);
    })

    .delete('/:id/sets/:setId', (req, res, next) => {
        const {id, setId} = req.params;
        Course.findByIdAndUpdate(id, {
            $pull: { flashcardSets: {_id: setId}}
        },{new: true, runValidators: true})
            .then(({sets}) => {
                res.send({setCount: sets.length});
            })
            .catch(next);
    });

module.exports = router;