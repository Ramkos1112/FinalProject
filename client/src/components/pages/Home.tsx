import styled from "styled-components";
import { Link } from "react-router";

const StyledSection = styled.section`
  padding: 20px 200px;
  min-height: calc(100vh - 80px);
  background: #292020d5;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  button {
    background-color: var(--color-background);
    color: var(--color-secondary);
    border: 2px var(--color-secondary) solid;
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
    justify-content: center;
    align-items: center;
    width: 50%;
    padding: 50px 0;
    color: white;
    font-weight: 600;

    > p {
      margin: 0;
      padding: 10px;
    }
  }
`;

const Home = () => {
    return ( 
        <StyledSection>
            <div className="text">
                <h1> Welcome to the artist forums!</h1>
                <p>This is a space to ask other artists for advice. If you don't have an account please make one and begin exchanging information with like minded individuals.</p>
                <Link to="/questions">
                  <button>Go to Forum</button>
                </Link>
            </div>
        </StyledSection>
     );
}
 
export default Home;