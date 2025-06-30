import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserContextType, User,  } from '../../types';
import InputField from '../UI/molecules/InputField';
import UsersContext from '../contexts/UserContext';


const StyledSection = styled.section`
    margin: 0;
height: 100vh;
background: #292020d5;
background-repeat: no-repeat;
background-size: cover;
background-attachment: fixed;
display: flex;
align-items: center;
justify-content: center;
font-family: "Times New Roman", Times, serif;
font-weight: 600;

> div {
  padding: 30px 30px;
  width: 580px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

> div > h2 {
  margin: 0;
  font-size: 40px;
  padding-bottom: 20px;
}

> div > p {
  margin: 0;
  padding-top: 5px;
  padding-bottom: 5px;
}

.button {
  margin: 20px;
  padding: 5px 15px;
  border: none;
  border-radius: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-secondary);
  background-color: var(--color-background);
  cursor: pointer;
  transition: 0.3s;
}

.link {
  text-decoration: none;
  color: var(--color-accent);
}

.link:hover {
  color: var(--color-background);
}
.message {
  color: var(--color-secondary);
}
`

const Login = () => {

    const { login } = useContext(UsersContext) as UserContextType;
    const [afterLoginMessage, setAfterLoginMessage] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const navigate = useNavigate();

    const formikInitialValues: Pick<User, 'username' | 'password'> = {
        username: '',
        password: ''
    }
    const formik = useFormik({
        initialValues: formikInitialValues,
        validationSchema: Yup.object({
        username: Yup.string()
            .required('This field is required')
            .trim(),
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
            'Password must be 8-25 characters long and include uppercase, lowercase, number, and special character (@$!%*?&)')
            .required('This field is required')
            .trim()
        }),
        onSubmit: async(values) => {
            setAfterLoginMessage('');
            const Context_Response = await login(values, keepLoggedIn);
            if('error' in Context_Response){
                setAfterLoginMessage(Context_Response.error);
            }else{
                setAfterLoginMessage(Context_Response.success);
                setTimeout(() => navigate('/'), 3000);
            }
        }
    });

    return ( 
        <StyledSection>
            <div>
                <h2>Login</h2>
                <form onSubmit={formik.handleSubmit}>
                    <InputField 
                    inputName="username"
                    inputId="username"
                    inputType="text"
                    labelText="Username:"
                    inputValue={formik.values.username}
                    errors={formik.errors.username}
                    touched={formik.touched.username}
                    inputOnBlur={formik.handleBlur}
                    inputOnChange={formik.handleChange}
                    />
                    <InputField 
                    inputName="password"
                    inputId="password"
                    inputType="password"
                    labelText="Password:"
                    inputValue={formik.values.password ?? ''}
                    errors={formik.errors.password}
                    touched={formik.touched.password}
                    inputOnBlur={formik.handleBlur}
                    inputOnChange={formik.handleChange}
                    />
                    <input type="submit" value="Login" className='button'/>
                </form>
                <div>
                <p> Click <Link to="/register" className='link'>register</Link> to create an account!</p>
                    <input
                        type="checkbox"
                        name="keepSignedIn" id="keepSignedIn"
                        onChange={() => {
                            setKeepLoggedIn(!keepLoggedIn);
                        }}
                    />
                    <label htmlFor="keepSignedIn">Keep me signed in</label>
                </div>
                {
                    afterLoginMessage && <p className='message'>{afterLoginMessage}</p>
                }
            </div>
        </StyledSection>
    );
}
 
export default Login;