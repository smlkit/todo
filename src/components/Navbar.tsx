import { Outlet, useNavigate } from "react-router-dom";
import { Box, Link } from "@chakra-ui/react";

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
      >
        <Link onClick={() => navigate("/")}>Main</Link>
        <Link onClick={() => navigate("/calendar")}>Calendar</Link>
      </Box>
      <Outlet />
    </>
  );
};

export default Navbar;
