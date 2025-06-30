import { v4 as generateID } from 'uuid';
import { getDB } from '../index.js';

export const getAllLikes = async (req, res) => {
    const client = await getDB();
    try{
        const { questionId } = req.params;
        const count = await client
            .db('ForumProject')
            .collection('likes')
            .countDocuments({ questionId });
        res.send({ questionId, likesCount: count });
    }catch(err){
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    }finally{
        await client.close();
    }
};

export const toggleLike = async (req, res) => {
    const client = await getDB();
    try{
        const userId = req.user._id;
        const { questionId } = req.params;

        const likesCollection = await client
            .db('ForumProject')
            .collection('likes');

        const existingLike = await likesCollection.findOne({ questionId, userId });

        if (existingLike) {
            await likesCollection.deleteOne({ questionId, userId });
            return res.send({ success: 'Like removed', liked: false });
        } else {
            await likesCollection.insertOne({
                _id: generateID(),  
                questionId,
                userId,
                value: 1,
            });
        return res.send({ success: 'Liked successfully', liked: true });
        }
    }catch(err){
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    }finally{
        await client.close();
    }
};

export const getUserLikes = async (req, res) => {
    const client = await getDB();
    try {
        const { questionId } = req.params;
        const userId = req.user._id;

        const like = await client
            .db('ForumProject')
            .collection('likes')
            .findOne({ questionId, userId });
        res.send({ questionId, liked: !!like });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    } finally {
        await client.close();
    }
};

export const getAllUserLikedQuestions = async (req, res) => {
    const client = await getDB();
    try{
        const userId = req.user._id;
        const likedQuestions = await client
            .db('ForumProject')
            .collection('likes')
            .find({ userId })
            .toArray();
        const questionIds = likedQuestions.map(q => q.questionId);
        const questions = await client
            .db('ForumProject')
            .collection('questions')
            .find({ _id: { $in: questionIds } })
            .toArray();
        res.send({ questions });
    }catch(err){
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    }finally{
        await client.close();
    }
};