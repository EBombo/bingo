import React from "reactn";
import {AdminManifest} from "../../../src/pages/admin/settings/Manifests";
import dynamic from "next/dynamic";
import {spinLoader} from "../../../src/components/common/loader";
import {PrivateRoutes} from "../../../src/routes/PrivateRoutes";

const UserLayout = dynamic(() => import("../../../src/components/UserLayout"), {
    ssr: false,
    loading: () => spinLoader()
});

const AdminManifestContainer = props =>
    <PrivateRoutes>
        <UserLayout {...props}>
            <AdminManifest {...props}/>
        </UserLayout>
    </PrivateRoutes>

export default AdminManifestContainer;
