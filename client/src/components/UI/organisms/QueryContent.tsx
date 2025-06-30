import styled from "styled-components";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";

import QuestionsContext from "../../contexts/QuestionContext.tsx";
import { AnswersContextType, Question, QuestionsContextType, UserContextType } from "../../../types";
import UsersContext from "../../contexts/UserContext.tsx";
import EditingQuestion from "../molecules/EditingQuestion.tsx";
import AnswersContext from "../../contexts/RepliesContext.tsx";
import AnswerInput from "../../UI/molecules/ReplyInput.tsx";
import EditingAnswer from "../../UI/molecules/ReplyEdit.tsx";

const StyledSection = styled.section`
    padding: 20px 200px;
    font-weight: 600;
    .container{
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px;
        margin: 20px;
        border-radius: 40px;
        background-color: var(--color-background);
        box-shadow: 0 6px 12px var(--color-secondary);

    }
    .buttons{
        display: flex;
        gap: 10px;
        padding-bottom: 20px;
    }
    .edit, .delete{
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        height: 30px;
        font-weight: 600;
        box-shadow: 0 1px 2px var(--color-secondary);
        font-family: "Times New Roman", Times, serif;
        cursor: pointer;
    }
    .edit:hover{
        background-color: var(--color-accentText);
        transition: 0.3s;
    }  
    .delete:hover, .cancel:hover{
        background-color: #cc7e7e;
        transition: 0.3s;
    }
    .dates{
        display: flex;
        gap: 10px;
        align-items: baseline;
        >span{
            font-weight: 600;
        }
        >.isEdited{
            font-style: italic;
            font-size: 12px;
            color: var(--color-secondary);
        }
    }
    .name{
        font-weight: 600;
        font-style: italic;
        color: var(--color-secondary);
    }
    .tags{
        margin-bottom: 15px;
        >span{
            background-color: var(--color-secondary);
            color: var(--color-primary);
            border-radius: 10px;
            padding: 1px 10px;
            margin-right: 8px;
        }
    }
    .answer{
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        margin: 20px 0px;
        height: 30px;
        width: 100px;
        font-weight: 600;
        font-family: "Times New Roman", Times, serif;
        cursor: pointer;
        animation: glow 2s infinite ease-in-out;
    }
    .answer:hover{
        color: var(--color-accentText);
    }
    .oneAnswer{
        padding: 20px;
        border-radius: 40px;
        box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 0px) and (max-width: 767px) {
        padding: 20px;
    }
    @media (min-width: 768px) and (max-width: 1080px) {
        padding: 20px 100px;
    }
`

const SpecificQuestionContent = () => {

    const {_id} = useParams();
    const { questions, isLoading, deleteQuestion } = useContext(QuestionsContext) as QuestionsContextType;
    const { answers, answerIsLoading, deleteAnswer } = useContext(AnswersContext) as AnswersContextType;
    const { loggedInUser } = useContext(UsersContext) as UserContextType;

    const [ question, setQuestion ] = useState<Question | null>(null);
    const [ isEditing, setIsEditing ] = useState(false);
    const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    
    useEffect(() => {
        if(!isLoading && questions.length){
            const found = questions.find(q => q._id === _id);
            setQuestion(found || null);
        }
    }, [_id, questions, isLoading]);

    return ( 
        <StyledSection>
            <div className="container">
                {
                    question && question.authorId === loggedInUser?._id && (
                    <div className="buttons">
                        <button onClick={() => deleteQuestion(question._id)} className="delete">Delete</button>
                        <button onClick={() => setIsEditing((prev) => !prev)} className={`edit ${isEditing ? "cancel" : ""}`}>
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                    </div>
                )}
                {
                    isLoading ? <p>Data is loading...</p> :
                    !question ? <p>Question not found</p> :
                    isEditing && question.authorId === loggedInUser?._id ? (
                        <EditingQuestion question={question} onClose={() => setIsEditing(false)} />
                    ) : (
                        <div>
                            <div className="dates">
                                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                                {
                                    question.isEdited && (
                                        <span className="isEdited">Edited {new Date (question.updatedAt).toLocaleDateString()}</span>
                                    )
                                }
                            </div>
                            <p className="name">{question.authorUsername} asked:</p>
                            <h3>{question.title}</h3>
                            <p>{question.body}</p>
                            <p className="tags">{question.tags.map((tag, index) => (
                                <span key={index}>{tag}</span>
                            ))}</p>
                        </div>
                    )
                }
            </div>
            <div className="container">
                {
                    loggedInUser && (
                        <button onClick={() => setIsOpen(true)} className="answer">Answer</button>
                )}
                <AnswerInput isOpen={isOpen} onClose={() => setIsOpen(false)}/>
                {
                    answerIsLoading ? (<p>Answers are loading...</p>) :
                    answers.length > 0 ? (
                            answers.map(answer => (
                                <div key={answer._id}>
                                {
                                    editingAnswerId && editingAnswerId === answer._id ? (
                                        <EditingAnswer
                                        answer={answer}
                                        onClose={() => setEditingAnswerId (null)}
                                    />
                                ) : (
                                    <div className="oneAnswer">
                                        <div className="dates">
                                            <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                                            {
                                                answer.isEdited && (
                                                    <span className="isEdited">Edited {new Date(answer.updatedAt).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                        <p className="name">{answer.authorUsername} answered:</p>
                                        <p>{answer.body}</p>
                                        {
                                            answer.authorId === loggedInUser?._id && (
                                                <div className="buttons">
                                                    <button onClick={() => deleteAnswer(answer._id)} className="delete">Delete</button>
                                                    {
                                                    editingAnswerId !== answer._id && (
                                                        <button onClick={() => setEditingAnswerId(answer._id)} className="edit">Edit</button>
                                                    )}
                                                </div>
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                            ))
                        ) : (<p>No answers yet</p>)
                    }
            </div>
        </StyledSection>
    );
}
 
export default SpecificQuestionContent;