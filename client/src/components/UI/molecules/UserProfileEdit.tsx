import { useState, useContext } from "react";
import styled from "styled-components";

import { User, UserContextType } from "../../../types.ts";
import UsersContext from "../../contexts/UserContext.tsx";


type Props = {
    user: Omit<User, 'password'>,
    onClose: () => void;
}

const StyledDiv = styled.div`
    >div{
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 600;
        >input{
            margin: 10px;
            border: 2px var(--color-secondary) solid;
            height: 30px;
            width: 70%;
            text-align: center;
            font-weight: 600;
            background-color: var(--color-background);
            font-family: "Times New Roman", Times, serif;
            color: var(--color-secondary);
        }
    }
    .button{
        background-color: var(--color-background);
        border-right: 2px var(--color-secondary) solid;
        border-radius: 12px;
        padding: 0 10px;
        margin-top: 10px;
        height: 30px;
        width: 100px;
        font-weight: 600;
        box-shadow: 0 1px 2px var(--color-secondary);
        font-family: "Times New Roman", Times, serif;
        cursor: pointer;
    }
    .button:hover{
        background-color: var(--color-accentText);
        transition: 0.3s;
    }
    @media (min-width: 1081px){
        >div{
            >input{
                width: 50%;
            }
        }
    }
`

const EditingUserInfo = ({ user, onClose}: Props) => {

    const { editUserInfo } = useContext(UsersContext) as UserContextType;
    const [afterEditMessage, setAfterEditMessage] = useState('');

    const [ formData, setFormData ] = useState({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar
    });
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        const updated = {
            ...user,
            username: formData.username,
            email: formData.email,
            fullName: formData.fullName,
            avatar: formData.avatar
        };
        const res = await editUserInfo(updated);
        if('error' in res) {
            setAfterEditMessage(res.error)
            setTimeout(() => {onClose()}, 3000);
        }else{
            setAfterEditMessage(res.success);
            onClose();
        }
    };

    return ( 
        <StyledDiv>
            <div>
                <p>Username</p>
                <input
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                />
            </div>
            <div>
                <p>Email</p>
                <input
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                />
            </div>
            <div>
                <p>Name</p>
                <input
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                />
            </div>
            <div>
                <p>Avatar</p>
                <input
                    value={formData.avatar}
                    onChange={(e) => handleChange("avatar", e.target.value)}
                />
            </div>
            <button onClick={handleSave} className="button">Save</button>
            {
                afterEditMessage && <p>{afterEditMessage}</p>
            }
        </StyledDiv>
     );
}
 
export default EditingUserInfo;