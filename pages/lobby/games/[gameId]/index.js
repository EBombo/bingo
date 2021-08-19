import React from "reactn";
import { SEOMeta } from "../../../../src/components/common/seo";
import { Lobby } from "../../../../src/pages/lobby";

const LobbyPage = (props) => (
  <>
    <SEOMeta {...props} />
    <Lobby {...props} />
  </>
);

export default LobbyPage;
