
import Navbar from './../components/Navbar';
import Header from './../components/Header';
import BlogList from './../components/BlogList';
import Footer from './../components/Footer';
import Addon from './../components/Addon';



const Home = () => {
  return (
    <div>
      <Navbar/>
      <Header />
      <BlogList />
      <Addon/>
      <Footer />
    </div>
  );
};

export default Home;
