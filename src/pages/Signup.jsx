import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleChange = (e) => {
    console.log(formData);

    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await axios
        .post("http://localhost:3000/signup", formData)
        .then((res) => {
          console.log(res);

          if (res.statusText === "Created") {
            setLoading(false);
            setError("");
            navigate("/signin");
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err.response.data.message);
        });
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <section className="w-full">
      <div className="max-w-4xl min-w-3xl mx-auto px-8 py-16">
        <h2 className="text-rose-500 text-4xl font-bold text-center">
          Sign Up
        </h2>
        <form className="flex flex-col justify-center items-center gap-8 mt-8">
          <div className="flex flex-col gap-2 text-red-700">
            {error ? error : ""}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-slate-700 font-semibold">
              Username
            </label>
            <input
              type="username"
              id="username"
              name="username"
              className="border border-slate-700 rounded px-4 py-2"
              placeholder="Username"
              onChange={handleChange}
            />
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
            {loading ? "loading..." : "Signup"}
          </button>
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signin" className="text-blue-500">
              Signin now!
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};
export default Signup;
