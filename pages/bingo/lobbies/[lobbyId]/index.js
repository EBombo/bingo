import React from "reactn";
import { useRouter } from "next/router";
import { Lobby } from "../../../../src/pages/lobbies/_lobbyId";
import { SEOMeta } from "../../../../src/components/common/seo";
import { spinLoader } from "../../../../src/components/common/loader";
import { CreateLobby } from "../../../../src/pages/lobbies/_lobbyId/CreateLobby";

const LobbyPage = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;

  if (!router.isReady) return spinLoader();

  return (
    <>
      <SEOMeta {...props} />
      {lobbyId === "new" ? <CreateLobby {...props} /> : <Lobby {...props} />}
    </>
  );
};

export default LobbyPage;
