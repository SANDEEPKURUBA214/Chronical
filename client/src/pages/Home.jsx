import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Subscription'
import Subscription from '../components/Subscription'
import Footer from '../components/Footer'


const Home= ()=>{
  return (
      <div>
          <Navbar/>
          <Header/>
          <BlogList/>
          <Subscription/>
          <Footer/>
      </div>
    )
}

export default Home