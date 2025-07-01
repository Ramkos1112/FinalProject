import { v4 as generateID } from 'uuid';
import { getDB } from '../index.js';

export const getAnswersForQuestion = async (req, res) => {
    const db = getDB();
    try {
        const answers = await db
            .collection('answers')
            .find({ questionId: req.params.questionId })
            .toArray();

        const users = await db.collection('users').find().toArray();
        const usersMap = Object.fromEntries(users.map(user => [user._id, user.username]));

        const answersWithAuthor = answers.map(answer => ({
            ...answer,
            authorUsername: usersMap[answer.authorId] || 'Unknown'
        }));

        res.send(answersWithAuthor);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message, message: "Something went wrong with the server." });
    }
};

export const addAnswerToQuestion = async (req, res) => {
    const db = getDB();
    try {
        const newAnswer = {
            _id: generateID(),
            body: req.body.body,
            authorId: req.user._id,
            questionId: req.params.questionId,
            createdAt: new Date(),
            updatedAt: new Date(),
            isEdited: false
        };

        await db.collection('answers').insertOne(newAnswer);

        await db.collection('questions').updateOne(
            { _id: req.params.questionId },
            { $inc: { answersCount: 1 } }
        );

        const user = await db.collection('users').findOne({ _id: req.user._id });

        const newAnswerWithUsername = {
            ...newAnswer,
            authorUsername: user?.username || 'Unknown'
        };

        res.send({ success: 'Answer successfully added', newAnswer: newAnswerWithUsername });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message, message: "Something went wrong with the server." });
    }
};

export const deleteAnswer = async (req, res) => {
    const db = getDB();
    try {
        const { _id } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized. No user.' });
        }

        const answer = await db.collection('answers').findOne({ _id });

        if (!answer) {
            return res.status(404).send({ error: `No answer with ID ${_id}.` });
        }

        if (answer.authorId !== userId) {
            return res.status(403).send({ error: 'You are not allowed to delete this answer.' });
        }

        await db.collection('answers').deleteOne({ _id });

        const newCount = await db
            .collection('answers')
            .countDocuments({ questionId: answer.questionId });

        await db.collection('questions').updateOne(
            { _id: answer.questionId },
            { $set: { answersCount: newCount } }
        );

        res.send({ success: `Answer with ID ${_id} was deleted successfully.` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message, message: "Something went wrong with the server." });
    }
};

export const editAnswer = async (req, res) => {
    const db = getDB();
    try {
        const { _id } = req.params;
        const userId = req.user._id;

        const existingAnswer = await db.collection('answers').findOne({ _id });

        if (!existingAnswer) {
            return res.status(404).send({ error: 'Answer not found' });
        }

        if (existingAnswer.authorId !== userId) {
            return res.status(403).send({ error: 'You can only edit your own answers' });
        }

        const updatedFields = {
            body: req.body.body,
            updatedAt: new Date(),
            isEdited: true
        };

        const result = await db.collection('answers').updateOne(
            { _id },
            { $set: updatedFields }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).send({ error: 'No changes were made' });
        }

        res.send({ success: 'Answer updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message, message: "Something went wrong with the server." });
    }
};