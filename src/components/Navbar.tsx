import { Outlet, useNavigate } from "react-router-dom";
import { Box, Link } from "@chakra-ui/react";
import { Wrapper } from "../styles/styledComponents/Wrapper";
import { Container } from "../styles/styledComponents/Container";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        color="white"
        height="60px"
        backgroundColor="teal"
        display="flex"
        flexDirection="row"
        gap="30px"
        alignItems="center"
        justifyContent="center"
      >
        <Container>
          <Link onClick={() => navigate("/")} pr={10}>
            Main page
          </Link>
          <Link onClick={() => navigate("/calendar")}>Calendar</Link>
        </Container>
      </Box>
      <Outlet />
    </>
  );
};

export default Navbar;
