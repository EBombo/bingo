import { spinLoaderMin } from "../../../components/common/loader";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import React, { useEffect, useGlobal, useState } from "reactn";
import { config, firestore } from "../../../firebase";
import { useFetch } from "../../../hooks/useFetch";
import defaultTo from "lodash/defaultTo";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  ButtonAnt,
  ButtonBingo,
  Input,
  Select,
  Switch,
} from "../../../components/form";
import { useUser } from "../../../hooks";
import { Image } from "../../../components/common/Image";

export const Game = (props) => {
  const router = useRouter();
  const { Fetch } = useFetch();
  const [, setLSAuthUser] = useUser();
  const [audios] = useGlobal("audios");
  const [game, setGame] = useState(null);
  const { tokenId, gameId } = router.query;
  const [, setAuthUser] = useGlobal("user");
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const [showMainCard, setShowMainCard] = useState(true);
  const [userIdentity, setUserIdentity] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);
  const [cardAutofill, setCardAutofill] = useState(false);
  const [showChat, setShowChat] = useState(false);
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
    if (!tokenId || !gameId) return;

    const verifyUser = async () => {
      try {
        const url = `${config.serverUrlEvents}/api/tokens`;
        const { response, error } = await Fetch(url, "POST", { tokenId });

        if (error) {
          props.showNotification("ERROR", "Error al validar la cuenta");
          return router.push("/login");
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

        const authUser = response[0];
        const game = response[1];

        const formatUser = {
          id: authUser.uid,
          email: authUser.email,
          isAdmin: true,
        };

        if (!game.usersIds.includes(formatUser.id))
          return router.push("/login");

        await setAuthUser(formatUser);
        setLSAuthUser(formatUser);
        setGame(game);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserByToken();
  }, [tokenId, gameId]);

  const createLobby = async (typeOfGame) => {
    setIsLoadingSave(true);
    try {
      const pin = await generatePin();

      const lobbiesRef = firestore.collection("lobbies");
      const lobbyId = lobbiesRef.doc().id;

      await lobbiesRef.doc(lobbyId).set({
        pin,
        game,
        typeOfGame,
        id: lobbyId,
        updateAt: new Date(),
        createAt: new Date(),
        isLocked: false,
        isClosed: false,
        startAt: null,
        settings: {
          showMainCard,
          userIdentity,
          showAllCards,
          cardAutofill,
          showChat,
          showParticipants,
          showBoardToUser,
          awards: showAwards ? awards : null,
        },
      });

      return router.push(`/lobbies/${lobbyId}`);
    } catch (error) {
      console.log(error);
    }
    setIsLoadingSave(false);
  };

  const generatePin = async () => {
    const pin = Math.floor(100000 + Math.random() * 900000);
    const isValid = await validatePin(pin);

    return isValid && pin > 99999 ? pin.toString() : await generatePin();
  };

  const validatePin = async (pin) => {
    const gamesRef = await firestore
      .collection("games")
      .where("pin", "==", pin)
      .get();

    return gamesRef.empty;
  };

  if (isLoading) return spinLoaderMin();

  return (
    <GameCss>
      <div>
        <ButtonBingo variant="primary" width="100%">
          {game.name}
        </ButtonBingo>
        <div className="container-game">
          <div className="item">
            <div>Jugadores vs Jugadores</div>
            <div>1:1 dispositivos</div>
            <ButtonBingo
              variant="secondary"
              padding="0 15px"
              loading={isLoadingSave}
              disabled={isLoadingSave}
              onClick={() => createLobby("individual")}
            >
              Clásico
            </ButtonBingo>
          </div>
          <div className="item">
            <div>Equipos vs Equipos</div>
            <div>1 dispositivo</div>
            <ButtonBingo
              variant="primary"
              padding="0 15px"
              loading={isLoadingSave}
              disabled={isLoadingSave}
              onClick={() => createLobby("team")}
            >
              Modo equipo
            </ButtonBingo>
          </div>
        </div>
        <ButtonBingo
          variant="primary"
          className="btn-large"
          width="100%"
          align="left"
          onClick={() => setShowSettings(!showSettings)}
        >
          Opciones del juego{" "}
          {showSettings ? <DownOutlined /> : <RightOutlined />}
        </ButtonBingo>

        {showSettings ? (
          <div className="options">
            <div className="title">Recomendado</div>

            <div className="option">
              <div>
                <div className="title-opt">Identificador de jugador</div>
                <div>Conoce el nombre de la persona atrás del nickname</div>
              </div>
              <Switch
                defaultChecked={userIdentity}
                onChange={() => setUserIdentity(!userIdentity)}
              />
            </div>

            <div className="title">General</div>

            <div className="option">
              <div>
                <div className="title-opt">
                  Mostrar cartilla principal y bolas en dispositivos de jug.{" "}
                </div>
                <div>Para videoconferencias y mejorar accesibilidad</div>
              </div>
              <Switch
                defaultChecked={showMainCard}
                onChange={() => setShowMainCard(!showMainCard)}
              />
            </div>

            <div className="option">
              <div>
                <div className="title-opt">Música en el Lobby</div>
              </div>
              <Select
                defaultValue={game?.audio?.id ?? audios[0]?.id}
                optionsdom={audios.map((audio) => ({
                  key: audio.id,
                  code: audio.id,
                  name: audio.title,
                }))}
              />
            </div>

            <div className="option">
              <div>
                <div className="title-opt">
                  Los jugadores pueden ver cartillas de otros jug.
                </div>
              </div>
              <Switch
                defaultChecked={showAllCards}
                onChange={() => setShowAllCards(!showAllCards)}
              />
            </div>

            <div className="option">
              <div>
                <div className="title-opt">
                  El jug. tiene que llenar su cartilla manualmente
                </div>
                <div>Los jugadores tienen que estar atentos al juego</div>
              </div>
              <Switch
                defaultChecked={cardAutofill}
                onChange={() => setCardAutofill(!cardAutofill)}
              />
            </div>

            <div className="option">
              <div>
                <div className="title-opt">Chat dentro del juego</div>
              </div>
              <Switch
                defaultChecked={showChat}
                onChange={() => setShowChat(!showChat)}
              />
            </div>

            <div className="option">
              <div>
                <div className="title-opt">
                  El jug. puede ver a los demás participantes
                </div>
              </div>
              <Switch
                defaultChecked={showParticipants}
                onChange={() => setShowParticipants(!showParticipants)}
              />
            </div>

            <div className="option">
              <div>
                <div className="title-opt">
                  El usuario tiene la tabla general en su pantalla
                </div>
              </div>
              <Switch
                defaultChecked={showBoardToUser}
                onChange={() => setShowBoardToUser(!showBoardToUser)}
              />
            </div>

            <div className="option">
              <div>
                <div className="title-opt">Premio</div>
              </div>
              <Switch
                defaultChecked={showAwards}
                onChange={() => setShowAwards(!showAwards)}
              />
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
                        let newAwards = awards.filter(
                          (award, idx) => idx !== index
                        );

                        setAwards([...newAwards]);
                      }}
                    >
                      <Image
                        src={`${config.storageUrl}/resources/close.svg`}
                        height="15px"
                        width="15px"
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
        ) : null}
      </div>
    </GameCss>
  );
};

const GameCss = styled.div`
  width: 100%;
  margin: auto;
  max-width: 500px;
  padding-top: 20px;
  color: ${(props) => props.theme.basic.white};

  .container-game {
    grid-gap: 5px;
    padding: 10px 5px 5px 5px;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .item {
      padding: 15px;
      font-size: 11px;
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
      margin: 1px auto;
      padding: 5px 10px;
      background: ${(props) => props.theme.basic.primary};

      .title-opt {
        font-weight: bold;
      }

      .ant-switch {
        margin: auto !important;
      }

      display: grid;
      grid-template-columns: 5fr 1fr;
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
`;
