import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? (
    <div className="h-full w-full flex-col gap-8 flex justify-center items-center">
      <p className="text-orange-700 font-bold text-4xl">
        Hey {currentUser.username}, I hope you&apos;re enjoying our servives!
      </p>
      <p className="text-xl font-semibold">
        Now you can see the user by clicking{" "}
        <Link to="/users" className="text-blue-500">
          here
        </Link>
      </p>
    </div>
  ) : (
    <div className="h-full w-full flex justify-center items-center">
      <p className="text-blue-700 font-bold text-4xl">
        Hey, seems like you&apos;re not logged in, please log in to enjoy our
        services!
      </p>
    </div>
  );
};
export default Home;
