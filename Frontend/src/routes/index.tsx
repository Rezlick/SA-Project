import { useRoutes, RouteObject } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import LoginRoutes from "./LoginRoutes";
import CustomerRoutes from "./CustomerRoutes";

function ConfigRoutes() {
  const isLoggedIn = localStorage.getItem("isLogin") === "true";
  const positionID = localStorage.getItem("positionID"); 
  let role = "";
  if (positionID === '1') {
    role = "IT"
  } else if (positionID === '2'){
    role = "Manager"
  } else {
    role = "Common"
  }
  let routes: RouteObject[] = [];

  if (isLoggedIn) {
    routes = [AdminRoutes(isLoggedIn, role || "Common"), LoginRoutes(), CustomerRoutes()];
  } else {
    routes = [LoginRoutes(), CustomerRoutes()];
  }

  return useRoutes(routes);
}

export default ConfigRoutes;

