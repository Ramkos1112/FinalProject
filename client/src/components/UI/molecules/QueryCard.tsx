import styled from "styled-components";
import { useContext } from "react";
import { Link } from "react-router";
import { Question, UserContextType } from "../../../types";
import UsersContext from "../../contexts/UserContext";
import LikeButton from "../molecules/LikeButton";

type Props = {
  data: Question;
};

const StyledDiv = styled.div`
  padding: 20px;
  background-color: var(--color-background);
  border: 2px solid var(--color-secondary);

  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: repeat(3, auto);
  grid-column-gap: 50px;
  align-items: start;

  .info {
    grid-area: 1 / 1 / 4 / 2;
    align-self: center;
    text-align: end;
    padding-right: 40px;
    font-size: 12px;
    font-weight: 600;
    border-right: 2px var(--color-primary) solid;
    > p {
      margin: 0;
      padding: 2px;
    }
    > .name {
      font-style: italic;
      color: var(--color-secondary);
    }
  }

  .body {
    grid-area: 1 / 2 / 4 / 3;
    font-weight: 600;
    > a {
      text-decoration: none;
      color: var(--color-secondary);
    }
    > .tags {
      margin-bottom: 15px;
      > span {
        background-color: var(--color-secondary);
        color: var(--color-primary);
        border-radius: 10px;
        padding: 1px 10px;
        margin-right: 8px;
      }
    }
  }

  .button {
    padding: 2px;
    font-size: 12px;
    border: none;
    background-color: var(--color-background);
    > svg {
      color: var(--color-secondary);
      font-size: 20px;
    }
  }
`;

const QuestionCard = ({ data }: Props) => {
  const { loggedInUser } = useContext(UsersContext) as UserContextType;

  return (
    <StyledDiv>
      <div className="info">
        <div>
          {loggedInUser && (
            <LikeButton
              targetId={data._id}
              targetType="question"
              accessToken={sessionStorage.getItem("accessJWT") ?? undefined}
            />
          )}
        </div>
        <p>Answers: {data.answersCount}</p>
        <p className="name">{data.authorUsername}</p>
        <p>{new Date(data.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="body">
        <Link to={`/questions/${data._id}`}>
          <h3>{data.title}</h3>
        </Link>
        <p>{data.body}</p>
        <div className="tags">
          {data.tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>
    </StyledDiv>
  );
};

export default QuestionCard;