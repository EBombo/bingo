import { spinLoaderMin } from "../../../components/common/loader";
import React, { useEffect, useGlobal, useState } from "reactn";
import { config, firestore, firestoreBomboGames } from "../../../firebase";
import { useFetch } from "../../../hooks/useFetch";
import defaultTo from "lodash/defaultTo";
import { useRouter } from "next/router";
import styled from "styled-components";
import { ButtonAnt, Input, Select, Switch } from "../../../components/form";
import { useSendError, useUser } from "../../../hooks";
import { Image } from "../../../components/common/Image";
import { mediaQuery } from "../../../constants";
import { Collapse } from "antd";

const { Panel } = Collapse;

export const CreateLobby = (props) => {
  const { sendError } = useSendError();
  const { Fetch } = useFetch();

  const router = useRouter();
  const { userId, tokenId, gameId } = router.query;

  const [, setLSAuthUser] = useUser();

  const [audios] = useGlobal("audios");
  const [authUser, setAuthUser] = useGlobal("user");

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const [userIdentity, setUserIdentity] = useState(true);
  const [showAllCards, setShowAllCards] = useState(false);
  const [cardAutofill, setCardAutofill] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showBoardToUser, setShowBoardToUser] = useState(false);
  const [awards, setAwards] = useState([
    {
      name: "",
      order: 1,
    },
  ]);
  const [showAwards, setShowAwards] = useState(false);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/login");
  }, []);

  useEffect(() => {
    if ((!tokenId && !userId) || !gameId) return;

    const verifyUser = async () => {
      try {
        const url = `${config.serverUrlEvents}/api/tokens`;
        const { response, error } = await Fetch(url, "POST", { tokenId, userId });

        if (error) {
          props.showNotification("ERROR", "Error al validar la cuenta");

          if (typeof window !== "undefined") window.location.href = "/";
          return;
        }

        return response.user;
      } catch (error) {
        console.error(error);
      }
    };

    const fetchGame = async () => {
      const gameRef = await firestore.doc(`games/${gameId}`).get();
      return gameRef.data();
    };

    const fetchUserByToken = async () => {
      try {
        const promiseUser = verifyUser();
        const promiseGame = fetchGame();

        const response = await Promise.all([promiseUser, promiseGame]);

        const userAdmin = response[0];
        const game = response[1];

        const formatUser = {
          id: userAdmin.uid,
          nickname: userAdmin.name,
          email: userAdmin.email,
          isAdmin: true,
          companyId: userAdmin.companyId ?? null,
        };

        if (!game?.usersIds?.includes(formatUser.id) && typeof window !== "undefined") {
          window.location.href = "/";
          return;
        }

        await setAuthUser(formatUser);
        setLSAuthUser(formatUser);
        setGame(game);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        props.showNotification("ERROR", "Algo salio mal, intentalo nuevamente");
      }
    };

    fetchUserByToken();
  }, [tokenId, gameId]);

  const createLobby = async (typeOfGame) => {
    setIsLoadingSave(true);
    try {
      const pin = await generatePin();

      // References.
      const lobbiesRef = firestore.collection("lobbies");
      const lobbiesBomboGamesRef = firestoreBomboGames.collection("lobbies");

      // New lobby id.
      const lobbyId = lobbiesRef.doc().id;

      // New lobby mapped.
      const newLobby = {
        pin,
        game,
        typeOfGame,
        id: lobbyId,
        updateAt: new Date(),
        createAt: new Date(),
        isLocked: false,
        isClosed: false,
        companyId: authUser?.companyId ?? null,
        startAt: null,
        countPlayers: 0,
        settings: {
          userIdentity,
          showAllCards,
          cardAutofill,
          showParticipants,
          showBoardToUser,
          // TODO: The order number could be generated by the index of a map.
          awards: showAwards ? awards.filter((award) => award.name !== "") : null,
        },
      };

      // Create lobby [bingo & ebombo-games].
      const promiseLobby = lobbiesRef.doc(lobbyId).set(newLobby);
      const promiseLobbyBomboGames = lobbiesBomboGamesRef.doc(lobbyId).set(newLobby);

      // Metrics.
      const promiseCountPlays = firestore.doc(`games/${game.id}`).update({ countPlays: (game?.countPlays ?? 0) + 1 });

      await Promise.all([promiseLobby, promiseLobbyBomboGames, promiseCountPlays]);

      return router.push(`/bingo/lobbies/${lobbyId}`);
    } catch (error) {
      console.error(error);
      await sendError(error, "createLobby");
      props.showNotification("ERROR", "Algo salio mal al crear el lobby, intetalo nuevamente.");
    }

    setIsLoadingSave(false);
  };

  const validatePin = async (pin) => {
    // Validate ebombo-games.
    const gamesRef = await firestoreBomboGames.collection("lobbies").where("pin", "==", pin).get();

    return gamesRef.empty;
  };

  const generatePin = async () => {
    const pin = Math.floor(100000 + Math.random() * 900000);
    const isValid = await validatePin(pin);

    return isValid && pin > 99999 ? pin.toString() : await generatePin();
  };

  if (isLoading) return spinLoaderMin();

  return (
    <GameCss>
      <div>
        <div className="title">{game.name}</div>
        <div className="container-game">
          <div className="item">
            <div>Jugadores vs Jugadores</div>
            <div>1:1 dispositivos</div>
            <ButtonAnt
              className="btn-play"
              color="success"
              margin="auto"
              loading={isLoadingSave}
              disabled={isLoadingSave}
              onClick={() => createLobby("individual")}
            >
              Jugar
            </ButtonAnt>
          </div>
          <div className="item">
            <div>Equipos vs Equipos</div>
            <div>1 dispositivo</div>
            <ButtonAnt
              color="primary"
              margin="auto"
              disabled={isLoadingSave || true}
              onClick={() => createLobby("team")}
            >
              Modo equipo
            </ButtonAnt>
          </div>
        </div>
        <Collapse defaultActiveKey={["1"]} accordion>
          <Panel header="Opciones del juego" key="1">
            <div className="options">
              <div className="title">Recomendado</div>

              <div className="option">
                <div>
                  <div className="title-opt">Identificador de jugador</div>
                  <span>Conoce el nombre de la persona atrás del nickname</span>
                </div>
                <Switch defaultChecked={userIdentity} onChange={() => setUserIdentity(!userIdentity)} />
              </div>

              <div className="title">General</div>

              <div className="option">
                <div>
                  <div className="title-opt">Mostrar tablero principal y bolas en dispositivos de jug. </div>
                  <span>Para videoconferencias y mejorar accesibilidad</span>
                </div>
                <Switch defaultChecked={showBoardToUser} onChange={() => setShowBoardToUser(!showBoardToUser)} />
              </div>

              <div className="option with-select">
                <div>
                  <div className="title-opt">Música en el Lobby</div>
                </div>
                <Select
                  defaultValue={game?.audio?.id ?? audios[0]?.id}
                  key={game?.audio?.id ?? audios[0]?.id}
                  optionsdom={audios.map((audio) => ({
                    key: audio.id,
                    code: audio.id,
                    name: audio.title,
                  }))}
                  onChange={(value) => setGame({ ...game, audio: { id: value } })}
                />
              </div>

              <div className="option">
                <div>
                  <div className="title-opt">El jug. tiene que llenar su cartilla manualmente</div>
                  <span>Los jugadores tienen que estar atentos al juego</span>
                </div>
                <Switch defaultChecked={!cardAutofill} onChange={() => setCardAutofill(!cardAutofill)} />
              </div>

              <div className="option_ hidden">
                <div>
                  <div className="title-opt">El jug. puede ver a los demás participantes</div>
                </div>
                <Switch defaultChecked={showParticipants} onChange={() => setShowParticipants(!showParticipants)} />
              </div>

              <div className="option_ hidden">
                <div>
                  <div className="title-opt">Los jugadores pueden ver cartillas de otros jug.</div>
                </div>
                <Switch
                  defaultChecked={showAllCards}
                  onChange={() => setShowAllCards(!showAllCards)}
                  disabled={showParticipants}
                />
              </div>

              <div className="option">
                <div>
                  <div className="title-opt">Premio</div>
                </div>
                <Switch defaultChecked={showAwards} onChange={() => setShowAwards(!showAwards)} />
              </div>

              {showAwards && (
                <div className="awards-container" id={awards.length}>
                  {defaultTo(awards, []).map((award, index) => (
                    <div className="input-container" key={`award-${index}`}>
                      <Input
                        type="text"
                        name={`award-${index}`}
                        defaultValue={award.name}
                        onBlur={(e) => {
                          let newAwards = awards;
                          newAwards[index].name = e.target.value;
                          setAwards([...newAwards]);
                        }}
                        placeholder={`Premio ${index + 1}`}
                        className={"input-award"}
                        key={`award-${index}-${award.order}`}
                      />
                      <button
                        className="btn-delete"
                        onClick={() => {
                          let newAwards = awards.filter((award, idx) => idx !== index);

                          setAwards([...newAwards]);
                        }}
                      >
                        <Image
                          src={`${config.storageUrl}/resources/close.svg`}
                          height="15px"
                          width="15px"
                          cursor="pointer"
                          size="contain"
                          margin="0"
                        />
                      </button>
                    </div>
                  ))}
                  <ButtonAnt
                    color="secondary"
                    margin="0.5rem 0 0.5rem auto"
                    onClick={() => {
                      setAwards([
                        ...awards,
                        {
                          name: "",
                          id: firestore.collection("awards").doc().id,
                          order: awards.length + 1,
                        },
                      ]);
                    }}
                  >
                    Agregar
                  </ButtonAnt>
                </div>
              )}
            </div>
          </Panel>
        </Collapse>
      </div>
    </GameCss>
  );
};

