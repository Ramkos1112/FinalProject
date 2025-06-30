import { useContext } from "react";
import { useFormik } from "formik";
import styled from "styled-components";

import QuestionsContext from "../../contexts/QuestionContext.tsx";
import { QuestionsContextType } from "../../../types.ts";

const StyledForm = styled.form `
    display: flex;
    flex-direction: column;
    flex-wrap: no-wrap;
    gap: 10px;
    padding: 0px 32px;
    .buttons{
        background-color: var(--color-background);
        box-shadow: 0 6px 12px var(--color-secondary);
        >button{
            background-color: var(--color-background);            
            border: none;
            padding: 2px 10px;
            font-family: "Times New Roman", Times, serif;
            font-weight: 600;
            cursor: pointer;
        }
    }
    .search{
        border-radius: 10px;
        border: none;
        padding: 0 10px;
        height: 30px;
        font-weight: 600;
        background-color: var(--color-background);
        box-shadow: 0 6px 12px var(--color-secondary);
        font-family: "Times New Roman", Times, serif;
    }
    .filterClear{
        display: flex;
        justify-content: center;
        gap: 10px;
        >.filter, .clear{
            background-color: var(--color-background);
            border: none;
            padding: 0 px;
            height: 30px;
            font-weight: 600;
            box-shadow: 0 6px 12px var(--color-secondary);
            font-family: "Times New Roman", Times, serif;
            cursor: pointer;
        }
        >.filter:hover{
            background-color:  #cc7e7e);
            transition: 0.3s;
        }  
        >.clear:hover{
            background-color: #cc7e7e;
            transition: 0.3s;
        }
    }
    @media (min-width: 0px) and (max-width: 1389px) {
        justify-content: center;
        margin: 20px 0px;
    }   
`

const QuestionsFilter = () => {

    const { changeFilter } = useContext(QuestionsContext) as QuestionsContextType;

    const formik = useFormik({
        initialValues: {
            filter_isAnswered: '',
            filter_title: '',
            filter_tags: [] as string[]
        },
        onSubmit(values){
            const params = new URLSearchParams();
            
            if(values.filter_isAnswered === 'true' || values.filter_isAnswered === 'false'){
                params.append('filter_isAnswered', values.filter_isAnswered);
            }

            if (values.filter_title.trim() !== '') {
                params.append('filter_title', values.filter_title.trim());
            }

            if (values.filter_tags.length > 0) {
                values.filter_tags.forEach(tag => params.append('filter_tags', tag));
            }
            changeFilter(params.toString());
        }
    });

    return ( 
        <StyledForm onSubmit={formik.handleSubmit}>
            <div className="buttons">
                <button
                    type="button"
                    onClick={() => {
                        formik.setFieldValue("filter_isAnswered", "true", true);
                        formik.handleSubmit();
                    }}
                    className={formik.values.filter_isAnswered === "true" ? "active" : ""}
                >
                    Answered
                </button>
                <button
                    type="button"
                    onClick={() => {
                        formik.setFieldValue("filter_isAnswered", "false", true);
                        formik.handleSubmit();
                    }}
                    className={formik.values.filter_isAnswered === "false" ? "active" : ""}
                >
                    Unanswered
                </button>
            </div>
            <div>
            </div>
            <div className="filterClear">
                <button 
                    type="button"
                    onClick={() => {
                        formik.resetForm();
                        formik.handleSubmit();
                    }}
                    className="clear"
                >Clear</button>
            </div>
        </StyledForm>
    );
}
 
export default QuestionsFilter;