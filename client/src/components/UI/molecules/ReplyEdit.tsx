import { useContext, useState } from "react";
import styled from "styled-components";

import { Answer, AnswersContextType } from "../../../types.ts";
import AnswersContext from "../../contexts/RepliesContext.tsx";


type Props = {
    answer: Answer,
    onClose: () => void;
}

const StyledDiv= styled.div`
    display: flex;
    flex-direction: column;
    >textarea{
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 10px;
        border: none;
        height: 80px;
        font-weight: 600;
        background-color: var(--color-primary);
        font-family: "Times New Roman", Times, serif;
    }
    >textarea:hover{
        background-color: var(--color-accent);
        transition: 0.3s;
    }
    >textarea::placeholder{
        color: var(--color-secondary);
    }
    .buttons{
        display: flex;
        gap: 10px;
        padding-bottom: 20px;
        justify-content: center;
    }
    .save, .cancel{
        margin: 10px 0px;
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        height: 30px;
        width: 100px;
        font-weight: 600;
        box-shadow: 0 1px 2px var(--color-secondary);
        font-family: "Times New Roman", Times, serif;
        cursor: pointer;
    }
    .save:hover{
        background-color: var(--color-accentText);
        transition: 0.3s;
    }
    .cancel:hover{
        background-color: #cc7e7e;
        transition: 0.3s;
    }
`

const EditingAnswer = ({ answer, onClose }: Props) => {

    const { editAnswer } = useContext(AnswersContext) as AnswersContextType;
    const [afterEditMessage, setAfterEditMessage] = useState('');

    const [ formData, setFormData ] = useState({
        body: answer.body,
    });
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        const updated = {
             ...answer,
            body: formData.body,
        };
        const res = await editAnswer(updated);
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
                <textarea
                    value={formData.body}
                    onChange={(e) => handleChange("body", e.target.value)}
                />
                <div className="buttons">
                    <button onClick={handleSave} className="save">Save</button>
                    <button onClick={onClose} className="cancel">Cancel</button>
                </div>
                {
                    afterEditMessage && <p className="message">{afterEditMessage}</p>
                }
        </StyledDiv>
     );
}
 
export default EditingAnswer;