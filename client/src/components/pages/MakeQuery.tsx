import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { QuestionsContextType, Question } from "../../types";
import MultiSelect from "../UI/molecules/TagSelection";
import QuestionsContext from "../contexts/QuestionContext";
import InputField from "../UI/molecules/InputField";






const StyledSection = styled.section`
   padding: 20px;
    min-height: 100vh;
    background: #292020d5;
    display: flex;
    justify-content: center;
    align-items: center;

    > form {
        background-color: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
        border-radius: 30px;
        padding: 40px 30px;
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        font-weight: 600;
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);

        > label {
            font-size: 18px;
            color: #ddd;
            margin-top: 15px;
        }

        > input, > textarea {
            margin: 10px 0;
            padding: 10px;
            width: 100%;
            border-radius: 10px;
            border: none;
            background-color: #111;
            color: #eee;
            font-weight: 600;
        }

        > input::placeholder,
        > textarea::placeholder {
            color: #888;
        }

        > button, .ask {
            margin-top: 20px;
            background-color: #000;
            color: red;
            border: 2px solid red;
            border-radius: 12px;
            padding: 8px 20px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        > button:hover, .ask:hover {
            background-color: red;
            color: black;
        }
    }

    .errors {
        margin: 0;
        padding-top: 5px;
        font-size: 12px;
        color: #ff8080;
    }

    .message {
        color: #ff4d4d;
        padding-top: 10px;
    }

    @media (max-width: 767px) {
        padding: 10px;

        > form {
            padding: 30px 20px;
        }
    }
`;

const AskQuestion = () => {

    const { addNewQuestion } = useContext(QuestionsContext) as QuestionsContextType;
    const [ afterAddMessage, setAfterAddMessage ] = useState('');
    const navigate = useNavigate();
    const allowedTags = ["Learning","Advice","Opinions","Inspiration","Comissions","Collaboration","Tutorials","SFW"];

    const formikInitialValues: Pick<Question, 'title' | 'body' | 'tags'> = {
        title: '',
        body: '',
        tags: []
    }
    const formik = useFormik({
        initialValues: formikInitialValues,
        validationSchema: Yup.object({
            title: Yup.string()
                .required('This field is required')
                .trim(),
            body: Yup.string()
                .min(10, 'Question is too short')
                .required('This field is required')
                .trim(),
            tags: Yup.array()
                .of(Yup.string().oneOf(allowedTags, 'Invalid tag selected'))
                .min(1, 'At least one tag must be selected')
                .max(3, 'You can select up to 3 tags only')
        }),
        onSubmit: async (values) => {
            setAfterAddMessage('');
            const Context_Response = await addNewQuestion(values);
            if('error' in Context_Response){
                setAfterAddMessage(Context_Response.error);
            }else{
                setAfterAddMessage(Context_Response.success);
                setTimeout(() => navigate('/questions'), 3000);
            }
        }
    })

    return ( 
        <StyledSection>
            <form onSubmit={formik.handleSubmit}>
                <InputField
                    inputName="title"
                    inputId="title"
                    inputType="text"
                    labelText="Title:"
                    inputValue={formik.values.title}
                    errors={formik.errors.title}
                    touched={formik.touched.title}
                    inputOnBlur={formik.handleBlur}
                    inputOnChange={formik.handleChange}
                />
                <textarea 
                    name="body" 
                    id="body"
                    value={formik.values.body}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your question here..." 
                />
                {formik.touched.body && formik.errors.body && <p className="errors">{formik.errors.body}</p>}
                <MultiSelect
                    options={allowedTags}
                    selected={formik.values.tags}
                    onChange={(values) => formik.setFieldValue('tags', values)}
                    maxSelected={3}
                    errors={formik.errors.tags}
                    touched={formik.touched.tags}
                />
            <input type="submit" value="Submit" className="ask"/>
            {
                afterAddMessage && <p className="message">{afterAddMessage}</p>
            }
            </form>
        </StyledSection>
     );
}
 
export default AskQuestion;