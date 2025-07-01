import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { ChildrenElementProp, AnswersContextType } from "../../types";

import QuestionsContext from "./QuestionContext";
import { QuestionsContextType } from "../../types";
import { Answer } from "../../types";
import { AnswerActionTypes } from "../../types";

const reducer = (state: Answer[], action: AnswerActionTypes): Answer[] => {
    switch (action.type) {
        case 'setData':
            return action.data;
        case 'addAnswer':
            return [...state, action.newAnswer];
        case 'deleteAnswer':
            return state.filter(q => q._id !== action._id);
        case 'editAnswer':
            return state.map(answer =>
                answer._id === action.editedAnswer._id ? action.editedAnswer : answer
            );
        default:
            return state;
    }
};

type Props = ChildrenElementProp & {
    questionId?: string;
};

const AnswersContext = createContext<undefined | AnswersContextType>(undefined);

const AnswersProvider = ({ children, questionId }: Props) => {
    const [answers, dispatch] = useReducer(reducer, []);
    const [answerIsLoading, setAnswerIsLoading] = useState(true);
    const { refetchQuestions } = useContext(QuestionsContext) as QuestionsContextType;

    const addNewAnswer = async (newAnswer: Pick<Answer, 'body'>) => {
        if (!questionId) return { error: "Invalid questionId" };

        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const response = await fetch(`http://localhost:5500/api/comments/${questionId}/answers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessJWT}`
            },
            body: JSON.stringify(newAnswer)
        });

        const contentType = response.headers.get("content-type");
        if (!response.ok) {
            const error = contentType?.includes("application/json")
                ? await response.json()
                : await response.text();
            return { error };
        }

        const data = await response.json();
        dispatch({
            type: "addAnswer",
            newAnswer: data.newAnswer
        });
        await refetchQuestions();
        return { success: data.success };
    };

    const deleteAnswer = async (_id: Answer['_id']) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const confirm = window.confirm("Do you want to delete it?");
        if (!confirm) return;

        const response = await fetch(`http://localhost:5500/api/comments/answers/${_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessJWT}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            return { error: error.message || "Delete failed" };
        }

        dispatch({
            type: "deleteAnswer",
            _id
        });
        await refetchQuestions();
    };

    const editAnswer = async (editedAnswer: Answer) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const response = await fetch(`http://localhost:5500/api/comments/answers/${editedAnswer._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessJWT}`
            },
            body: JSON.stringify(editedAnswer)
        });

        const data = await response.json();
        if ('error' in data) {
            return { error: data.error };
        }

        dispatch({
            type: "editAnswer",
            editedAnswer
        });
        return { success: data.success };
    };

    useEffect(() => {
        if (!questionId) return;

        setAnswerIsLoading(true);
        fetch(`http://localhost:5500/api/comments/${questionId}/answers`)
            .then(async res => {
                if (!res.ok) {
                    const err = await res.text();
                    console.error("Failed to fetch answers:", res.status, err);
                    return;
                }
                return res.json();
            })
            .then((data: Answer[] | undefined) => {
                if (data) {
                    dispatch({
                        type: "setData",
                        data
                    });
                }
                setAnswerIsLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setAnswerIsLoading(false);
            });
    }, [questionId]);

    return (
        <AnswersContext.Provider
            value={{
                answers,
                dispatch,
                answerIsLoading,
                addNewAnswer,
                deleteAnswer,
                editAnswer
            }}
        >
            {children}
        </AnswersContext.Provider>
    );
};

export { AnswersProvider };
export default AnswersContext;