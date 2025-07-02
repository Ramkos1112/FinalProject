import { useEffect, useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

type Props = {
  targetId: string;
  targetType: "question" | "answer";
  accessToken?: string;
};

const LikeButton = ({ targetId, targetType, accessToken }: Props) => {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5500/api/interactions/count/${targetType}/${targetId}`)
      .then(res => res.json())
      .then(data => setLikesCount(data.likesCount))
      .catch(console.error);

    if (accessToken) {
      fetch(`http://localhost:5500/api/interactions/user-liked/${targetType}/${targetId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then(res => res.json())
        .then(data => setLiked(data.liked))
        .catch(console.error);
    }
  }, [targetId, targetType, accessToken]);

  const toggleLike = () => {
    if (!accessToken) return alert("You must be logged in to like.");

    fetch(`http://localhost:5500/api/interactions/toggle/${targetType}/${targetId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setLiked(data.liked);
        setLikesCount(prev => (data.liked ? prev + 1 : prev - 1));
      })
      .catch(console.error);
  };

  return (
    <button onClick={toggleLike} style={{ background: "none", border: "none", cursor: "pointer" }}>
      {liked ? <StarIcon /> : <StarBorderIcon />}
      {likesCount}
    </button>
  );
};

export default LikeButton;