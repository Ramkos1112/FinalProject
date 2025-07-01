import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Question } from "../../types";
import QuestionsContext from "../contexts/QuestionContext";
import { QuestionsContextType } from "../../types";
import UserContext from "../contexts/UserContext";
import { UserContextType } from "../../types";
import EditingQuestion from "../UI/molecules/EditingQuestion";
import { AnswersProvider } from "../contexts/RepliesContext";
import AnswersContext from "../contexts/RepliesContext";
import ReplyCard from "../UI/molecules/ReplyCard";
import ReplyInput from "../UI/molecules/ReplyInput";

const StyledSection = styled.section`
  padding: 20px 200px;
  color: var(--color-secondary);

  .edit-button, .delete-button {
    margin-top: 10px;
    background: var(--color-background);
    border: none;
    padding: 5px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    margin-right: 10px;
  }

  .delete-button {
    background: crimson;
    color: white;
  }
`;

const QueryPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const { loggedInUser } = useContext(UserContext) as UserContextType;
  const { refetchQuestions } = useContext(QuestionsContext) as QuestionsContextType;
  const accessJWT = sessionStorage.getItem("accessJWT") || localStorage.getItem("accessJWT");

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

  const handleDelete = async () => {
    if (!question || !accessJWT) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5500/questions/${question._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessJWT}`
        }
      });

      if (res.ok) {
        refetchQuestions();
        navigate('/');
      } else {
        console.error("Failed to delete question");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StyledSection>
      {loading && <p>Loading question...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {question && !editing && (
        <>
          <h2>{question.title}</h2>
          <p>{question.body}</p>
          <p><strong>Tags:</strong> {question.tags.join(", ")}</p>
          {question.isEdited && (
            <p style={{ fontStyle: "italic", color: "gray" }}>
              (Edited on {new Date(question.updatedAt).toLocaleString()})
            </p>
          )}
          {loggedInUser?._id === question.authorId && (
            <>
              <button className="edit-button" onClick={() => setEditing(true)}>Edit</button>
              <button className="delete-button" onClick={handleDelete}>Delete</button>
            </>
          )}
        </>
      )}

      {editing && question && (
        <EditingQuestion question={question} onClose={() => setEditing(false)} />
      )}

      {question && (
        <AnswersProvider questionId={question._id}>
          <div style={{ marginTop: '2rem' }}>
            <h3>Replies</h3>
            <ReplyList />
            {loggedInUser && (
              <div style={{ marginTop: '1rem' }}>
                <ReplyInput questionId={question._id} />
              </div>
            )}
          </div>
        </AnswersProvider>
      )}
    </StyledSection>
  );
};

const ReplyList = () => {
  const { answers, answerIsLoading } = useContext(AnswersContext) ?? { answers: [], answerIsLoading: false };

  if (answerIsLoading) return <p>Loading replies...</p>;
  if (!answers.length) return <p>No replies yet.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {answers.map(reply => (
        <ReplyCard key={reply._id} reply={reply} />
      ))}
    </div>
  );
};

export default QueryPage;