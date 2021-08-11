import React, {useEffect, useState} from "reactn";
import styled from "styled-components";
import {Anchor, Input} from "../../../components/form";
import {firestore} from "../../../firebase";
import {snapshotToArray} from "../../../utils";
import moment from "moment";
import {useRouter} from "next/router";
import {spinLoader} from "../../../components/common/loader";

export const AdminUsers = () => {
    const router = useRouter();
    const [search, setSearch] = useState(null);
    const [loadingSearch, setLoadingSearch] = useState(true);
    const [loadingLimit, setLoadingLimit] = useState(false);
    const [users, setUsers] = useState([]);
    const [limit, setLimit] = useState(5);

    useEffect(() => {
        setLoadingSearch(true);
        findUser();
    }, [limit]);

    const findUser = async () => {
        setLoadingSearch(true);

        let userRef = firestore.collection("users");

        if (search) userRef = userRef.where("searchName", "array-contains", search.toUpperCase())

        const userQuery = await userRef
            .orderBy("createAt", "desc")
            .limit(limit)
            .get();

        setUsers(snapshotToArray(userQuery));
        setLoadingSearch(false);
    };

    return <AdminUsersCss>
        <div className="container">
            <div className="title">
                lista de usuarios
            </div>
            <div className="body">
                <Input label="Buscar usuario"
                       addonAfter={
                           <Anchor onClick={() => findUser()}
                                   variant="primary">
                               Buscar
                           </Anchor>
                       }
                       variant="primary"
                       defaultValue={search}
                       onChange={event => setSearch(event.target.value)}
                       placeholder="Buscar por nombre, email, tlf"/>
            </div>
            <div className="list">
                {
                    loadingSearch
                        ? spinLoader()
                        : users.map(user =>
                            <div className="user-item"
                                 key={`ket-user-${user.id}`}>
                                <div className="info">
                                    email: {user.email}
                                    <br/>
                                    nombre: {user.name}
                                    <br/>
                                    phone: {user.dialCode}{user.phoneNumber}
                                    <br/>
                                    Verificado: {user.isVerified ? "SI" : "NO"}
                                    <br/>
                                    <div className="create-at">
                                        {moment(user.createAt.toDate()).format("LLLL")}
                                    </div>
                                </div>
                                <div className="options">
                                    <Anchor variant="primary"
                                            onClick={() => router.push(`/admin/users/${user.id}/acls`)}>
                                        PERMISOS
                                    </Anchor>
                                </div>
                            </div>
                        )
                }
                <Anchor type="primary"
                        margin="10px 0 10px 0"
                        display="block"
                        disabled={loadingSearch || limit > users.length}
                        onClick={() => {
                            setLimit(limit + 10);
                            setLoadingLimit(true);
                        }}>
                    {loadingLimit && <LoadingOutlined/>} Ver más
                </Anchor>
            </div>
        </div>
    </AdminUsersCss>
};

const AdminUsersCss = styled.div`
  color: ${props => props.theme.basic.white};

  .container {
    margin: auto;
    padding: 10px;
    width: 100%;
    max-width: 400px;

    .title {
      font-weight: bold;
      font-size: 12px;
    }

    .body {


    }

    .list {
      .user-item {
        font-size: 12px;
        border-bottom: 1px solid ${props => props.theme.basic.white};
        display: grid;
        grid-template-columns: auto 80px;

        .info {

          .create-at {
            font-size: 10px;
            color: ${props => props.theme.basic.primary};
          }
        }

        .options {
          display: flex;
          flex-direction: column;

          .redirect {
            color: ${props => props.theme.basic.primary};
            cursor: pointer;
          }
        }
      }

      .loading-more {
        color: ${props => props.theme.basic.primary};
        cursor: pointer;
        text-align: center;
      }

    }
  }
`;
