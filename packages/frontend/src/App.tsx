import React, { ReactElement, useEffect } from "react";
import "./App.css";
import { SnackbarProvider, useSnackbar } from "notistack";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { GlobalOverlay, Loading } from "@poodna/design-system";
import Routes from "./Routes";
import { useOverlay } from "@poodna/design-system/src/components/utility/GlobalOverlay";
import { appStore, gunStore } from "./stores/appStore";
import { observer } from "mobx-react-lite";

/*
  Load Everything
*/
const AppLoader = observer((p: { children: ReactElement }) => {
  //Routing
  const his = useHistory();
  //Overlay
  const ov = useOverlay();
  //Snackbar
  const sn = useSnackbar();
  useEffect(() => {
    if (his) appStore.set_history(his);
    appStore.set_dialog_trigger({
      show: (p) => {
        ov.showOverlay(p);
      },
      hide: (p) => {
        p.id && ov.hideOverlay(p.id);
      },
    });
    appStore.set_noti_trigger((p) => {
      const { message, ...x } = p;
      sn.enqueueSnackbar(p.message, x);
    });

    gunStore.load_gun();
  }, [his, ov, sn]);

  if (!gunStore.gun || !appStore.history || !appStore.noti_trigger) {
    return (
      <>
        <Loading />
      </>
    );
  }
  return <div>{p.children}</div>;
});
const AppInner = () => {
  return (
    <Router>
      <SnackbarProvider>
        <GlobalOverlay>
          <AppLoader>
            <Routes />
          </AppLoader>
        </GlobalOverlay>
      </SnackbarProvider>
      <audio autoPlay />
    </Router>
  );
};
function App() {
  return <AppInner />;
}

export default App;
