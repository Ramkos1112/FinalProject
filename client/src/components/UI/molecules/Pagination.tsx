import { useContext } from "react";
import styled from "styled-components";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import QuestionsContext from "../../contexts/QuestionContext.tsx";
import { QuestionsContextType } from "../../../types.ts";

const StyledDiv = styled.div`
  margin: 20px;
  text-align: center;
  font-weight: 600;
  color: var(--color-background);
  div{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    >button{
      background-color: var(--color-background);
      width: 30px;
      height: 30px;
      border: none;
      font-weight: 600;
      font-family: "Times New Roman", Times, serif;
      cursor: pointer;
    }
    >button:hover{
      background-color: var(--color-accent);
    }
    >button:hover:disabled{
      background-color: var(--color-background);
    }
  }
  .arrow{
    display: flex;
    align-items: center;
    justify-content: center;
    >svg{
      font-size: 12px;
    }
  }
`

const Pagination = () => {

    const {  filteredDataAmount, pageSize, changePage, currentPage } = useContext(QuestionsContext) as QuestionsContextType;
    const lastPage = filteredDataAmount === 0 ? 1 : Math.ceil(filteredDataAmount/pageSize);
    
    return (
      <StyledDiv>
        <div>
          <button
            disabled={currentPage === 1 ? true : false}
            onClick={() => changePage(currentPage-1)}
            className="arrow"
            ><ArrowBackIcon/></button>
          <span> </span>
          {
            currentPage !== 1 &&
            <button
            onClick={() => changePage(1)}
            >1</button>
          }
          {
            currentPage - 3 > 1 && <span>...</span>
          }
          {
            currentPage - 2 !== 1 && currentPage - 2 > 0 &&
            <button
            onClick={() => changePage(currentPage-2)}
            >{currentPage-2}</button>
          }
          {
            currentPage - 1 !== 1 && currentPage - 1 > 0 &&
            <button
            onClick={() => changePage(currentPage-1)}
            >{currentPage-1}</button>
          }
          <button
            disabled
            >{currentPage}</button>
          {
            currentPage + 1 !== lastPage && currentPage + 1 < lastPage &&
            <button
            onClick={() => changePage(currentPage+1)}
            >{currentPage+1}</button>
          }
          {
            currentPage + 2 !== lastPage && currentPage + 2 < lastPage &&
            <button
            onClick={() => changePage(currentPage+2)}
            >{currentPage+2}</button>
          }
          {
            currentPage + 3 < lastPage && <span>...</span>
          }
          {
            currentPage !== lastPage &&
            <button
            onClick={() => changePage(lastPage)}
            >{lastPage}</button>
          }
          <span> </span>
          <button
            disabled={currentPage === lastPage ? true : false}
            onClick={() => changePage(currentPage+1)}
            className="arrow"
          ><ArrowForwardIcon/></button>
        </div>
    </StyledDiv>
  );
};
 
export default Pagination;