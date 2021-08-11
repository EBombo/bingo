import React, {useEffect, useState} from "reactn";
import {useRouter} from "next/router";
import styled from "styled-components";
import {firestore} from "../../../../firebase";
import {useForm} from "react-hook-form";
import {array, object, string} from "yup";
import {ButtonAnt, Input} from "../../../../components/form";
import {spinLoader} from "../../../../components/common/loader";
import {useSendError} from "../../../../hooks";

const defaultSeo = [{route: "/"}]

export const SeoContainer = props => {
    const router = useRouter();
    const {sendError} = useSendError();
    const {hostId} = router.query;

    const schema = object().shape({
        seo: array().of(
            object({
                route: string().required(),
                title: string().required(),
                description: string().required(),
                keywords: string().required()
            })
        )
    });

    const [seo, setSeo] = useState(defaultSeo);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSave, setIsLoadingSave] = useState(false);

    const {handleSubmit, register, errors} = useForm({
        validationSchema: schema,
        reValidateMode: "onSubmit"
    });

    useEffect(() => {
        const fetchSeo = async () => {
            const seoQuery = await firestore
                .doc(`seo/${hostId}`)
                .get()

            setSeo(Object.values(seoQuery.data() || {route: "/"}));
            setIsLoading(false);
        };

        fetchSeo();
    }, []);

    const saveSEO = async data => {
        try {
            setIsLoadingSave(true);

            let SEO = mapSEO(data);

            await firestore
                .doc(`seo/${hostId}`)
                .set(SEO);

            props.showNotification("SAVED", "It was saved successfully", "success");
        } catch (error) {
            console.error(error);
            await sendError(error, "saveSEO");
        }
        setIsLoadingSave(false);
    };

    const mapSEO = data =>
        Object.fromEntries(
            data.seo
                .map(seo_ =>
                    [seo_.route, seo_]
                )
        );

    if (isLoading) return spinLoader();

    return <SeoContainerCss>
        <div>SEO for rutes</div>
        <form onSubmit={handleSubmit(saveSEO)}
              autoComplete="off"
              noValidate>
            {
                seo
                    .map((currentSeo, index) =>
                        <fieldset key={index}>
                            <Input type="text"
                                   name={`seo[${index}].route`}
                                   label="Route"
                                   ref={register}
                                   variant="primary"
                                   defaultValue={currentSeo.route}
                                   placeholder="Route"
                                   error={errors.seo?.[index]?.route}/>
                            <Input type="text"
                                   name={`seo[${index}].title`}
                                   label="Title"
                                   ref={register}
                                   variant="primary"
                                   defaultValue={currentSeo.title}
                                   placeholder="Title"
                                   error={errors.seo?.[index]?.title}/>
                            <Input type="text"
                                   name={`seo[${index}].description`}
                                   label="Description"
                                   ref={register}
                                   variant="primary"
                                   defaultValue={currentSeo.description}
                                   placeholder="Description"
                                   error={errors.seo?.[index]?.description}/>
                            <Input type="text"
                                   name={`seo[${index}].keywords`}
                                   label="Keywords"
                                   ref={register}
                                   variant="primary"
                                   defaultValue={currentSeo.keywords}
                                   placeholder="Keywords"
                                   error={errors.seo?.[index]?.keywords}/>
                            {
                                (index + 1) === Object.keys(seo).length
                                && <ButtonAnt variant="danger"
                                              margin="5px auto"
                                              lineheight="normal"
                                              disabled={isLoadingSave}
                                              onClick={() => setSeo([...seo.slice(0, seo.length - 1)])}>
                                    REMOVE
                                </ButtonAnt>
                            }
                        </fieldset>
                    )
            }
            <ButtonAnt variant="default"
                       margin="5px auto"
                       lineheight="normal"
                       disabled={isLoadingSave}
                       onClick={() => setSeo([...seo, {}])}>
                ADD ROUTE
            </ButtonAnt>
            <ButtonAnt variant="primary"
                       margin="15px auto"
                       disabled={isLoadingSave}
                       loading={isLoadingSave}
                       htmlType="submit">
                SAVE
            </ButtonAnt>
        </form>
    </SeoContainerCss>
};

const SeoContainerCss = styled.div`
  color: ${props => props.theme.basic.white};
  margin: auto;
  padding: 10px;
  width: 100%;
  max-width: 400px;
`;
