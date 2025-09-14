import React, { useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../../context/AppContext";

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();

  // update input on each keystroke
  const onChangeHandler = (e) => {
    setInput(e.target.value);
  };

  // keep submit if you also want "enter" button
  const onSubmitHandler = (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  return (
    <div className="relative mx-8 sm:mx-16 xl:mx-24">
      <img
        src={assets.gradientBackground}
        alt="background"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl -z-10"
      />
      <div className="text-center mt-20 mb-8 relative">
        <div
          className="inline-flex items-center justify-center gap-4 px-6 py-1.5
          mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary"
        >
          <p>Powered with GEMINI</p>
          <img src={assets.star_icon} className="w-2.5" alt="" />
        </div>

        <h1 className="text-3xl sm:text-2xl ">
          Your Blogs, Your World, Your Chronical.
        </h1>

        <form
          onSubmit={onSubmitHandler}
          className="mt-8 flex justify-between max-w-lg max-sm:scale-75 mx-auto
          border border-gray-300 bg-white rounded-full overflow-hidden shadow-lg"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search For Blogs"
            value={input}             // controlled input
            onChange={onChangeHandler} // onChange updates context
            required
            className="w-full pl-4 outline-none rounded-full"
          />
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 m-1.5
            rounded-full hover:scale-105 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
