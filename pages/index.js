import React from "reactn";
import { Lading } from "../src/pages/lading";
import { SEOMeta } from "../src/components/common/seo";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <Lading {...props} />
  </>
);

export default Init;
