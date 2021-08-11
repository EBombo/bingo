import React from "reactn";
import {Lading} from "../src/pages/lading";
import {SEOMeta} from "../src/components/common/seo";
import dynamic from "next/dynamic";
import {spinLoader} from "../src/components/common/loader";
import {config} from "../src/firebase";
import defaultSeo from "../defaultSeo.json";

const UserLayout = dynamic(() => import("../src/components/UserLayout"),
    {
        ssr: false,
        loading: () => spinLoader(),
    }
);

const Init = (props) => <>
    <SEOMeta {...props} />
    <UserLayout {...props} isLanding>
        <Lading {...props} />
    </UserLayout>
</>;

export const getStaticProps = async () => {
    const response = await fetch(`${config.serverUrl}/api/seo`);
    const seo = await response.json();

    return {
        props: {
            seo: seo["/"] || defaultSeo
        },
        revalidate: config.maxAgeCache
    };
};

export default Init;
