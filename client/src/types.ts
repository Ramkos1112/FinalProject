export type ChildrenElementProp = { children: React.ReactElement };
export type ChildrenNodeProp = { children: React.ReactNode };

export type User = {
    _id: string,
    username: string,
    fullName: string,
    email: string,
    password?: string,
    passwordRepeat?: string,
    avatar: string,
    createdAt?: string
};

export type UserContextReducerActions = 
    { type: 'setUser', user: Omit<User, 'password'> } |
    { type: 'logUserOut' } |
    { type: 'editUser', user: Omit<User, 'password'>};

export type UserContextType = {
    loggedInUser: Omit<User, "password"> | null,
    login: ({ username, password }: Pick<User, "username" | "password">, keepLoggedIn: boolean) => Promise<{ error: string } | { success: string }>,
    logOut: () => void,
    register: (registerInfo: Omit<User, "_id">) => Promise<{ error: string} | {success: string}>
    editUserInfo: (editedUser: User) => Promise<{error: string} | {success: string}>
};

export type Question = {
    _id: string,
    title: string,
    body: string,
    authorId: string,
    authorUsername: string,
    createdAt: string,
    updatedAt: string,
    isEdited: boolean,
    tags: string[],
    answersCount: number,
    isAnswered: boolean
}

export type QuestionActionTypes = 
    { type: 'setData', data: Question[] } |
    { type: 'addQuestion', newQuestion: Question } |
    { type: 'deleteQuestion', _id: Question['_id']} |
    { type: 'editQuestion', editedQuestion: Question } |
    { type: 'updateAnswersCount'; questionId: string; change: number };
    
export type QuestionsContextType = {
    changePageSize: (size: number) => void,
    changePage: (newPage: number) => void,
    currentPage: number,
    pageSize: number,
    changeSort: (sortValue: string) => void,
    changeFilter: (filterValue: string) => void,
    filteredDataAmount: number,
    refetchQuestions: () => Promise<void>,
    questions: Question[],
    dispatch: React.ActionDispatch<[action: QuestionActionTypes]>,
    isLoading: boolean,
    addNewQuestion: (newQuestion: Pick<Question, 'title' | 'body' | 'tags'>) => Promise<{ error: string } | { success: string }>,
    deleteQuestion: (_id: Question["_id"]) => void,
    editQuestion: (editedQuestion: Question) => Promise<{ error: string } | { success: string }>
};

export type Answer = {
    _id: string,
    questionId: string,
    authorId: string,
    authorUsername: string,
    body: string,
    createdAt: string,
    updatedAt: string,
    isEdited: boolean
}

export type AnswerActionTypes = 
    { type: 'setData', data: Answer[] } |
    { type: 'addAnswer', newAnswer: Answer } |
    { type: 'deleteAnswer', _id: Answer['_id']} |
    { type: 'editAnswer', editedAnswer: Answer };

export type AnswersContextType = {
    answers: Answer[],
    dispatch: React.ActionDispatch<[action: AnswerActionTypes]>,
    answerIsLoading: boolean,
    addNewAnswer: (newAnswer: Pick<Answer, 'body'>) => Promise<{ error: string } | { success: string }>,
    deleteAnswer: (_id: Answer['_id']) => void,
    editAnswer: (editedAnswer: Answer) => Promise<{ error: string } | { success: string }>
}

export type InputFieldProps = {
    inputType: string, 
    inputName: string,
    inputId: string,
    inputValue: string | number,
    inputOnChange: React.ChangeEventHandler<HTMLInputElement>,
    inputOnBlur: React.FocusEventHandler<HTMLInputElement>,
    labelFor: string,
    labelText: string,
    touched: boolean | undefined,
    errors: string | undefined
};

export type MultiSelectProps = {
    options: string[],
    selected: string[],
    onChange: (selected: string[]) => void,
    maxSelected?: number,
    errors?: string | string[] | undefined,
    touched?: boolean | undefined
};