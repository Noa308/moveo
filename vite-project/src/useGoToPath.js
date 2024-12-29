import { useNavigate } from "react-router";

const useGoToPath = () => {
  const navigate = useNavigate();
  const goToPath = (path) => navigate(path);
  return goToPath;
};

export default useGoToPath;
