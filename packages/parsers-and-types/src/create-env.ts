import type { BaseSchema, ObjectSchema, Output, ValiError } from "valibot";
import { flatten, merge, object, safeParse } from "valibot";

export type BaseOptions<
  TInput,
  TOutput,
  TShared extends Record<string, BaseSchema<TInput, TOutput>>,
> = {
  /**
   * How to determine whether the app is running on the server or the client.
   * @default typeof window === "undefined"
   */
  isServer?: boolean;

  /**
   * Shared variables, often those that are provided by build tools and is available to both client and server,
   * but isn't prefixed and doesn't require to be manually supplied. For example `NODE_ENV`, `VERCEL_URL` etc.
   */
  shared?: TShared;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   */
  onValidationError?: (error: ValiError) => never;

  /**
   * Called when a server-side environment variable is accessed on the client.
   * By default an error is thrown.
   */
  onInvalidAccess?: (variable: string) => never;

  /**
   * Whether to skip validation of environment variables.
   * @default false
   */
  skipValidation?: boolean;
};

export type StrictOptions<
  TInput,
  TOutput,
  TPrefix extends string,
  TServer extends Record<string, BaseSchema<TInput, TOutput>>,
  TClient extends Record<string, BaseSchema<TInput, TOutput>>,
  TShared extends Record<string, BaseSchema<TInput, TOutput>>,
> = {
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Enforces all environment variables to be set. Required in for example Next.js Edge and Client runtimes.
   */
  runtimeEnvStrict: Record<
    | {
        [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
          ? TKey
          : never;
      }[keyof TClient]
    | {
        [TKey in keyof TServer]: TKey extends `${TPrefix}${string}`
          ? never
          : TKey;
      }[keyof TServer]
    | {
        [TKey in keyof TShared]: TKey extends string ? TKey : never;
      }[keyof TShared],
    string | boolean | number | undefined
  >;
} & BaseOptions<TInput, TOutput, TShared>;

export type ClientOptions<
  TInput,
  TOutput,
  TPrefix extends string,
  TClient extends Record<string, BaseSchema<TInput, TOutput>>,
> = {
  /**
   * Client-side environment variables are exposed to the client by default. Set what prefix they have
   */
  clientPrefix: TPrefix;

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: Partial<{
    [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
      ? TClient[TKey]
      : ErrorMessage<`${TKey extends string
          ? TKey
          : never} is not prefixed with ${TPrefix}.`>;
  }>;
};

export type ServerOptions<
  TInput,
  TOutput,
  TPrefix extends string,
  TServer extends Record<string, BaseSchema<TInput, TOutput>>,
> = {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: Partial<{
    [TKey in keyof TServer]: TPrefix extends ""
      ? TServer[TKey]
      : TKey extends `${TPrefix}${string}`
      ? ErrorMessage<`${TKey extends `${TPrefix}${string}`
          ? TKey
          : never} should not prefixed with ${TPrefix}.`>
      : TServer[TKey];
  }>;
};

export type ServerClientOptions<
  TInput,
  TOutput,
  TPrefix extends string,
  TServer extends Record<string, BaseSchema<TInput, TOutput>>,
  TClient extends Record<string, BaseSchema<TInput, TOutput>>,
> = ClientOptions<TInput, TOutput, TPrefix, TClient> &
  ServerOptions<TInput, TOutput, TPrefix, TServer>;

export type EnvOptions<
  TInput,
  TOutput,
  TPrefix extends string,
  TServer extends Record<string, BaseSchema<TInput, TOutput>>,
  TClient extends Record<string, BaseSchema<TInput, TOutput>>,
  TShared extends Record<string, BaseSchema<TInput, TOutput>>,
> = StrictOptions<TInput, TOutput, TPrefix, TServer, TClient, TShared> &
  ServerClientOptions<TInput, TOutput, TPrefix, TServer, TClient>;

export type ErrorMessage<T extends string> = T;
export type Simplify<T> = {
  [P in keyof T]: T[P];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export function createEnv<
  TInput,
  TOutput,
  TPrefix extends string = "",
  TServer extends Record<
    string,
    BaseSchema<TInput, TOutput>
  > = NonNullable<unknown>,
  TClient extends Record<
    string,
    BaseSchema<TInput, TOutput>
  > = NonNullable<unknown>,
  TShared extends Record<
    string,
    BaseSchema<TInput, TOutput>
  > = NonNullable<unknown>,
>(
  opts: EnvOptions<TInput, TOutput, TPrefix, TServer, TClient, TShared>,
): Readonly<
  Simplify<
    Output<ObjectSchema<TServer>> &
      Output<ObjectSchema<TClient>> &
      Output<ObjectSchema<TShared>>
  >
> {
  const runtimeEnv = opts.runtimeEnvStrict ?? process.env;

  const skip = !!opts.skipValidation;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  if (skip) return runtimeEnv as any;

  const _client = typeof opts.client === "object" ? opts.client : {};
  const _server = typeof opts.server === "object" ? opts.server : {};
  const _shared = typeof opts.shared === "object" ? opts.shared : {};
  const client = object(_client);
  const server = object(_server);
  const shared = object(_shared);
  const isServer = opts.isServer ?? typeof window === "undefined";

  const allClient = merge([client, shared]);
  const allServer = merge([merge([server, shared]), client]);
  const parsed = isServer
    ? safeParse(allServer, runtimeEnv) // on server we can validate all env vars
    : safeParse(allClient, runtimeEnv); // on client we can only validate the ones that are exposed

  const onValidationError =
    opts.onValidationError ??
    ((error: ValiError) => {
      console.error("❌ Invalid environment variables:", flatten(error).nested);
      throw new Error("Invalid environment variables");
    });

  const onInvalidAccess =
    opts.onInvalidAccess ??
    ((_variable: string) => {
      throw new Error(
        "❌ Attempted to access a server-side environment variable on the client",
      );
    });

  if (parsed.success === false) {
    return onValidationError(parsed.error);
  }

  const env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string" || prop === "__esModule") return undefined;
      if (
        !isServer &&
        opts.clientPrefix &&
        !prop.startsWith(opts.clientPrefix) &&
        shared.object[prop as keyof typeof shared.object] === undefined
      ) {
        return onInvalidAccess(prop);
      }
      return target[prop as keyof typeof target];
    },
    // Maybe reconsider this in the future:
    // https://github.com/t3-oss/t3-env/pull/111#issuecomment-1682931526
    // set(_target, prop) {
    //   // Readonly - this is the error message you get from assigning to a frozen object
    //   throw new Error(
    //     typeof prop === "string"
    //       ? `Cannot assign to read only property ${prop} of object #<Object>`
    //       : `Cannot assign to read only property of object #<Object>`
    //   );
    // },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
  return env as any;
}
