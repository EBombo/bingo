import React from "reactn";
import { useRouter } from "next/router";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;
  return <div>hola-{lobbyId}</div>;
};
