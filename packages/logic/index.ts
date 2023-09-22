import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

import { state$ } from "./src";

enableReactUse();
configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});
persistObservable(state$.EMAIL_CLIENT, {
  local: "email_client", // Unique name
});

export * from "./src";
