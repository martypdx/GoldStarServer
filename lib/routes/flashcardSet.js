const Router = require('express').Router;
const router = Router();
const FlashcardSet = require('../models/flashcardSet');

router
    // GET ALL SETS
    .get('/', (req, res, next) => {
        FlashcardSet.find()
            .lean()
            .then(set => res.send(set))
            .catch(next);
    })
    // ADD NEW SET
    .post('/', (req, res, next) => {
        const set = new FlashcardSet(req.body);
        set.save()
            .then(set => res.send(set))
            .catch(next);
    })
    // GET ONE SET
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
    // UPDATE ONE SET
    .put('/:id', (req, res, next) => {
        FlashcardSet.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(set => res.send(set))
            .catch(next);
    })
    // DELETE A SET
    .delete('/:id', (req, res, next) => {
        FlashcardSet.findByIdAndRemove(req.params.id) // req.user.id?
            .then(response => {
                res.send({ removed: response ? true : false });
            })
            .catch(next);
    })
    // ADD CARDS TO A SET
    .post('/:id/cards', (req, res, next) => {
        FlashcardSet.findByIdAndUpdate(req.params.id, {
            $addToSet: { cards: { $each: req.body} }
        }, { new: true })
            .then(set => {
                res.send(set.cards);
            })
            .catch(next);
    })
    // DELETE CARDS FROM SET
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

// .delete('/:id/cards', (req, res, next) => {
//     FlashcardSet.findByIdAndUpdate(req.params.id, {
//         $pull: { cards: req.body }
//     }, { new: true, runValidators: true })
//         .then(set => {
//             res.send(set.cards);
//         })
//         .catch(next);
// });


module.exports = router;