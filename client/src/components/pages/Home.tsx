import styled from "styled-components";
import { Link } from "react-router";

const StyledSection = styled.section`
  padding: 20px 200px;
  min-height: calc(100vh - 80px);
  background: #292020d5;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  /* Shared button styling */
  button {
    background-color: var(--color-background);
    color: var(--color-secondary);
    border: none;
    padding: 8px 12px;
    font-weight: 600;
    font-family: "Times New Roman", Times, serif;
    cursor: pointer;
    border-radius: 0;
  }

  button:hover {
    background-color: var(--color-secondary);
    color: var(--color-background);
  }

  .text {
    display: flex;
    flex-direction: column;
    width: 50%;
    padding: 50px 0;
    color: white;
    font-weight: 600;

    > p {
      margin: 0;
      padding: 10px;
    }

    .link{
        text-decoration: none;
        color: var(--color-accent)
    }
    .link:hover{
        color: var(--color-background);
    }
  }

  .logReg {
    text-decoration: none;
    color: #ff4d4d;
  }

  @media (max-width: 599px) {
    padding: 20px;

    .text {
      width: 100%;
    }
  }

  @media (min-width: 600px) and (max-width: 767px) {
    padding: 20px;


    .text {
      width: 90%;
    }
  }

  @media (min-width: 768px) and (max-width: 1080px) {
    padding: 20px 100px;

    .text {
      width: 70%;
    }
  }

  @media (min-width: 1081px) and (max-width: 1600px) {
    .text {
      width: 60%;
    }

  @media (min-width: 1601px) {
    justify-content: space-between;

    .text {
      color: var(--color-accentText);
    }
  }
`;

const Home = () => {
    return ( 
        <StyledSection>
            <div className="text">
                <p><Link to='/login' className="logReg">Login</Link> and begin discussing art projects with others, or <Link to='/register' className="logReg">Register</Link> now and enjoy!</p>
            </div>
        </StyledSection>
     );
}
 
export default Home;