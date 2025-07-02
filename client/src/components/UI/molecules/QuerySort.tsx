import { useContext } from "react";
import styled from "styled-components";

import QuestionsContext from "../../contexts/QuestionContext.tsx";
import { QuestionsContextType } from "../../../types.ts";



const StyleDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 32px;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 15px;
    >p{
        margin: 0px;
    }
    >select{
        background-color: var(--color-background);
        border-radius: 12px;
        border: none;
        padding: 2px;
        font-family: "Times New Roman", Times, serif;
        font-weight: 600;
    }
`

const QuestionsSort = () => {

    const { changeSort } = useContext(QuestionsContext) as QuestionsContextType;

    return ( 
        <StyleDiv>
            <p>Sort by:</p>
            <select onChange={(e) => changeSort(e.target.value)} defaultValue="sort_createdAt=-1">
                <option value="sort_createdAt=-1">Newest</option>
                <option value="sort_createdAt=1">Oldest</option>
                <option value="sort_answersCount=-1">Most answered</option>Add commentMore actions
                <option value="sort_answersCount=1">Least answered</option>
            </select>
        </StyleDiv>
     );
}
 
export default QuestionsSort;