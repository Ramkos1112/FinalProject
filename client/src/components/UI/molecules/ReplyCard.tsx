import { Answer } from "../../../types";

type Props = {
  reply: Answer;
};

const ReplyCard = ({ reply }: Props) => {
  return (
    <div>
      <p>{reply.body}</p>
      <small>Posted on: {new Date(reply.createdAt).toLocaleString()}</small>
    </div>
  );
};

export default ReplyCard;