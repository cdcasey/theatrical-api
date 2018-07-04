const express = require('express');
const router = express.Router();

const usersModel = require('../models/users');

router.get('/', (req, res, next) => {
    usersModel.all()
        .then((users) => {
            res.json({ users });
        })
        .catch(err => next);
});

router.get('/:id', (req, res, next) => {
    usersModel.getById(req.params.id)
        .then((user) => {
            res.json({ user });
        })
        .catch(err => next);
});

module.exports = router;