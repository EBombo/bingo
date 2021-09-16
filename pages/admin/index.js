import React from "reactn";
import { AdminPage } from "../../src/pages/admin";
import dynamic from "next/dynamic";
import { spinLoader } from "../../src/components/common/loader";
import { UserPrivateRoute } from "../../src/routes/UserPrivateRoute";

const UserLayout = dynamic(() => import("../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const AdminContainer = (props) => (
  <UserPrivateRoute>
    <UserLayout {...props}>
      <AdminPage {...props} />
    </UserLayout>
  </UserPrivateRoute>
);

export default AdminContainer;
