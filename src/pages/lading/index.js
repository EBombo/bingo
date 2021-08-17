import React, { useEffect, useGlobal } from "reactn";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Anchor } from "../../components/form";

export const Lading = () => {
  const router = useRouter();
  const [authUser] = useGlobal("user");

  useEffect(() => {
    authUser && router.push("/home");
  }, [authUser]);

  return (
    <LadingContainer>
      <Anchor variant="primary" onClick={() => router.push("/login")}>
        INGREGAR
      </Anchor>
    </LadingContainer>
  );
};

const LadingContainer = styled.div`
  color: ${(props) => props.theme.basic.white};
`;
