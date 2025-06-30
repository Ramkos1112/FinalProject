import { InputFieldProps } from "../../../types";

type Props = Omit<InputFieldProps, 'labelFor' | 'labelText' | 'touched' | 'errors'>;

const Input = ({ inputType, inputName, inputId, inputValue, inputOnChange, inputOnBlur }: Props) => {
    return ( 
        <input
            type={inputType}
            name={inputName} id={inputId}
            value={inputValue}
            onChange={inputOnChange}
            onBlur={inputOnBlur}
        />
     );
}
 
export default Input;