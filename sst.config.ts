import type { SSTConfig } from "sst";

import { SkylarEmailConstructs } from "./stacks/skylar-email";

export default {
  config(_input) {
    return {
      name: "skylar-email",
      region: "us-west-2",
    };
  },
  stacks(app) {
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
    app.stack(SkylarEmailConstructs);
  },
} satisfies SSTConfig;
