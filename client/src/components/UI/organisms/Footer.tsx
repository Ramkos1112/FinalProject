import styled from "styled-components";

const StyledFooter = styled.footer`
    height: 200px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.1);
    .info{
        display: flex;
        gap: 40px;
        a{
            color: var(--color-background);
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
        }
        a:hover{
            text-decoration: underline solid 2px;
            text-underline-offset: 6px;
        }
    }
    .rights{
        >span{
            font-size: 13px;
            color: var(--color-background);
        }
    }
`

const Footer = () => {
    return ( 
        <StyledFooter>
            <div className="info">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms and Uses</a>
            </div>
            <div className="rights">
                <span>© Cypyrights 2025</span>
            </div>
        </StyledFooter>
     );
}
 
export default Footer;