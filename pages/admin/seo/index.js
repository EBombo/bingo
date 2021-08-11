import React, {useEffect} from "react";
import {spinLoader} from "../../../src/components/common/loader";
import {useRouter} from "next/router";
import {hostName} from "../../../src/firebase";

const Seo = () => {
    const router = useRouter();

    useEffect(() => {
        router.push(`/admin/seo/${encodeURIComponent(hostName)}`)
    }, [])

    return spinLoader();
};

export default Seo;
