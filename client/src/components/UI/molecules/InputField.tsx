import styled from "styled-components";

import Label from "../atoms/Label.tsx";
import Input from "../atoms/Input.tsx";
import { InputFieldProps } from "../../../types.ts";


const StyledInput = styled.div`
    >div{
        display: flex;
        flex-direction: column;
        font-weight: 600;
        >input{
            margin: 10px;
            border-radius: 10px;
            border: none;
            height: 30px;
            text-align: center;
            font-weight: 600;
            background-color: var(--color-background);
        }
        >label{
            font-size: 20px;
            color: var(--color-accentText);
        }
    }
    .errors{
        margin: 0;
        padding-bottom: 5px;
        font-size: 13px;
        color: var(--color-secondary);
    }
`

type Props = Omit<InputFieldProps, 'labelFor'>;

const InputField = ({ labelText, inputId, inputName, inputOnBlur, inputOnChange, inputType, inputValue, errors, touched }: Props) => {
    return ( 
        <StyledInput>
            <div>
                <Label
                    labelFor={inputId}
                    labelText={labelText}
                />
                <Input
                    inputType={inputType}
                    inputId={inputId}
                    inputName={inputName}
                    inputValue={inputValue}
                    inputOnBlur={inputOnBlur}
                    inputOnChange={inputOnChange}
                />
            </div>
            {
                errors && touched && <p className="errors">{errors}</p>
            }
        </StyledInput>
     );
}
 
export default InputField;