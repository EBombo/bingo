import React, { setGlobal, useEffect, useGlobal, useState } from "reactn";
import {
  collectionToDate,
  useEnvironment,
  useLanguageCode,
  useLocation,
  useSettings,
  useUser,
} from "../hooks";
import { config, firestore, version } from "../firebase";
import get from "lodash/get";
import { darkTheme, lightTheme } from "../theme";
import moment from "moment";
import { setLocale } from "yup";
import { yup } from "../config";
import { register } from "next-offline/runtime";
import { spinLoader } from "../components/common/loader";
import dynamic from "next/dynamic";

const UpdateVersion = dynamic(
  () => import("../components/versions/UpdateVersion"),
  {
    loading: () => spinLoader(),
  }
);

export const WithConfiguration = (props) => {
  const [authUser] = useGlobal("user");
  const [settings, setSettings] = useGlobal("settings");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");

  const [authUserLS] = useUser();
  const [settingsLS, setSettingsLocalStorage] = useSettings();
  const [environment, setEnvironment] = useEnvironment();
  const [location, setLocationLocalStorage] = useLocation();
  const [languageCode] = useLanguageCode();

  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  let pageLoaded = false;

  useEffect(() => {
    const initializeConfig = async () => {
      environment !== config.firebase.projectId && localStorage.clear();
      setEnvironment(config.firebase.projectId);

      await setGlobal({
        user: authUserLS ? collectionToDate(authUserLS) : null,
        settings: collectionToDate({ ...settingsLS, version }),
        location,
        audios: [],
        languageCode,
        ping: null,
        register: null,
        isLoadingUser: true,
        isLoadingCreateUser: true,
        isVisibleLoginModal: false,
        isVisibleForgotPassword: false,
        openRightDrawer: false,
        openLeftDrawer: false,
        serverTime: new Date(),
        currentCurrency: "s/.",
        theme:
          get(authUserLS, "theme") === "lightTheme" ? lightTheme : darkTheme,
      });

      moment.locale(languageCode);
      setLocale(yup[languageCode]);
    };

    const fetchVersion = () =>
      firestore.doc("settings/default").onSnapshot(async (snapshot) => {
        if (!snapshot.exists) return;

        const newSettings = snapshot.data();

        await setSettings(newSettings);
        setSettingsLocalStorage(newSettings);

        if (version !== newSettings.version && pageLoaded) {
          localStorage.clear();
          document.location.reload(true);
        }

        pageLoaded = true;
      });

    initializeConfig();
    const unsubscribeVersion = fetchVersion();
    setIsLoadingConfig(false);

    return () => unsubscribeVersion();
  }, []);

  useEffect(() => {
    authUser && setIsVisibleLoginModal(false);
  }, [authUser, setIsVisibleLoginModal]);

  useEffect(() => {
    register("/sw.js", { scope: "/" });
  }, []);

  return version === get(settings, "version", version) ? (
    isLoadingConfig ? (
      spinLoader()
    ) : (
      props.children
    )
  ) : (
    <UpdateVersion />
  );
};
