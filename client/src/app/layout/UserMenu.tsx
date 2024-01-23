import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../features/account/accountSlice";
import { useAuth } from "../hooks/useAuth";
import { clearBasket } from "../../features/basket/basketSlice";

const UserMenu = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { user } = useAuth();
  const handleLogout = () => {
    dispatch(signOut());
    dispatch(clearBasket());
    Navigate("/login");
  };

  if (!user)
    return (
      <Link to="/login" className="m-2">
        login
      </Link>
    );

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <p className="text-lg">{user?.userName[0].toUpperCase()}</p>
        </div>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
