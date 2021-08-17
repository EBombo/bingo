import React from "reactn";
import { Lading } from "../src/pages/lading";
import { SEOMeta } from "../src/components/common/seo";
import dynamic from "next/dynamic";
import { spinLoader } from "../src/components/common/loader";

const UserLayout = dynamic(() => import("../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <Lading {...props} />
  </>
);

export default Init;
