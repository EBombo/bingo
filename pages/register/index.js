import React from "reactn";
import { Register } from "../../src/pages/register";
import dynamic from "next/dynamic";
import { spinLoader } from "../../src/components/common/loader";
import { SEOMeta } from "../../src/components/common/seo";

const UserLayout = dynamic(() => import("../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const Registration = (props) => (
  <>
    <SEOMeta {...props} />
    <UserLayout {...props}>
      <Register {...props} />
    </UserLayout>
  </>
);

export default Registration;
