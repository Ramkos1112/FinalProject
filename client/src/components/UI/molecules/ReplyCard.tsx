import { useContext, useState } from "react";
import styled from "styled-components";
import { Answer, UserContextType } from "../../../types";
import UsersContext from "../../contexts/UserContext";
import AnswersContext from "../../contexts/RepliesContext";

type Props = {
  reply: Answer;
};

const Card = styled.div`
  padding: 1rem;
  border-radius: 12px;
  background-color: var(--color-background);
  border: 1px solid var(--color-secondary);
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--color-secondary);
`;

const Body = styled.p`
  margin: 0.5rem 0;
  color: var(--color-secondary);
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  button {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background-color: var(--color-secondary);
    color: var(--color-background);
  }
`;

const ReplyCard = ({ reply }: Props) => {
  const { loggedInUser } = useContext(UsersContext) as UserContextType;
  const { deleteAnswer, editAnswer } = useContext(AnswersContext)!;

  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(reply.body);

  const handleDelete = () => {
    deleteAnswer(reply._id);
  };

  const handleSave = async () => {
    const result = await editAnswer({ ...reply, body: editedBody });
    if ('success' in result) {
      setIsEditing(false);
    } else {
      alert(result.error);
    }
  };

  return (
    <Card>
      <TopBar>
        <div>
          <strong>{reply.authorUsername}</strong>
          <div style={{ fontSize: "0.7rem", color: "gray" }}>
            {new Date(reply.createdAt).toLocaleString()}
            {reply.isEdited && (
              <div>
                <em>edited on {new Date(reply.updatedAt).toLocaleString()}</em>
              </div>
           )}
          </div>
        </div>
      </TopBar>

      {isEditing ? (
        <>
          <textarea
            value={editedBody}
            onChange={e => setEditedBody(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "0.5rem" }}
          />
          <Actions>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => {
              setIsEditing(false);
              setEditedBody(reply.body);
            }}>Cancel</button>
          </Actions>
        </>
      ) : (
        <>
          <Body>{reply.body}</Body>
          {loggedInUser?._id === reply.authorId && (
            <Actions>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </Actions>
          )}
        </>
      )}
    </Card>
  );
};

export default ReplyCard;