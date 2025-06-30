import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Question, UserContextType } from "../../../types";
import UsersContext from "../../contexts/UserContext.tsx";

type Props = {
    data: Question
}

const StyledDiv = styled.div`
    padding: 20px;
    background-color: var(--color-background);
    border-radius: 40px;
    box-shadow: 0 6px 12px var(--color-secondary);

    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: repeat(3, auto);
    grid-column-gap: 50px;
    align-items: start;
    .info{
        grid-area: 1 / 1 / 4 / 2;
        align-self: center;
        text-align: end;
        padding-right: 40px;
        font-size: 12px;
        font-weight: 600;
        border-right: 2px var(--color-primary) solid;
        >p{
            margin: 0;
            padding: 2px;
        }
        >.name{
            font-style: italic;
            color: var(--color-secondary);
        }
        >.edited {
            font-style: italic;
            color: gray;
        }
    }
    .body{
        grid-area: 1 / 2 / 4 / 3;
        font-weight: 600;
        >a{
            text-decoration: none;
            color: var(--color-secondary);
        }
        >.tags{
            margin-bottom: 15px;
            >span{
                background-color: var(--color-secondary);
                color: var(--color-primary);
                border-radius: 10px;
                padding: 1px 10px;
                margin-right: 8px;
            }
        }
    }
    .button{
        padding: 2px;
        font-size: 12px;
        border: none;
        background-color: var(--color-background);
        >svg{
            color: var(--color-secondary);
            font-size: 20px;
        }
    }

    @media (min-width: 0px) and (max-width: 768px) {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(4, 1fr);
        padding: 30px;
        text-align: center;
        min-width: 340px;
        .info{
            grid-area: 4 / 1 / 5 / 2;
            padding: 0px;
            font-size: 12px;
            border: none;
            display: flex;
            justify-content: flex-end;
            align-items: baseline;
            gap: 20px;
        }
        .body{
            grid-area: 1 / 1 / 4 / 2;
            >.tags{
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                margin: 0px;
                >span{
                    font-size: 12px;
                }
            }
        }
    }
`

const QuestionCard = ({ data }: Props) => {
    const { loggedInUser } = useContext(UsersContext) as UserContextType;
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const accessJWT = sessionStorage.getItem("accessJWT");

    useEffect(() => {
        fetch(`http://localhost:5500/likes/count/${data._id}`)
            .then(res => res.json())
            .then(question => setLikesCount(question.likesCount))
            .catch(console.error);

        if (accessJWT) {
            fetch(`http://localhost:5500/likes/user-liked/${data._id}`, {
                headers: {
                    Authorization: `Bearer ${accessJWT}`
                }
            })
                .then(res => res.json())
                .then(data => setLiked(data.liked))
                .catch(console.error);
        }
    }, [data._id, accessJWT]);

    const toggleLike = () => {
        fetch(`http://localhost:5500/likes/toggle/${data._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessJWT}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setLiked(data.liked);
                setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
            })
            .catch(console.error);
    };

    return (
        <StyledDiv>
            <div className="info">
                <div>
                    {
                        loggedInUser ? 
                        (<button onClick={toggleLike} className="button">
                                {liked ? <StarIcon/> : <StarBorderIcon />}
                                {likesCount}
                            </button>) : null
                    }
                </div>
                <p>Answers: {data.answersCount}</p>
                <p className="name">{data.authorUsername}</p>
                <p>{new Date(data.createdAt).toLocaleDateString()}</p>
                {data.isEdited && (
                    <p className="edited">Edited on: {new Date(data.updatedAt).toLocaleDateString()}</p>
                )}
            </div>
            <div className="body">
                <Link to={`/questions/${data._id}`}>
                    <h3>{data.title}</h3>
                </Link>
                <p>{data.body}</p> 
                <div className="tags">{data.tags.map((tag, index) => (
                    <span key={index}>{tag}</span>
                ))}</div>
            </div>
        </StyledDiv>
    );
}
 
export default QuestionCard;