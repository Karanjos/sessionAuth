import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Users = () => {
  const [Users, setUsers] = useState([]);

  console.log("Users :", Users);

  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    fetchWithAuth("http://localhost:3000/users", {
      withCredentials: true,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("data :", data);

        setUsers(data);
      });
  }, []);

  if (!Users) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      {Users &&
        Users.map((user) => (
          <div
            key={user._id}
            className="flex justify-center items-center h-full my-20"
          >
            <div className="p-4 border border-slate-950 rounded-md flex gap-4">
              {/* <p>{user._id}</p> */}
              <p>{user.username}</p>
              <p>{user.email}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
export default Users;
