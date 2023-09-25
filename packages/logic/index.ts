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
persistObservable(state$.EMAIL_CLIENT.emailProviders, {
  local: "skylar_active_email_providers",
});
persistObservable(state$.EMAIL_CLIENT.activeEmailProviderIndex, {
  local: "skylar_active_active_email_provider_index",
});

export * from "./src";
