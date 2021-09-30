import React, { useGlobal } from "reactn";
import { Slider } from "antd";
import styled from "styled-components";
import { ANIMATION, SPEED } from "../../../../business";

export const SliderControls = () => {
  const [isAutomate] = useGlobal("isAutomate");
  const [animation, setAnimation] = useGlobal("animation");
  const [speed, setSpeed] = useGlobal("speed");

  if (!isAutomate) return null;

  return (
    <SliderControlsCss>
      <div className="slider-auto">
        <div className="description">Velocidad de la animación</div>
        <div>
          <Slider
            defaultValue={ANIMATION.default}
            min={ANIMATION.min}
            max={ANIMATION.max}
          />
        </div>
      </div>
      <div className="slider-auto">
        <div className="description">Velocidad de reproducción automática</div>
        <div>
          <Slider
            defaultValue={SPEED.default}
            min={SPEED.min}
            max={SPEED.max}
          />
        </div>
      </div>
    </SliderControlsCss>
  );
};

const SliderControlsCss = styled.div`
  font-size: 10px;
  padding: 10px 15px;
  color: ${(props) => props.theme.basic.white};

  .description {
    margin: auto 0;
  }

  .slider-auto {
    display: grid;
    grid-template-columns: 200px 100px;
    width: 90%;
  }
`;
