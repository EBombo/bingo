import React, {useGlobal} from "reactn";

export const Home = () => {
    const [authUser] = useGlobal("user");

    return <>
        {authUser?.name}
    </>;
};
