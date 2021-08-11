import React from "reactn";
import {AclsContainer} from "../../../../../src/pages/admin/users/_userId/acls";
import dynamic from "next/dynamic";
import {spinLoader} from "../../../../../src/components/common/loader";
import {PrivateRoutes} from "../../../../../src/routes/PrivateRoutes";

const UserLayout = dynamic(
    () => import("../../../../../src/components/UserLayout"),
    {
        ssr: false,
        loading: () => spinLoader(),
    }
);

const AdminUserAclsContainer = props => <PrivateRoutes>
    <UserLayout {...props}>
        <AclsContainer {...props} />
    </UserLayout>
</PrivateRoutes>;

export default AdminUserAclsContainer;
