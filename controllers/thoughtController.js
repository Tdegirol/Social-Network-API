const { User, Thought } = require('../models');

const thoughtController = {

    getThoughts(req, res) {
        Thought.find({})
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                ? res.status(404).json({ message: "No associated thought with this ID"})
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((thought) =>
                !thought
                ? res.status(404).json({ message: "No associated thought with this ID"})
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $set: body },
            { runValidators: true, New: true }
        )
            .then((user) =>
                !user
                ? res.status(404).json({ message: "No associated thought with this ID"})
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId})
        .then((thought) => 
            !thought
            ? res.status(404).json({ message: "No associated thought with this ID"})
            : User.findOneAndUpdate(
                { thoughts: params.thoughtId },
                { $pull: {}},
                { new: true }
            )
        )
        .then((user) => 
            !user
                ? res.status(404).json({ message: "Thought deleted, but no user found"})
                : res.json('Thought deleted.')
        )
        .catch((err) => res.status(500).json(err));
    },

    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: "No thought found with this ID"})
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId }}},
            { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: "No thought found with this ID" })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
};