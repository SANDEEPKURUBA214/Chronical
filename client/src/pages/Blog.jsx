
import React, { useEffect } from 'react'
import {useParams} from "react-router-dom"
import { assets} from './../assets/assets';
import { useState } from 'react';
import Navbar from './../components/Navbar';
import  Moment from "moment"
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import BlogImage from './../components/BlogImage';
import { useAuthStore } from '../store/useAuthStore';
import API from '../utils/axios.js';

const Blog = () => {

  const {id}= useParams()

  const {user} = useAuthStore()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [content,setContent] = useState('')

  const fetchBlogData = async ()=>{
    try{
      const {data} = await API.get(`/blog/blog/${id}`)

      data.success ? setData(data.blog) : toast.error(data.message)
      // console.log("Fetched comments:", data.comments);

    } catch (error){
      toast.error(error.message)
    }
  }

  const fetchComments = async () => {
  try {
    const { data } = await API.get(`/blog/comments/${id}`);
    if (data.success) {
      setComments(data.comments); // 👈 make sure this is called
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  const addComment = async (e) => {
  e.preventDefault();
  try {
    const { data } = await API.post("/blog/comments", {
      blogId: id,
      content,
    });
    if (data.success) {
      toast.success(data.message);
      setContent("");
      fetchComments(); // refresh
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  const handleDelete = async (commentId) => {
    try {
      const { data } = await API.delete("/admin/delete-comment", {
          data: { id: commentId }
        });

      if (data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast.success("Comment deleted");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  useEffect(()=>{
    fetchBlogData()
    fetchComments()
  },[])



  return data ? (

    <div className='relative'>
      <img src={assets.gradientBackground} alt="background" className="absolute top-0 left-1/2
       -translate-x-1/2 w-full max-w-3xl -z-10"/>
      <Navbar/>

      <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 front-medium'>
          Published on {Moment(data.createdAt).format('MMMM Do YYYY')}</p>
        <h1 className='text-2xl sm: text-5xl font-semibold max-w-2xl-auto
        text-shadow-gray-800'>{data.title}</h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>
        <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full mb-6 border text-sm
        border-primary/35 bg-primary/5 font-medium text-primary">
        <img
          src={data?.user?.photo || assets.user_icon}
          alt="publisher"
          className="w-6 h-6 rounded-full object-cover"
        />
        <span>{data?.user?.name}</span>
      </div>    
      </div>
      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
            <BlogImage path={data.image} className="rounded-lg max-w-4xl w-full" />
            <div className='rich-text max-w-3xl mx:auto' dangerouslySetInnerHTML={{__html:data.description}}></div>
      </div>
              <div className="max-w-3xl mx-auto text-center py-5">
              <p className="font-semibold mb-4">Thank You</p>
              </div>
      {/*comment sectionn */}
        <div className="flex flex-col gap-4 max-w-lg mx-auto">
          <p className="font-semibold mb-4">comments({comments.length})</p>
          {comments.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-3 border-b border-gray-200 pb-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={item.user?.photo || assets.user_icon}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{item.user?.name}</p>
                  <p className="text-gray-700 text-sm">{item.content}</p>
                  <p className="text-xs text-gray-400">
                    {Moment(item.createdAt).fromNow()}
                  </p>
                </div>
              </div>
              {/* ✅ Show delete option if authorized */}
                {user && (
                  (user.role === "admin" ||
                  user._id === item.user?._id ||
                  (user.role === "publisher" && user._id === data?.user?._id)
                  ) && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Delete
                    </button>
              
                  )
                )}

                
            </div>
          ))}
        </div>
            <div className="max-w-3xl mx-auto text-center">
              <p className="font-semibold mb-4">Add comment</p>
              <form
                onSubmit={addComment}
                className="flex flex-col items-center gap-4 max-w-lg mx-auto"
              >
                <textarea
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                  placeholder="Write a comment..."
                  className="w-full p-2 border border-gray-300 rounded outline-none h-28"
                  required
                ></textarea>

                <button
                  type="submit"
                  className="bg-primary text-white rounded-full p-2 px-8 hover:scale-102 transition-all cursor-pointer"
                >
                  Submit
                </button>
              </form>
            </div>
              

            </div>
  ) : <Loader/>
}

export default Blog

