const Router = require('express').Router;
const router = Router();
const superAgent = require('superagent');

router
    .get('/:id', (req, res, next) => {
        superAgent
            .get((`https://api.quizlet.com/2.0/sets/${req.params.id}?client_id=${process.env.QUIZLET_TOKEN}`))
            .then(results => {
                const resultsArray = results.body.terms;
                const termsArray = resultsArray.map(term => {
                    return {
                        id: term.id,
                        term: term.term,
                        definition: term.definition,
                        order: term.rank +1
                    };
                });
                res.send(termsArray);
            })
            .catch(next);
    });

module.exports = router;