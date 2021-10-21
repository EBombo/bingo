import React from "reactn";
import { EditProfile } from "../../../../src/pages/users/_userId/edit";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../src/components/common/loader";
import { UserPrivateRoute } from "../../../../src/routes/UserPrivateRoute";

const UserLayout = dynamic(() => import("../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const EditProfileContainer = (props) => (
  <UserPrivateRoute>
    <UserLayout {...props}>
      <EditProfile {...props} />
    </UserLayout>
  </UserPrivateRoute>
);

export default EditProfileContainer;
