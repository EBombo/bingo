import React from "reactn";
import {TemplatesContainer} from "../../../src/pages/admin/settings/templates";
import dynamic from "next/dynamic";
import {spinLoader} from "../../../src/components/common/loader";
import {PrivateRoutes} from "../../../src/routes/PrivateRoutes";

const UserLayout = dynamic(() => import("../../../src/components/UserLayout"), {
    ssr: false,
    loading: () => spinLoader()
});

const AdminTemplatesContainer = props =>
    <PrivateRoutes>
        <UserLayout {...props}>
            <TemplatesContainer {...props}/>
        </UserLayout>
    </PrivateRoutes>

export default AdminTemplatesContainer;
