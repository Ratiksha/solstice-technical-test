import { useAuthStore } from "../state/authStore";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full flex justify-end">
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Logout
      </button>
    </div>
  );
};

export default TopBar;
