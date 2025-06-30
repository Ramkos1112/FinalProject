import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import styled from "styled-components";

import { Answer, AnswersContextType } from "../../../types";
import AnswersContext from "../../contexts/RepliesContext.tsx";




const StyledDiv = styled.div`
    >form{
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
        .add, .cancel{
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
        .add:hover{
            background-color: var(--color-accentText);
            transition: 0.3s;
        }
        .cancel:hover{
            background-color: #cc7e7e;
            transition: 0.3s;
        }
        .errors{
            margin: 0;
            padding-bottom: 5px;
            font-size: 13px;
            color: var(--color-secondary);
        }
        .message{
            color: var(--color-accentText);
            padding-top: 10px;
        }
    }
`

type Props = {
    isOpen: boolean,
    onClose: () => void,
};

const AnswerInput = ({ isOpen, onClose}: Props) => {

    const [ afterAnswerAddMessage, setAnswerAfterAddMessage ] = useState('');
    const { addNewAnswer } = useContext(AnswersContext) as AnswersContextType;

    const formikInitialValues: Pick<Answer, 'body'> = {
            body: ''
        }
    const formik = useFormik({
        initialValues: formikInitialValues,
        validationSchema: Yup.object({
            body: Yup.string()
                .min(10, 'Answer is too short')
                .required('This field is required')
                .trim()
        }),
        onSubmit: async (values, { resetForm }) => {
            setAnswerAfterAddMessage('');
            const result = await addNewAnswer(values);
            if('error' in result){
                setAnswerAfterAddMessage(result.error);
            }else{
                setAnswerAfterAddMessage(result.success);
                resetForm();
                onClose();
            }
        }
    })

    if(!isOpen) return null;

    return ( 
        <StyledDiv>
            <form onSubmit={formik.handleSubmit}>
                <textarea 
                    name="body" 
                    value={formik.values.body}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your answer here..." 
                    rows={5}
                />
                {formik.touched.body && formik.errors.body && <p className="errors">{formik.errors.body}</p>}
                {
                    afterAnswerAddMessage && <p className="message">{afterAnswerAddMessage}</p>
                }
                <div className="buttons">
                    <button type="submit" className="add">Add</button>
                    <button type="button" onClick={onClose} className="cancel">Cancel</button>
                </div>
            </form>
        </StyledDiv>
     );
}
 
export default AnswerInput;