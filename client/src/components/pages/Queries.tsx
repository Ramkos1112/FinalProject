import styled from "styled-components";
import { useContext } from "react";
import { Link } from "react-router";

import QuestionsContext from "../contexts/QuestionContext.tsx";
import UsersContext from "../contexts/UserContext.tsx";
import { QuestionsContextType, UserContextType } from "../../types.ts";
import QuestionCard from "../../components/UI/molecules/QueryCard";
import QuestionsSort from "../../components/UI/molecules/QuerySort";
import QuestionsFilter from "../../components/UI/molecules/QueryFilter";
import Pagination from "../../components/UI/molecules/Pagination";
import PageSize from "../UI/atoms/Page.tsx";

const StyledSection = styled.section`
padding: 20px 200px;
font-family: "Times New Roman", Times, serif;

> .start {
  display: flex;
  align-items: center;
    justify-content: center;
  flex-direction: column;
  align-items: flex-end;
    justify-content: flex-end;
  padding: 10px 0px;
  margin-bottom: 30px;

  > h2 {
    margin: 0;
    color: var(--color-secondary);
  }

  > a > button {
    background-color: var(--color-background); 
    color: var(--color-secondary); 
    border: 2px solid var(--color-secondary);
    border-radius: 0;
    padding: 0 10px;
    height: 30px;
    font-weight: 600;
    font-family: "Times New Roman", Times, serif;
    cursor: pointer;
  }

  > a > button:hover {
    background-color: var(--color-secondary);
    color: var(--color-background);
  }
}

.questionsContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
}

.sortFilter {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: last baseline;
  gap: 10px;

  button,
  select,
  input {
    border-radius: 0;
    border: 2px solid var(--color-secondary);
    background-color: var(--color-background);
    color: var(--color-secondary);
    font-weight: 600;
    padding: 6px 10px;
    font-family: "Times New Roman", Times, serif;
    cursor: pointer;
  }
}

@media (max-width: 767px) {
  padding: 20px;

  > .start > h2 {
    font-size: 20px;
  }
}

@media (min-width: 768px) and (max-width: 1080px) {
  padding: 20px 100px;
}

@media (max-width: 1389px) {
  .sortFilter {
    justify-content: center;
  }
}
`;

const Questions = () => {

    const { questions, isLoading } = useContext(QuestionsContext) as QuestionsContextType;
    const { loggedInUser } = useContext(UsersContext) as UserContextType;
    const isEmpty = questions.length === 0;
    
    return ( 
        <StyledSection>
            <div className="start">
                {
                    loggedInUser ? 
                    <Link to={'/questions/ask'}><button>Make Post</button></Link> :
                    <Link to={'/login'}><button>Make Posts</button></Link>
                }   
            </div>
            <div className="sortFilter">
                <QuestionsSort/>
                <QuestionsFilter/>
            </div>
            <PageSize />
            <div className="questionsContainer">
                {
                    !isLoading && isEmpty && (
                        <p>Empty</p>
                    )
                }
                {
                    !isLoading && !isEmpty && questions.map(question => (
                        <QuestionCard
                            data={question}
                            key={question._id}
                        />
                    ))
                }
            </div>  
            <Pagination />  
        </StyledSection>
     );
}
 
export default Questions;