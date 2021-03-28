import axios from "axios";
import { GetServerSideProps } from "next";

const App = ({ loggedIn }) => {
  return <h1>Hola!</h1>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    await axios.get(`${process.env.API_URL}/api/users/currentuser`, {
      headers: req.headers,
    });
    return {
      props: {
        loggedIn: true,
      },
    };
  } catch {
    return {
      props: {
        loggedIn: false,
      },
    };
  }
};

export default App;
