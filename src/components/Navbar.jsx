import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/user.slice";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { fetchWithAuth } = useAuth();

  const handleLogout = async () => {
    await fetchWithAuth("http://localhost:3000/signout", {
      withCredentials: true,
    }).then(() => {
      dispatch(signoutSuccess());
      console.log("Logout Successfull!");
      navigate("/");
    });
  };

  return (
    <header className="w-full px-8 py-4 flex justify-between items-center border-b-[1px] border-slate-700 bg-slate-200">
      <div className="">
        <h1 className=" text-purple-600 text-4xl font-medium">
          <Link to="/">MERN</Link>
        </h1>
      </div>
      <div className="">
        <nav className="flex gap-8">
          <div className="">
            <Link to="/">Home</Link>
          </div>
          <div className="">
            {currentUser ? (
              <>@{currentUser.username}</>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
          </div>
          <div className="">
            {currentUser ? (
              <>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <></>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
