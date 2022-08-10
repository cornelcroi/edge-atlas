import Layout from '../components/Layout';
import '../styles/globals.css';
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navbar />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

export default MyApp;
