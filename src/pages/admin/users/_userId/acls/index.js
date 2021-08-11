import React, {useEffect, useState} from "reactn";
import {firestore} from "../../../../../firebase";
import {useRouter} from "next/router";
import get from "lodash/get";
import map from "lodash/map";
import flatMap from "lodash/flatMap";
import isEmpty from "lodash/isEmpty";
import mapValues from "lodash/mapValues";
import acls from "../../../../../hooks/acl/acls.json";
import {Controller, useForm} from "react-hook-form";
import {ButtonAnt, Checkbox} from "../../../../../components/form";
import styled from "styled-components";
import {spinLoader} from "../../../../../components/common/loader";

export const AclsContainer = props => {
    const router = useRouter();
    const {userId} = router.query;
    const [user, setUser] = useState({});
    const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [allChecked, setAllChecked] = useState(false);

    const {handleSubmit, control, setValue, watch} = useForm({
        reValidateMode: "onSubmit",
    });

    useEffect(() => {
        const fetchUser = async () => {
            const userQuery = await firestore.doc(`users/${userId}`).get();

            if (!userQuery.exists) return router.push("/");

            setUser(userQuery.data());
            setLoadingUser(false);
        };

        const validateAll = () => {
            const allCheckboxes = watch();
            if (isEmpty(allCheckboxes)) return;
            const cbxValues = Object.values(allCheckboxes);
            return cbxValues.every((item) => item);
        };

        fetchUser();
        setAllChecked(validateAll());
    }, [watch]);

    const updateUser = async data => {
        setLoadingUpdateUser(true);
        const newAcls = mapValues(data, (moduleUrls) =>
            map(moduleUrls, (moduleUrl, key) =>
                (moduleUrl ? key.replaceAll("<", "[").replaceAll(">", "]") : null)
            )
                .filter(
                    (moduleUrl) => moduleUrl
                )
        );

        await firestore.doc(`users/${userId}`).update({
            acls: newAcls,
            isAdmin: flatMap(Object.values(newAcls)).some((acl) =>
                acl.includes("admin")
            ),
        });

        props.showNotification("OK", "Guardado", "success");
        setLoadingUpdateUser(false);
    };

    const toggle = () =>
        map(acls, (moduleAcl, module) =>
            map(moduleAcl.items, (description, urlAcl) => {
                setValue(`${module}.${urlAcl}`.replaceAll("[", "<").replaceAll("]", ">"), !allChecked);
                setAllChecked(!allChecked);
            }));

    return loadingUser
        ? spinLoader()
        : <AclFormCss onSubmit={handleSubmit(updateUser)}
                      noValidate>
            <div>
                Nombre: <b>{user.name}</b>
            </div>
            <div>
                Email: <b>{user.email}</b>
            </div>
            <hr/>
            <label>
                <input type="checkbox"
                       onClick={toggle}
                       checked={allChecked}/> MARCAR TODOS
            </label>
            {
                map(acls, (moduleAcl, module) => (
                    <ul key={module}>
                        <li>{moduleAcl.label}</li>
                        {map(moduleAcl.items, (description, urlAcl) => (
                            <Controller key={urlAcl}
                                        name={`${module}.${urlAcl.replaceAll("[", "<").replaceAll("]", ">")}`}
                                        control={control}
                                        onChange={([value]) => value.target.checked}
                                        defaultValue={get(user, `acls[${module}]`, []).includes(urlAcl)}
                                        as={
                                            <Checkbox variant="primary">
                                                {description}
                                            </Checkbox>
                                        }
                            />
                        ))}
                    </ul>
                ))
            }
            <div className="btns">
                <ButtonAnt onClick={() => router.push(`/admin/users`)}
                           disabled={loadingUpdateUser}>
                    CANCELAR
                </ButtonAnt>
                <ButtonAnt variant="primary"
                           htmlType="submit"
                           loading={loadingUpdateUser}
                           disabled={loadingUpdateUser}>
                    GUARDAR
                </ButtonAnt>
            </div>
        </AclFormCss>;
};

const AclFormCss = styled.form`
  margin: auto;
  padding: 10px;
  width: 100%;
  max-width: 400px;
  color: ${props => props.theme.basic.white};

  .btns {
    display: flex;
  }
`;
