import React from "reactn";
import {UserProfile} from "../../../src/pages/users/_userId";
import dynamic from "next/dynamic";
import {spinLoader} from "../../../src/components/common/loader";
import {UserPrivateRoute} from "../../../src/routes/UserPrivateRoute";

const UserLayout = dynamic(
    () => import("../../../src/components/UserLayout"),
    {
        ssr: false,
        loading: () => spinLoader(),
    }
);

const UserProfileContainer = props => <UserPrivateRoute>
    <UserLayout {...props}>
        <UserProfile {...props} />
    </UserLayout>
</UserPrivateRoute>;

export default UserProfileContainer;
