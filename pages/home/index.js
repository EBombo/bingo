import React from "reactn";
import { Home } from "../../src/pages/home";
import { SEOMeta } from "../../src/components/common/seo";
import { UserPrivateRoute } from "../../src/routes/UserPrivateRoute";

const HomePage = (props) => (
  <UserPrivateRoute>
    <SEOMeta {...props} />
    <Home {...props} />
  </UserPrivateRoute>
);

export default HomePage;
