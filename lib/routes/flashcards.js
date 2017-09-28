const Router = require('express').Router;
const router = Router();
const superAgent = require('superagent');

const SETS_URL = `https://api.quizlet.com/2.0/sets/`;
const CLIENT_ID = `?client_id=${process.env.QUIZLET_TOKEN}`;

router
    .get('/:id', (req, res, next) => {
        superAgent
            .get(`${SETS_URL}${req.params.id}${CLIENT_ID}`)
            .then(({ body }) => {
                // don't name things by data type
                const terms = body.terms.map(term => {
                    return {
                        id: term.id,
                        term: term.term,
                        definition: term.definition,
                        order: term.rank +1
                    };
                });
                res.send(terms);
            })
            .catch(next);
    })
    .get('/:query', (req, res, next) => {
        superAgent
            .get(`${SETS_URL}${CLIENT_ID}&q=${req.params.query}`)
            // of response is of type application/json, then superagent already parses to results.body:
            .then(({ body }) => {
                const { total_results, sets } = body;

                if (total_results === 0) res.send({ results: 0 });
                else {
                    const mapped = sets.map(set => {
                        return {
                            id: set.id,
                            title: set.title,
                            url: set.url,
                            description: set.description,
                            created_by: set.created_by,
                            term_count: set.term_count
                        };
                    });
                    res.send(mapped);
                }
            })
            .catch(next);
    });


module.exports = router;