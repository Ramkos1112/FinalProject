import { v4 as generateID } from 'uuid';
import { getDB } from '../index.js';

export const getAllLikes = async (req, res) => {
  const db = getDB();
  try {
    const { targetType, targetId } = req.params;
    const count = await db.collection('likes').countDocuments({ targetType, targetId });
    res.send({ targetId, targetType, likesCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};

export const toggleLike = async (req, res) => {
  const db = getDB();
  try {
    const userId = req.user._id;
    const { targetType, targetId } = req.params;

    const likesCollection = db.collection('likes');
    const existingLike = await likesCollection.findOne({ userId, targetType, targetId });

    if (existingLike) {
      await likesCollection.deleteOne({ userId, targetType, targetId });
      return res.send({ success: 'Like removed', liked: false });
    } else {
      await likesCollection.insertOne({
        _id: generateID(),
        userId,
        targetType,
        targetId,
        value: 1,
      });
      return res.send({ success: 'Liked', liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};

export const getUserLikes = async (req, res) => {
  const db = getDB();
  try {
    const { targetType, targetId } = req.params;
    const userId = req.user._id;

    const like = await db.collection('likes').findOne({ userId, targetType, targetId });
    res.send({ targetId, targetType, liked: !!like });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};

export const getAllUserLikedQuestions = async (req, res) => {
  const db = getDB();
  try {
    const userId = req.user._id;
    const liked = await db.collection('likes').find({ userId, targetType: 'question' }).toArray();

    const questionIds = liked.map(l => l.targetId);
    const questions = await db.collection('questions')
      .find({ _id: { $in: questionIds } })
      .toArray();

    res.send({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};