/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DeferredPromise } from "@open-draft/deferred-promise";
import type { TRPCLink } from "@trpc/client";
import { TRPCClientError } from "@trpc/client";
import { transformResult } from "@trpc/client/shared";
import type { AnyRouter } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";

import type {
  workerLinkOptions,
  workerMessageRequest,
  workerMessageResponse,
} from "../types";

export const workerLink = <TRouter extends AnyRouter>(
  opts: workerLinkOptions,
): TRPCLink<TRouter> => {
  // here we just got initialized in the app - this happens once per app
  // useful for storing cache for instance
  const requestQueue = new Map<
    number,
    DeferredPromise<workerMessageResponse>
  >();

  const worker = opts.createWorker();
  worker.port.start();
  // listen to messages from the worker
  worker.port.onmessage = (event: MessageEvent<workerMessageResponse>) => {
    const { id } = event.data.trpc;
    const deferred = requestQueue.get(id);
    if (!deferred) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Request with id ${id} not found`,
      });
    }
    requestQueue.delete(id);
    deferred.resolve(event.data);
  };

  return (runtime) => {
    return ({ op }) => {
      // this is when passing the result to the next link
      // each link needs to return an observable which propagates results
      return observable((observer) => {
        const { id, type, path } = op;
        const input = runtime.transformer.serialize(op.input);
        const promise = new DeferredPromise<workerMessageResponse>();
        requestQueue.set(id, promise);

        const req: workerMessageRequest = {
          trpc: {
            id,
            method: type,
            params: { path, input },
          },
        };
        worker.port.postMessage(req);

        Promise.resolve(promise)
          .then((res) => {
            const transformed = transformResult(res.trpc, runtime);
            if (!transformed.ok) {
              // if an error is returned from the server, it comes here
              observer.error(TRPCClientError.from(transformed.error));
              return;
            }
            observer.next({
              result: transformed.result,
            });
            observer.complete();
          })
          .catch((cause) => {
            observer.error(TRPCClientError.from(cause, {}));
          });
        return () => {};
      });
    };
  };
};
