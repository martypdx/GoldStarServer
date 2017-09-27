const Router = require('express').Router;
const router = Router();
const FlashcardSet = require('../models/flashcardSet');

router
    .get('/', (req, res, next) => {
        FlashcardSet.find()
            .lean()
            .then(set => res.send(set))
            .catch(next);
    })

    .post('/', (req, res, next) => {
        const set = new FlashcardSet(req.body);
        set.save()
            .then(set => res.send(set))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        FlashcardSet.findById(id)
            .lean()
            .then(set => {
                if (!set) throw {
                    code: 404,
                    error: `set ${id} does not exist`
                };
                res.send(set);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        FlashcardSet.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(set => res.send(set))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        FlashcardSet.findByIdAndRemove(req.params.id)
            .then(response => {
                res.send({ removed: response ? true : false });
            })
            .catch(next);
    })

    .post('/:id/cards', (req, res, next) => {
        FlashcardSet.findByIdAndUpdate(req.params.id, {
            $addToSet: { cards: { $each: req.body} }
        }, { new: true })
            .then(set => {
                res.send(set.cards);
            })
            .catch(next);
    })

    .delete('/:id/cards/:cardId', (req, res, next) => {
        const { id, cardId } = req.params;
        FlashcardSet.findByIdAndUpdate(id, {
            $pull: { cards: { _id: cardId } }
        }, { new: true, runValidators: true })
            .then(({ cards }) => {
                res.send({ cardCount: cards.length});
            })
            .catch(next);
    });

module.exports = router;