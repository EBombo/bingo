import React from "reactn";
import {AdminUsers} from "../../../src/pages/admin/users";
import dynamic from "next/dynamic";
import {spinLoader} from "../../../src/components/common/loader";
import {PrivateRoutes} from "../../../src/routes/PrivateRoutes";

const UserLayout = dynamic(
    () => import("../../../src/components/UserLayout"),
    {
        ssr: false,
        loading: () => spinLoader(),
    }
);

const AdminUsersContainer = props => <PrivateRoutes>
    <UserLayout {...props}>
        <AdminUsers {...props} />
    </UserLayout>
</PrivateRoutes>;

export default AdminUsersContainer;
