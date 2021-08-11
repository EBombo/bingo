import React, {useEffect, useGlobal} from "reactn";
import {useRouter} from "next/router";
import styled from "styled-components";

export const Lading = () => {
    const router = useRouter();
    const [authUser] = useGlobal("user");

    useEffect(() => {
        authUser && router.push("/home")
    }, [authUser]);

    return <LadingContainer>lading page</LadingContainer>
};

const LadingContainer = styled.div`
  color: ${props => props.theme.basic.white};
`;
