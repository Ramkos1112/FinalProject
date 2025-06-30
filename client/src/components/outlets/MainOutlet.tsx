import { Outlet } from "react-router";
import styled from "styled-components";

import Header from "../UI/organisms/Header";
import Footer from "../UI/organisms/Footer";

const StyledMain = styled.main`
    min-height: calc(100vh - 80px - 200px);
`

const MainOutlet = () => {
    return ( 
        <>
            <Header />
            <StyledMain>
                <Outlet/>
            </StyledMain>
            <Footer />
        </>
     );
}
 
export default MainOutlet;