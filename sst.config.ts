import type { SSTConfig } from "sst";

import { Frontend } from "./stacks/frontend";

export default {
  config(_input) {
    return {
      name: "skylar-email",
      region: "us-west-2",
    };
  },
  stacks(app) {
    if (app.stage !== "production") {
      app.setDefaultRemovalPolicy("destroy");
    }
    app.stack(Frontend);
  },
} satisfies SSTConfig;