const GameCss = styled.div`
  width: 100%;
  margin: auto;
  max-width: 500px;
  padding: 1rem;
  color: ${(props) => props.theme.basic.white};

  ${mediaQuery.afterTablet} {
    padding: 20px;
  }

  .title {
    border: none;
    width: 100%;
    margin: auto;
    font-size: 14px;
    font-weight: 700;
    font-family: Lato;
    text-align: center;
    border-radius: 4px;
    padding: 10px 10px;
    color: ${(props) => props.theme.basic.black};
    background: ${(props) => props.theme.basic.whiteDark};
    box-shadow: 0 4px 0 ${(props) => props.theme.basic.grayLighten};
  }

  .container-game {
    grid-gap: 5px;
    padding: 10px 5px 5px 5px;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .item {
      font-family: Lato;
      padding: 15px;
      font-size: 15px;
      line-height: 2rem;
      border-radius: 4px;
      text-align: center;
      background: ${(props) => props.theme.basic.primary};
    }
  }

  .btn-large {
    display: block;

    .anticon {
      margin: 5px !important;
      float: right !important;
    }
  }

  .options {
    .title {
      margin: 10px auto;
      text-align: center;
      font-weight: bold;
    }

    .option {
      display: grid;
      grid-template-columns: 5fr 1fr;
      align-items: center;
      margin: 2px auto;
      padding: 5px 10px;
      font-size: 13px;
      line-height: 16px;
      background: ${(props) => props.theme.basic.primaryDarken};
      color: ${(props) => props.theme.basic.whiteLight};
      border-radius: 2px;

      span {
        font-family: Lato;
        font-style: normal;
        font-weight: 300;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.whiteLight};
      }

      .title-opt {
        font-weight: bold;
      }

      .ant-switch {
        margin: auto !important;
      }
    }

    .with-select {
      grid-template-columns: 5fr 3fr;
    }
  }

  .awards-container {
    background: ${(props) => props.theme.basic.primary};
    padding: 0.5rem;

    .input-container {
      margin: 0.5rem 0;
      position: relative;

      .btn-delete {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        z-index: 999;
        width: 15px;
        height: 15px;
      }
    }

    .input-award {
      width: 100%;
      height: 32px;
      background: ${(props) => props.theme.basic.secondary};
      color: ${(props) => props.theme.basic.whiteLight};
      border-radius: 4px !important;
      font-family: Lato;
      font-style: normal;
      font-weight: 300;
      font-size: 13px;
      line-height: 16px;
      border: none !important;
    }
  }

  .ant-collapse {
    border: none !important;

    .ant-collapse-item {
      border: none !important;
    }
  }

  .ant-collapse-header {
    font-size: 14px;
    font-weight: 700;
    font-family: Lato;
    text-align: center;
    border-radius: 4px !important;
    color: ${(props) => props.theme.basic.black};
    background: ${(props) => props.theme.basic.whiteDark};
    box-shadow: 0 4px 0 ${(props) => props.theme.basic.grayLighten};
    text-align: left;
    position: relative;

    .anticon {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .ant-collapse-content {
    background: ${(props) => props.theme.basic.secondary} !important;
  }

  .btn-play {
    font-weight: bold;

    &:hover {
      background: ${(props) => props.theme.buttonSuccess.hover} !important;
    }
  }
`;
