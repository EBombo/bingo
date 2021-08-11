import React from "reactn";
import dynamic from "next/dynamic";
import {spinLoader} from "../../../../src/components/common/loader";
import {SeoContainer} from "../../../../src/pages/admin/seo/_hostId";
import {PrivateRoutes} from "../../../../src/routes/PrivateRoutes";

const UserLayout = dynamic(() => import("../../../../src/components/UserLayout"), {
    ssr: false,
    loading: () => spinLoader()
});

const AdminSEOContainer = props =>
    <PrivateRoutes>
        <UserLayout {...props}>
            <SeoContainer {...props}/>
        </UserLayout>
    </PrivateRoutes>

export default AdminSEOContainer;
