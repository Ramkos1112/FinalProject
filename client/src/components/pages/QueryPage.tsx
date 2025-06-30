import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { Question, UserContextType } from "../../types";
import UsersContext from "../contexts/UserContext";
import EditingQuestion from "../UI/molecules/EditingQuestion";

const StyledSection = styled.section`
  padding: 20px 200px;
  color: var(--color-secondary);
  .edit-button {
    margin-top: 10px;
    background: var(--color-background);
    border: none;
    padding: 5px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }
`;

const QueryPage = () => {
  const { _id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const { loggedInUser } = useContext(UsersContext) as UserContextType;

  useEffect(() => {
    if (!_id) return;

    fetch(`http://localhost:5500/questions/${_id}`)
      .then(async res => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg);
        }
        return res.json();
      })
      .then(data => {
        setQuestion(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load question");
        setLoading(false);
      });
  }, [_id]);

  return (
    <StyledSection>
      {loading && <p>Loading question...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {question && !editing && (
        <>
          <h2>{question.title}</h2>
          <p>{question.body}</p>
          <p><strong>Tags:</strong> {question.tags.join(", ")}</p>

          {loggedInUser?._id === question.authorId && (
            <button className="edit-button" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </>
      )}
      {editing && question && (
        <EditingQuestion question={question} onClose={() => setEditing(false)} />
      )}
    </StyledSection>
  );
};

export default QueryPage;