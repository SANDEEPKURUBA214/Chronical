import AboveFooter from "../components/AboveFooter";
import Navbar from './../components/Navbar';
import Header from './../components/Header';
import BlogList from './../components/BlogList';
import Footer from './../components/Footer';


const Home = () => {
  return (
    <div>
      <Navbar/>
      <Header />
      <BlogList />
      <AboveFooter />  {/* ✅ Correct usage */}
      <Footer />
    </div>
  );
};

export default Home;
