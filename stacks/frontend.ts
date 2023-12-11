import { NextjsSite, StackContext } from "sst/constructs";

export function Frontend({ stack }: StackContext) {
  const site = new NextjsSite(stack, "frontend", {
    path: "./apps/frontend",
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
