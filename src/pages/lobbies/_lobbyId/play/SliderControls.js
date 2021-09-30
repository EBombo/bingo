import React, { useGlobal } from "reactn";
import { Slider } from "antd";
import styled from "styled-components";
import { ANIMATION, SPEED } from "../../../../business";

export const SliderControls = () => {
  const [isAutomate] = useGlobal("isAutomate");
  const [animationSpeed, setAnimationSpeed] = useGlobal("animationSpeed");
  const [reproductionSpeed, setReproductionSpeedSpeed] =
    useGlobal("reproductionSpeed");

  if (!isAutomate) return null;

  return (
    <SliderControlsCss>
      <div className="slider-auto">
        <div className="description">Velocidad de la animación</div>
        <div>
          <Slider
            onChange={(value) => setAnimationSpeed(value)}
            defaultValue={animationSpeed}
            min={ANIMATION.min}
            max={ANIMATION.max}
          />
        </div>
      </div>
      <div className="slider-auto">
        <div className="description">Velocidad de reproducción automática</div>
        <div>
          <Slider
            onChange={(value) => setReproductionSpeedSpeed(value)}
            defaultValue={reproductionSpeed}
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
