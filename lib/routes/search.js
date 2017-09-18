const Router = require('express').Router;
const router = Router();
const superAgent = require('superagent');

router
    .get('/:query', (req, res, next) => {
        superAgent
            .get((`https://api.quizlet.com/2.0/search/sets?client_id=${process.env.QUIZLET_TOKEN}&q=${req.params.query}`))
            .then(results => {
                if (JSON.parse(results.text).total_results === 0) res.send({ results: 0 });
                else {
                    const resultsArray = results.body.sets;
                    const setsArray = resultsArray.map(set => {
                        return {
                            id: set.id,
                            title: set.title,
                            url: set.url,
                            description: set.description,
                            term_count: set.term_count
                        };
                    });
                    res.send(setsArray);
                }
            })
            .catch(next);
    });

module.exports = router;