import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  signinStart,
  signinSuccess,
  signinFailure,
} from "../redux/user/user.slice";

const Signin = () => {
  const [formData, setFormData] = useState({});

  const { currentUser, loading, errorMessage } = useSelector(
    (state) => state.user
  );

  console.log(errorMessage);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    console.log(formData);

    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signinStart());
      await axios
        .post("http://localhost:3000/signin", formData, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.statusText === "OK") {
            dispatch(signinSuccess(res.data));
            localStorage.setItem("currentUser", JSON.stringify(res.data));
            localStorage.setItem("access_token", res.data.access_token);
            navigate("/");
          }
        })
        .catch((err) => {
          dispatch(signinFailure(err.response.data.message));
        });
    } catch (error) {
      dispatch(signinFailure(error));
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <section className="w-full">
      <div className="max-w-4xl min-w-3xl mx-auto px-8 py-16">
        <h2 className="text-rose-500 text-4xl font-bold text-center">
          Sign In
        </h2>
        <form className="flex flex-col justify-center items-center gap-8 mt-8">
          <div className="flex flex-col gap-2 text-red-700">
            {errorMessage ? errorMessage : ""}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-slate-700 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border border-slate-700 rounded px-4 py-2"
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-slate-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border border-slate-700 rounded px-4 py-2"
              placeholder="password"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="bg-rose-500 text-white py-2 rounded font-semibold w-full"
            onClick={handleSubmit}
          >
            {loading ? "loading..." : "Signin"}
          </button>
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/signup" className="text-blue-500">
              Signup now!
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};
export default Signin;
