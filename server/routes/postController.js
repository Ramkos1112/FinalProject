import { v4 as generateID } from 'uuid';
import { getDB } from '../index.js';

const dynamicQuery = (reqQuery) => {
    const settings = {
        filter: {},
        sort: {},
        skip: 0,
        limit: 20
    }
    for (const key in reqQuery) {
        const [action, field, operator] = key.split('_');
        const value = reqQuery[key];
        
        if(action === 'sort') {
            settings.sort[field] = Number(value);
            settings.sort._id = 1;
        }else if(action === 'skip'){
          settings.skip = Number(reqQuery[key]);
        }else if(action === 'limit'){
          settings.limit = Number(reqQuery[key]);
        }else if(action === 'filter'){
            if(!operator){
                if(field === 'isAnswered'){
                    settings.filter[field] = value === 'true';
                }else if(field === 'title'){
                    settings.filter[field] = { $regex: new RegExp(value, 'i') };
                }else if(field === 'tags'){
                    if(Array.isArray(value)){
                        settings.filter[field] = { $in: value };                 
                    }else{
                        settings.filter[field] = { $in: [value] };                 
                    }
                }else{
                    settings.filter[field] = { $regex: new RegExp(value, 'i') };                    
                }
            }else{
                const $operator = '$' + operator;
                if(!settings.filter[field]){
                    settings.filter[field] = { [$operator]: Number(value) };
                }else{
                    settings.filter[field][$operator] = Number(value);
                }
            }        
        }
    }
    return settings;
};

export const getAllQuestions = async (req, res) => {
    const client = await getDB();
    try{
        const settings = dynamicQuery(req.query);
        const questions = await client
            .db('ForumProject')
            .collection('questions')
            .find(settings.filter)
            .sort(settings.sort)
            .skip(settings.skip)
            .limit(settings.limit)
            .toArray();
        const users = await client
            .db('ForumProject')
            .collection('users')
            .find()
            .toArray();
        const usersMap = Object.fromEntries(users.map(user => [user._id, user.username])); 
        const questionsWithAuthor = questions.map(q => ({...q, authorUsername: usersMap[q.authorId] || 'Unknown'}));
        res.send(questionsWithAuthor);   
    }catch(err){
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    }finally{
        await client.close();
    }
};

export const getQuestionsAmount = async (req, res) => {
    const client = await getDB();
    try{
        const settings = dynamicQuery(req.query);
        const backResponse = await client
            .db('ForumProject')
            .collection('questions')
            .aggregate([
                {$match: settings.filter},
                {$count: 'count'}
            ])
            .toArray();
        const count = Array.isArray(backResponse) && backResponse.length > 0 ? backResponse[0].count : 0;
        res.send({ totalAmount: count });
    }catch(err){
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    }finally{
        await client.close();
    }
}

export const getSpecQuestion = async (req, res) => {
    const client = await getDB();
    try{
        const { _id } = req.params;
        const question = await client
        .db('ForumProject')
        .collection('questions')
        .findOne({ _id: _id });

        if(!question){
            return res.status(404).send({ error: `Question with id ${_id} not found.`});
        }
        res.json(question);
    }catch(err){
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    }finally{
        await client.close();
    }
}

export const addNewQuestion = async (req, res) => {
    const client = await getDB();
    try{
        const newQuestion = {
            _id: generateID(),
            title: req.body.title,
            body: req.body.body,
            authorId: req.user._id,
            createdAt: new Date(),
            updatedAt: new Date(),
            isEdited: false,
            isAnswered: false,
            tags: req.body.tags || [],
            answersCount: 0
        };
        await client
            .db('ForumProject')
            .collection('questions')
            .insertOne(newQuestion);
        res.send({ success: 'Question successfully added', newQuestion });
    }catch(err){
        console.log(err);
        res.status(500).send({ error: err.message, message: `Something went wrong with servers, please try again later.` });
    }finally{
        await client.close();
    }
}

export const deleteQuestion = async (req, res) => {
    const client = await getDB();
    try{
        const { _id } = req.params;
        const userId = req.user?._id;
        if(!userId){
            return res.status(401).send({error: 'Unauthorized. No user'});
        }
        const question = await client
        .db('ForumProject')
        .collection('questions')
        .findOne({ _id });

        if (!question) {
            return res.status(404).send({ error: `No question with ID ${_id}.` });
        }
        if (question.authorId !== userId) {
            return res.status(403).send({ error: 'You are not allowed to delete this question.' });
        }

        await client
            .db('ForumProject')
            .collection('answers')
            .deleteMany({ questionId: _id});
        const result = await client
            .db('ForumProject')
            .collection('questions')
            .deleteOne({ _id });

        if(result.deletedCount){
            res.send({ success: `Question with ID ${_id} was deleted successfully.` });
        }else{
            res.status(404).send({ error: `Failed to delete. No question with ID ${_id}.` });
        }
    }catch(err){
        console.log(err);
        res.status(500).send({ error: err.message, message: `Something went wrong with servers, please try again later.` });
    }finally{
        await client.close();
    }
}

export const editQuestion = async (req, res) => {
    const client = await getDB();
    try{
        const { _id } = req.params;
        const userId = req.user._id;

        const existingQuestion = await client
            .db('ForumProject')
            .collection('questions')
            .findOne({ _id });

        if(!existingQuestion){
           return res.status(404).send({ error: 'Question not found' }); 
        }
        if (existingQuestion.authorId !== userId) {
            return res.status(403).send({ error: 'You can only edit your own questions' });
        }

        const updatedFields = {
            title: req.body.title,
            body: req.body.body,
            tags: req.body.tags || [],
            updatedAt: new Date(),
            isEdited: true
        };

        const result = await client
            .db('ForumProject')
            .collection('questions')
            .updateOne(
                {_id},
                {$set: updatedFields}
            );
        if (result.modifiedCount === 0) {
            return res.status(400).send({ error: 'No changes were made' });
        }
        res.send({ success: 'Question updated successfully' });
    }catch(err){
        console.log(err);
        res.status(500).send({ error: err.message, message: `Something went wrong with servers, please try again later.` });
    }finally{
        await client.close();
    }
}