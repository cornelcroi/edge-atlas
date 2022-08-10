import Layout from '../components/Layout';
import '../styles/globals.css';
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Navbar />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
