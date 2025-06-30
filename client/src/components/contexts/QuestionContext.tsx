import { createContext, useEffect, useReducer, useState } from "react";
import { QuestionsContextType, Question, QuestionActionTypes, ChildrenElementProp } from "../../types";
import { useNavigate } from "react-router";

const reducer = (state: Question[], action: QuestionActionTypes): Question[] => {
    switch (action.type) {
        case 'setData':
            return action.data;
        case 'addQuestion':
            return [action.newQuestion, ...state];
        case 'deleteQuestion':
            return state.filter(q => q._id !== action._id);
        case 'editQuestion':
            return state.map(q =>
                q._id === action.editedQuestion._id ? action.editedQuestion : q
            );
        default:
            return state;
    }
};

const QuestionsContext = createContext<undefined | QuestionsContextType>(undefined);

const QuestionsProvider = ({ children }: ChildrenElementProp) => {
    const [questions, dispatch] = useReducer(reducer, []);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [sort, setSort] = useState("sort_createdAt=-1");
    const [filter, setFilter] = useState("");
    const [pageSize, setPageSize] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredDataAmount, setFilteredDataAmount] = useState(0);

    const changePageSize = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const changePage = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const changeSort = (sortValue: string) => {
        setSort(sortValue);
        setCurrentPage(1);
    };

    const changeFilter = (filterValue: string) => {
        setFilter(filterValue);
        setCurrentPage(1);
    };

    const getFilteredDataAmount = () => {
        fetch(`http://localhost:5500/questions/getCount?${filter}`)
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    console.error("Error fetching question count:", res.status, text);
                    return;
                }
                return res.json();
            })
            .then(data => {
                if (data?.totalAmount !== undefined) {
                    setFilteredDataAmount(data.totalAmount);
                }
            });
    };

    const fetchData = async () => {
        setIsLoading(true);
        const skip = (currentPage - 1) * pageSize;
        const query = `skip=${skip}&limit=${pageSize}&${sort}&${filter}`;

        fetch(`http://localhost:5500/questions?${query}`)
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    console.error("Error fetching questions:", res.status, text);
                    return [];
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    dispatch({ type: "setData", data });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const refetchQuestions = async () => {
        await fetchData();
        await getFilteredDataAmount();
    };

    const addNewQuestion = async (questionData: Pick<Question, "title" | "body" | "tags">) => {
        const accessJWT = localStorage.getItem("accessJWT") || sessionStorage.getItem("accessJWT");
        if (!accessJWT) return { error: "User is not logged in." };

        try {
            const res = await fetch("http://localhost:5500/questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessJWT}`,
                },
                body: JSON.stringify(questionData),
            });

            const data = await res.json();

            if (!res.ok) {
                return { error: data?.error || "Something went wrong." };
            }

            dispatch({ type: "addQuestion", newQuestion: data.newQuestion });
            return { success: "Question successfully added." };
        } catch (err) {
            console.error(err);
            return { error: "Failed to connect to server." };
        }
    };

    const deleteQuestion = (_id: Question["_id"]) => {
        const accessJWT = localStorage.getItem("accessJWT") || sessionStorage.getItem("accessJWT");
        const confirm = window.confirm("Do you want to delete it?");
        if (!confirm || !accessJWT) return;

        fetch(`http://localhost:5500/questions/${_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessJWT}`,
            },
        }).then(() => {
            dispatch({ type: "deleteQuestion", _id });
            navigate("/questions");
        });
    };

    const editQuestion = async (editedQuestion: Question) => {
        const accessJWT = localStorage.getItem("accessJWT") || sessionStorage.getItem("accessJWT");
        if (!accessJWT) return { error: "User is not logged in." };

        const res = await fetch(`http://localhost:5500/questions/${editedQuestion._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessJWT}`,
            },
            body: JSON.stringify(editedQuestion),
        });

        const data = await res.json();

        if (!res.ok || "error" in data) {
            return { error: data.error || "Failed to edit question." };
        }

        dispatch({ type: "editQuestion", editedQuestion });
        return { success: data.success };
    };

    useEffect(() => {
        fetchData();
        getFilteredDataAmount();
    }, [pageSize, currentPage, sort, filter]);

    return (
        <QuestionsContext.Provider
            value={{
                changePageSize,
                changePage,
                currentPage,
                pageSize,
                changeSort,
                changeFilter,
                filteredDataAmount,
                refetchQuestions,
                questions,
                dispatch,
                isLoading,
                addNewQuestion,
                deleteQuestion,
                editQuestion,
            }}
        >
            {children}
        </QuestionsContext.Provider>
    );
};

export { QuestionsProvider };
export default QuestionsContext;