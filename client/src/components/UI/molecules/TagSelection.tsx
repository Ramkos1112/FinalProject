import { useState, useRef } from "react";
import styled from "styled-components";
import { MultiSelectProps } from "../../../types";



const StyledDiv = styled.div`
    >button{
        background-color: var(--color-background);
        border: none;
        padding: 0 10px;
        margin: 10px;
        height: 30px;
        width: 100px;
        font-weight: 600;
        font-family: "Times New Roman", Times, serif;
        cursor: pointer;
    }
    >button:hover{
        background-color: var(--color-accent);
        transition: 0.3s;
    }
    >p{
        color: var(--color-secondary);
        margin: 0;
    }
    .tags{
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
    }
    .errors{
        margin: 0;
        padding: 10px 0px;
        font-size: 13px;
        color: var(--color-secondary);
    }
`

const MultiSelect = ({ options, selected, onChange, maxSelected=5, errors, touched }: MultiSelectProps) => {

    const [ isOpen, setIsOpen ] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const handleCheckboxChange = (option: string) => {
        const isSelected = selected.includes(option);
        if (isSelected) {
            onChange(selected.filter(tag => tag !== option));
        } else if (selected.length < maxSelected){
            onChange([...selected, option]);
        }
    };

    return(
        <StyledDiv ref={ref}>
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
        >
            Select tags
        </button>
        <p>({selected.length}/{maxSelected})</p>
        {
            isOpen && (
                <div className="tags">
                {
                    options.map(option => {
                    const isChecked = selected.includes(option);
                    const isDisabled = !isChecked && selected.length >= maxSelected;

                    return (
                    <label key={option}>
                        <input
                        type="checkbox"
                        value={option}
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(option)}
                        disabled={isDisabled}
                        />
                        <span>{option}</span>
                    </label>);
                    })
                }
                </div>
            )
        }
        {
            errors && touched && <p className="errors">{errors}</p>   
        }
        </StyledDiv>
    )
}
 
export default MultiSelect;