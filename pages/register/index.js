import React from "reactn";
import {Register} from "../../src/pages/register";
import dynamic from "next/dynamic";
import {spinLoader} from "../../src/components/common/loader";
import {SEOMeta} from "../../src/components/common/seo";
import {config} from "../../src/firebase";
import defaultSeo from "../../defaultSeo.json";

const UserLayout = dynamic(() => import("../../src/components/UserLayout"), {ssr: false, loading: () => spinLoader()});

const Registration = props =>
    <>
        <SEOMeta {...props}/>
        <UserLayout {...props}>
            <Register {...props}/>
        </UserLayout>
    </>

export const getStaticProps = async () => {
    const response = await fetch(`${config.serverUrl}/api/seo`);
    const seo = await response.json();

    return {
        props: {
            seo: seo["/register"] || defaultSeo
        },
        revalidate: config.maxAgeCache
    };
};

export default Registration;
