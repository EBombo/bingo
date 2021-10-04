import React, { useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import { Popover, Slider } from "antd";
import { mediaQuery } from "../../../constants";
import { SoundOutlined } from "@ant-design/icons";

export const UserLayout = (props) => {
  const [authUser] = useGlobal("user");
  const [audios] = useGlobal("audios");
  const [isPlay, setIsPlay] = useState(false);

  const audioRef = useRef(null);

  return (
    <UserLayoutCss>
      <div className="description">1-75 números</div>
      <div className="title">{props.lobby.game.name}</div>
      <div className="right-content">
        {authUser.isAdmin ? (
          <div className="right-container">
            <Popover
              content={
                <AudioStyled>
                  {audios.map((audio_) => (
                    <div
                      key={audio_.id}
                      className="item-audio"
                      onClick={() => {
                        if (audioRef.current) audioRef.current.pause();

                        const currentAudio = new Audio(audio_.audioUrl);

                        audioRef.current = currentAudio;
                        audioRef.current.play();
                        setIsPlay(true);
                      }}
                    >
                      {audio_.title}
                    </div>
                  ))}
                </AudioStyled>
              }
            >
              <button
                className="nav-button"
                key={audioRef.current?.paused}
                onClick={() => {
                  if (audioRef.current && !audioRef.current?.paused) {
                    audioRef.current.pause();
                    return setIsPlay(false);
                  }

                  const currentAudioToPlay =
                    props.lobby.game?.audio?.audioUrl ?? audios[0].audioUrl;

                  const currentAudio =
                    audioRef.current ?? new Audio(currentAudioToPlay);

                  audioRef.current = currentAudio;
                  audioRef.current.play();
                  setIsPlay(true);
                }}
              >
                {isPlay ? "♫" : "►"}
              </button>
            </Popover>
            <Popover
              content={
                <div style={{ width: 100 }}>
                  <Slider
                    defaultValue={30}
                    onChange={(event) => {
                      if (!audioRef.current) return;
                      audioRef.current.volume = event / 100;
                    }}
                  />
                </div>
              }
            >
              <button className="nav-button" disabled={!isPlay}>
                <SoundOutlined />
              </button>
            </Popover>
          </div>
        ) : (
          <Popover
            trigger="click"
            content={
              <div>
                <div
                  onClick={() => props.logout()}
                  style={{ cursor: "pointer" }}
                >
                  Salir
                </div>
              </div>
            }
          >
            <div className="icon-menu">
              <span />
              <span />
              <span />
            </div>
          </Popover>
        )}
      </div>
    </UserLayoutCss>
  );
};

const UserLayoutCss = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  background: ${(props) => props.theme.basic.whiteDark};
  padding: 0.5rem;
  height: 50px;

  .title {
    text-align: center;
  }

  .right-content {
    display: flex;
    justify-content: flex-end;

    .icon-menu {
      cursor: pointer;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      flex-direction: column;
      height: 30px;

      span {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }

  .description {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
  }

  .right-container {
    display: flex;
    align-items: center;

    button {
      width: 30px;
      height: 30px;
      border: none;
      background: ${(props) => props.theme.basic.whiteLight};
      border-radius: 50%;
      margin: 0 5px;
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 0 1rem;

    .description {
      font-size: 18px;
      line-height: 22px;
    }

    .right-container {
      button {
        width: 40px;
        height: 40px;
        margin: 0 1rem;
      }
    }
  }
`;

const AudioStyled = styled.div`
  width: 100%;

  .item-audio {
    cursor: pointer;
    padding: 0 10px;

    &:hover {
      color: ${(props) => props.theme.basic.secondary};
      background: ${(props) => props.theme.basic.primaryLight};
    }
  }
`;
