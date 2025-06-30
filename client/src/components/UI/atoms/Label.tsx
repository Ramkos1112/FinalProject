import { InputFieldProps } from "../../../types";

type Props = Pick<InputFieldProps, 'labelFor' | 'labelText'>;

const Label = ({ labelFor, labelText}: Props) => {
    return ( 
        <label 
        htmlFor={labelFor}>{labelText}</label>
     );
}
 
export default Label;