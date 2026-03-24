
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Department
 * 
 */
export type Department = $Result.DefaultSelection<Prisma.$DepartmentPayload>
/**
 * Model AssetTemplate
 * 
 */
export type AssetTemplate = $Result.DefaultSelection<Prisma.$AssetTemplatePayload>
/**
 * Model Asset
 * 
 */
export type Asset = $Result.DefaultSelection<Prisma.$AssetPayload>
/**
 * Model AssetRecord
 * 
 */
export type AssetRecord = $Result.DefaultSelection<Prisma.$AssetRecordPayload>
/**
 * Model RepairRecord
 * 
 */
export type RepairRecord = $Result.DefaultSelection<Prisma.$RepairRecordPayload>
/**
 * Model SystemConfig
 * 
 */
export type SystemConfig = $Result.DefaultSelection<Prisma.$SystemConfigPayload>
/**
 * Model OperationLog
 * 
 */
export type OperationLog = $Result.DefaultSelection<Prisma.$OperationLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  super_admin: 'super_admin',
  admin: 'admin',
  viewer: 'viewer'
};

export type Role = (typeof Role)[keyof typeof Role]


export const DeviceType: {
  laptop: 'laptop',
  desktop: 'desktop',
  aio: 'aio',
  server: 'server'
};

export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType]


export const AssetStatus: {
  in_stock: 'in_stock',
  waiting_pickup: 'waiting_pickup',
  in_use: 'in_use',
  borrowed: 'borrowed',
  in_repair: 'in_repair',
  retired: 'retired'
};

export type AssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus]


export const AssetRecordAction: {
  stock_in: 'stock_in',
  assign: 'assign',
  cancel_assign: 'cancel_assign',
  pick_up: 'pick_up',
  check_out: 'check_out',
  lend: 'lend',
  return: 'return',
  transfer: 'transfer',
  repair: 'repair',
  repair_done: 'repair_done',
  retire: 'retire'
};

export type AssetRecordAction = (typeof AssetRecordAction)[keyof typeof AssetRecordAction]


export const RepairResult: {
  fixed: 'fixed',
  unfixable: 'unfixable'
};

export type RepairResult = (typeof RepairResult)[keyof typeof RepairResult]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type DeviceType = $Enums.DeviceType

export const DeviceType: typeof $Enums.DeviceType

export type AssetStatus = $Enums.AssetStatus

export const AssetStatus: typeof $Enums.AssetStatus

export type AssetRecordAction = $Enums.AssetRecordAction

export const AssetRecordAction: typeof $Enums.AssetRecordAction

export type RepairResult = $Enums.RepairResult

export const RepairResult: typeof $Enums.RepairResult

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.department`: Exposes CRUD operations for the **Department** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Departments
    * const departments = await prisma.department.findMany()
    * ```
    */
  get department(): Prisma.DepartmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assetTemplate`: Exposes CRUD operations for the **AssetTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssetTemplates
    * const assetTemplates = await prisma.assetTemplate.findMany()
    * ```
    */
  get assetTemplate(): Prisma.AssetTemplateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.asset`: Exposes CRUD operations for the **Asset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Assets
    * const assets = await prisma.asset.findMany()
    * ```
    */
  get asset(): Prisma.AssetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assetRecord`: Exposes CRUD operations for the **AssetRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssetRecords
    * const assetRecords = await prisma.assetRecord.findMany()
    * ```
    */
  get assetRecord(): Prisma.AssetRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.repairRecord`: Exposes CRUD operations for the **RepairRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RepairRecords
    * const repairRecords = await prisma.repairRecord.findMany()
    * ```
    */
  get repairRecord(): Prisma.RepairRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.systemConfig`: Exposes CRUD operations for the **SystemConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemConfigs
    * const systemConfigs = await prisma.systemConfig.findMany()
    * ```
    */
  get systemConfig(): Prisma.SystemConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.operationLog`: Exposes CRUD operations for the **OperationLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OperationLogs
    * const operationLogs = await prisma.operationLog.findMany()
    * ```
    */
  get operationLog(): Prisma.OperationLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.5.0
   * Query Engine version: 280c870be64f457428992c43c1f6d557fab6e29e
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Department: 'Department',
    AssetTemplate: 'AssetTemplate',
    Asset: 'Asset',
    AssetRecord: 'AssetRecord',
    RepairRecord: 'RepairRecord',
    SystemConfig: 'SystemConfig',
    OperationLog: 'OperationLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "department" | "assetTemplate" | "asset" | "assetRecord" | "repairRecord" | "systemConfig" | "operationLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Department: {
        payload: Prisma.$DepartmentPayload<ExtArgs>
        fields: Prisma.DepartmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findFirst: {
            args: Prisma.DepartmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findMany: {
            args: Prisma.DepartmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          create: {
            args: Prisma.DepartmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          createMany: {
            args: Prisma.DepartmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepartmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          delete: {
            args: Prisma.DepartmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          update: {
            args: Prisma.DepartmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DepartmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          upsert: {
            args: Prisma.DepartmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          aggregate: {
            args: Prisma.DepartmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartment>
          }
          groupBy: {
            args: Prisma.DepartmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentCountAggregateOutputType> | number
          }
        }
      }
      AssetTemplate: {
        payload: Prisma.$AssetTemplatePayload<ExtArgs>
        fields: Prisma.AssetTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload>
          }
          findFirst: {
            args: Prisma.AssetTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload>
          }
          findMany: {
            args: Prisma.AssetTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload>[]
          }
          create: {
            args: Prisma.AssetTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload>
          }
          createMany: {
            args: Prisma.AssetTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssetTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload>[]
          }
          delete: {
            args: Prisma.AssetTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload>
          }
          update: {
            args: Prisma.AssetTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload>
          }
          deleteMany: {
            args: Prisma.AssetTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AssetTemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload>[]
          }
          upsert: {
            args: Prisma.AssetTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTemplatePayload>
          }
          aggregate: {
            args: Prisma.AssetTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssetTemplate>
          }
          groupBy: {
            args: Prisma.AssetTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssetTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<AssetTemplateCountAggregateOutputType> | number
          }
        }
      }
      Asset: {
        payload: Prisma.$AssetPayload<ExtArgs>
        fields: Prisma.AssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          findFirst: {
            args: Prisma.AssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          findMany: {
            args: Prisma.AssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          create: {
            args: Prisma.AssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          createMany: {
            args: Prisma.AssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          delete: {
            args: Prisma.AssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          update: {
            args: Prisma.AssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          deleteMany: {
            args: Prisma.AssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AssetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          upsert: {
            args: Prisma.AssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          aggregate: {
            args: Prisma.AssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsset>
          }
          groupBy: {
            args: Prisma.AssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssetCountArgs<ExtArgs>
            result: $Utils.Optional<AssetCountAggregateOutputType> | number
          }
        }
      }
      AssetRecord: {
        payload: Prisma.$AssetRecordPayload<ExtArgs>
        fields: Prisma.AssetRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload>
          }
          findFirst: {
            args: Prisma.AssetRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload>
          }
          findMany: {
            args: Prisma.AssetRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload>[]
          }
          create: {
            args: Prisma.AssetRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload>
          }
          createMany: {
            args: Prisma.AssetRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssetRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload>[]
          }
          delete: {
            args: Prisma.AssetRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload>
          }
          update: {
            args: Prisma.AssetRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload>
          }
          deleteMany: {
            args: Prisma.AssetRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AssetRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload>[]
          }
          upsert: {
            args: Prisma.AssetRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetRecordPayload>
          }
          aggregate: {
            args: Prisma.AssetRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssetRecord>
          }
          groupBy: {
            args: Prisma.AssetRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssetRecordCountArgs<ExtArgs>
            result: $Utils.Optional<AssetRecordCountAggregateOutputType> | number
          }
        }
      }
      RepairRecord: {
        payload: Prisma.$RepairRecordPayload<ExtArgs>
        fields: Prisma.RepairRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RepairRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RepairRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload>
          }
          findFirst: {
            args: Prisma.RepairRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RepairRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload>
          }
          findMany: {
            args: Prisma.RepairRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload>[]
          }
          create: {
            args: Prisma.RepairRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload>
          }
          createMany: {
            args: Prisma.RepairRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RepairRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload>[]
          }
          delete: {
            args: Prisma.RepairRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload>
          }
          update: {
            args: Prisma.RepairRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload>
          }
          deleteMany: {
            args: Prisma.RepairRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RepairRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RepairRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload>[]
          }
          upsert: {
            args: Prisma.RepairRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairRecordPayload>
          }
          aggregate: {
            args: Prisma.RepairRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRepairRecord>
          }
          groupBy: {
            args: Prisma.RepairRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<RepairRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.RepairRecordCountArgs<ExtArgs>
            result: $Utils.Optional<RepairRecordCountAggregateOutputType> | number
          }
        }
      }
      SystemConfig: {
        payload: Prisma.$SystemConfigPayload<ExtArgs>
        fields: Prisma.SystemConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findFirst: {
            args: Prisma.SystemConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findMany: {
            args: Prisma.SystemConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          create: {
            args: Prisma.SystemConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          createMany: {
            args: Prisma.SystemConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          delete: {
            args: Prisma.SystemConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          update: {
            args: Prisma.SystemConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          deleteMany: {
            args: Prisma.SystemConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          upsert: {
            args: Prisma.SystemConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          aggregate: {
            args: Prisma.SystemConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemConfig>
          }
          groupBy: {
            args: Prisma.SystemConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemConfigCountArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigCountAggregateOutputType> | number
          }
        }
      }
      OperationLog: {
        payload: Prisma.$OperationLogPayload<ExtArgs>
        fields: Prisma.OperationLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OperationLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OperationLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload>
          }
          findFirst: {
            args: Prisma.OperationLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OperationLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload>
          }
          findMany: {
            args: Prisma.OperationLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload>[]
          }
          create: {
            args: Prisma.OperationLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload>
          }
          createMany: {
            args: Prisma.OperationLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OperationLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload>[]
          }
          delete: {
            args: Prisma.OperationLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload>
          }
          update: {
            args: Prisma.OperationLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload>
          }
          deleteMany: {
            args: Prisma.OperationLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OperationLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OperationLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload>[]
          }
          upsert: {
            args: Prisma.OperationLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperationLogPayload>
          }
          aggregate: {
            args: Prisma.OperationLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOperationLog>
          }
          groupBy: {
            args: Prisma.OperationLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<OperationLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.OperationLogCountArgs<ExtArgs>
            result: $Utils.Optional<OperationLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    department?: DepartmentOmit
    assetTemplate?: AssetTemplateOmit
    asset?: AssetOmit
    assetRecord?: AssetRecordOmit
    repairRecord?: RepairRecordOmit
    systemConfig?: SystemConfigOmit
    operationLog?: OperationLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    operatorLogs: number
    assetRecords: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    operatorLogs?: boolean | UserCountOutputTypeCountOperatorLogsArgs
    assetRecords?: boolean | UserCountOutputTypeCountAssetRecordsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOperatorLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OperationLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAssetRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetRecordWhereInput
  }


  /**
   * Count Type DepartmentCountOutputType
   */

  export type DepartmentCountOutputType = {
    assets: number
    records: number
  }

  export type DepartmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assets?: boolean | DepartmentCountOutputTypeCountAssetsArgs
    records?: boolean | DepartmentCountOutputTypeCountRecordsArgs
  }

  // Custom InputTypes
  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentCountOutputType
     */
    select?: DepartmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountAssetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetRecordWhereInput
  }


  /**
   * Count Type AssetTemplateCountOutputType
   */

  export type AssetTemplateCountOutputType = {
    assets: number
  }

  export type AssetTemplateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assets?: boolean | AssetTemplateCountOutputTypeCountAssetsArgs
  }

  // Custom InputTypes
  /**
   * AssetTemplateCountOutputType without action
   */
  export type AssetTemplateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplateCountOutputType
     */
    select?: AssetTemplateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AssetTemplateCountOutputType without action
   */
  export type AssetTemplateCountOutputTypeCountAssetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
  }


  /**
   * Count Type AssetCountOutputType
   */

  export type AssetCountOutputType = {
    records: number
    repairRecords: number
  }

  export type AssetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    records?: boolean | AssetCountOutputTypeCountRecordsArgs
    repairRecords?: boolean | AssetCountOutputTypeCountRepairRecordsArgs
  }

  // Custom InputTypes
  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCountOutputType
     */
    select?: AssetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeCountRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetRecordWhereInput
  }

  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeCountRepairRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RepairRecordWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    username: string | null
    password: string | null
    realName: string | null
    role: $Enums.Role | null
    isActive: boolean | null
    mustChangePass: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    username: string | null
    password: string | null
    realName: string | null
    role: $Enums.Role | null
    isActive: boolean | null
    mustChangePass: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    password: number
    realName: number
    role: number
    isActive: number
    mustChangePass: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
    realName?: true
    role?: true
    isActive?: true
    mustChangePass?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
    realName?: true
    role?: true
    isActive?: true
    mustChangePass?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    realName?: true
    role?: true
    isActive?: true
    mustChangePass?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    username: string
    password: string
    realName: string
    role: $Enums.Role
    isActive: boolean
    mustChangePass: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    realName?: boolean
    role?: boolean
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    operatorLogs?: boolean | User$operatorLogsArgs<ExtArgs>
    assetRecords?: boolean | User$assetRecordsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    realName?: boolean
    role?: boolean
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    realName?: boolean
    role?: boolean
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
    realName?: boolean
    role?: boolean
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password" | "realName" | "role" | "isActive" | "mustChangePass" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    operatorLogs?: boolean | User$operatorLogsArgs<ExtArgs>
    assetRecords?: boolean | User$assetRecordsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      operatorLogs: Prisma.$OperationLogPayload<ExtArgs>[]
      assetRecords: Prisma.$AssetRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      username: string
      password: string
      realName: string
      role: $Enums.Role
      isActive: boolean
      mustChangePass: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    operatorLogs<T extends User$operatorLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$operatorLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    assetRecords<T extends User$assetRecordsArgs<ExtArgs> = {}>(args?: Subset<T, User$assetRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly realName: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly mustChangePass: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.operatorLogs
   */
  export type User$operatorLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
    where?: OperationLogWhereInput
    orderBy?: OperationLogOrderByWithRelationInput | OperationLogOrderByWithRelationInput[]
    cursor?: OperationLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OperationLogScalarFieldEnum | OperationLogScalarFieldEnum[]
  }

  /**
   * User.assetRecords
   */
  export type User$assetRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    where?: AssetRecordWhereInput
    orderBy?: AssetRecordOrderByWithRelationInput | AssetRecordOrderByWithRelationInput[]
    cursor?: AssetRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssetRecordScalarFieldEnum | AssetRecordScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Department
   */

  export type AggregateDepartment = {
    _count: DepartmentCountAggregateOutputType | null
    _avg: DepartmentAvgAggregateOutputType | null
    _sum: DepartmentSumAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  export type DepartmentAvgAggregateOutputType = {
    id: number | null
    sortOrder: number | null
  }

  export type DepartmentSumAggregateOutputType = {
    id: number | null
    sortOrder: number | null
  }

  export type DepartmentMinAggregateOutputType = {
    id: number | null
    name: string | null
    sortOrder: number | null
    isActive: boolean | null
  }

  export type DepartmentMaxAggregateOutputType = {
    id: number | null
    name: string | null
    sortOrder: number | null
    isActive: boolean | null
  }

  export type DepartmentCountAggregateOutputType = {
    id: number
    name: number
    sortOrder: number
    isActive: number
    _all: number
  }


  export type DepartmentAvgAggregateInputType = {
    id?: true
    sortOrder?: true
  }

  export type DepartmentSumAggregateInputType = {
    id?: true
    sortOrder?: true
  }

  export type DepartmentMinAggregateInputType = {
    id?: true
    name?: true
    sortOrder?: true
    isActive?: true
  }

  export type DepartmentMaxAggregateInputType = {
    id?: true
    name?: true
    sortOrder?: true
    isActive?: true
  }

  export type DepartmentCountAggregateInputType = {
    id?: true
    name?: true
    sortOrder?: true
    isActive?: true
    _all?: true
  }

  export type DepartmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Department to aggregate.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Departments
    **/
    _count?: true | DepartmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DepartmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DepartmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentMaxAggregateInputType
  }

  export type GetDepartmentAggregateType<T extends DepartmentAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartment[P]>
      : GetScalarType<T[P], AggregateDepartment[P]>
  }




  export type DepartmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithAggregationInput | DepartmentOrderByWithAggregationInput[]
    by: DepartmentScalarFieldEnum[] | DepartmentScalarFieldEnum
    having?: DepartmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentCountAggregateInputType | true
    _avg?: DepartmentAvgAggregateInputType
    _sum?: DepartmentSumAggregateInputType
    _min?: DepartmentMinAggregateInputType
    _max?: DepartmentMaxAggregateInputType
  }

  export type DepartmentGroupByOutputType = {
    id: number
    name: string
    sortOrder: number
    isActive: boolean
    _count: DepartmentCountAggregateOutputType | null
    _avg: DepartmentAvgAggregateOutputType | null
    _sum: DepartmentSumAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  type GetDepartmentGroupByPayload<T extends DepartmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sortOrder?: boolean
    isActive?: boolean
    assets?: boolean | Department$assetsArgs<ExtArgs>
    records?: boolean | Department$recordsArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sortOrder?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sortOrder?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectScalar = {
    id?: boolean
    name?: boolean
    sortOrder?: boolean
    isActive?: boolean
  }

  export type DepartmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "sortOrder" | "isActive", ExtArgs["result"]["department"]>
  export type DepartmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assets?: boolean | Department$assetsArgs<ExtArgs>
    records?: boolean | Department$recordsArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DepartmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DepartmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DepartmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Department"
    objects: {
      assets: Prisma.$AssetPayload<ExtArgs>[]
      records: Prisma.$AssetRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      sortOrder: number
      isActive: boolean
    }, ExtArgs["result"]["department"]>
    composites: {}
  }

  type DepartmentGetPayload<S extends boolean | null | undefined | DepartmentDefaultArgs> = $Result.GetResult<Prisma.$DepartmentPayload, S>

  type DepartmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepartmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepartmentCountAggregateInputType | true
    }

  export interface DepartmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Department'], meta: { name: 'Department' } }
    /**
     * Find zero or one Department that matches the filter.
     * @param {DepartmentFindUniqueArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentFindUniqueArgs>(args: SelectSubset<T, DepartmentFindUniqueArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Department that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepartmentFindUniqueOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentFindFirstArgs>(args?: SelectSubset<T, DepartmentFindFirstArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Departments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Departments
     * const departments = await prisma.department.findMany()
     * 
     * // Get first 10 Departments
     * const departments = await prisma.department.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentWithIdOnly = await prisma.department.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentFindManyArgs>(args?: SelectSubset<T, DepartmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Department.
     * @param {DepartmentCreateArgs} args - Arguments to create a Department.
     * @example
     * // Create one Department
     * const Department = await prisma.department.create({
     *   data: {
     *     // ... data to create a Department
     *   }
     * })
     * 
     */
    create<T extends DepartmentCreateArgs>(args: SelectSubset<T, DepartmentCreateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Departments.
     * @param {DepartmentCreateManyArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentCreateManyArgs>(args?: SelectSubset<T, DepartmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Departments and returns the data saved in the database.
     * @param {DepartmentCreateManyAndReturnArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Departments and only return the `id`
     * const departmentWithIdOnly = await prisma.department.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepartmentCreateManyAndReturnArgs>(args?: SelectSubset<T, DepartmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Department.
     * @param {DepartmentDeleteArgs} args - Arguments to delete one Department.
     * @example
     * // Delete one Department
     * const Department = await prisma.department.delete({
     *   where: {
     *     // ... filter to delete one Department
     *   }
     * })
     * 
     */
    delete<T extends DepartmentDeleteArgs>(args: SelectSubset<T, DepartmentDeleteArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Department.
     * @param {DepartmentUpdateArgs} args - Arguments to update one Department.
     * @example
     * // Update one Department
     * const department = await prisma.department.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentUpdateArgs>(args: SelectSubset<T, DepartmentUpdateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Departments.
     * @param {DepartmentDeleteManyArgs} args - Arguments to filter Departments to delete.
     * @example
     * // Delete a few Departments
     * const { count } = await prisma.department.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentDeleteManyArgs>(args?: SelectSubset<T, DepartmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentUpdateManyArgs>(args: SelectSubset<T, DepartmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments and returns the data updated in the database.
     * @param {DepartmentUpdateManyAndReturnArgs} args - Arguments to update many Departments.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Departments and only return the `id`
     * const departmentWithIdOnly = await prisma.department.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DepartmentUpdateManyAndReturnArgs>(args: SelectSubset<T, DepartmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Department.
     * @param {DepartmentUpsertArgs} args - Arguments to update or create a Department.
     * @example
     * // Update or create a Department
     * const department = await prisma.department.upsert({
     *   create: {
     *     // ... data to create a Department
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Department we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentUpsertArgs>(args: SelectSubset<T, DepartmentUpsertArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentCountArgs} args - Arguments to filter Departments to count.
     * @example
     * // Count the number of Departments
     * const count = await prisma.department.count({
     *   where: {
     *     // ... the filter for the Departments we want to count
     *   }
     * })
    **/
    count<T extends DepartmentCountArgs>(
      args?: Subset<T, DepartmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepartmentAggregateArgs>(args: Subset<T, DepartmentAggregateArgs>): Prisma.PrismaPromise<GetDepartmentAggregateType<T>>

    /**
     * Group by Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepartmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepartmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Department model
   */
  readonly fields: DepartmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Department.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assets<T extends Department$assetsArgs<ExtArgs> = {}>(args?: Subset<T, Department$assetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    records<T extends Department$recordsArgs<ExtArgs> = {}>(args?: Subset<T, Department$recordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Department model
   */
  interface DepartmentFieldRefs {
    readonly id: FieldRef<"Department", 'Int'>
    readonly name: FieldRef<"Department", 'String'>
    readonly sortOrder: FieldRef<"Department", 'Int'>
    readonly isActive: FieldRef<"Department", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Department findUnique
   */
  export type DepartmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findUniqueOrThrow
   */
  export type DepartmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findFirst
   */
  export type DepartmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findFirstOrThrow
   */
  export type DepartmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findMany
   */
  export type DepartmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Departments to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department create
   */
  export type DepartmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Department.
     */
    data: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
  }

  /**
   * Department createMany
   */
  export type DepartmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
  }

  /**
   * Department createManyAndReturn
   */
  export type DepartmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
  }

  /**
   * Department update
   */
  export type DepartmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Department.
     */
    data: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
    /**
     * Choose, which Department to update.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department updateMany
   */
  export type DepartmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
  }

  /**
   * Department updateManyAndReturn
   */
  export type DepartmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
  }

  /**
   * Department upsert
   */
  export type DepartmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Department to update in case it exists.
     */
    where: DepartmentWhereUniqueInput
    /**
     * In case the Department found by the `where` argument doesn't exist, create a new Department with this data.
     */
    create: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
    /**
     * In case the Department was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
  }

  /**
   * Department delete
   */
  export type DepartmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter which Department to delete.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department deleteMany
   */
  export type DepartmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Departments to delete
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to delete.
     */
    limit?: number
  }

  /**
   * Department.assets
   */
  export type Department$assetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    cursor?: AssetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Department.records
   */
  export type Department$recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    where?: AssetRecordWhereInput
    orderBy?: AssetRecordOrderByWithRelationInput | AssetRecordOrderByWithRelationInput[]
    cursor?: AssetRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssetRecordScalarFieldEnum | AssetRecordScalarFieldEnum[]
  }

  /**
   * Department without action
   */
  export type DepartmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
  }


  /**
   * Model AssetTemplate
   */

  export type AggregateAssetTemplate = {
    _count: AssetTemplateCountAggregateOutputType | null
    _avg: AssetTemplateAvgAggregateOutputType | null
    _sum: AssetTemplateSumAggregateOutputType | null
    _min: AssetTemplateMinAggregateOutputType | null
    _max: AssetTemplateMaxAggregateOutputType | null
  }

  export type AssetTemplateAvgAggregateOutputType = {
    id: number | null
    sortOrder: number | null
  }

  export type AssetTemplateSumAggregateOutputType = {
    id: number | null
    sortOrder: number | null
  }

  export type AssetTemplateMinAggregateOutputType = {
    id: number | null
    name: string | null
    deviceType: $Enums.DeviceType | null
    brand: string | null
    model: string | null
    os: string | null
    cpu: string | null
    memory: string | null
    storage: string | null
    remark: string | null
    isActive: boolean | null
    sortOrder: number | null
  }

  export type AssetTemplateMaxAggregateOutputType = {
    id: number | null
    name: string | null
    deviceType: $Enums.DeviceType | null
    brand: string | null
    model: string | null
    os: string | null
    cpu: string | null
    memory: string | null
    storage: string | null
    remark: string | null
    isActive: boolean | null
    sortOrder: number | null
  }

  export type AssetTemplateCountAggregateOutputType = {
    id: number
    name: number
    deviceType: number
    brand: number
    model: number
    os: number
    cpu: number
    memory: number
    storage: number
    remark: number
    isActive: number
    sortOrder: number
    _all: number
  }


  export type AssetTemplateAvgAggregateInputType = {
    id?: true
    sortOrder?: true
  }

  export type AssetTemplateSumAggregateInputType = {
    id?: true
    sortOrder?: true
  }

  export type AssetTemplateMinAggregateInputType = {
    id?: true
    name?: true
    deviceType?: true
    brand?: true
    model?: true
    os?: true
    cpu?: true
    memory?: true
    storage?: true
    remark?: true
    isActive?: true
    sortOrder?: true
  }

  export type AssetTemplateMaxAggregateInputType = {
    id?: true
    name?: true
    deviceType?: true
    brand?: true
    model?: true
    os?: true
    cpu?: true
    memory?: true
    storage?: true
    remark?: true
    isActive?: true
    sortOrder?: true
  }

  export type AssetTemplateCountAggregateInputType = {
    id?: true
    name?: true
    deviceType?: true
    brand?: true
    model?: true
    os?: true
    cpu?: true
    memory?: true
    storage?: true
    remark?: true
    isActive?: true
    sortOrder?: true
    _all?: true
  }

  export type AssetTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetTemplate to aggregate.
     */
    where?: AssetTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetTemplates to fetch.
     */
    orderBy?: AssetTemplateOrderByWithRelationInput | AssetTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssetTemplates
    **/
    _count?: true | AssetTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssetTemplateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssetTemplateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetTemplateMaxAggregateInputType
  }

  export type GetAssetTemplateAggregateType<T extends AssetTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateAssetTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssetTemplate[P]>
      : GetScalarType<T[P], AggregateAssetTemplate[P]>
  }




  export type AssetTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetTemplateWhereInput
    orderBy?: AssetTemplateOrderByWithAggregationInput | AssetTemplateOrderByWithAggregationInput[]
    by: AssetTemplateScalarFieldEnum[] | AssetTemplateScalarFieldEnum
    having?: AssetTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetTemplateCountAggregateInputType | true
    _avg?: AssetTemplateAvgAggregateInputType
    _sum?: AssetTemplateSumAggregateInputType
    _min?: AssetTemplateMinAggregateInputType
    _max?: AssetTemplateMaxAggregateInputType
  }

  export type AssetTemplateGroupByOutputType = {
    id: number
    name: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    os: string
    cpu: string
    memory: string
    storage: string
    remark: string | null
    isActive: boolean
    sortOrder: number
    _count: AssetTemplateCountAggregateOutputType | null
    _avg: AssetTemplateAvgAggregateOutputType | null
    _sum: AssetTemplateSumAggregateOutputType | null
    _min: AssetTemplateMinAggregateOutputType | null
    _max: AssetTemplateMaxAggregateOutputType | null
  }

  type GetAssetTemplateGroupByPayload<T extends AssetTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], AssetTemplateGroupByOutputType[P]>
        }
      >
    >


  export type AssetTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    deviceType?: boolean
    brand?: boolean
    model?: boolean
    os?: boolean
    cpu?: boolean
    memory?: boolean
    storage?: boolean
    remark?: boolean
    isActive?: boolean
    sortOrder?: boolean
    assets?: boolean | AssetTemplate$assetsArgs<ExtArgs>
    _count?: boolean | AssetTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assetTemplate"]>

  export type AssetTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    deviceType?: boolean
    brand?: boolean
    model?: boolean
    os?: boolean
    cpu?: boolean
    memory?: boolean
    storage?: boolean
    remark?: boolean
    isActive?: boolean
    sortOrder?: boolean
  }, ExtArgs["result"]["assetTemplate"]>

  export type AssetTemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    deviceType?: boolean
    brand?: boolean
    model?: boolean
    os?: boolean
    cpu?: boolean
    memory?: boolean
    storage?: boolean
    remark?: boolean
    isActive?: boolean
    sortOrder?: boolean
  }, ExtArgs["result"]["assetTemplate"]>

  export type AssetTemplateSelectScalar = {
    id?: boolean
    name?: boolean
    deviceType?: boolean
    brand?: boolean
    model?: boolean
    os?: boolean
    cpu?: boolean
    memory?: boolean
    storage?: boolean
    remark?: boolean
    isActive?: boolean
    sortOrder?: boolean
  }

  export type AssetTemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "deviceType" | "brand" | "model" | "os" | "cpu" | "memory" | "storage" | "remark" | "isActive" | "sortOrder", ExtArgs["result"]["assetTemplate"]>
  export type AssetTemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assets?: boolean | AssetTemplate$assetsArgs<ExtArgs>
    _count?: boolean | AssetTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AssetTemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AssetTemplateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AssetTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssetTemplate"
    objects: {
      assets: Prisma.$AssetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      deviceType: $Enums.DeviceType
      brand: string
      model: string
      os: string
      cpu: string
      memory: string
      storage: string
      remark: string | null
      isActive: boolean
      sortOrder: number
    }, ExtArgs["result"]["assetTemplate"]>
    composites: {}
  }

  type AssetTemplateGetPayload<S extends boolean | null | undefined | AssetTemplateDefaultArgs> = $Result.GetResult<Prisma.$AssetTemplatePayload, S>

  type AssetTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssetTemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssetTemplateCountAggregateInputType | true
    }

  export interface AssetTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssetTemplate'], meta: { name: 'AssetTemplate' } }
    /**
     * Find zero or one AssetTemplate that matches the filter.
     * @param {AssetTemplateFindUniqueArgs} args - Arguments to find a AssetTemplate
     * @example
     * // Get one AssetTemplate
     * const assetTemplate = await prisma.assetTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetTemplateFindUniqueArgs>(args: SelectSubset<T, AssetTemplateFindUniqueArgs<ExtArgs>>): Prisma__AssetTemplateClient<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AssetTemplate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetTemplateFindUniqueOrThrowArgs} args - Arguments to find a AssetTemplate
     * @example
     * // Get one AssetTemplate
     * const assetTemplate = await prisma.assetTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetTemplateClient<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTemplateFindFirstArgs} args - Arguments to find a AssetTemplate
     * @example
     * // Get one AssetTemplate
     * const assetTemplate = await prisma.assetTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetTemplateFindFirstArgs>(args?: SelectSubset<T, AssetTemplateFindFirstArgs<ExtArgs>>): Prisma__AssetTemplateClient<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTemplateFindFirstOrThrowArgs} args - Arguments to find a AssetTemplate
     * @example
     * // Get one AssetTemplate
     * const assetTemplate = await prisma.assetTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetTemplateClient<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssetTemplates
     * const assetTemplates = await prisma.assetTemplate.findMany()
     * 
     * // Get first 10 AssetTemplates
     * const assetTemplates = await prisma.assetTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetTemplateWithIdOnly = await prisma.assetTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetTemplateFindManyArgs>(args?: SelectSubset<T, AssetTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AssetTemplate.
     * @param {AssetTemplateCreateArgs} args - Arguments to create a AssetTemplate.
     * @example
     * // Create one AssetTemplate
     * const AssetTemplate = await prisma.assetTemplate.create({
     *   data: {
     *     // ... data to create a AssetTemplate
     *   }
     * })
     * 
     */
    create<T extends AssetTemplateCreateArgs>(args: SelectSubset<T, AssetTemplateCreateArgs<ExtArgs>>): Prisma__AssetTemplateClient<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AssetTemplates.
     * @param {AssetTemplateCreateManyArgs} args - Arguments to create many AssetTemplates.
     * @example
     * // Create many AssetTemplates
     * const assetTemplate = await prisma.assetTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetTemplateCreateManyArgs>(args?: SelectSubset<T, AssetTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AssetTemplates and returns the data saved in the database.
     * @param {AssetTemplateCreateManyAndReturnArgs} args - Arguments to create many AssetTemplates.
     * @example
     * // Create many AssetTemplates
     * const assetTemplate = await prisma.assetTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AssetTemplates and only return the `id`
     * const assetTemplateWithIdOnly = await prisma.assetTemplate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssetTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, AssetTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AssetTemplate.
     * @param {AssetTemplateDeleteArgs} args - Arguments to delete one AssetTemplate.
     * @example
     * // Delete one AssetTemplate
     * const AssetTemplate = await prisma.assetTemplate.delete({
     *   where: {
     *     // ... filter to delete one AssetTemplate
     *   }
     * })
     * 
     */
    delete<T extends AssetTemplateDeleteArgs>(args: SelectSubset<T, AssetTemplateDeleteArgs<ExtArgs>>): Prisma__AssetTemplateClient<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AssetTemplate.
     * @param {AssetTemplateUpdateArgs} args - Arguments to update one AssetTemplate.
     * @example
     * // Update one AssetTemplate
     * const assetTemplate = await prisma.assetTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetTemplateUpdateArgs>(args: SelectSubset<T, AssetTemplateUpdateArgs<ExtArgs>>): Prisma__AssetTemplateClient<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AssetTemplates.
     * @param {AssetTemplateDeleteManyArgs} args - Arguments to filter AssetTemplates to delete.
     * @example
     * // Delete a few AssetTemplates
     * const { count } = await prisma.assetTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetTemplateDeleteManyArgs>(args?: SelectSubset<T, AssetTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssetTemplates
     * const assetTemplate = await prisma.assetTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetTemplateUpdateManyArgs>(args: SelectSubset<T, AssetTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetTemplates and returns the data updated in the database.
     * @param {AssetTemplateUpdateManyAndReturnArgs} args - Arguments to update many AssetTemplates.
     * @example
     * // Update many AssetTemplates
     * const assetTemplate = await prisma.assetTemplate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AssetTemplates and only return the `id`
     * const assetTemplateWithIdOnly = await prisma.assetTemplate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AssetTemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, AssetTemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AssetTemplate.
     * @param {AssetTemplateUpsertArgs} args - Arguments to update or create a AssetTemplate.
     * @example
     * // Update or create a AssetTemplate
     * const assetTemplate = await prisma.assetTemplate.upsert({
     *   create: {
     *     // ... data to create a AssetTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssetTemplate we want to update
     *   }
     * })
     */
    upsert<T extends AssetTemplateUpsertArgs>(args: SelectSubset<T, AssetTemplateUpsertArgs<ExtArgs>>): Prisma__AssetTemplateClient<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AssetTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTemplateCountArgs} args - Arguments to filter AssetTemplates to count.
     * @example
     * // Count the number of AssetTemplates
     * const count = await prisma.assetTemplate.count({
     *   where: {
     *     // ... the filter for the AssetTemplates we want to count
     *   }
     * })
    **/
    count<T extends AssetTemplateCountArgs>(
      args?: Subset<T, AssetTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssetTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssetTemplateAggregateArgs>(args: Subset<T, AssetTemplateAggregateArgs>): Prisma.PrismaPromise<GetAssetTemplateAggregateType<T>>

    /**
     * Group by AssetTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssetTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetTemplateGroupByArgs['orderBy'] }
        : { orderBy?: AssetTemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssetTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssetTemplate model
   */
  readonly fields: AssetTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssetTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assets<T extends AssetTemplate$assetsArgs<ExtArgs> = {}>(args?: Subset<T, AssetTemplate$assetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AssetTemplate model
   */
  interface AssetTemplateFieldRefs {
    readonly id: FieldRef<"AssetTemplate", 'Int'>
    readonly name: FieldRef<"AssetTemplate", 'String'>
    readonly deviceType: FieldRef<"AssetTemplate", 'DeviceType'>
    readonly brand: FieldRef<"AssetTemplate", 'String'>
    readonly model: FieldRef<"AssetTemplate", 'String'>
    readonly os: FieldRef<"AssetTemplate", 'String'>
    readonly cpu: FieldRef<"AssetTemplate", 'String'>
    readonly memory: FieldRef<"AssetTemplate", 'String'>
    readonly storage: FieldRef<"AssetTemplate", 'String'>
    readonly remark: FieldRef<"AssetTemplate", 'String'>
    readonly isActive: FieldRef<"AssetTemplate", 'Boolean'>
    readonly sortOrder: FieldRef<"AssetTemplate", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * AssetTemplate findUnique
   */
  export type AssetTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
    /**
     * Filter, which AssetTemplate to fetch.
     */
    where: AssetTemplateWhereUniqueInput
  }

  /**
   * AssetTemplate findUniqueOrThrow
   */
  export type AssetTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
    /**
     * Filter, which AssetTemplate to fetch.
     */
    where: AssetTemplateWhereUniqueInput
  }

  /**
   * AssetTemplate findFirst
   */
  export type AssetTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
    /**
     * Filter, which AssetTemplate to fetch.
     */
    where?: AssetTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetTemplates to fetch.
     */
    orderBy?: AssetTemplateOrderByWithRelationInput | AssetTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetTemplates.
     */
    cursor?: AssetTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetTemplates.
     */
    distinct?: AssetTemplateScalarFieldEnum | AssetTemplateScalarFieldEnum[]
  }

  /**
   * AssetTemplate findFirstOrThrow
   */
  export type AssetTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
    /**
     * Filter, which AssetTemplate to fetch.
     */
    where?: AssetTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetTemplates to fetch.
     */
    orderBy?: AssetTemplateOrderByWithRelationInput | AssetTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetTemplates.
     */
    cursor?: AssetTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetTemplates.
     */
    distinct?: AssetTemplateScalarFieldEnum | AssetTemplateScalarFieldEnum[]
  }

  /**
   * AssetTemplate findMany
   */
  export type AssetTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
    /**
     * Filter, which AssetTemplates to fetch.
     */
    where?: AssetTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetTemplates to fetch.
     */
    orderBy?: AssetTemplateOrderByWithRelationInput | AssetTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssetTemplates.
     */
    cursor?: AssetTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetTemplates.
     */
    distinct?: AssetTemplateScalarFieldEnum | AssetTemplateScalarFieldEnum[]
  }

  /**
   * AssetTemplate create
   */
  export type AssetTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a AssetTemplate.
     */
    data: XOR<AssetTemplateCreateInput, AssetTemplateUncheckedCreateInput>
  }

  /**
   * AssetTemplate createMany
   */
  export type AssetTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssetTemplates.
     */
    data: AssetTemplateCreateManyInput | AssetTemplateCreateManyInput[]
  }

  /**
   * AssetTemplate createManyAndReturn
   */
  export type AssetTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * The data used to create many AssetTemplates.
     */
    data: AssetTemplateCreateManyInput | AssetTemplateCreateManyInput[]
  }

  /**
   * AssetTemplate update
   */
  export type AssetTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a AssetTemplate.
     */
    data: XOR<AssetTemplateUpdateInput, AssetTemplateUncheckedUpdateInput>
    /**
     * Choose, which AssetTemplate to update.
     */
    where: AssetTemplateWhereUniqueInput
  }

  /**
   * AssetTemplate updateMany
   */
  export type AssetTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssetTemplates.
     */
    data: XOR<AssetTemplateUpdateManyMutationInput, AssetTemplateUncheckedUpdateManyInput>
    /**
     * Filter which AssetTemplates to update
     */
    where?: AssetTemplateWhereInput
    /**
     * Limit how many AssetTemplates to update.
     */
    limit?: number
  }

  /**
   * AssetTemplate updateManyAndReturn
   */
  export type AssetTemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * The data used to update AssetTemplates.
     */
    data: XOR<AssetTemplateUpdateManyMutationInput, AssetTemplateUncheckedUpdateManyInput>
    /**
     * Filter which AssetTemplates to update
     */
    where?: AssetTemplateWhereInput
    /**
     * Limit how many AssetTemplates to update.
     */
    limit?: number
  }

  /**
   * AssetTemplate upsert
   */
  export type AssetTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the AssetTemplate to update in case it exists.
     */
    where: AssetTemplateWhereUniqueInput
    /**
     * In case the AssetTemplate found by the `where` argument doesn't exist, create a new AssetTemplate with this data.
     */
    create: XOR<AssetTemplateCreateInput, AssetTemplateUncheckedCreateInput>
    /**
     * In case the AssetTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetTemplateUpdateInput, AssetTemplateUncheckedUpdateInput>
  }

  /**
   * AssetTemplate delete
   */
  export type AssetTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
    /**
     * Filter which AssetTemplate to delete.
     */
    where: AssetTemplateWhereUniqueInput
  }

  /**
   * AssetTemplate deleteMany
   */
  export type AssetTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetTemplates to delete
     */
    where?: AssetTemplateWhereInput
    /**
     * Limit how many AssetTemplates to delete.
     */
    limit?: number
  }

  /**
   * AssetTemplate.assets
   */
  export type AssetTemplate$assetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    cursor?: AssetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * AssetTemplate without action
   */
  export type AssetTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
  }


  /**
   * Model Asset
   */

  export type AggregateAsset = {
    _count: AssetCountAggregateOutputType | null
    _avg: AssetAvgAggregateOutputType | null
    _sum: AssetSumAggregateOutputType | null
    _min: AssetMinAggregateOutputType | null
    _max: AssetMaxAggregateOutputType | null
  }

  export type AssetAvgAggregateOutputType = {
    id: number | null
    templateId: number | null
    departmentId: number | null
    version: number | null
  }

  export type AssetSumAggregateOutputType = {
    id: number | null
    templateId: number | null
    departmentId: number | null
    version: number | null
  }

  export type AssetMinAggregateOutputType = {
    id: number | null
    assetCode: string | null
    templateId: number | null
    deviceType: $Enums.DeviceType | null
    brand: string | null
    model: string | null
    serialNumber: string | null
    os: string | null
    cpu: string | null
    memory: string | null
    storage: string | null
    status: $Enums.AssetStatus | null
    currentUserName: string | null
    departmentId: number | null
    purchaseDate: Date | null
    warrantyExpiry: Date | null
    remark: string | null
    version: number | null
  }

  export type AssetMaxAggregateOutputType = {
    id: number | null
    assetCode: string | null
    templateId: number | null
    deviceType: $Enums.DeviceType | null
    brand: string | null
    model: string | null
    serialNumber: string | null
    os: string | null
    cpu: string | null
    memory: string | null
    storage: string | null
    status: $Enums.AssetStatus | null
    currentUserName: string | null
    departmentId: number | null
    purchaseDate: Date | null
    warrantyExpiry: Date | null
    remark: string | null
    version: number | null
  }

  export type AssetCountAggregateOutputType = {
    id: number
    assetCode: number
    templateId: number
    deviceType: number
    brand: number
    model: number
    serialNumber: number
    os: number
    cpu: number
    memory: number
    storage: number
    status: number
    currentUserName: number
    departmentId: number
    purchaseDate: number
    warrantyExpiry: number
    remark: number
    version: number
    _all: number
  }


  export type AssetAvgAggregateInputType = {
    id?: true
    templateId?: true
    departmentId?: true
    version?: true
  }

  export type AssetSumAggregateInputType = {
    id?: true
    templateId?: true
    departmentId?: true
    version?: true
  }

  export type AssetMinAggregateInputType = {
    id?: true
    assetCode?: true
    templateId?: true
    deviceType?: true
    brand?: true
    model?: true
    serialNumber?: true
    os?: true
    cpu?: true
    memory?: true
    storage?: true
    status?: true
    currentUserName?: true
    departmentId?: true
    purchaseDate?: true
    warrantyExpiry?: true
    remark?: true
    version?: true
  }

  export type AssetMaxAggregateInputType = {
    id?: true
    assetCode?: true
    templateId?: true
    deviceType?: true
    brand?: true
    model?: true
    serialNumber?: true
    os?: true
    cpu?: true
    memory?: true
    storage?: true
    status?: true
    currentUserName?: true
    departmentId?: true
    purchaseDate?: true
    warrantyExpiry?: true
    remark?: true
    version?: true
  }

  export type AssetCountAggregateInputType = {
    id?: true
    assetCode?: true
    templateId?: true
    deviceType?: true
    brand?: true
    model?: true
    serialNumber?: true
    os?: true
    cpu?: true
    memory?: true
    storage?: true
    status?: true
    currentUserName?: true
    departmentId?: true
    purchaseDate?: true
    warrantyExpiry?: true
    remark?: true
    version?: true
    _all?: true
  }

  export type AssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asset to aggregate.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Assets
    **/
    _count?: true | AssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetMaxAggregateInputType
  }

  export type GetAssetAggregateType<T extends AssetAggregateArgs> = {
        [P in keyof T & keyof AggregateAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsset[P]>
      : GetScalarType<T[P], AggregateAsset[P]>
  }




  export type AssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithAggregationInput | AssetOrderByWithAggregationInput[]
    by: AssetScalarFieldEnum[] | AssetScalarFieldEnum
    having?: AssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetCountAggregateInputType | true
    _avg?: AssetAvgAggregateInputType
    _sum?: AssetSumAggregateInputType
    _min?: AssetMinAggregateInputType
    _max?: AssetMaxAggregateInputType
  }

  export type AssetGroupByOutputType = {
    id: number
    assetCode: string
    templateId: number | null
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    departmentId: number
    purchaseDate: Date
    warrantyExpiry: Date | null
    remark: string | null
    version: number
    _count: AssetCountAggregateOutputType | null
    _avg: AssetAvgAggregateOutputType | null
    _sum: AssetSumAggregateOutputType | null
    _min: AssetMinAggregateOutputType | null
    _max: AssetMaxAggregateOutputType | null
  }

  type GetAssetGroupByPayload<T extends AssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetGroupByOutputType[P]>
            : GetScalarType<T[P], AssetGroupByOutputType[P]>
        }
      >
    >


  export type AssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetCode?: boolean
    templateId?: boolean
    deviceType?: boolean
    brand?: boolean
    model?: boolean
    serialNumber?: boolean
    os?: boolean
    cpu?: boolean
    memory?: boolean
    storage?: boolean
    status?: boolean
    currentUserName?: boolean
    departmentId?: boolean
    purchaseDate?: boolean
    warrantyExpiry?: boolean
    remark?: boolean
    version?: boolean
    template?: boolean | Asset$templateArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    records?: boolean | Asset$recordsArgs<ExtArgs>
    repairRecords?: boolean | Asset$repairRecordsArgs<ExtArgs>
    _count?: boolean | AssetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetCode?: boolean
    templateId?: boolean
    deviceType?: boolean
    brand?: boolean
    model?: boolean
    serialNumber?: boolean
    os?: boolean
    cpu?: boolean
    memory?: boolean
    storage?: boolean
    status?: boolean
    currentUserName?: boolean
    departmentId?: boolean
    purchaseDate?: boolean
    warrantyExpiry?: boolean
    remark?: boolean
    version?: boolean
    template?: boolean | Asset$templateArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetCode?: boolean
    templateId?: boolean
    deviceType?: boolean
    brand?: boolean
    model?: boolean
    serialNumber?: boolean
    os?: boolean
    cpu?: boolean
    memory?: boolean
    storage?: boolean
    status?: boolean
    currentUserName?: boolean
    departmentId?: boolean
    purchaseDate?: boolean
    warrantyExpiry?: boolean
    remark?: boolean
    version?: boolean
    template?: boolean | Asset$templateArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectScalar = {
    id?: boolean
    assetCode?: boolean
    templateId?: boolean
    deviceType?: boolean
    brand?: boolean
    model?: boolean
    serialNumber?: boolean
    os?: boolean
    cpu?: boolean
    memory?: boolean
    storage?: boolean
    status?: boolean
    currentUserName?: boolean
    departmentId?: boolean
    purchaseDate?: boolean
    warrantyExpiry?: boolean
    remark?: boolean
    version?: boolean
  }

  export type AssetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assetCode" | "templateId" | "deviceType" | "brand" | "model" | "serialNumber" | "os" | "cpu" | "memory" | "storage" | "status" | "currentUserName" | "departmentId" | "purchaseDate" | "warrantyExpiry" | "remark" | "version", ExtArgs["result"]["asset"]>
  export type AssetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | Asset$templateArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    records?: boolean | Asset$recordsArgs<ExtArgs>
    repairRecords?: boolean | Asset$repairRecordsArgs<ExtArgs>
    _count?: boolean | AssetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AssetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | Asset$templateArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }
  export type AssetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | Asset$templateArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }

  export type $AssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Asset"
    objects: {
      template: Prisma.$AssetTemplatePayload<ExtArgs> | null
      department: Prisma.$DepartmentPayload<ExtArgs>
      records: Prisma.$AssetRecordPayload<ExtArgs>[]
      repairRecords: Prisma.$RepairRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      assetCode: string
      templateId: number | null
      deviceType: $Enums.DeviceType
      brand: string
      model: string
      serialNumber: string
      os: string
      cpu: string
      memory: string
      storage: string
      status: $Enums.AssetStatus
      currentUserName: string
      departmentId: number
      purchaseDate: Date
      warrantyExpiry: Date | null
      remark: string | null
      version: number
    }, ExtArgs["result"]["asset"]>
    composites: {}
  }

  type AssetGetPayload<S extends boolean | null | undefined | AssetDefaultArgs> = $Result.GetResult<Prisma.$AssetPayload, S>

  type AssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssetCountAggregateInputType | true
    }

  export interface AssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Asset'], meta: { name: 'Asset' } }
    /**
     * Find zero or one Asset that matches the filter.
     * @param {AssetFindUniqueArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetFindUniqueArgs>(args: SelectSubset<T, AssetFindUniqueArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Asset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetFindUniqueOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Asset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetFindFirstArgs>(args?: SelectSubset<T, AssetFindFirstArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Asset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Assets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assets
     * const assets = await prisma.asset.findMany()
     * 
     * // Get first 10 Assets
     * const assets = await prisma.asset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetWithIdOnly = await prisma.asset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetFindManyArgs>(args?: SelectSubset<T, AssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Asset.
     * @param {AssetCreateArgs} args - Arguments to create a Asset.
     * @example
     * // Create one Asset
     * const Asset = await prisma.asset.create({
     *   data: {
     *     // ... data to create a Asset
     *   }
     * })
     * 
     */
    create<T extends AssetCreateArgs>(args: SelectSubset<T, AssetCreateArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Assets.
     * @param {AssetCreateManyArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetCreateManyArgs>(args?: SelectSubset<T, AssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Assets and returns the data saved in the database.
     * @param {AssetCreateManyAndReturnArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssetCreateManyAndReturnArgs>(args?: SelectSubset<T, AssetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Asset.
     * @param {AssetDeleteArgs} args - Arguments to delete one Asset.
     * @example
     * // Delete one Asset
     * const Asset = await prisma.asset.delete({
     *   where: {
     *     // ... filter to delete one Asset
     *   }
     * })
     * 
     */
    delete<T extends AssetDeleteArgs>(args: SelectSubset<T, AssetDeleteArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Asset.
     * @param {AssetUpdateArgs} args - Arguments to update one Asset.
     * @example
     * // Update one Asset
     * const asset = await prisma.asset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetUpdateArgs>(args: SelectSubset<T, AssetUpdateArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Assets.
     * @param {AssetDeleteManyArgs} args - Arguments to filter Assets to delete.
     * @example
     * // Delete a few Assets
     * const { count } = await prisma.asset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetDeleteManyArgs>(args?: SelectSubset<T, AssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetUpdateManyArgs>(args: SelectSubset<T, AssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assets and returns the data updated in the database.
     * @param {AssetUpdateManyAndReturnArgs} args - Arguments to update many Assets.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AssetUpdateManyAndReturnArgs>(args: SelectSubset<T, AssetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Asset.
     * @param {AssetUpsertArgs} args - Arguments to update or create a Asset.
     * @example
     * // Update or create a Asset
     * const asset = await prisma.asset.upsert({
     *   create: {
     *     // ... data to create a Asset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Asset we want to update
     *   }
     * })
     */
    upsert<T extends AssetUpsertArgs>(args: SelectSubset<T, AssetUpsertArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCountArgs} args - Arguments to filter Assets to count.
     * @example
     * // Count the number of Assets
     * const count = await prisma.asset.count({
     *   where: {
     *     // ... the filter for the Assets we want to count
     *   }
     * })
    **/
    count<T extends AssetCountArgs>(
      args?: Subset<T, AssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssetAggregateArgs>(args: Subset<T, AssetAggregateArgs>): Prisma.PrismaPromise<GetAssetAggregateType<T>>

    /**
     * Group by Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetGroupByArgs['orderBy'] }
        : { orderBy?: AssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Asset model
   */
  readonly fields: AssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Asset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    template<T extends Asset$templateArgs<ExtArgs> = {}>(args?: Subset<T, Asset$templateArgs<ExtArgs>>): Prisma__AssetTemplateClient<$Result.GetResult<Prisma.$AssetTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    department<T extends DepartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentDefaultArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    records<T extends Asset$recordsArgs<ExtArgs> = {}>(args?: Subset<T, Asset$recordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    repairRecords<T extends Asset$repairRecordsArgs<ExtArgs> = {}>(args?: Subset<T, Asset$repairRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Asset model
   */
  interface AssetFieldRefs {
    readonly id: FieldRef<"Asset", 'Int'>
    readonly assetCode: FieldRef<"Asset", 'String'>
    readonly templateId: FieldRef<"Asset", 'Int'>
    readonly deviceType: FieldRef<"Asset", 'DeviceType'>
    readonly brand: FieldRef<"Asset", 'String'>
    readonly model: FieldRef<"Asset", 'String'>
    readonly serialNumber: FieldRef<"Asset", 'String'>
    readonly os: FieldRef<"Asset", 'String'>
    readonly cpu: FieldRef<"Asset", 'String'>
    readonly memory: FieldRef<"Asset", 'String'>
    readonly storage: FieldRef<"Asset", 'String'>
    readonly status: FieldRef<"Asset", 'AssetStatus'>
    readonly currentUserName: FieldRef<"Asset", 'String'>
    readonly departmentId: FieldRef<"Asset", 'Int'>
    readonly purchaseDate: FieldRef<"Asset", 'DateTime'>
    readonly warrantyExpiry: FieldRef<"Asset", 'DateTime'>
    readonly remark: FieldRef<"Asset", 'String'>
    readonly version: FieldRef<"Asset", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Asset findUnique
   */
  export type AssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset findUniqueOrThrow
   */
  export type AssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset findFirst
   */
  export type AssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset findFirstOrThrow
   */
  export type AssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset findMany
   */
  export type AssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Assets to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset create
   */
  export type AssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The data needed to create a Asset.
     */
    data: XOR<AssetCreateInput, AssetUncheckedCreateInput>
  }

  /**
   * Asset createMany
   */
  export type AssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[]
  }

  /**
   * Asset createManyAndReturn
   */
  export type AssetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asset update
   */
  export type AssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The data needed to update a Asset.
     */
    data: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>
    /**
     * Choose, which Asset to update.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset updateMany
   */
  export type AssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput
    /**
     * Limit how many Assets to update.
     */
    limit?: number
  }

  /**
   * Asset updateManyAndReturn
   */
  export type AssetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput
    /**
     * Limit how many Assets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asset upsert
   */
  export type AssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The filter to search for the Asset to update in case it exists.
     */
    where: AssetWhereUniqueInput
    /**
     * In case the Asset found by the `where` argument doesn't exist, create a new Asset with this data.
     */
    create: XOR<AssetCreateInput, AssetUncheckedCreateInput>
    /**
     * In case the Asset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>
  }

  /**
   * Asset delete
   */
  export type AssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter which Asset to delete.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset deleteMany
   */
  export type AssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assets to delete
     */
    where?: AssetWhereInput
    /**
     * Limit how many Assets to delete.
     */
    limit?: number
  }

  /**
   * Asset.template
   */
  export type Asset$templateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTemplate
     */
    select?: AssetTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetTemplate
     */
    omit?: AssetTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTemplateInclude<ExtArgs> | null
    where?: AssetTemplateWhereInput
  }

  /**
   * Asset.records
   */
  export type Asset$recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    where?: AssetRecordWhereInput
    orderBy?: AssetRecordOrderByWithRelationInput | AssetRecordOrderByWithRelationInput[]
    cursor?: AssetRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssetRecordScalarFieldEnum | AssetRecordScalarFieldEnum[]
  }

  /**
   * Asset.repairRecords
   */
  export type Asset$repairRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
    where?: RepairRecordWhereInput
    orderBy?: RepairRecordOrderByWithRelationInput | RepairRecordOrderByWithRelationInput[]
    cursor?: RepairRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RepairRecordScalarFieldEnum | RepairRecordScalarFieldEnum[]
  }

  /**
   * Asset without action
   */
  export type AssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
  }


  /**
   * Model AssetRecord
   */

  export type AggregateAssetRecord = {
    _count: AssetRecordCountAggregateOutputType | null
    _avg: AssetRecordAvgAggregateOutputType | null
    _sum: AssetRecordSumAggregateOutputType | null
    _min: AssetRecordMinAggregateOutputType | null
    _max: AssetRecordMaxAggregateOutputType | null
  }

  export type AssetRecordAvgAggregateOutputType = {
    id: number | null
    assetId: number | null
    departmentId: number | null
    operatorId: number | null
  }

  export type AssetRecordSumAggregateOutputType = {
    id: number | null
    assetId: number | null
    departmentId: number | null
    operatorId: number | null
  }

  export type AssetRecordMinAggregateOutputType = {
    id: number | null
    assetId: number | null
    action: $Enums.AssetRecordAction | null
    userName: string | null
    departmentId: number | null
    actionDate: Date | null
    expectedReturnDate: Date | null
    proofImage: string | null
    remark: string | null
    operatorId: number | null
    requestId: string | null
    createdAt: Date | null
  }

  export type AssetRecordMaxAggregateOutputType = {
    id: number | null
    assetId: number | null
    action: $Enums.AssetRecordAction | null
    userName: string | null
    departmentId: number | null
    actionDate: Date | null
    expectedReturnDate: Date | null
    proofImage: string | null
    remark: string | null
    operatorId: number | null
    requestId: string | null
    createdAt: Date | null
  }

  export type AssetRecordCountAggregateOutputType = {
    id: number
    assetId: number
    action: number
    userName: number
    departmentId: number
    actionDate: number
    expectedReturnDate: number
    proofImage: number
    remark: number
    operatorId: number
    requestId: number
    createdAt: number
    _all: number
  }


  export type AssetRecordAvgAggregateInputType = {
    id?: true
    assetId?: true
    departmentId?: true
    operatorId?: true
  }

  export type AssetRecordSumAggregateInputType = {
    id?: true
    assetId?: true
    departmentId?: true
    operatorId?: true
  }

  export type AssetRecordMinAggregateInputType = {
    id?: true
    assetId?: true
    action?: true
    userName?: true
    departmentId?: true
    actionDate?: true
    expectedReturnDate?: true
    proofImage?: true
    remark?: true
    operatorId?: true
    requestId?: true
    createdAt?: true
  }

  export type AssetRecordMaxAggregateInputType = {
    id?: true
    assetId?: true
    action?: true
    userName?: true
    departmentId?: true
    actionDate?: true
    expectedReturnDate?: true
    proofImage?: true
    remark?: true
    operatorId?: true
    requestId?: true
    createdAt?: true
  }

  export type AssetRecordCountAggregateInputType = {
    id?: true
    assetId?: true
    action?: true
    userName?: true
    departmentId?: true
    actionDate?: true
    expectedReturnDate?: true
    proofImage?: true
    remark?: true
    operatorId?: true
    requestId?: true
    createdAt?: true
    _all?: true
  }

  export type AssetRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetRecord to aggregate.
     */
    where?: AssetRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetRecords to fetch.
     */
    orderBy?: AssetRecordOrderByWithRelationInput | AssetRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssetRecords
    **/
    _count?: true | AssetRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssetRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssetRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetRecordMaxAggregateInputType
  }

  export type GetAssetRecordAggregateType<T extends AssetRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateAssetRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssetRecord[P]>
      : GetScalarType<T[P], AggregateAssetRecord[P]>
  }




  export type AssetRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetRecordWhereInput
    orderBy?: AssetRecordOrderByWithAggregationInput | AssetRecordOrderByWithAggregationInput[]
    by: AssetRecordScalarFieldEnum[] | AssetRecordScalarFieldEnum
    having?: AssetRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetRecordCountAggregateInputType | true
    _avg?: AssetRecordAvgAggregateInputType
    _sum?: AssetRecordSumAggregateInputType
    _min?: AssetRecordMinAggregateInputType
    _max?: AssetRecordMaxAggregateInputType
  }

  export type AssetRecordGroupByOutputType = {
    id: number
    assetId: number
    action: $Enums.AssetRecordAction
    userName: string
    departmentId: number
    actionDate: Date
    expectedReturnDate: Date | null
    proofImage: string | null
    remark: string | null
    operatorId: number
    requestId: string
    createdAt: Date
    _count: AssetRecordCountAggregateOutputType | null
    _avg: AssetRecordAvgAggregateOutputType | null
    _sum: AssetRecordSumAggregateOutputType | null
    _min: AssetRecordMinAggregateOutputType | null
    _max: AssetRecordMaxAggregateOutputType | null
  }

  type GetAssetRecordGroupByPayload<T extends AssetRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetRecordGroupByOutputType[P]>
            : GetScalarType<T[P], AssetRecordGroupByOutputType[P]>
        }
      >
    >


  export type AssetRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    action?: boolean
    userName?: boolean
    departmentId?: boolean
    actionDate?: boolean
    expectedReturnDate?: boolean
    proofImage?: boolean
    remark?: boolean
    operatorId?: boolean
    requestId?: boolean
    createdAt?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assetRecord"]>

  export type AssetRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    action?: boolean
    userName?: boolean
    departmentId?: boolean
    actionDate?: boolean
    expectedReturnDate?: boolean
    proofImage?: boolean
    remark?: boolean
    operatorId?: boolean
    requestId?: boolean
    createdAt?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assetRecord"]>

  export type AssetRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    action?: boolean
    userName?: boolean
    departmentId?: boolean
    actionDate?: boolean
    expectedReturnDate?: boolean
    proofImage?: boolean
    remark?: boolean
    operatorId?: boolean
    requestId?: boolean
    createdAt?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assetRecord"]>

  export type AssetRecordSelectScalar = {
    id?: boolean
    assetId?: boolean
    action?: boolean
    userName?: boolean
    departmentId?: boolean
    actionDate?: boolean
    expectedReturnDate?: boolean
    proofImage?: boolean
    remark?: boolean
    operatorId?: boolean
    requestId?: boolean
    createdAt?: boolean
  }

  export type AssetRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assetId" | "action" | "userName" | "departmentId" | "actionDate" | "expectedReturnDate" | "proofImage" | "remark" | "operatorId" | "requestId" | "createdAt", ExtArgs["result"]["assetRecord"]>
  export type AssetRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AssetRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AssetRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AssetRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssetRecord"
    objects: {
      asset: Prisma.$AssetPayload<ExtArgs>
      department: Prisma.$DepartmentPayload<ExtArgs>
      operator: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      assetId: number
      action: $Enums.AssetRecordAction
      userName: string
      departmentId: number
      actionDate: Date
      expectedReturnDate: Date | null
      proofImage: string | null
      remark: string | null
      operatorId: number
      requestId: string
      createdAt: Date
    }, ExtArgs["result"]["assetRecord"]>
    composites: {}
  }

  type AssetRecordGetPayload<S extends boolean | null | undefined | AssetRecordDefaultArgs> = $Result.GetResult<Prisma.$AssetRecordPayload, S>

  type AssetRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssetRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssetRecordCountAggregateInputType | true
    }

  export interface AssetRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssetRecord'], meta: { name: 'AssetRecord' } }
    /**
     * Find zero or one AssetRecord that matches the filter.
     * @param {AssetRecordFindUniqueArgs} args - Arguments to find a AssetRecord
     * @example
     * // Get one AssetRecord
     * const assetRecord = await prisma.assetRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetRecordFindUniqueArgs>(args: SelectSubset<T, AssetRecordFindUniqueArgs<ExtArgs>>): Prisma__AssetRecordClient<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AssetRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetRecordFindUniqueOrThrowArgs} args - Arguments to find a AssetRecord
     * @example
     * // Get one AssetRecord
     * const assetRecord = await prisma.assetRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetRecordClient<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetRecordFindFirstArgs} args - Arguments to find a AssetRecord
     * @example
     * // Get one AssetRecord
     * const assetRecord = await prisma.assetRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetRecordFindFirstArgs>(args?: SelectSubset<T, AssetRecordFindFirstArgs<ExtArgs>>): Prisma__AssetRecordClient<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetRecordFindFirstOrThrowArgs} args - Arguments to find a AssetRecord
     * @example
     * // Get one AssetRecord
     * const assetRecord = await prisma.assetRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetRecordClient<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssetRecords
     * const assetRecords = await prisma.assetRecord.findMany()
     * 
     * // Get first 10 AssetRecords
     * const assetRecords = await prisma.assetRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetRecordWithIdOnly = await prisma.assetRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetRecordFindManyArgs>(args?: SelectSubset<T, AssetRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AssetRecord.
     * @param {AssetRecordCreateArgs} args - Arguments to create a AssetRecord.
     * @example
     * // Create one AssetRecord
     * const AssetRecord = await prisma.assetRecord.create({
     *   data: {
     *     // ... data to create a AssetRecord
     *   }
     * })
     * 
     */
    create<T extends AssetRecordCreateArgs>(args: SelectSubset<T, AssetRecordCreateArgs<ExtArgs>>): Prisma__AssetRecordClient<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AssetRecords.
     * @param {AssetRecordCreateManyArgs} args - Arguments to create many AssetRecords.
     * @example
     * // Create many AssetRecords
     * const assetRecord = await prisma.assetRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetRecordCreateManyArgs>(args?: SelectSubset<T, AssetRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AssetRecords and returns the data saved in the database.
     * @param {AssetRecordCreateManyAndReturnArgs} args - Arguments to create many AssetRecords.
     * @example
     * // Create many AssetRecords
     * const assetRecord = await prisma.assetRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AssetRecords and only return the `id`
     * const assetRecordWithIdOnly = await prisma.assetRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssetRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, AssetRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AssetRecord.
     * @param {AssetRecordDeleteArgs} args - Arguments to delete one AssetRecord.
     * @example
     * // Delete one AssetRecord
     * const AssetRecord = await prisma.assetRecord.delete({
     *   where: {
     *     // ... filter to delete one AssetRecord
     *   }
     * })
     * 
     */
    delete<T extends AssetRecordDeleteArgs>(args: SelectSubset<T, AssetRecordDeleteArgs<ExtArgs>>): Prisma__AssetRecordClient<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AssetRecord.
     * @param {AssetRecordUpdateArgs} args - Arguments to update one AssetRecord.
     * @example
     * // Update one AssetRecord
     * const assetRecord = await prisma.assetRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetRecordUpdateArgs>(args: SelectSubset<T, AssetRecordUpdateArgs<ExtArgs>>): Prisma__AssetRecordClient<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AssetRecords.
     * @param {AssetRecordDeleteManyArgs} args - Arguments to filter AssetRecords to delete.
     * @example
     * // Delete a few AssetRecords
     * const { count } = await prisma.assetRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetRecordDeleteManyArgs>(args?: SelectSubset<T, AssetRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssetRecords
     * const assetRecord = await prisma.assetRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetRecordUpdateManyArgs>(args: SelectSubset<T, AssetRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetRecords and returns the data updated in the database.
     * @param {AssetRecordUpdateManyAndReturnArgs} args - Arguments to update many AssetRecords.
     * @example
     * // Update many AssetRecords
     * const assetRecord = await prisma.assetRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AssetRecords and only return the `id`
     * const assetRecordWithIdOnly = await prisma.assetRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AssetRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, AssetRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AssetRecord.
     * @param {AssetRecordUpsertArgs} args - Arguments to update or create a AssetRecord.
     * @example
     * // Update or create a AssetRecord
     * const assetRecord = await prisma.assetRecord.upsert({
     *   create: {
     *     // ... data to create a AssetRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssetRecord we want to update
     *   }
     * })
     */
    upsert<T extends AssetRecordUpsertArgs>(args: SelectSubset<T, AssetRecordUpsertArgs<ExtArgs>>): Prisma__AssetRecordClient<$Result.GetResult<Prisma.$AssetRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AssetRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetRecordCountArgs} args - Arguments to filter AssetRecords to count.
     * @example
     * // Count the number of AssetRecords
     * const count = await prisma.assetRecord.count({
     *   where: {
     *     // ... the filter for the AssetRecords we want to count
     *   }
     * })
    **/
    count<T extends AssetRecordCountArgs>(
      args?: Subset<T, AssetRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssetRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssetRecordAggregateArgs>(args: Subset<T, AssetRecordAggregateArgs>): Prisma.PrismaPromise<GetAssetRecordAggregateType<T>>

    /**
     * Group by AssetRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssetRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetRecordGroupByArgs['orderBy'] }
        : { orderBy?: AssetRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssetRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssetRecord model
   */
  readonly fields: AssetRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssetRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    asset<T extends AssetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AssetDefaultArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    department<T extends DepartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentDefaultArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    operator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AssetRecord model
   */
  interface AssetRecordFieldRefs {
    readonly id: FieldRef<"AssetRecord", 'Int'>
    readonly assetId: FieldRef<"AssetRecord", 'Int'>
    readonly action: FieldRef<"AssetRecord", 'AssetRecordAction'>
    readonly userName: FieldRef<"AssetRecord", 'String'>
    readonly departmentId: FieldRef<"AssetRecord", 'Int'>
    readonly actionDate: FieldRef<"AssetRecord", 'DateTime'>
    readonly expectedReturnDate: FieldRef<"AssetRecord", 'DateTime'>
    readonly proofImage: FieldRef<"AssetRecord", 'String'>
    readonly remark: FieldRef<"AssetRecord", 'String'>
    readonly operatorId: FieldRef<"AssetRecord", 'Int'>
    readonly requestId: FieldRef<"AssetRecord", 'String'>
    readonly createdAt: FieldRef<"AssetRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AssetRecord findUnique
   */
  export type AssetRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    /**
     * Filter, which AssetRecord to fetch.
     */
    where: AssetRecordWhereUniqueInput
  }

  /**
   * AssetRecord findUniqueOrThrow
   */
  export type AssetRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    /**
     * Filter, which AssetRecord to fetch.
     */
    where: AssetRecordWhereUniqueInput
  }

  /**
   * AssetRecord findFirst
   */
  export type AssetRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    /**
     * Filter, which AssetRecord to fetch.
     */
    where?: AssetRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetRecords to fetch.
     */
    orderBy?: AssetRecordOrderByWithRelationInput | AssetRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetRecords.
     */
    cursor?: AssetRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetRecords.
     */
    distinct?: AssetRecordScalarFieldEnum | AssetRecordScalarFieldEnum[]
  }

  /**
   * AssetRecord findFirstOrThrow
   */
  export type AssetRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    /**
     * Filter, which AssetRecord to fetch.
     */
    where?: AssetRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetRecords to fetch.
     */
    orderBy?: AssetRecordOrderByWithRelationInput | AssetRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetRecords.
     */
    cursor?: AssetRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetRecords.
     */
    distinct?: AssetRecordScalarFieldEnum | AssetRecordScalarFieldEnum[]
  }

  /**
   * AssetRecord findMany
   */
  export type AssetRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    /**
     * Filter, which AssetRecords to fetch.
     */
    where?: AssetRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetRecords to fetch.
     */
    orderBy?: AssetRecordOrderByWithRelationInput | AssetRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssetRecords.
     */
    cursor?: AssetRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetRecords.
     */
    distinct?: AssetRecordScalarFieldEnum | AssetRecordScalarFieldEnum[]
  }

  /**
   * AssetRecord create
   */
  export type AssetRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a AssetRecord.
     */
    data: XOR<AssetRecordCreateInput, AssetRecordUncheckedCreateInput>
  }

  /**
   * AssetRecord createMany
   */
  export type AssetRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssetRecords.
     */
    data: AssetRecordCreateManyInput | AssetRecordCreateManyInput[]
  }

  /**
   * AssetRecord createManyAndReturn
   */
  export type AssetRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * The data used to create many AssetRecords.
     */
    data: AssetRecordCreateManyInput | AssetRecordCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AssetRecord update
   */
  export type AssetRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a AssetRecord.
     */
    data: XOR<AssetRecordUpdateInput, AssetRecordUncheckedUpdateInput>
    /**
     * Choose, which AssetRecord to update.
     */
    where: AssetRecordWhereUniqueInput
  }

  /**
   * AssetRecord updateMany
   */
  export type AssetRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssetRecords.
     */
    data: XOR<AssetRecordUpdateManyMutationInput, AssetRecordUncheckedUpdateManyInput>
    /**
     * Filter which AssetRecords to update
     */
    where?: AssetRecordWhereInput
    /**
     * Limit how many AssetRecords to update.
     */
    limit?: number
  }

  /**
   * AssetRecord updateManyAndReturn
   */
  export type AssetRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * The data used to update AssetRecords.
     */
    data: XOR<AssetRecordUpdateManyMutationInput, AssetRecordUncheckedUpdateManyInput>
    /**
     * Filter which AssetRecords to update
     */
    where?: AssetRecordWhereInput
    /**
     * Limit how many AssetRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AssetRecord upsert
   */
  export type AssetRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the AssetRecord to update in case it exists.
     */
    where: AssetRecordWhereUniqueInput
    /**
     * In case the AssetRecord found by the `where` argument doesn't exist, create a new AssetRecord with this data.
     */
    create: XOR<AssetRecordCreateInput, AssetRecordUncheckedCreateInput>
    /**
     * In case the AssetRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetRecordUpdateInput, AssetRecordUncheckedUpdateInput>
  }

  /**
   * AssetRecord delete
   */
  export type AssetRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
    /**
     * Filter which AssetRecord to delete.
     */
    where: AssetRecordWhereUniqueInput
  }

  /**
   * AssetRecord deleteMany
   */
  export type AssetRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetRecords to delete
     */
    where?: AssetRecordWhereInput
    /**
     * Limit how many AssetRecords to delete.
     */
    limit?: number
  }

  /**
   * AssetRecord without action
   */
  export type AssetRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetRecord
     */
    select?: AssetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetRecord
     */
    omit?: AssetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetRecordInclude<ExtArgs> | null
  }


  /**
   * Model RepairRecord
   */

  export type AggregateRepairRecord = {
    _count: RepairRecordCountAggregateOutputType | null
    _avg: RepairRecordAvgAggregateOutputType | null
    _sum: RepairRecordSumAggregateOutputType | null
    _min: RepairRecordMinAggregateOutputType | null
    _max: RepairRecordMaxAggregateOutputType | null
  }

  export type RepairRecordAvgAggregateOutputType = {
    id: number | null
    assetId: number | null
    repairCost: number | null
  }

  export type RepairRecordSumAggregateOutputType = {
    id: number | null
    assetId: number | null
    repairCost: number | null
  }

  export type RepairRecordMinAggregateOutputType = {
    id: number | null
    assetId: number | null
    faultDescription: string | null
    repairVendor: string | null
    repairCost: number | null
    repairResult: $Enums.RepairResult | null
    startDate: Date | null
    endDate: Date | null
    remark: string | null
  }

  export type RepairRecordMaxAggregateOutputType = {
    id: number | null
    assetId: number | null
    faultDescription: string | null
    repairVendor: string | null
    repairCost: number | null
    repairResult: $Enums.RepairResult | null
    startDate: Date | null
    endDate: Date | null
    remark: string | null
  }

  export type RepairRecordCountAggregateOutputType = {
    id: number
    assetId: number
    faultDescription: number
    repairVendor: number
    repairCost: number
    repairResult: number
    startDate: number
    endDate: number
    remark: number
    _all: number
  }


  export type RepairRecordAvgAggregateInputType = {
    id?: true
    assetId?: true
    repairCost?: true
  }

  export type RepairRecordSumAggregateInputType = {
    id?: true
    assetId?: true
    repairCost?: true
  }

  export type RepairRecordMinAggregateInputType = {
    id?: true
    assetId?: true
    faultDescription?: true
    repairVendor?: true
    repairCost?: true
    repairResult?: true
    startDate?: true
    endDate?: true
    remark?: true
  }

  export type RepairRecordMaxAggregateInputType = {
    id?: true
    assetId?: true
    faultDescription?: true
    repairVendor?: true
    repairCost?: true
    repairResult?: true
    startDate?: true
    endDate?: true
    remark?: true
  }

  export type RepairRecordCountAggregateInputType = {
    id?: true
    assetId?: true
    faultDescription?: true
    repairVendor?: true
    repairCost?: true
    repairResult?: true
    startDate?: true
    endDate?: true
    remark?: true
    _all?: true
  }

  export type RepairRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RepairRecord to aggregate.
     */
    where?: RepairRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RepairRecords to fetch.
     */
    orderBy?: RepairRecordOrderByWithRelationInput | RepairRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RepairRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RepairRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RepairRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RepairRecords
    **/
    _count?: true | RepairRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RepairRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RepairRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RepairRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RepairRecordMaxAggregateInputType
  }

  export type GetRepairRecordAggregateType<T extends RepairRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateRepairRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRepairRecord[P]>
      : GetScalarType<T[P], AggregateRepairRecord[P]>
  }




  export type RepairRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RepairRecordWhereInput
    orderBy?: RepairRecordOrderByWithAggregationInput | RepairRecordOrderByWithAggregationInput[]
    by: RepairRecordScalarFieldEnum[] | RepairRecordScalarFieldEnum
    having?: RepairRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RepairRecordCountAggregateInputType | true
    _avg?: RepairRecordAvgAggregateInputType
    _sum?: RepairRecordSumAggregateInputType
    _min?: RepairRecordMinAggregateInputType
    _max?: RepairRecordMaxAggregateInputType
  }

  export type RepairRecordGroupByOutputType = {
    id: number
    assetId: number
    faultDescription: string
    repairVendor: string
    repairCost: number
    repairResult: $Enums.RepairResult
    startDate: Date
    endDate: Date
    remark: string | null
    _count: RepairRecordCountAggregateOutputType | null
    _avg: RepairRecordAvgAggregateOutputType | null
    _sum: RepairRecordSumAggregateOutputType | null
    _min: RepairRecordMinAggregateOutputType | null
    _max: RepairRecordMaxAggregateOutputType | null
  }

  type GetRepairRecordGroupByPayload<T extends RepairRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RepairRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RepairRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RepairRecordGroupByOutputType[P]>
            : GetScalarType<T[P], RepairRecordGroupByOutputType[P]>
        }
      >
    >


  export type RepairRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    faultDescription?: boolean
    repairVendor?: boolean
    repairCost?: boolean
    repairResult?: boolean
    startDate?: boolean
    endDate?: boolean
    remark?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repairRecord"]>

  export type RepairRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    faultDescription?: boolean
    repairVendor?: boolean
    repairCost?: boolean
    repairResult?: boolean
    startDate?: boolean
    endDate?: boolean
    remark?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repairRecord"]>

  export type RepairRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    faultDescription?: boolean
    repairVendor?: boolean
    repairCost?: boolean
    repairResult?: boolean
    startDate?: boolean
    endDate?: boolean
    remark?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repairRecord"]>

  export type RepairRecordSelectScalar = {
    id?: boolean
    assetId?: boolean
    faultDescription?: boolean
    repairVendor?: boolean
    repairCost?: boolean
    repairResult?: boolean
    startDate?: boolean
    endDate?: boolean
    remark?: boolean
  }

  export type RepairRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assetId" | "faultDescription" | "repairVendor" | "repairCost" | "repairResult" | "startDate" | "endDate" | "remark", ExtArgs["result"]["repairRecord"]>
  export type RepairRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }
  export type RepairRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }
  export type RepairRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }

  export type $RepairRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RepairRecord"
    objects: {
      asset: Prisma.$AssetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      assetId: number
      faultDescription: string
      repairVendor: string
      repairCost: number
      repairResult: $Enums.RepairResult
      startDate: Date
      endDate: Date
      remark: string | null
    }, ExtArgs["result"]["repairRecord"]>
    composites: {}
  }

  type RepairRecordGetPayload<S extends boolean | null | undefined | RepairRecordDefaultArgs> = $Result.GetResult<Prisma.$RepairRecordPayload, S>

  type RepairRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RepairRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RepairRecordCountAggregateInputType | true
    }

  export interface RepairRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RepairRecord'], meta: { name: 'RepairRecord' } }
    /**
     * Find zero or one RepairRecord that matches the filter.
     * @param {RepairRecordFindUniqueArgs} args - Arguments to find a RepairRecord
     * @example
     * // Get one RepairRecord
     * const repairRecord = await prisma.repairRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RepairRecordFindUniqueArgs>(args: SelectSubset<T, RepairRecordFindUniqueArgs<ExtArgs>>): Prisma__RepairRecordClient<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RepairRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RepairRecordFindUniqueOrThrowArgs} args - Arguments to find a RepairRecord
     * @example
     * // Get one RepairRecord
     * const repairRecord = await prisma.repairRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RepairRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, RepairRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RepairRecordClient<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RepairRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairRecordFindFirstArgs} args - Arguments to find a RepairRecord
     * @example
     * // Get one RepairRecord
     * const repairRecord = await prisma.repairRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RepairRecordFindFirstArgs>(args?: SelectSubset<T, RepairRecordFindFirstArgs<ExtArgs>>): Prisma__RepairRecordClient<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RepairRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairRecordFindFirstOrThrowArgs} args - Arguments to find a RepairRecord
     * @example
     * // Get one RepairRecord
     * const repairRecord = await prisma.repairRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RepairRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, RepairRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__RepairRecordClient<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RepairRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RepairRecords
     * const repairRecords = await prisma.repairRecord.findMany()
     * 
     * // Get first 10 RepairRecords
     * const repairRecords = await prisma.repairRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const repairRecordWithIdOnly = await prisma.repairRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RepairRecordFindManyArgs>(args?: SelectSubset<T, RepairRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RepairRecord.
     * @param {RepairRecordCreateArgs} args - Arguments to create a RepairRecord.
     * @example
     * // Create one RepairRecord
     * const RepairRecord = await prisma.repairRecord.create({
     *   data: {
     *     // ... data to create a RepairRecord
     *   }
     * })
     * 
     */
    create<T extends RepairRecordCreateArgs>(args: SelectSubset<T, RepairRecordCreateArgs<ExtArgs>>): Prisma__RepairRecordClient<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RepairRecords.
     * @param {RepairRecordCreateManyArgs} args - Arguments to create many RepairRecords.
     * @example
     * // Create many RepairRecords
     * const repairRecord = await prisma.repairRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RepairRecordCreateManyArgs>(args?: SelectSubset<T, RepairRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RepairRecords and returns the data saved in the database.
     * @param {RepairRecordCreateManyAndReturnArgs} args - Arguments to create many RepairRecords.
     * @example
     * // Create many RepairRecords
     * const repairRecord = await prisma.repairRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RepairRecords and only return the `id`
     * const repairRecordWithIdOnly = await prisma.repairRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RepairRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, RepairRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RepairRecord.
     * @param {RepairRecordDeleteArgs} args - Arguments to delete one RepairRecord.
     * @example
     * // Delete one RepairRecord
     * const RepairRecord = await prisma.repairRecord.delete({
     *   where: {
     *     // ... filter to delete one RepairRecord
     *   }
     * })
     * 
     */
    delete<T extends RepairRecordDeleteArgs>(args: SelectSubset<T, RepairRecordDeleteArgs<ExtArgs>>): Prisma__RepairRecordClient<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RepairRecord.
     * @param {RepairRecordUpdateArgs} args - Arguments to update one RepairRecord.
     * @example
     * // Update one RepairRecord
     * const repairRecord = await prisma.repairRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RepairRecordUpdateArgs>(args: SelectSubset<T, RepairRecordUpdateArgs<ExtArgs>>): Prisma__RepairRecordClient<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RepairRecords.
     * @param {RepairRecordDeleteManyArgs} args - Arguments to filter RepairRecords to delete.
     * @example
     * // Delete a few RepairRecords
     * const { count } = await prisma.repairRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RepairRecordDeleteManyArgs>(args?: SelectSubset<T, RepairRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RepairRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RepairRecords
     * const repairRecord = await prisma.repairRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RepairRecordUpdateManyArgs>(args: SelectSubset<T, RepairRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RepairRecords and returns the data updated in the database.
     * @param {RepairRecordUpdateManyAndReturnArgs} args - Arguments to update many RepairRecords.
     * @example
     * // Update many RepairRecords
     * const repairRecord = await prisma.repairRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RepairRecords and only return the `id`
     * const repairRecordWithIdOnly = await prisma.repairRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RepairRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, RepairRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RepairRecord.
     * @param {RepairRecordUpsertArgs} args - Arguments to update or create a RepairRecord.
     * @example
     * // Update or create a RepairRecord
     * const repairRecord = await prisma.repairRecord.upsert({
     *   create: {
     *     // ... data to create a RepairRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RepairRecord we want to update
     *   }
     * })
     */
    upsert<T extends RepairRecordUpsertArgs>(args: SelectSubset<T, RepairRecordUpsertArgs<ExtArgs>>): Prisma__RepairRecordClient<$Result.GetResult<Prisma.$RepairRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RepairRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairRecordCountArgs} args - Arguments to filter RepairRecords to count.
     * @example
     * // Count the number of RepairRecords
     * const count = await prisma.repairRecord.count({
     *   where: {
     *     // ... the filter for the RepairRecords we want to count
     *   }
     * })
    **/
    count<T extends RepairRecordCountArgs>(
      args?: Subset<T, RepairRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RepairRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RepairRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RepairRecordAggregateArgs>(args: Subset<T, RepairRecordAggregateArgs>): Prisma.PrismaPromise<GetRepairRecordAggregateType<T>>

    /**
     * Group by RepairRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RepairRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RepairRecordGroupByArgs['orderBy'] }
        : { orderBy?: RepairRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RepairRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRepairRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RepairRecord model
   */
  readonly fields: RepairRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RepairRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RepairRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    asset<T extends AssetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AssetDefaultArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RepairRecord model
   */
  interface RepairRecordFieldRefs {
    readonly id: FieldRef<"RepairRecord", 'Int'>
    readonly assetId: FieldRef<"RepairRecord", 'Int'>
    readonly faultDescription: FieldRef<"RepairRecord", 'String'>
    readonly repairVendor: FieldRef<"RepairRecord", 'String'>
    readonly repairCost: FieldRef<"RepairRecord", 'Float'>
    readonly repairResult: FieldRef<"RepairRecord", 'RepairResult'>
    readonly startDate: FieldRef<"RepairRecord", 'DateTime'>
    readonly endDate: FieldRef<"RepairRecord", 'DateTime'>
    readonly remark: FieldRef<"RepairRecord", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RepairRecord findUnique
   */
  export type RepairRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
    /**
     * Filter, which RepairRecord to fetch.
     */
    where: RepairRecordWhereUniqueInput
  }

  /**
   * RepairRecord findUniqueOrThrow
   */
  export type RepairRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
    /**
     * Filter, which RepairRecord to fetch.
     */
    where: RepairRecordWhereUniqueInput
  }

  /**
   * RepairRecord findFirst
   */
  export type RepairRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
    /**
     * Filter, which RepairRecord to fetch.
     */
    where?: RepairRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RepairRecords to fetch.
     */
    orderBy?: RepairRecordOrderByWithRelationInput | RepairRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RepairRecords.
     */
    cursor?: RepairRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RepairRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RepairRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RepairRecords.
     */
    distinct?: RepairRecordScalarFieldEnum | RepairRecordScalarFieldEnum[]
  }

  /**
   * RepairRecord findFirstOrThrow
   */
  export type RepairRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
    /**
     * Filter, which RepairRecord to fetch.
     */
    where?: RepairRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RepairRecords to fetch.
     */
    orderBy?: RepairRecordOrderByWithRelationInput | RepairRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RepairRecords.
     */
    cursor?: RepairRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RepairRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RepairRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RepairRecords.
     */
    distinct?: RepairRecordScalarFieldEnum | RepairRecordScalarFieldEnum[]
  }

  /**
   * RepairRecord findMany
   */
  export type RepairRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
    /**
     * Filter, which RepairRecords to fetch.
     */
    where?: RepairRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RepairRecords to fetch.
     */
    orderBy?: RepairRecordOrderByWithRelationInput | RepairRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RepairRecords.
     */
    cursor?: RepairRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RepairRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RepairRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RepairRecords.
     */
    distinct?: RepairRecordScalarFieldEnum | RepairRecordScalarFieldEnum[]
  }

  /**
   * RepairRecord create
   */
  export type RepairRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a RepairRecord.
     */
    data: XOR<RepairRecordCreateInput, RepairRecordUncheckedCreateInput>
  }

  /**
   * RepairRecord createMany
   */
  export type RepairRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RepairRecords.
     */
    data: RepairRecordCreateManyInput | RepairRecordCreateManyInput[]
  }

  /**
   * RepairRecord createManyAndReturn
   */
  export type RepairRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * The data used to create many RepairRecords.
     */
    data: RepairRecordCreateManyInput | RepairRecordCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RepairRecord update
   */
  export type RepairRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a RepairRecord.
     */
    data: XOR<RepairRecordUpdateInput, RepairRecordUncheckedUpdateInput>
    /**
     * Choose, which RepairRecord to update.
     */
    where: RepairRecordWhereUniqueInput
  }

  /**
   * RepairRecord updateMany
   */
  export type RepairRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RepairRecords.
     */
    data: XOR<RepairRecordUpdateManyMutationInput, RepairRecordUncheckedUpdateManyInput>
    /**
     * Filter which RepairRecords to update
     */
    where?: RepairRecordWhereInput
    /**
     * Limit how many RepairRecords to update.
     */
    limit?: number
  }

  /**
   * RepairRecord updateManyAndReturn
   */
  export type RepairRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * The data used to update RepairRecords.
     */
    data: XOR<RepairRecordUpdateManyMutationInput, RepairRecordUncheckedUpdateManyInput>
    /**
     * Filter which RepairRecords to update
     */
    where?: RepairRecordWhereInput
    /**
     * Limit how many RepairRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RepairRecord upsert
   */
  export type RepairRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the RepairRecord to update in case it exists.
     */
    where: RepairRecordWhereUniqueInput
    /**
     * In case the RepairRecord found by the `where` argument doesn't exist, create a new RepairRecord with this data.
     */
    create: XOR<RepairRecordCreateInput, RepairRecordUncheckedCreateInput>
    /**
     * In case the RepairRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RepairRecordUpdateInput, RepairRecordUncheckedUpdateInput>
  }

  /**
   * RepairRecord delete
   */
  export type RepairRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
    /**
     * Filter which RepairRecord to delete.
     */
    where: RepairRecordWhereUniqueInput
  }

  /**
   * RepairRecord deleteMany
   */
  export type RepairRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RepairRecords to delete
     */
    where?: RepairRecordWhereInput
    /**
     * Limit how many RepairRecords to delete.
     */
    limit?: number
  }

  /**
   * RepairRecord without action
   */
  export type RepairRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepairRecord
     */
    select?: RepairRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RepairRecord
     */
    omit?: RepairRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairRecordInclude<ExtArgs> | null
  }


  /**
   * Model SystemConfig
   */

  export type AggregateSystemConfig = {
    _count: SystemConfigCountAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  export type SystemConfigMinAggregateOutputType = {
    configKey: string | null
    configValue: string | null
    description: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type SystemConfigMaxAggregateOutputType = {
    configKey: string | null
    configValue: string | null
    description: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type SystemConfigCountAggregateOutputType = {
    configKey: number
    configValue: number
    description: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type SystemConfigMinAggregateInputType = {
    configKey?: true
    configValue?: true
    description?: true
    updatedAt?: true
    createdAt?: true
  }

  export type SystemConfigMaxAggregateInputType = {
    configKey?: true
    configValue?: true
    description?: true
    updatedAt?: true
    createdAt?: true
  }

  export type SystemConfigCountAggregateInputType = {
    configKey?: true
    configValue?: true
    description?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type SystemConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemConfig to aggregate.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemConfigs
    **/
    _count?: true | SystemConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemConfigMaxAggregateInputType
  }

  export type GetSystemConfigAggregateType<T extends SystemConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemConfig[P]>
      : GetScalarType<T[P], AggregateSystemConfig[P]>
  }




  export type SystemConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemConfigWhereInput
    orderBy?: SystemConfigOrderByWithAggregationInput | SystemConfigOrderByWithAggregationInput[]
    by: SystemConfigScalarFieldEnum[] | SystemConfigScalarFieldEnum
    having?: SystemConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemConfigCountAggregateInputType | true
    _min?: SystemConfigMinAggregateInputType
    _max?: SystemConfigMaxAggregateInputType
  }

  export type SystemConfigGroupByOutputType = {
    configKey: string
    configValue: string
    description: string | null
    updatedAt: Date
    createdAt: Date
    _count: SystemConfigCountAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  type GetSystemConfigGroupByPayload<T extends SystemConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
            : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
        }
      >
    >


  export type SystemConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    configKey?: boolean
    configValue?: boolean
    description?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    configKey?: boolean
    configValue?: boolean
    description?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    configKey?: boolean
    configValue?: boolean
    description?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectScalar = {
    configKey?: boolean
    configValue?: boolean
    description?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type SystemConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"configKey" | "configValue" | "description" | "updatedAt" | "createdAt", ExtArgs["result"]["systemConfig"]>

  export type $SystemConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      configKey: string
      configValue: string
      description: string | null
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["systemConfig"]>
    composites: {}
  }

  type SystemConfigGetPayload<S extends boolean | null | undefined | SystemConfigDefaultArgs> = $Result.GetResult<Prisma.$SystemConfigPayload, S>

  type SystemConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemConfigCountAggregateInputType | true
    }

  export interface SystemConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemConfig'], meta: { name: 'SystemConfig' } }
    /**
     * Find zero or one SystemConfig that matches the filter.
     * @param {SystemConfigFindUniqueArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemConfigFindUniqueArgs>(args: SelectSubset<T, SystemConfigFindUniqueArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemConfigFindUniqueOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemConfigFindFirstArgs>(args?: SelectSubset<T, SystemConfigFindFirstArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany()
     * 
     * // Get first 10 SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany({ take: 10 })
     * 
     * // Only select the `configKey`
     * const systemConfigWithConfigKeyOnly = await prisma.systemConfig.findMany({ select: { configKey: true } })
     * 
     */
    findMany<T extends SystemConfigFindManyArgs>(args?: SelectSubset<T, SystemConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemConfig.
     * @param {SystemConfigCreateArgs} args - Arguments to create a SystemConfig.
     * @example
     * // Create one SystemConfig
     * const SystemConfig = await prisma.systemConfig.create({
     *   data: {
     *     // ... data to create a SystemConfig
     *   }
     * })
     * 
     */
    create<T extends SystemConfigCreateArgs>(args: SelectSubset<T, SystemConfigCreateArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemConfigs.
     * @param {SystemConfigCreateManyArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemConfigCreateManyArgs>(args?: SelectSubset<T, SystemConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemConfigs and returns the data saved in the database.
     * @param {SystemConfigCreateManyAndReturnArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemConfigs and only return the `configKey`
     * const systemConfigWithConfigKeyOnly = await prisma.systemConfig.createManyAndReturn({
     *   select: { configKey: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemConfig.
     * @param {SystemConfigDeleteArgs} args - Arguments to delete one SystemConfig.
     * @example
     * // Delete one SystemConfig
     * const SystemConfig = await prisma.systemConfig.delete({
     *   where: {
     *     // ... filter to delete one SystemConfig
     *   }
     * })
     * 
     */
    delete<T extends SystemConfigDeleteArgs>(args: SelectSubset<T, SystemConfigDeleteArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemConfig.
     * @param {SystemConfigUpdateArgs} args - Arguments to update one SystemConfig.
     * @example
     * // Update one SystemConfig
     * const systemConfig = await prisma.systemConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemConfigUpdateArgs>(args: SelectSubset<T, SystemConfigUpdateArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemConfigs.
     * @param {SystemConfigDeleteManyArgs} args - Arguments to filter SystemConfigs to delete.
     * @example
     * // Delete a few SystemConfigs
     * const { count } = await prisma.systemConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemConfigDeleteManyArgs>(args?: SelectSubset<T, SystemConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemConfigUpdateManyArgs>(args: SelectSubset<T, SystemConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs and returns the data updated in the database.
     * @param {SystemConfigUpdateManyAndReturnArgs} args - Arguments to update many SystemConfigs.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemConfigs and only return the `configKey`
     * const systemConfigWithConfigKeyOnly = await prisma.systemConfig.updateManyAndReturn({
     *   select: { configKey: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SystemConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemConfig.
     * @param {SystemConfigUpsertArgs} args - Arguments to update or create a SystemConfig.
     * @example
     * // Update or create a SystemConfig
     * const systemConfig = await prisma.systemConfig.upsert({
     *   create: {
     *     // ... data to create a SystemConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemConfig we want to update
     *   }
     * })
     */
    upsert<T extends SystemConfigUpsertArgs>(args: SelectSubset<T, SystemConfigUpsertArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigCountArgs} args - Arguments to filter SystemConfigs to count.
     * @example
     * // Count the number of SystemConfigs
     * const count = await prisma.systemConfig.count({
     *   where: {
     *     // ... the filter for the SystemConfigs we want to count
     *   }
     * })
    **/
    count<T extends SystemConfigCountArgs>(
      args?: Subset<T, SystemConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemConfigAggregateArgs>(args: Subset<T, SystemConfigAggregateArgs>): Prisma.PrismaPromise<GetSystemConfigAggregateType<T>>

    /**
     * Group by SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemConfigGroupByArgs['orderBy'] }
        : { orderBy?: SystemConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemConfig model
   */
  readonly fields: SystemConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemConfig model
   */
  interface SystemConfigFieldRefs {
    readonly configKey: FieldRef<"SystemConfig", 'String'>
    readonly configValue: FieldRef<"SystemConfig", 'String'>
    readonly description: FieldRef<"SystemConfig", 'String'>
    readonly updatedAt: FieldRef<"SystemConfig", 'DateTime'>
    readonly createdAt: FieldRef<"SystemConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemConfig findUnique
   */
  export type SystemConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findUniqueOrThrow
   */
  export type SystemConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findFirst
   */
  export type SystemConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findFirstOrThrow
   */
  export type SystemConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findMany
   */
  export type SystemConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfigs to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig create
   */
  export type SystemConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a SystemConfig.
     */
    data: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
  }

  /**
   * SystemConfig createMany
   */
  export type SystemConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
  }

  /**
   * SystemConfig createManyAndReturn
   */
  export type SystemConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
  }

  /**
   * SystemConfig update
   */
  export type SystemConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a SystemConfig.
     */
    data: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
    /**
     * Choose, which SystemConfig to update.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig updateMany
   */
  export type SystemConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to update.
     */
    limit?: number
  }

  /**
   * SystemConfig updateManyAndReturn
   */
  export type SystemConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to update.
     */
    limit?: number
  }

  /**
   * SystemConfig upsert
   */
  export type SystemConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the SystemConfig to update in case it exists.
     */
    where: SystemConfigWhereUniqueInput
    /**
     * In case the SystemConfig found by the `where` argument doesn't exist, create a new SystemConfig with this data.
     */
    create: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
    /**
     * In case the SystemConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
  }

  /**
   * SystemConfig delete
   */
  export type SystemConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter which SystemConfig to delete.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig deleteMany
   */
  export type SystemConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemConfigs to delete
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to delete.
     */
    limit?: number
  }

  /**
   * SystemConfig without action
   */
  export type SystemConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
  }


  /**
   * Model OperationLog
   */

  export type AggregateOperationLog = {
    _count: OperationLogCountAggregateOutputType | null
    _avg: OperationLogAvgAggregateOutputType | null
    _sum: OperationLogSumAggregateOutputType | null
    _min: OperationLogMinAggregateOutputType | null
    _max: OperationLogMaxAggregateOutputType | null
  }

  export type OperationLogAvgAggregateOutputType = {
    id: number | null
    operatorId: number | null
    targetId: number | null
  }

  export type OperationLogSumAggregateOutputType = {
    id: number | null
    operatorId: number | null
    targetId: number | null
  }

  export type OperationLogMinAggregateOutputType = {
    id: number | null
    operatorId: number | null
    action: string | null
    targetType: string | null
    targetId: number | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type OperationLogMaxAggregateOutputType = {
    id: number | null
    operatorId: number | null
    action: string | null
    targetType: string | null
    targetId: number | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type OperationLogCountAggregateOutputType = {
    id: number
    operatorId: number
    action: number
    targetType: number
    targetId: number
    detail: number
    ipAddress: number
    createdAt: number
    _all: number
  }


  export type OperationLogAvgAggregateInputType = {
    id?: true
    operatorId?: true
    targetId?: true
  }

  export type OperationLogSumAggregateInputType = {
    id?: true
    operatorId?: true
    targetId?: true
  }

  export type OperationLogMinAggregateInputType = {
    id?: true
    operatorId?: true
    action?: true
    targetType?: true
    targetId?: true
    ipAddress?: true
    createdAt?: true
  }

  export type OperationLogMaxAggregateInputType = {
    id?: true
    operatorId?: true
    action?: true
    targetType?: true
    targetId?: true
    ipAddress?: true
    createdAt?: true
  }

  export type OperationLogCountAggregateInputType = {
    id?: true
    operatorId?: true
    action?: true
    targetType?: true
    targetId?: true
    detail?: true
    ipAddress?: true
    createdAt?: true
    _all?: true
  }

  export type OperationLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OperationLog to aggregate.
     */
    where?: OperationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperationLogs to fetch.
     */
    orderBy?: OperationLogOrderByWithRelationInput | OperationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OperationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OperationLogs
    **/
    _count?: true | OperationLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OperationLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OperationLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OperationLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OperationLogMaxAggregateInputType
  }

  export type GetOperationLogAggregateType<T extends OperationLogAggregateArgs> = {
        [P in keyof T & keyof AggregateOperationLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOperationLog[P]>
      : GetScalarType<T[P], AggregateOperationLog[P]>
  }




  export type OperationLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OperationLogWhereInput
    orderBy?: OperationLogOrderByWithAggregationInput | OperationLogOrderByWithAggregationInput[]
    by: OperationLogScalarFieldEnum[] | OperationLogScalarFieldEnum
    having?: OperationLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OperationLogCountAggregateInputType | true
    _avg?: OperationLogAvgAggregateInputType
    _sum?: OperationLogSumAggregateInputType
    _min?: OperationLogMinAggregateInputType
    _max?: OperationLogMaxAggregateInputType
  }

  export type OperationLogGroupByOutputType = {
    id: number
    operatorId: number
    action: string
    targetType: string
    targetId: number
    detail: JsonValue
    ipAddress: string
    createdAt: Date
    _count: OperationLogCountAggregateOutputType | null
    _avg: OperationLogAvgAggregateOutputType | null
    _sum: OperationLogSumAggregateOutputType | null
    _min: OperationLogMinAggregateOutputType | null
    _max: OperationLogMaxAggregateOutputType | null
  }

  type GetOperationLogGroupByPayload<T extends OperationLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OperationLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OperationLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OperationLogGroupByOutputType[P]>
            : GetScalarType<T[P], OperationLogGroupByOutputType[P]>
        }
      >
    >


  export type OperationLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operatorId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    detail?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["operationLog"]>

  export type OperationLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operatorId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    detail?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["operationLog"]>

  export type OperationLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operatorId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    detail?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["operationLog"]>

  export type OperationLogSelectScalar = {
    id?: boolean
    operatorId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    detail?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }

  export type OperationLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "operatorId" | "action" | "targetType" | "targetId" | "detail" | "ipAddress" | "createdAt", ExtArgs["result"]["operationLog"]>
  export type OperationLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OperationLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OperationLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    operator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OperationLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OperationLog"
    objects: {
      operator: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      operatorId: number
      action: string
      targetType: string
      targetId: number
      detail: Prisma.JsonValue
      ipAddress: string
      createdAt: Date
    }, ExtArgs["result"]["operationLog"]>
    composites: {}
  }

  type OperationLogGetPayload<S extends boolean | null | undefined | OperationLogDefaultArgs> = $Result.GetResult<Prisma.$OperationLogPayload, S>

  type OperationLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OperationLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OperationLogCountAggregateInputType | true
    }

  export interface OperationLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OperationLog'], meta: { name: 'OperationLog' } }
    /**
     * Find zero or one OperationLog that matches the filter.
     * @param {OperationLogFindUniqueArgs} args - Arguments to find a OperationLog
     * @example
     * // Get one OperationLog
     * const operationLog = await prisma.operationLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OperationLogFindUniqueArgs>(args: SelectSubset<T, OperationLogFindUniqueArgs<ExtArgs>>): Prisma__OperationLogClient<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OperationLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OperationLogFindUniqueOrThrowArgs} args - Arguments to find a OperationLog
     * @example
     * // Get one OperationLog
     * const operationLog = await prisma.operationLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OperationLogFindUniqueOrThrowArgs>(args: SelectSubset<T, OperationLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OperationLogClient<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OperationLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationLogFindFirstArgs} args - Arguments to find a OperationLog
     * @example
     * // Get one OperationLog
     * const operationLog = await prisma.operationLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OperationLogFindFirstArgs>(args?: SelectSubset<T, OperationLogFindFirstArgs<ExtArgs>>): Prisma__OperationLogClient<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OperationLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationLogFindFirstOrThrowArgs} args - Arguments to find a OperationLog
     * @example
     * // Get one OperationLog
     * const operationLog = await prisma.operationLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OperationLogFindFirstOrThrowArgs>(args?: SelectSubset<T, OperationLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__OperationLogClient<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OperationLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OperationLogs
     * const operationLogs = await prisma.operationLog.findMany()
     * 
     * // Get first 10 OperationLogs
     * const operationLogs = await prisma.operationLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const operationLogWithIdOnly = await prisma.operationLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OperationLogFindManyArgs>(args?: SelectSubset<T, OperationLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OperationLog.
     * @param {OperationLogCreateArgs} args - Arguments to create a OperationLog.
     * @example
     * // Create one OperationLog
     * const OperationLog = await prisma.operationLog.create({
     *   data: {
     *     // ... data to create a OperationLog
     *   }
     * })
     * 
     */
    create<T extends OperationLogCreateArgs>(args: SelectSubset<T, OperationLogCreateArgs<ExtArgs>>): Prisma__OperationLogClient<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OperationLogs.
     * @param {OperationLogCreateManyArgs} args - Arguments to create many OperationLogs.
     * @example
     * // Create many OperationLogs
     * const operationLog = await prisma.operationLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OperationLogCreateManyArgs>(args?: SelectSubset<T, OperationLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OperationLogs and returns the data saved in the database.
     * @param {OperationLogCreateManyAndReturnArgs} args - Arguments to create many OperationLogs.
     * @example
     * // Create many OperationLogs
     * const operationLog = await prisma.operationLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OperationLogs and only return the `id`
     * const operationLogWithIdOnly = await prisma.operationLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OperationLogCreateManyAndReturnArgs>(args?: SelectSubset<T, OperationLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OperationLog.
     * @param {OperationLogDeleteArgs} args - Arguments to delete one OperationLog.
     * @example
     * // Delete one OperationLog
     * const OperationLog = await prisma.operationLog.delete({
     *   where: {
     *     // ... filter to delete one OperationLog
     *   }
     * })
     * 
     */
    delete<T extends OperationLogDeleteArgs>(args: SelectSubset<T, OperationLogDeleteArgs<ExtArgs>>): Prisma__OperationLogClient<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OperationLog.
     * @param {OperationLogUpdateArgs} args - Arguments to update one OperationLog.
     * @example
     * // Update one OperationLog
     * const operationLog = await prisma.operationLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OperationLogUpdateArgs>(args: SelectSubset<T, OperationLogUpdateArgs<ExtArgs>>): Prisma__OperationLogClient<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OperationLogs.
     * @param {OperationLogDeleteManyArgs} args - Arguments to filter OperationLogs to delete.
     * @example
     * // Delete a few OperationLogs
     * const { count } = await prisma.operationLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OperationLogDeleteManyArgs>(args?: SelectSubset<T, OperationLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OperationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OperationLogs
     * const operationLog = await prisma.operationLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OperationLogUpdateManyArgs>(args: SelectSubset<T, OperationLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OperationLogs and returns the data updated in the database.
     * @param {OperationLogUpdateManyAndReturnArgs} args - Arguments to update many OperationLogs.
     * @example
     * // Update many OperationLogs
     * const operationLog = await prisma.operationLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OperationLogs and only return the `id`
     * const operationLogWithIdOnly = await prisma.operationLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OperationLogUpdateManyAndReturnArgs>(args: SelectSubset<T, OperationLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OperationLog.
     * @param {OperationLogUpsertArgs} args - Arguments to update or create a OperationLog.
     * @example
     * // Update or create a OperationLog
     * const operationLog = await prisma.operationLog.upsert({
     *   create: {
     *     // ... data to create a OperationLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OperationLog we want to update
     *   }
     * })
     */
    upsert<T extends OperationLogUpsertArgs>(args: SelectSubset<T, OperationLogUpsertArgs<ExtArgs>>): Prisma__OperationLogClient<$Result.GetResult<Prisma.$OperationLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OperationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationLogCountArgs} args - Arguments to filter OperationLogs to count.
     * @example
     * // Count the number of OperationLogs
     * const count = await prisma.operationLog.count({
     *   where: {
     *     // ... the filter for the OperationLogs we want to count
     *   }
     * })
    **/
    count<T extends OperationLogCountArgs>(
      args?: Subset<T, OperationLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OperationLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OperationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OperationLogAggregateArgs>(args: Subset<T, OperationLogAggregateArgs>): Prisma.PrismaPromise<GetOperationLogAggregateType<T>>

    /**
     * Group by OperationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OperationLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OperationLogGroupByArgs['orderBy'] }
        : { orderBy?: OperationLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OperationLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOperationLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OperationLog model
   */
  readonly fields: OperationLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OperationLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OperationLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    operator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OperationLog model
   */
  interface OperationLogFieldRefs {
    readonly id: FieldRef<"OperationLog", 'Int'>
    readonly operatorId: FieldRef<"OperationLog", 'Int'>
    readonly action: FieldRef<"OperationLog", 'String'>
    readonly targetType: FieldRef<"OperationLog", 'String'>
    readonly targetId: FieldRef<"OperationLog", 'Int'>
    readonly detail: FieldRef<"OperationLog", 'Json'>
    readonly ipAddress: FieldRef<"OperationLog", 'String'>
    readonly createdAt: FieldRef<"OperationLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OperationLog findUnique
   */
  export type OperationLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
    /**
     * Filter, which OperationLog to fetch.
     */
    where: OperationLogWhereUniqueInput
  }

  /**
   * OperationLog findUniqueOrThrow
   */
  export type OperationLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
    /**
     * Filter, which OperationLog to fetch.
     */
    where: OperationLogWhereUniqueInput
  }

  /**
   * OperationLog findFirst
   */
  export type OperationLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
    /**
     * Filter, which OperationLog to fetch.
     */
    where?: OperationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperationLogs to fetch.
     */
    orderBy?: OperationLogOrderByWithRelationInput | OperationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OperationLogs.
     */
    cursor?: OperationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OperationLogs.
     */
    distinct?: OperationLogScalarFieldEnum | OperationLogScalarFieldEnum[]
  }

  /**
   * OperationLog findFirstOrThrow
   */
  export type OperationLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
    /**
     * Filter, which OperationLog to fetch.
     */
    where?: OperationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperationLogs to fetch.
     */
    orderBy?: OperationLogOrderByWithRelationInput | OperationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OperationLogs.
     */
    cursor?: OperationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OperationLogs.
     */
    distinct?: OperationLogScalarFieldEnum | OperationLogScalarFieldEnum[]
  }

  /**
   * OperationLog findMany
   */
  export type OperationLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
    /**
     * Filter, which OperationLogs to fetch.
     */
    where?: OperationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperationLogs to fetch.
     */
    orderBy?: OperationLogOrderByWithRelationInput | OperationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OperationLogs.
     */
    cursor?: OperationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OperationLogs.
     */
    distinct?: OperationLogScalarFieldEnum | OperationLogScalarFieldEnum[]
  }

  /**
   * OperationLog create
   */
  export type OperationLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
    /**
     * The data needed to create a OperationLog.
     */
    data: XOR<OperationLogCreateInput, OperationLogUncheckedCreateInput>
  }

  /**
   * OperationLog createMany
   */
  export type OperationLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OperationLogs.
     */
    data: OperationLogCreateManyInput | OperationLogCreateManyInput[]
  }

  /**
   * OperationLog createManyAndReturn
   */
  export type OperationLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * The data used to create many OperationLogs.
     */
    data: OperationLogCreateManyInput | OperationLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OperationLog update
   */
  export type OperationLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
    /**
     * The data needed to update a OperationLog.
     */
    data: XOR<OperationLogUpdateInput, OperationLogUncheckedUpdateInput>
    /**
     * Choose, which OperationLog to update.
     */
    where: OperationLogWhereUniqueInput
  }

  /**
   * OperationLog updateMany
   */
  export type OperationLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OperationLogs.
     */
    data: XOR<OperationLogUpdateManyMutationInput, OperationLogUncheckedUpdateManyInput>
    /**
     * Filter which OperationLogs to update
     */
    where?: OperationLogWhereInput
    /**
     * Limit how many OperationLogs to update.
     */
    limit?: number
  }

  /**
   * OperationLog updateManyAndReturn
   */
  export type OperationLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * The data used to update OperationLogs.
     */
    data: XOR<OperationLogUpdateManyMutationInput, OperationLogUncheckedUpdateManyInput>
    /**
     * Filter which OperationLogs to update
     */
    where?: OperationLogWhereInput
    /**
     * Limit how many OperationLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OperationLog upsert
   */
  export type OperationLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
    /**
     * The filter to search for the OperationLog to update in case it exists.
     */
    where: OperationLogWhereUniqueInput
    /**
     * In case the OperationLog found by the `where` argument doesn't exist, create a new OperationLog with this data.
     */
    create: XOR<OperationLogCreateInput, OperationLogUncheckedCreateInput>
    /**
     * In case the OperationLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OperationLogUpdateInput, OperationLogUncheckedUpdateInput>
  }

  /**
   * OperationLog delete
   */
  export type OperationLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
    /**
     * Filter which OperationLog to delete.
     */
    where: OperationLogWhereUniqueInput
  }

  /**
   * OperationLog deleteMany
   */
  export type OperationLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OperationLogs to delete
     */
    where?: OperationLogWhereInput
    /**
     * Limit how many OperationLogs to delete.
     */
    limit?: number
  }

  /**
   * OperationLog without action
   */
  export type OperationLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationLog
     */
    select?: OperationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperationLog
     */
    omit?: OperationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperationLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password',
    realName: 'realName',
    role: 'role',
    isActive: 'isActive',
    mustChangePass: 'mustChangePass',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const DepartmentScalarFieldEnum: {
    id: 'id',
    name: 'name',
    sortOrder: 'sortOrder',
    isActive: 'isActive'
  };

  export type DepartmentScalarFieldEnum = (typeof DepartmentScalarFieldEnum)[keyof typeof DepartmentScalarFieldEnum]


  export const AssetTemplateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    deviceType: 'deviceType',
    brand: 'brand',
    model: 'model',
    os: 'os',
    cpu: 'cpu',
    memory: 'memory',
    storage: 'storage',
    remark: 'remark',
    isActive: 'isActive',
    sortOrder: 'sortOrder'
  };

  export type AssetTemplateScalarFieldEnum = (typeof AssetTemplateScalarFieldEnum)[keyof typeof AssetTemplateScalarFieldEnum]


  export const AssetScalarFieldEnum: {
    id: 'id',
    assetCode: 'assetCode',
    templateId: 'templateId',
    deviceType: 'deviceType',
    brand: 'brand',
    model: 'model',
    serialNumber: 'serialNumber',
    os: 'os',
    cpu: 'cpu',
    memory: 'memory',
    storage: 'storage',
    status: 'status',
    currentUserName: 'currentUserName',
    departmentId: 'departmentId',
    purchaseDate: 'purchaseDate',
    warrantyExpiry: 'warrantyExpiry',
    remark: 'remark',
    version: 'version'
  };

  export type AssetScalarFieldEnum = (typeof AssetScalarFieldEnum)[keyof typeof AssetScalarFieldEnum]


  export const AssetRecordScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    action: 'action',
    userName: 'userName',
    departmentId: 'departmentId',
    actionDate: 'actionDate',
    expectedReturnDate: 'expectedReturnDate',
    proofImage: 'proofImage',
    remark: 'remark',
    operatorId: 'operatorId',
    requestId: 'requestId',
    createdAt: 'createdAt'
  };

  export type AssetRecordScalarFieldEnum = (typeof AssetRecordScalarFieldEnum)[keyof typeof AssetRecordScalarFieldEnum]


  export const RepairRecordScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    faultDescription: 'faultDescription',
    repairVendor: 'repairVendor',
    repairCost: 'repairCost',
    repairResult: 'repairResult',
    startDate: 'startDate',
    endDate: 'endDate',
    remark: 'remark'
  };

  export type RepairRecordScalarFieldEnum = (typeof RepairRecordScalarFieldEnum)[keyof typeof RepairRecordScalarFieldEnum]


  export const SystemConfigScalarFieldEnum: {
    configKey: 'configKey',
    configValue: 'configValue',
    description: 'description',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type SystemConfigScalarFieldEnum = (typeof SystemConfigScalarFieldEnum)[keyof typeof SystemConfigScalarFieldEnum]


  export const OperationLogScalarFieldEnum: {
    id: 'id',
    operatorId: 'operatorId',
    action: 'action',
    targetType: 'targetType',
    targetId: 'targetId',
    detail: 'detail',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
  };

  export type OperationLogScalarFieldEnum = (typeof OperationLogScalarFieldEnum)[keyof typeof OperationLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DeviceType'
   */
  export type EnumDeviceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceType'>
    


  /**
   * Reference to a field of type 'AssetStatus'
   */
  export type EnumAssetStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssetStatus'>
    


  /**
   * Reference to a field of type 'AssetRecordAction'
   */
  export type EnumAssetRecordActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssetRecordAction'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'RepairResult'
   */
  export type EnumRepairResultFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RepairResult'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    realName?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    isActive?: BoolFilter<"User"> | boolean
    mustChangePass?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    operatorLogs?: OperationLogListRelationFilter
    assetRecords?: AssetRecordListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    realName?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    mustChangePass?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    operatorLogs?: OperationLogOrderByRelationAggregateInput
    assetRecords?: AssetRecordOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    realName?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    isActive?: BoolFilter<"User"> | boolean
    mustChangePass?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    operatorLogs?: OperationLogListRelationFilter
    assetRecords?: AssetRecordListRelationFilter
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    realName?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    mustChangePass?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    realName?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    mustChangePass?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type DepartmentWhereInput = {
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    id?: IntFilter<"Department"> | number
    name?: StringFilter<"Department"> | string
    sortOrder?: IntFilter<"Department"> | number
    isActive?: BoolFilter<"Department"> | boolean
    assets?: AssetListRelationFilter
    records?: AssetRecordListRelationFilter
  }

  export type DepartmentOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    assets?: AssetOrderByRelationAggregateInput
    records?: AssetRecordOrderByRelationAggregateInput
  }

  export type DepartmentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    sortOrder?: IntFilter<"Department"> | number
    isActive?: BoolFilter<"Department"> | boolean
    assets?: AssetListRelationFilter
    records?: AssetRecordListRelationFilter
  }, "id" | "name">

  export type DepartmentOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    _count?: DepartmentCountOrderByAggregateInput
    _avg?: DepartmentAvgOrderByAggregateInput
    _max?: DepartmentMaxOrderByAggregateInput
    _min?: DepartmentMinOrderByAggregateInput
    _sum?: DepartmentSumOrderByAggregateInput
  }

  export type DepartmentScalarWhereWithAggregatesInput = {
    AND?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    OR?: DepartmentScalarWhereWithAggregatesInput[]
    NOT?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Department"> | number
    name?: StringWithAggregatesFilter<"Department"> | string
    sortOrder?: IntWithAggregatesFilter<"Department"> | number
    isActive?: BoolWithAggregatesFilter<"Department"> | boolean
  }

  export type AssetTemplateWhereInput = {
    AND?: AssetTemplateWhereInput | AssetTemplateWhereInput[]
    OR?: AssetTemplateWhereInput[]
    NOT?: AssetTemplateWhereInput | AssetTemplateWhereInput[]
    id?: IntFilter<"AssetTemplate"> | number
    name?: StringFilter<"AssetTemplate"> | string
    deviceType?: EnumDeviceTypeFilter<"AssetTemplate"> | $Enums.DeviceType
    brand?: StringFilter<"AssetTemplate"> | string
    model?: StringFilter<"AssetTemplate"> | string
    os?: StringFilter<"AssetTemplate"> | string
    cpu?: StringFilter<"AssetTemplate"> | string
    memory?: StringFilter<"AssetTemplate"> | string
    storage?: StringFilter<"AssetTemplate"> | string
    remark?: StringNullableFilter<"AssetTemplate"> | string | null
    isActive?: BoolFilter<"AssetTemplate"> | boolean
    sortOrder?: IntFilter<"AssetTemplate"> | number
    assets?: AssetListRelationFilter
  }

  export type AssetTemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    deviceType?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    os?: SortOrder
    cpu?: SortOrder
    memory?: SortOrder
    storage?: SortOrder
    remark?: SortOrderInput | SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    assets?: AssetOrderByRelationAggregateInput
  }

  export type AssetTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: AssetTemplateWhereInput | AssetTemplateWhereInput[]
    OR?: AssetTemplateWhereInput[]
    NOT?: AssetTemplateWhereInput | AssetTemplateWhereInput[]
    deviceType?: EnumDeviceTypeFilter<"AssetTemplate"> | $Enums.DeviceType
    brand?: StringFilter<"AssetTemplate"> | string
    model?: StringFilter<"AssetTemplate"> | string
    os?: StringFilter<"AssetTemplate"> | string
    cpu?: StringFilter<"AssetTemplate"> | string
    memory?: StringFilter<"AssetTemplate"> | string
    storage?: StringFilter<"AssetTemplate"> | string
    remark?: StringNullableFilter<"AssetTemplate"> | string | null
    isActive?: BoolFilter<"AssetTemplate"> | boolean
    sortOrder?: IntFilter<"AssetTemplate"> | number
    assets?: AssetListRelationFilter
  }, "id" | "name">

  export type AssetTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    deviceType?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    os?: SortOrder
    cpu?: SortOrder
    memory?: SortOrder
    storage?: SortOrder
    remark?: SortOrderInput | SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    _count?: AssetTemplateCountOrderByAggregateInput
    _avg?: AssetTemplateAvgOrderByAggregateInput
    _max?: AssetTemplateMaxOrderByAggregateInput
    _min?: AssetTemplateMinOrderByAggregateInput
    _sum?: AssetTemplateSumOrderByAggregateInput
  }

  export type AssetTemplateScalarWhereWithAggregatesInput = {
    AND?: AssetTemplateScalarWhereWithAggregatesInput | AssetTemplateScalarWhereWithAggregatesInput[]
    OR?: AssetTemplateScalarWhereWithAggregatesInput[]
    NOT?: AssetTemplateScalarWhereWithAggregatesInput | AssetTemplateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AssetTemplate"> | number
    name?: StringWithAggregatesFilter<"AssetTemplate"> | string
    deviceType?: EnumDeviceTypeWithAggregatesFilter<"AssetTemplate"> | $Enums.DeviceType
    brand?: StringWithAggregatesFilter<"AssetTemplate"> | string
    model?: StringWithAggregatesFilter<"AssetTemplate"> | string
    os?: StringWithAggregatesFilter<"AssetTemplate"> | string
    cpu?: StringWithAggregatesFilter<"AssetTemplate"> | string
    memory?: StringWithAggregatesFilter<"AssetTemplate"> | string
    storage?: StringWithAggregatesFilter<"AssetTemplate"> | string
    remark?: StringNullableWithAggregatesFilter<"AssetTemplate"> | string | null
    isActive?: BoolWithAggregatesFilter<"AssetTemplate"> | boolean
    sortOrder?: IntWithAggregatesFilter<"AssetTemplate"> | number
  }

  export type AssetWhereInput = {
    AND?: AssetWhereInput | AssetWhereInput[]
    OR?: AssetWhereInput[]
    NOT?: AssetWhereInput | AssetWhereInput[]
    id?: IntFilter<"Asset"> | number
    assetCode?: StringFilter<"Asset"> | string
    templateId?: IntNullableFilter<"Asset"> | number | null
    deviceType?: EnumDeviceTypeFilter<"Asset"> | $Enums.DeviceType
    brand?: StringFilter<"Asset"> | string
    model?: StringFilter<"Asset"> | string
    serialNumber?: StringFilter<"Asset"> | string
    os?: StringFilter<"Asset"> | string
    cpu?: StringFilter<"Asset"> | string
    memory?: StringFilter<"Asset"> | string
    storage?: StringFilter<"Asset"> | string
    status?: EnumAssetStatusFilter<"Asset"> | $Enums.AssetStatus
    currentUserName?: StringFilter<"Asset"> | string
    departmentId?: IntFilter<"Asset"> | number
    purchaseDate?: DateTimeFilter<"Asset"> | Date | string
    warrantyExpiry?: DateTimeNullableFilter<"Asset"> | Date | string | null
    remark?: StringNullableFilter<"Asset"> | string | null
    version?: IntFilter<"Asset"> | number
    template?: XOR<AssetTemplateNullableScalarRelationFilter, AssetTemplateWhereInput> | null
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    records?: AssetRecordListRelationFilter
    repairRecords?: RepairRecordListRelationFilter
  }

  export type AssetOrderByWithRelationInput = {
    id?: SortOrder
    assetCode?: SortOrder
    templateId?: SortOrderInput | SortOrder
    deviceType?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    os?: SortOrder
    cpu?: SortOrder
    memory?: SortOrder
    storage?: SortOrder
    status?: SortOrder
    currentUserName?: SortOrder
    departmentId?: SortOrder
    purchaseDate?: SortOrder
    warrantyExpiry?: SortOrderInput | SortOrder
    remark?: SortOrderInput | SortOrder
    version?: SortOrder
    template?: AssetTemplateOrderByWithRelationInput
    department?: DepartmentOrderByWithRelationInput
    records?: AssetRecordOrderByRelationAggregateInput
    repairRecords?: RepairRecordOrderByRelationAggregateInput
  }

  export type AssetWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    assetCode?: string
    serialNumber?: string
    AND?: AssetWhereInput | AssetWhereInput[]
    OR?: AssetWhereInput[]
    NOT?: AssetWhereInput | AssetWhereInput[]
    templateId?: IntNullableFilter<"Asset"> | number | null
    deviceType?: EnumDeviceTypeFilter<"Asset"> | $Enums.DeviceType
    brand?: StringFilter<"Asset"> | string
    model?: StringFilter<"Asset"> | string
    os?: StringFilter<"Asset"> | string
    cpu?: StringFilter<"Asset"> | string
    memory?: StringFilter<"Asset"> | string
    storage?: StringFilter<"Asset"> | string
    status?: EnumAssetStatusFilter<"Asset"> | $Enums.AssetStatus
    currentUserName?: StringFilter<"Asset"> | string
    departmentId?: IntFilter<"Asset"> | number
    purchaseDate?: DateTimeFilter<"Asset"> | Date | string
    warrantyExpiry?: DateTimeNullableFilter<"Asset"> | Date | string | null
    remark?: StringNullableFilter<"Asset"> | string | null
    version?: IntFilter<"Asset"> | number
    template?: XOR<AssetTemplateNullableScalarRelationFilter, AssetTemplateWhereInput> | null
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    records?: AssetRecordListRelationFilter
    repairRecords?: RepairRecordListRelationFilter
  }, "id" | "assetCode" | "serialNumber">

  export type AssetOrderByWithAggregationInput = {
    id?: SortOrder
    assetCode?: SortOrder
    templateId?: SortOrderInput | SortOrder
    deviceType?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    os?: SortOrder
    cpu?: SortOrder
    memory?: SortOrder
    storage?: SortOrder
    status?: SortOrder
    currentUserName?: SortOrder
    departmentId?: SortOrder
    purchaseDate?: SortOrder
    warrantyExpiry?: SortOrderInput | SortOrder
    remark?: SortOrderInput | SortOrder
    version?: SortOrder
    _count?: AssetCountOrderByAggregateInput
    _avg?: AssetAvgOrderByAggregateInput
    _max?: AssetMaxOrderByAggregateInput
    _min?: AssetMinOrderByAggregateInput
    _sum?: AssetSumOrderByAggregateInput
  }

  export type AssetScalarWhereWithAggregatesInput = {
    AND?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[]
    OR?: AssetScalarWhereWithAggregatesInput[]
    NOT?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Asset"> | number
    assetCode?: StringWithAggregatesFilter<"Asset"> | string
    templateId?: IntNullableWithAggregatesFilter<"Asset"> | number | null
    deviceType?: EnumDeviceTypeWithAggregatesFilter<"Asset"> | $Enums.DeviceType
    brand?: StringWithAggregatesFilter<"Asset"> | string
    model?: StringWithAggregatesFilter<"Asset"> | string
    serialNumber?: StringWithAggregatesFilter<"Asset"> | string
    os?: StringWithAggregatesFilter<"Asset"> | string
    cpu?: StringWithAggregatesFilter<"Asset"> | string
    memory?: StringWithAggregatesFilter<"Asset"> | string
    storage?: StringWithAggregatesFilter<"Asset"> | string
    status?: EnumAssetStatusWithAggregatesFilter<"Asset"> | $Enums.AssetStatus
    currentUserName?: StringWithAggregatesFilter<"Asset"> | string
    departmentId?: IntWithAggregatesFilter<"Asset"> | number
    purchaseDate?: DateTimeWithAggregatesFilter<"Asset"> | Date | string
    warrantyExpiry?: DateTimeNullableWithAggregatesFilter<"Asset"> | Date | string | null
    remark?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    version?: IntWithAggregatesFilter<"Asset"> | number
  }

  export type AssetRecordWhereInput = {
    AND?: AssetRecordWhereInput | AssetRecordWhereInput[]
    OR?: AssetRecordWhereInput[]
    NOT?: AssetRecordWhereInput | AssetRecordWhereInput[]
    id?: IntFilter<"AssetRecord"> | number
    assetId?: IntFilter<"AssetRecord"> | number
    action?: EnumAssetRecordActionFilter<"AssetRecord"> | $Enums.AssetRecordAction
    userName?: StringFilter<"AssetRecord"> | string
    departmentId?: IntFilter<"AssetRecord"> | number
    actionDate?: DateTimeFilter<"AssetRecord"> | Date | string
    expectedReturnDate?: DateTimeNullableFilter<"AssetRecord"> | Date | string | null
    proofImage?: StringNullableFilter<"AssetRecord"> | string | null
    remark?: StringNullableFilter<"AssetRecord"> | string | null
    operatorId?: IntFilter<"AssetRecord"> | number
    requestId?: StringFilter<"AssetRecord"> | string
    createdAt?: DateTimeFilter<"AssetRecord"> | Date | string
    asset?: XOR<AssetScalarRelationFilter, AssetWhereInput>
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    operator?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AssetRecordOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    action?: SortOrder
    userName?: SortOrder
    departmentId?: SortOrder
    actionDate?: SortOrder
    expectedReturnDate?: SortOrderInput | SortOrder
    proofImage?: SortOrderInput | SortOrder
    remark?: SortOrderInput | SortOrder
    operatorId?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
    asset?: AssetOrderByWithRelationInput
    department?: DepartmentOrderByWithRelationInput
    operator?: UserOrderByWithRelationInput
  }

  export type AssetRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    requestId?: string
    AND?: AssetRecordWhereInput | AssetRecordWhereInput[]
    OR?: AssetRecordWhereInput[]
    NOT?: AssetRecordWhereInput | AssetRecordWhereInput[]
    assetId?: IntFilter<"AssetRecord"> | number
    action?: EnumAssetRecordActionFilter<"AssetRecord"> | $Enums.AssetRecordAction
    userName?: StringFilter<"AssetRecord"> | string
    departmentId?: IntFilter<"AssetRecord"> | number
    actionDate?: DateTimeFilter<"AssetRecord"> | Date | string
    expectedReturnDate?: DateTimeNullableFilter<"AssetRecord"> | Date | string | null
    proofImage?: StringNullableFilter<"AssetRecord"> | string | null
    remark?: StringNullableFilter<"AssetRecord"> | string | null
    operatorId?: IntFilter<"AssetRecord"> | number
    createdAt?: DateTimeFilter<"AssetRecord"> | Date | string
    asset?: XOR<AssetScalarRelationFilter, AssetWhereInput>
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    operator?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "requestId">

  export type AssetRecordOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    action?: SortOrder
    userName?: SortOrder
    departmentId?: SortOrder
    actionDate?: SortOrder
    expectedReturnDate?: SortOrderInput | SortOrder
    proofImage?: SortOrderInput | SortOrder
    remark?: SortOrderInput | SortOrder
    operatorId?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
    _count?: AssetRecordCountOrderByAggregateInput
    _avg?: AssetRecordAvgOrderByAggregateInput
    _max?: AssetRecordMaxOrderByAggregateInput
    _min?: AssetRecordMinOrderByAggregateInput
    _sum?: AssetRecordSumOrderByAggregateInput
  }

  export type AssetRecordScalarWhereWithAggregatesInput = {
    AND?: AssetRecordScalarWhereWithAggregatesInput | AssetRecordScalarWhereWithAggregatesInput[]
    OR?: AssetRecordScalarWhereWithAggregatesInput[]
    NOT?: AssetRecordScalarWhereWithAggregatesInput | AssetRecordScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AssetRecord"> | number
    assetId?: IntWithAggregatesFilter<"AssetRecord"> | number
    action?: EnumAssetRecordActionWithAggregatesFilter<"AssetRecord"> | $Enums.AssetRecordAction
    userName?: StringWithAggregatesFilter<"AssetRecord"> | string
    departmentId?: IntWithAggregatesFilter<"AssetRecord"> | number
    actionDate?: DateTimeWithAggregatesFilter<"AssetRecord"> | Date | string
    expectedReturnDate?: DateTimeNullableWithAggregatesFilter<"AssetRecord"> | Date | string | null
    proofImage?: StringNullableWithAggregatesFilter<"AssetRecord"> | string | null
    remark?: StringNullableWithAggregatesFilter<"AssetRecord"> | string | null
    operatorId?: IntWithAggregatesFilter<"AssetRecord"> | number
    requestId?: StringWithAggregatesFilter<"AssetRecord"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AssetRecord"> | Date | string
  }

  export type RepairRecordWhereInput = {
    AND?: RepairRecordWhereInput | RepairRecordWhereInput[]
    OR?: RepairRecordWhereInput[]
    NOT?: RepairRecordWhereInput | RepairRecordWhereInput[]
    id?: IntFilter<"RepairRecord"> | number
    assetId?: IntFilter<"RepairRecord"> | number
    faultDescription?: StringFilter<"RepairRecord"> | string
    repairVendor?: StringFilter<"RepairRecord"> | string
    repairCost?: FloatFilter<"RepairRecord"> | number
    repairResult?: EnumRepairResultFilter<"RepairRecord"> | $Enums.RepairResult
    startDate?: DateTimeFilter<"RepairRecord"> | Date | string
    endDate?: DateTimeFilter<"RepairRecord"> | Date | string
    remark?: StringNullableFilter<"RepairRecord"> | string | null
    asset?: XOR<AssetScalarRelationFilter, AssetWhereInput>
  }

  export type RepairRecordOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    faultDescription?: SortOrder
    repairVendor?: SortOrder
    repairCost?: SortOrder
    repairResult?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    remark?: SortOrderInput | SortOrder
    asset?: AssetOrderByWithRelationInput
  }

  export type RepairRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RepairRecordWhereInput | RepairRecordWhereInput[]
    OR?: RepairRecordWhereInput[]
    NOT?: RepairRecordWhereInput | RepairRecordWhereInput[]
    assetId?: IntFilter<"RepairRecord"> | number
    faultDescription?: StringFilter<"RepairRecord"> | string
    repairVendor?: StringFilter<"RepairRecord"> | string
    repairCost?: FloatFilter<"RepairRecord"> | number
    repairResult?: EnumRepairResultFilter<"RepairRecord"> | $Enums.RepairResult
    startDate?: DateTimeFilter<"RepairRecord"> | Date | string
    endDate?: DateTimeFilter<"RepairRecord"> | Date | string
    remark?: StringNullableFilter<"RepairRecord"> | string | null
    asset?: XOR<AssetScalarRelationFilter, AssetWhereInput>
  }, "id">

  export type RepairRecordOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    faultDescription?: SortOrder
    repairVendor?: SortOrder
    repairCost?: SortOrder
    repairResult?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    remark?: SortOrderInput | SortOrder
    _count?: RepairRecordCountOrderByAggregateInput
    _avg?: RepairRecordAvgOrderByAggregateInput
    _max?: RepairRecordMaxOrderByAggregateInput
    _min?: RepairRecordMinOrderByAggregateInput
    _sum?: RepairRecordSumOrderByAggregateInput
  }

  export type RepairRecordScalarWhereWithAggregatesInput = {
    AND?: RepairRecordScalarWhereWithAggregatesInput | RepairRecordScalarWhereWithAggregatesInput[]
    OR?: RepairRecordScalarWhereWithAggregatesInput[]
    NOT?: RepairRecordScalarWhereWithAggregatesInput | RepairRecordScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RepairRecord"> | number
    assetId?: IntWithAggregatesFilter<"RepairRecord"> | number
    faultDescription?: StringWithAggregatesFilter<"RepairRecord"> | string
    repairVendor?: StringWithAggregatesFilter<"RepairRecord"> | string
    repairCost?: FloatWithAggregatesFilter<"RepairRecord"> | number
    repairResult?: EnumRepairResultWithAggregatesFilter<"RepairRecord"> | $Enums.RepairResult
    startDate?: DateTimeWithAggregatesFilter<"RepairRecord"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"RepairRecord"> | Date | string
    remark?: StringNullableWithAggregatesFilter<"RepairRecord"> | string | null
  }

  export type SystemConfigWhereInput = {
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    configKey?: StringFilter<"SystemConfig"> | string
    configValue?: StringFilter<"SystemConfig"> | string
    description?: StringNullableFilter<"SystemConfig"> | string | null
    updatedAt?: DateTimeFilter<"SystemConfig"> | Date | string
    createdAt?: DateTimeFilter<"SystemConfig"> | Date | string
  }

  export type SystemConfigOrderByWithRelationInput = {
    configKey?: SortOrder
    configValue?: SortOrder
    description?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemConfigWhereUniqueInput = Prisma.AtLeast<{
    configKey?: string
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    configValue?: StringFilter<"SystemConfig"> | string
    description?: StringNullableFilter<"SystemConfig"> | string | null
    updatedAt?: DateTimeFilter<"SystemConfig"> | Date | string
    createdAt?: DateTimeFilter<"SystemConfig"> | Date | string
  }, "configKey">

  export type SystemConfigOrderByWithAggregationInput = {
    configKey?: SortOrder
    configValue?: SortOrder
    description?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: SystemConfigCountOrderByAggregateInput
    _max?: SystemConfigMaxOrderByAggregateInput
    _min?: SystemConfigMinOrderByAggregateInput
  }

  export type SystemConfigScalarWhereWithAggregatesInput = {
    AND?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    OR?: SystemConfigScalarWhereWithAggregatesInput[]
    NOT?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    configKey?: StringWithAggregatesFilter<"SystemConfig"> | string
    configValue?: StringWithAggregatesFilter<"SystemConfig"> | string
    description?: StringNullableWithAggregatesFilter<"SystemConfig"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"SystemConfig"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"SystemConfig"> | Date | string
  }

  export type OperationLogWhereInput = {
    AND?: OperationLogWhereInput | OperationLogWhereInput[]
    OR?: OperationLogWhereInput[]
    NOT?: OperationLogWhereInput | OperationLogWhereInput[]
    id?: IntFilter<"OperationLog"> | number
    operatorId?: IntFilter<"OperationLog"> | number
    action?: StringFilter<"OperationLog"> | string
    targetType?: StringFilter<"OperationLog"> | string
    targetId?: IntFilter<"OperationLog"> | number
    detail?: JsonFilter<"OperationLog">
    ipAddress?: StringFilter<"OperationLog"> | string
    createdAt?: DateTimeFilter<"OperationLog"> | Date | string
    operator?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type OperationLogOrderByWithRelationInput = {
    id?: SortOrder
    operatorId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    detail?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
    operator?: UserOrderByWithRelationInput
  }

  export type OperationLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: OperationLogWhereInput | OperationLogWhereInput[]
    OR?: OperationLogWhereInput[]
    NOT?: OperationLogWhereInput | OperationLogWhereInput[]
    operatorId?: IntFilter<"OperationLog"> | number
    action?: StringFilter<"OperationLog"> | string
    targetType?: StringFilter<"OperationLog"> | string
    targetId?: IntFilter<"OperationLog"> | number
    detail?: JsonFilter<"OperationLog">
    ipAddress?: StringFilter<"OperationLog"> | string
    createdAt?: DateTimeFilter<"OperationLog"> | Date | string
    operator?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type OperationLogOrderByWithAggregationInput = {
    id?: SortOrder
    operatorId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    detail?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
    _count?: OperationLogCountOrderByAggregateInput
    _avg?: OperationLogAvgOrderByAggregateInput
    _max?: OperationLogMaxOrderByAggregateInput
    _min?: OperationLogMinOrderByAggregateInput
    _sum?: OperationLogSumOrderByAggregateInput
  }

  export type OperationLogScalarWhereWithAggregatesInput = {
    AND?: OperationLogScalarWhereWithAggregatesInput | OperationLogScalarWhereWithAggregatesInput[]
    OR?: OperationLogScalarWhereWithAggregatesInput[]
    NOT?: OperationLogScalarWhereWithAggregatesInput | OperationLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"OperationLog"> | number
    operatorId?: IntWithAggregatesFilter<"OperationLog"> | number
    action?: StringWithAggregatesFilter<"OperationLog"> | string
    targetType?: StringWithAggregatesFilter<"OperationLog"> | string
    targetId?: IntWithAggregatesFilter<"OperationLog"> | number
    detail?: JsonWithAggregatesFilter<"OperationLog">
    ipAddress?: StringWithAggregatesFilter<"OperationLog"> | string
    createdAt?: DateTimeWithAggregatesFilter<"OperationLog"> | Date | string
  }

  export type UserCreateInput = {
    username: string
    password: string
    realName: string
    role: $Enums.Role
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    operatorLogs?: OperationLogCreateNestedManyWithoutOperatorInput
    assetRecords?: AssetRecordCreateNestedManyWithoutOperatorInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    username: string
    password: string
    realName: string
    role: $Enums.Role
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    operatorLogs?: OperationLogUncheckedCreateNestedManyWithoutOperatorInput
    assetRecords?: AssetRecordUncheckedCreateNestedManyWithoutOperatorInput
  }

  export type UserUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    realName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mustChangePass?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorLogs?: OperationLogUpdateManyWithoutOperatorNestedInput
    assetRecords?: AssetRecordUpdateManyWithoutOperatorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    realName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mustChangePass?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorLogs?: OperationLogUncheckedUpdateManyWithoutOperatorNestedInput
    assetRecords?: AssetRecordUncheckedUpdateManyWithoutOperatorNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    username: string
    password: string
    realName: string
    role: $Enums.Role
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    realName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mustChangePass?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    realName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mustChangePass?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentCreateInput = {
    name: string
    sortOrder: number
    isActive?: boolean
    assets?: AssetCreateNestedManyWithoutDepartmentInput
    records?: AssetRecordCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateInput = {
    id?: number
    name: string
    sortOrder: number
    isActive?: boolean
    assets?: AssetUncheckedCreateNestedManyWithoutDepartmentInput
    records?: AssetRecordUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assets?: AssetUpdateManyWithoutDepartmentNestedInput
    records?: AssetRecordUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assets?: AssetUncheckedUpdateManyWithoutDepartmentNestedInput
    records?: AssetRecordUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentCreateManyInput = {
    id?: number
    name: string
    sortOrder: number
    isActive?: boolean
  }

  export type DepartmentUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DepartmentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AssetTemplateCreateInput = {
    name: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    os: string
    cpu: string
    memory: string
    storage: string
    remark?: string | null
    isActive?: boolean
    sortOrder: number
    assets?: AssetCreateNestedManyWithoutTemplateInput
  }

  export type AssetTemplateUncheckedCreateInput = {
    id?: number
    name: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    os: string
    cpu: string
    memory: string
    storage: string
    remark?: string | null
    isActive?: boolean
    sortOrder: number
    assets?: AssetUncheckedCreateNestedManyWithoutTemplateInput
  }

  export type AssetTemplateUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    assets?: AssetUpdateManyWithoutTemplateNestedInput
  }

  export type AssetTemplateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    assets?: AssetUncheckedUpdateManyWithoutTemplateNestedInput
  }

  export type AssetTemplateCreateManyInput = {
    id?: number
    name: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    os: string
    cpu: string
    memory: string
    storage: string
    remark?: string | null
    isActive?: boolean
    sortOrder: number
  }

  export type AssetTemplateUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type AssetTemplateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type AssetCreateInput = {
    assetCode: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
    template?: AssetTemplateCreateNestedOneWithoutAssetsInput
    department: DepartmentCreateNestedOneWithoutAssetsInput
    records?: AssetRecordCreateNestedManyWithoutAssetInput
    repairRecords?: RepairRecordCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateInput = {
    id?: number
    assetCode: string
    templateId?: number | null
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    departmentId: number
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
    records?: AssetRecordUncheckedCreateNestedManyWithoutAssetInput
    repairRecords?: RepairRecordUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetUpdateInput = {
    assetCode?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    template?: AssetTemplateUpdateOneWithoutAssetsNestedInput
    department?: DepartmentUpdateOneRequiredWithoutAssetsNestedInput
    records?: AssetRecordUpdateManyWithoutAssetNestedInput
    repairRecords?: RepairRecordUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetCode?: StringFieldUpdateOperationsInput | string
    templateId?: NullableIntFieldUpdateOperationsInput | number | null
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    records?: AssetRecordUncheckedUpdateManyWithoutAssetNestedInput
    repairRecords?: RepairRecordUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type AssetCreateManyInput = {
    id?: number
    assetCode: string
    templateId?: number | null
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    departmentId: number
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
  }

  export type AssetUpdateManyMutationInput = {
    assetCode?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type AssetUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetCode?: StringFieldUpdateOperationsInput | string
    templateId?: NullableIntFieldUpdateOperationsInput | number | null
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type AssetRecordCreateInput = {
    action: $Enums.AssetRecordAction
    userName: string
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    requestId: string
    createdAt?: Date | string
    asset: AssetCreateNestedOneWithoutRecordsInput
    department: DepartmentCreateNestedOneWithoutRecordsInput
    operator: UserCreateNestedOneWithoutAssetRecordsInput
  }

  export type AssetRecordUncheckedCreateInput = {
    id?: number
    assetId: number
    action: $Enums.AssetRecordAction
    userName: string
    departmentId: number
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    operatorId: number
    requestId: string
    createdAt?: Date | string
  }

  export type AssetRecordUpdateInput = {
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    asset?: AssetUpdateOneRequiredWithoutRecordsNestedInput
    department?: DepartmentUpdateOneRequiredWithoutRecordsNestedInput
    operator?: UserUpdateOneRequiredWithoutAssetRecordsNestedInput
  }

  export type AssetRecordUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetId?: IntFieldUpdateOperationsInput | number
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    operatorId?: IntFieldUpdateOperationsInput | number
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetRecordCreateManyInput = {
    id?: number
    assetId: number
    action: $Enums.AssetRecordAction
    userName: string
    departmentId: number
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    operatorId: number
    requestId: string
    createdAt?: Date | string
  }

  export type AssetRecordUpdateManyMutationInput = {
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetRecordUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetId?: IntFieldUpdateOperationsInput | number
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    operatorId?: IntFieldUpdateOperationsInput | number
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepairRecordCreateInput = {
    faultDescription: string
    repairVendor: string
    repairCost: number
    repairResult: $Enums.RepairResult
    startDate: Date | string
    endDate: Date | string
    remark?: string | null
    asset: AssetCreateNestedOneWithoutRepairRecordsInput
  }

  export type RepairRecordUncheckedCreateInput = {
    id?: number
    assetId: number
    faultDescription: string
    repairVendor: string
    repairCost: number
    repairResult: $Enums.RepairResult
    startDate: Date | string
    endDate: Date | string
    remark?: string | null
  }

  export type RepairRecordUpdateInput = {
    faultDescription?: StringFieldUpdateOperationsInput | string
    repairVendor?: StringFieldUpdateOperationsInput | string
    repairCost?: FloatFieldUpdateOperationsInput | number
    repairResult?: EnumRepairResultFieldUpdateOperationsInput | $Enums.RepairResult
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    asset?: AssetUpdateOneRequiredWithoutRepairRecordsNestedInput
  }

  export type RepairRecordUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetId?: IntFieldUpdateOperationsInput | number
    faultDescription?: StringFieldUpdateOperationsInput | string
    repairVendor?: StringFieldUpdateOperationsInput | string
    repairCost?: FloatFieldUpdateOperationsInput | number
    repairResult?: EnumRepairResultFieldUpdateOperationsInput | $Enums.RepairResult
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RepairRecordCreateManyInput = {
    id?: number
    assetId: number
    faultDescription: string
    repairVendor: string
    repairCost: number
    repairResult: $Enums.RepairResult
    startDate: Date | string
    endDate: Date | string
    remark?: string | null
  }

  export type RepairRecordUpdateManyMutationInput = {
    faultDescription?: StringFieldUpdateOperationsInput | string
    repairVendor?: StringFieldUpdateOperationsInput | string
    repairCost?: FloatFieldUpdateOperationsInput | number
    repairResult?: EnumRepairResultFieldUpdateOperationsInput | $Enums.RepairResult
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RepairRecordUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetId?: IntFieldUpdateOperationsInput | number
    faultDescription?: StringFieldUpdateOperationsInput | string
    repairVendor?: StringFieldUpdateOperationsInput | string
    repairCost?: FloatFieldUpdateOperationsInput | number
    repairResult?: EnumRepairResultFieldUpdateOperationsInput | $Enums.RepairResult
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SystemConfigCreateInput = {
    configKey: string
    configValue: string
    description?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type SystemConfigUncheckedCreateInput = {
    configKey: string
    configValue: string
    description?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type SystemConfigUpdateInput = {
    configKey?: StringFieldUpdateOperationsInput | string
    configValue?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateInput = {
    configKey?: StringFieldUpdateOperationsInput | string
    configValue?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigCreateManyInput = {
    configKey: string
    configValue: string
    description?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type SystemConfigUpdateManyMutationInput = {
    configKey?: StringFieldUpdateOperationsInput | string
    configValue?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateManyInput = {
    configKey?: StringFieldUpdateOperationsInput | string
    configValue?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperationLogCreateInput = {
    action: string
    targetType: string
    targetId: number
    detail: JsonNullValueInput | InputJsonValue
    ipAddress: string
    createdAt?: Date | string
    operator: UserCreateNestedOneWithoutOperatorLogsInput
  }

  export type OperationLogUncheckedCreateInput = {
    id?: number
    operatorId: number
    action: string
    targetType: string
    targetId: number
    detail: JsonNullValueInput | InputJsonValue
    ipAddress: string
    createdAt?: Date | string
  }

  export type OperationLogUpdateInput = {
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: IntFieldUpdateOperationsInput | number
    detail?: JsonNullValueInput | InputJsonValue
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    operator?: UserUpdateOneRequiredWithoutOperatorLogsNestedInput
  }

  export type OperationLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    operatorId?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: IntFieldUpdateOperationsInput | number
    detail?: JsonNullValueInput | InputJsonValue
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperationLogCreateManyInput = {
    id?: number
    operatorId: number
    action: string
    targetType: string
    targetId: number
    detail: JsonNullValueInput | InputJsonValue
    ipAddress: string
    createdAt?: Date | string
  }

  export type OperationLogUpdateManyMutationInput = {
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: IntFieldUpdateOperationsInput | number
    detail?: JsonNullValueInput | InputJsonValue
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperationLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    operatorId?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: IntFieldUpdateOperationsInput | number
    detail?: JsonNullValueInput | InputJsonValue
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OperationLogListRelationFilter = {
    every?: OperationLogWhereInput
    some?: OperationLogWhereInput
    none?: OperationLogWhereInput
  }

  export type AssetRecordListRelationFilter = {
    every?: AssetRecordWhereInput
    some?: AssetRecordWhereInput
    none?: AssetRecordWhereInput
  }

  export type OperationLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssetRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    realName?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    mustChangePass?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    realName?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    mustChangePass?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    realName?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    mustChangePass?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type AssetListRelationFilter = {
    every?: AssetWhereInput
    some?: AssetWhereInput
    none?: AssetWhereInput
  }

  export type AssetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
  }

  export type DepartmentAvgOrderByAggregateInput = {
    id?: SortOrder
    sortOrder?: SortOrder
  }

  export type DepartmentMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
  }

  export type DepartmentMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
  }

  export type DepartmentSumOrderByAggregateInput = {
    id?: SortOrder
    sortOrder?: SortOrder
  }

  export type EnumDeviceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[]
    notIn?: $Enums.DeviceType[]
    not?: NestedEnumDeviceTypeFilter<$PrismaModel> | $Enums.DeviceType
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AssetTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    deviceType?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    os?: SortOrder
    cpu?: SortOrder
    memory?: SortOrder
    storage?: SortOrder
    remark?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
  }

  export type AssetTemplateAvgOrderByAggregateInput = {
    id?: SortOrder
    sortOrder?: SortOrder
  }

  export type AssetTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    deviceType?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    os?: SortOrder
    cpu?: SortOrder
    memory?: SortOrder
    storage?: SortOrder
    remark?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
  }

  export type AssetTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    deviceType?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    os?: SortOrder
    cpu?: SortOrder
    memory?: SortOrder
    storage?: SortOrder
    remark?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
  }

  export type AssetTemplateSumOrderByAggregateInput = {
    id?: SortOrder
    sortOrder?: SortOrder
  }

  export type EnumDeviceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[]
    notIn?: $Enums.DeviceType[]
    not?: NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel> | $Enums.DeviceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceTypeFilter<$PrismaModel>
    _max?: NestedEnumDeviceTypeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumAssetStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[]
    notIn?: $Enums.AssetStatus[]
    not?: NestedEnumAssetStatusFilter<$PrismaModel> | $Enums.AssetStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AssetTemplateNullableScalarRelationFilter = {
    is?: AssetTemplateWhereInput | null
    isNot?: AssetTemplateWhereInput | null
  }

  export type DepartmentScalarRelationFilter = {
    is?: DepartmentWhereInput
    isNot?: DepartmentWhereInput
  }

  export type RepairRecordListRelationFilter = {
    every?: RepairRecordWhereInput
    some?: RepairRecordWhereInput
    none?: RepairRecordWhereInput
  }

  export type RepairRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssetCountOrderByAggregateInput = {
    id?: SortOrder
    assetCode?: SortOrder
    templateId?: SortOrder
    deviceType?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    os?: SortOrder
    cpu?: SortOrder
    memory?: SortOrder
    storage?: SortOrder
    status?: SortOrder
    currentUserName?: SortOrder
    departmentId?: SortOrder
    purchaseDate?: SortOrder
    warrantyExpiry?: SortOrder
    remark?: SortOrder
    version?: SortOrder
  }

  export type AssetAvgOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    departmentId?: SortOrder
    version?: SortOrder
  }

  export type AssetMaxOrderByAggregateInput = {
    id?: SortOrder
    assetCode?: SortOrder
    templateId?: SortOrder
    deviceType?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    os?: SortOrder
    cpu?: SortOrder
    memory?: SortOrder
    storage?: SortOrder
    status?: SortOrder
    currentUserName?: SortOrder
    departmentId?: SortOrder
    purchaseDate?: SortOrder
    warrantyExpiry?: SortOrder
    remark?: SortOrder
    version?: SortOrder
  }

  export type AssetMinOrderByAggregateInput = {
    id?: SortOrder
    assetCode?: SortOrder
    templateId?: SortOrder
    deviceType?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    os?: SortOrder
    cpu?: SortOrder
    memory?: SortOrder
    storage?: SortOrder
    status?: SortOrder
    currentUserName?: SortOrder
    departmentId?: SortOrder
    purchaseDate?: SortOrder
    warrantyExpiry?: SortOrder
    remark?: SortOrder
    version?: SortOrder
  }

  export type AssetSumOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    departmentId?: SortOrder
    version?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumAssetStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[]
    notIn?: $Enums.AssetStatus[]
    not?: NestedEnumAssetStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssetStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetStatusFilter<$PrismaModel>
    _max?: NestedEnumAssetStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumAssetRecordActionFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetRecordAction | EnumAssetRecordActionFieldRefInput<$PrismaModel>
    in?: $Enums.AssetRecordAction[]
    notIn?: $Enums.AssetRecordAction[]
    not?: NestedEnumAssetRecordActionFilter<$PrismaModel> | $Enums.AssetRecordAction
  }

  export type AssetScalarRelationFilter = {
    is?: AssetWhereInput
    isNot?: AssetWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AssetRecordCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    action?: SortOrder
    userName?: SortOrder
    departmentId?: SortOrder
    actionDate?: SortOrder
    expectedReturnDate?: SortOrder
    proofImage?: SortOrder
    remark?: SortOrder
    operatorId?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetRecordAvgOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    departmentId?: SortOrder
    operatorId?: SortOrder
  }

  export type AssetRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    action?: SortOrder
    userName?: SortOrder
    departmentId?: SortOrder
    actionDate?: SortOrder
    expectedReturnDate?: SortOrder
    proofImage?: SortOrder
    remark?: SortOrder
    operatorId?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetRecordMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    action?: SortOrder
    userName?: SortOrder
    departmentId?: SortOrder
    actionDate?: SortOrder
    expectedReturnDate?: SortOrder
    proofImage?: SortOrder
    remark?: SortOrder
    operatorId?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetRecordSumOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    departmentId?: SortOrder
    operatorId?: SortOrder
  }

  export type EnumAssetRecordActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetRecordAction | EnumAssetRecordActionFieldRefInput<$PrismaModel>
    in?: $Enums.AssetRecordAction[]
    notIn?: $Enums.AssetRecordAction[]
    not?: NestedEnumAssetRecordActionWithAggregatesFilter<$PrismaModel> | $Enums.AssetRecordAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetRecordActionFilter<$PrismaModel>
    _max?: NestedEnumAssetRecordActionFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumRepairResultFilter<$PrismaModel = never> = {
    equals?: $Enums.RepairResult | EnumRepairResultFieldRefInput<$PrismaModel>
    in?: $Enums.RepairResult[]
    notIn?: $Enums.RepairResult[]
    not?: NestedEnumRepairResultFilter<$PrismaModel> | $Enums.RepairResult
  }

  export type RepairRecordCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    faultDescription?: SortOrder
    repairVendor?: SortOrder
    repairCost?: SortOrder
    repairResult?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    remark?: SortOrder
  }

  export type RepairRecordAvgOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    repairCost?: SortOrder
  }

  export type RepairRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    faultDescription?: SortOrder
    repairVendor?: SortOrder
    repairCost?: SortOrder
    repairResult?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    remark?: SortOrder
  }

  export type RepairRecordMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    faultDescription?: SortOrder
    repairVendor?: SortOrder
    repairCost?: SortOrder
    repairResult?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    remark?: SortOrder
  }

  export type RepairRecordSumOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    repairCost?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumRepairResultWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RepairResult | EnumRepairResultFieldRefInput<$PrismaModel>
    in?: $Enums.RepairResult[]
    notIn?: $Enums.RepairResult[]
    not?: NestedEnumRepairResultWithAggregatesFilter<$PrismaModel> | $Enums.RepairResult
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRepairResultFilter<$PrismaModel>
    _max?: NestedEnumRepairResultFilter<$PrismaModel>
  }

  export type SystemConfigCountOrderByAggregateInput = {
    configKey?: SortOrder
    configValue?: SortOrder
    description?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemConfigMaxOrderByAggregateInput = {
    configKey?: SortOrder
    configValue?: SortOrder
    description?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemConfigMinOrderByAggregateInput = {
    configKey?: SortOrder
    configValue?: SortOrder
    description?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type OperationLogCountOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    detail?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type OperationLogAvgOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    targetId?: SortOrder
  }

  export type OperationLogMaxOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type OperationLogMinOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type OperationLogSumOrderByAggregateInput = {
    id?: SortOrder
    operatorId?: SortOrder
    targetId?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type OperationLogCreateNestedManyWithoutOperatorInput = {
    create?: XOR<OperationLogCreateWithoutOperatorInput, OperationLogUncheckedCreateWithoutOperatorInput> | OperationLogCreateWithoutOperatorInput[] | OperationLogUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: OperationLogCreateOrConnectWithoutOperatorInput | OperationLogCreateOrConnectWithoutOperatorInput[]
    createMany?: OperationLogCreateManyOperatorInputEnvelope
    connect?: OperationLogWhereUniqueInput | OperationLogWhereUniqueInput[]
  }

  export type AssetRecordCreateNestedManyWithoutOperatorInput = {
    create?: XOR<AssetRecordCreateWithoutOperatorInput, AssetRecordUncheckedCreateWithoutOperatorInput> | AssetRecordCreateWithoutOperatorInput[] | AssetRecordUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutOperatorInput | AssetRecordCreateOrConnectWithoutOperatorInput[]
    createMany?: AssetRecordCreateManyOperatorInputEnvelope
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
  }

  export type OperationLogUncheckedCreateNestedManyWithoutOperatorInput = {
    create?: XOR<OperationLogCreateWithoutOperatorInput, OperationLogUncheckedCreateWithoutOperatorInput> | OperationLogCreateWithoutOperatorInput[] | OperationLogUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: OperationLogCreateOrConnectWithoutOperatorInput | OperationLogCreateOrConnectWithoutOperatorInput[]
    createMany?: OperationLogCreateManyOperatorInputEnvelope
    connect?: OperationLogWhereUniqueInput | OperationLogWhereUniqueInput[]
  }

  export type AssetRecordUncheckedCreateNestedManyWithoutOperatorInput = {
    create?: XOR<AssetRecordCreateWithoutOperatorInput, AssetRecordUncheckedCreateWithoutOperatorInput> | AssetRecordCreateWithoutOperatorInput[] | AssetRecordUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutOperatorInput | AssetRecordCreateOrConnectWithoutOperatorInput[]
    createMany?: AssetRecordCreateManyOperatorInputEnvelope
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OperationLogUpdateManyWithoutOperatorNestedInput = {
    create?: XOR<OperationLogCreateWithoutOperatorInput, OperationLogUncheckedCreateWithoutOperatorInput> | OperationLogCreateWithoutOperatorInput[] | OperationLogUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: OperationLogCreateOrConnectWithoutOperatorInput | OperationLogCreateOrConnectWithoutOperatorInput[]
    upsert?: OperationLogUpsertWithWhereUniqueWithoutOperatorInput | OperationLogUpsertWithWhereUniqueWithoutOperatorInput[]
    createMany?: OperationLogCreateManyOperatorInputEnvelope
    set?: OperationLogWhereUniqueInput | OperationLogWhereUniqueInput[]
    disconnect?: OperationLogWhereUniqueInput | OperationLogWhereUniqueInput[]
    delete?: OperationLogWhereUniqueInput | OperationLogWhereUniqueInput[]
    connect?: OperationLogWhereUniqueInput | OperationLogWhereUniqueInput[]
    update?: OperationLogUpdateWithWhereUniqueWithoutOperatorInput | OperationLogUpdateWithWhereUniqueWithoutOperatorInput[]
    updateMany?: OperationLogUpdateManyWithWhereWithoutOperatorInput | OperationLogUpdateManyWithWhereWithoutOperatorInput[]
    deleteMany?: OperationLogScalarWhereInput | OperationLogScalarWhereInput[]
  }

  export type AssetRecordUpdateManyWithoutOperatorNestedInput = {
    create?: XOR<AssetRecordCreateWithoutOperatorInput, AssetRecordUncheckedCreateWithoutOperatorInput> | AssetRecordCreateWithoutOperatorInput[] | AssetRecordUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutOperatorInput | AssetRecordCreateOrConnectWithoutOperatorInput[]
    upsert?: AssetRecordUpsertWithWhereUniqueWithoutOperatorInput | AssetRecordUpsertWithWhereUniqueWithoutOperatorInput[]
    createMany?: AssetRecordCreateManyOperatorInputEnvelope
    set?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    disconnect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    delete?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    update?: AssetRecordUpdateWithWhereUniqueWithoutOperatorInput | AssetRecordUpdateWithWhereUniqueWithoutOperatorInput[]
    updateMany?: AssetRecordUpdateManyWithWhereWithoutOperatorInput | AssetRecordUpdateManyWithWhereWithoutOperatorInput[]
    deleteMany?: AssetRecordScalarWhereInput | AssetRecordScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OperationLogUncheckedUpdateManyWithoutOperatorNestedInput = {
    create?: XOR<OperationLogCreateWithoutOperatorInput, OperationLogUncheckedCreateWithoutOperatorInput> | OperationLogCreateWithoutOperatorInput[] | OperationLogUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: OperationLogCreateOrConnectWithoutOperatorInput | OperationLogCreateOrConnectWithoutOperatorInput[]
    upsert?: OperationLogUpsertWithWhereUniqueWithoutOperatorInput | OperationLogUpsertWithWhereUniqueWithoutOperatorInput[]
    createMany?: OperationLogCreateManyOperatorInputEnvelope
    set?: OperationLogWhereUniqueInput | OperationLogWhereUniqueInput[]
    disconnect?: OperationLogWhereUniqueInput | OperationLogWhereUniqueInput[]
    delete?: OperationLogWhereUniqueInput | OperationLogWhereUniqueInput[]
    connect?: OperationLogWhereUniqueInput | OperationLogWhereUniqueInput[]
    update?: OperationLogUpdateWithWhereUniqueWithoutOperatorInput | OperationLogUpdateWithWhereUniqueWithoutOperatorInput[]
    updateMany?: OperationLogUpdateManyWithWhereWithoutOperatorInput | OperationLogUpdateManyWithWhereWithoutOperatorInput[]
    deleteMany?: OperationLogScalarWhereInput | OperationLogScalarWhereInput[]
  }

  export type AssetRecordUncheckedUpdateManyWithoutOperatorNestedInput = {
    create?: XOR<AssetRecordCreateWithoutOperatorInput, AssetRecordUncheckedCreateWithoutOperatorInput> | AssetRecordCreateWithoutOperatorInput[] | AssetRecordUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutOperatorInput | AssetRecordCreateOrConnectWithoutOperatorInput[]
    upsert?: AssetRecordUpsertWithWhereUniqueWithoutOperatorInput | AssetRecordUpsertWithWhereUniqueWithoutOperatorInput[]
    createMany?: AssetRecordCreateManyOperatorInputEnvelope
    set?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    disconnect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    delete?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    update?: AssetRecordUpdateWithWhereUniqueWithoutOperatorInput | AssetRecordUpdateWithWhereUniqueWithoutOperatorInput[]
    updateMany?: AssetRecordUpdateManyWithWhereWithoutOperatorInput | AssetRecordUpdateManyWithWhereWithoutOperatorInput[]
    deleteMany?: AssetRecordScalarWhereInput | AssetRecordScalarWhereInput[]
  }

  export type AssetCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<AssetCreateWithoutDepartmentInput, AssetUncheckedCreateWithoutDepartmentInput> | AssetCreateWithoutDepartmentInput[] | AssetUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutDepartmentInput | AssetCreateOrConnectWithoutDepartmentInput[]
    createMany?: AssetCreateManyDepartmentInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type AssetRecordCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<AssetRecordCreateWithoutDepartmentInput, AssetRecordUncheckedCreateWithoutDepartmentInput> | AssetRecordCreateWithoutDepartmentInput[] | AssetRecordUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutDepartmentInput | AssetRecordCreateOrConnectWithoutDepartmentInput[]
    createMany?: AssetRecordCreateManyDepartmentInputEnvelope
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
  }

  export type AssetUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<AssetCreateWithoutDepartmentInput, AssetUncheckedCreateWithoutDepartmentInput> | AssetCreateWithoutDepartmentInput[] | AssetUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutDepartmentInput | AssetCreateOrConnectWithoutDepartmentInput[]
    createMany?: AssetCreateManyDepartmentInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type AssetRecordUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<AssetRecordCreateWithoutDepartmentInput, AssetRecordUncheckedCreateWithoutDepartmentInput> | AssetRecordCreateWithoutDepartmentInput[] | AssetRecordUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutDepartmentInput | AssetRecordCreateOrConnectWithoutDepartmentInput[]
    createMany?: AssetRecordCreateManyDepartmentInputEnvelope
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
  }

  export type AssetUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<AssetCreateWithoutDepartmentInput, AssetUncheckedCreateWithoutDepartmentInput> | AssetCreateWithoutDepartmentInput[] | AssetUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutDepartmentInput | AssetCreateOrConnectWithoutDepartmentInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutDepartmentInput | AssetUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: AssetCreateManyDepartmentInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutDepartmentInput | AssetUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutDepartmentInput | AssetUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type AssetRecordUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<AssetRecordCreateWithoutDepartmentInput, AssetRecordUncheckedCreateWithoutDepartmentInput> | AssetRecordCreateWithoutDepartmentInput[] | AssetRecordUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutDepartmentInput | AssetRecordCreateOrConnectWithoutDepartmentInput[]
    upsert?: AssetRecordUpsertWithWhereUniqueWithoutDepartmentInput | AssetRecordUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: AssetRecordCreateManyDepartmentInputEnvelope
    set?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    disconnect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    delete?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    update?: AssetRecordUpdateWithWhereUniqueWithoutDepartmentInput | AssetRecordUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: AssetRecordUpdateManyWithWhereWithoutDepartmentInput | AssetRecordUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: AssetRecordScalarWhereInput | AssetRecordScalarWhereInput[]
  }

  export type AssetUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<AssetCreateWithoutDepartmentInput, AssetUncheckedCreateWithoutDepartmentInput> | AssetCreateWithoutDepartmentInput[] | AssetUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutDepartmentInput | AssetCreateOrConnectWithoutDepartmentInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutDepartmentInput | AssetUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: AssetCreateManyDepartmentInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutDepartmentInput | AssetUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutDepartmentInput | AssetUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type AssetRecordUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<AssetRecordCreateWithoutDepartmentInput, AssetRecordUncheckedCreateWithoutDepartmentInput> | AssetRecordCreateWithoutDepartmentInput[] | AssetRecordUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutDepartmentInput | AssetRecordCreateOrConnectWithoutDepartmentInput[]
    upsert?: AssetRecordUpsertWithWhereUniqueWithoutDepartmentInput | AssetRecordUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: AssetRecordCreateManyDepartmentInputEnvelope
    set?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    disconnect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    delete?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    update?: AssetRecordUpdateWithWhereUniqueWithoutDepartmentInput | AssetRecordUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: AssetRecordUpdateManyWithWhereWithoutDepartmentInput | AssetRecordUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: AssetRecordScalarWhereInput | AssetRecordScalarWhereInput[]
  }

  export type AssetCreateNestedManyWithoutTemplateInput = {
    create?: XOR<AssetCreateWithoutTemplateInput, AssetUncheckedCreateWithoutTemplateInput> | AssetCreateWithoutTemplateInput[] | AssetUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutTemplateInput | AssetCreateOrConnectWithoutTemplateInput[]
    createMany?: AssetCreateManyTemplateInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type AssetUncheckedCreateNestedManyWithoutTemplateInput = {
    create?: XOR<AssetCreateWithoutTemplateInput, AssetUncheckedCreateWithoutTemplateInput> | AssetCreateWithoutTemplateInput[] | AssetUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutTemplateInput | AssetCreateOrConnectWithoutTemplateInput[]
    createMany?: AssetCreateManyTemplateInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type EnumDeviceTypeFieldUpdateOperationsInput = {
    set?: $Enums.DeviceType
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type AssetUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<AssetCreateWithoutTemplateInput, AssetUncheckedCreateWithoutTemplateInput> | AssetCreateWithoutTemplateInput[] | AssetUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutTemplateInput | AssetCreateOrConnectWithoutTemplateInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutTemplateInput | AssetUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: AssetCreateManyTemplateInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutTemplateInput | AssetUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutTemplateInput | AssetUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type AssetUncheckedUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<AssetCreateWithoutTemplateInput, AssetUncheckedCreateWithoutTemplateInput> | AssetCreateWithoutTemplateInput[] | AssetUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutTemplateInput | AssetCreateOrConnectWithoutTemplateInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutTemplateInput | AssetUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: AssetCreateManyTemplateInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutTemplateInput | AssetUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutTemplateInput | AssetUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type AssetTemplateCreateNestedOneWithoutAssetsInput = {
    create?: XOR<AssetTemplateCreateWithoutAssetsInput, AssetTemplateUncheckedCreateWithoutAssetsInput>
    connectOrCreate?: AssetTemplateCreateOrConnectWithoutAssetsInput
    connect?: AssetTemplateWhereUniqueInput
  }

  export type DepartmentCreateNestedOneWithoutAssetsInput = {
    create?: XOR<DepartmentCreateWithoutAssetsInput, DepartmentUncheckedCreateWithoutAssetsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutAssetsInput
    connect?: DepartmentWhereUniqueInput
  }

  export type AssetRecordCreateNestedManyWithoutAssetInput = {
    create?: XOR<AssetRecordCreateWithoutAssetInput, AssetRecordUncheckedCreateWithoutAssetInput> | AssetRecordCreateWithoutAssetInput[] | AssetRecordUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutAssetInput | AssetRecordCreateOrConnectWithoutAssetInput[]
    createMany?: AssetRecordCreateManyAssetInputEnvelope
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
  }

  export type RepairRecordCreateNestedManyWithoutAssetInput = {
    create?: XOR<RepairRecordCreateWithoutAssetInput, RepairRecordUncheckedCreateWithoutAssetInput> | RepairRecordCreateWithoutAssetInput[] | RepairRecordUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: RepairRecordCreateOrConnectWithoutAssetInput | RepairRecordCreateOrConnectWithoutAssetInput[]
    createMany?: RepairRecordCreateManyAssetInputEnvelope
    connect?: RepairRecordWhereUniqueInput | RepairRecordWhereUniqueInput[]
  }

  export type AssetRecordUncheckedCreateNestedManyWithoutAssetInput = {
    create?: XOR<AssetRecordCreateWithoutAssetInput, AssetRecordUncheckedCreateWithoutAssetInput> | AssetRecordCreateWithoutAssetInput[] | AssetRecordUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutAssetInput | AssetRecordCreateOrConnectWithoutAssetInput[]
    createMany?: AssetRecordCreateManyAssetInputEnvelope
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
  }

  export type RepairRecordUncheckedCreateNestedManyWithoutAssetInput = {
    create?: XOR<RepairRecordCreateWithoutAssetInput, RepairRecordUncheckedCreateWithoutAssetInput> | RepairRecordCreateWithoutAssetInput[] | RepairRecordUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: RepairRecordCreateOrConnectWithoutAssetInput | RepairRecordCreateOrConnectWithoutAssetInput[]
    createMany?: RepairRecordCreateManyAssetInputEnvelope
    connect?: RepairRecordWhereUniqueInput | RepairRecordWhereUniqueInput[]
  }

  export type EnumAssetStatusFieldUpdateOperationsInput = {
    set?: $Enums.AssetStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AssetTemplateUpdateOneWithoutAssetsNestedInput = {
    create?: XOR<AssetTemplateCreateWithoutAssetsInput, AssetTemplateUncheckedCreateWithoutAssetsInput>
    connectOrCreate?: AssetTemplateCreateOrConnectWithoutAssetsInput
    upsert?: AssetTemplateUpsertWithoutAssetsInput
    disconnect?: AssetTemplateWhereInput | boolean
    delete?: AssetTemplateWhereInput | boolean
    connect?: AssetTemplateWhereUniqueInput
    update?: XOR<XOR<AssetTemplateUpdateToOneWithWhereWithoutAssetsInput, AssetTemplateUpdateWithoutAssetsInput>, AssetTemplateUncheckedUpdateWithoutAssetsInput>
  }

  export type DepartmentUpdateOneRequiredWithoutAssetsNestedInput = {
    create?: XOR<DepartmentCreateWithoutAssetsInput, DepartmentUncheckedCreateWithoutAssetsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutAssetsInput
    upsert?: DepartmentUpsertWithoutAssetsInput
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutAssetsInput, DepartmentUpdateWithoutAssetsInput>, DepartmentUncheckedUpdateWithoutAssetsInput>
  }

  export type AssetRecordUpdateManyWithoutAssetNestedInput = {
    create?: XOR<AssetRecordCreateWithoutAssetInput, AssetRecordUncheckedCreateWithoutAssetInput> | AssetRecordCreateWithoutAssetInput[] | AssetRecordUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutAssetInput | AssetRecordCreateOrConnectWithoutAssetInput[]
    upsert?: AssetRecordUpsertWithWhereUniqueWithoutAssetInput | AssetRecordUpsertWithWhereUniqueWithoutAssetInput[]
    createMany?: AssetRecordCreateManyAssetInputEnvelope
    set?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    disconnect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    delete?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    update?: AssetRecordUpdateWithWhereUniqueWithoutAssetInput | AssetRecordUpdateWithWhereUniqueWithoutAssetInput[]
    updateMany?: AssetRecordUpdateManyWithWhereWithoutAssetInput | AssetRecordUpdateManyWithWhereWithoutAssetInput[]
    deleteMany?: AssetRecordScalarWhereInput | AssetRecordScalarWhereInput[]
  }

  export type RepairRecordUpdateManyWithoutAssetNestedInput = {
    create?: XOR<RepairRecordCreateWithoutAssetInput, RepairRecordUncheckedCreateWithoutAssetInput> | RepairRecordCreateWithoutAssetInput[] | RepairRecordUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: RepairRecordCreateOrConnectWithoutAssetInput | RepairRecordCreateOrConnectWithoutAssetInput[]
    upsert?: RepairRecordUpsertWithWhereUniqueWithoutAssetInput | RepairRecordUpsertWithWhereUniqueWithoutAssetInput[]
    createMany?: RepairRecordCreateManyAssetInputEnvelope
    set?: RepairRecordWhereUniqueInput | RepairRecordWhereUniqueInput[]
    disconnect?: RepairRecordWhereUniqueInput | RepairRecordWhereUniqueInput[]
    delete?: RepairRecordWhereUniqueInput | RepairRecordWhereUniqueInput[]
    connect?: RepairRecordWhereUniqueInput | RepairRecordWhereUniqueInput[]
    update?: RepairRecordUpdateWithWhereUniqueWithoutAssetInput | RepairRecordUpdateWithWhereUniqueWithoutAssetInput[]
    updateMany?: RepairRecordUpdateManyWithWhereWithoutAssetInput | RepairRecordUpdateManyWithWhereWithoutAssetInput[]
    deleteMany?: RepairRecordScalarWhereInput | RepairRecordScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AssetRecordUncheckedUpdateManyWithoutAssetNestedInput = {
    create?: XOR<AssetRecordCreateWithoutAssetInput, AssetRecordUncheckedCreateWithoutAssetInput> | AssetRecordCreateWithoutAssetInput[] | AssetRecordUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: AssetRecordCreateOrConnectWithoutAssetInput | AssetRecordCreateOrConnectWithoutAssetInput[]
    upsert?: AssetRecordUpsertWithWhereUniqueWithoutAssetInput | AssetRecordUpsertWithWhereUniqueWithoutAssetInput[]
    createMany?: AssetRecordCreateManyAssetInputEnvelope
    set?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    disconnect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    delete?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    connect?: AssetRecordWhereUniqueInput | AssetRecordWhereUniqueInput[]
    update?: AssetRecordUpdateWithWhereUniqueWithoutAssetInput | AssetRecordUpdateWithWhereUniqueWithoutAssetInput[]
    updateMany?: AssetRecordUpdateManyWithWhereWithoutAssetInput | AssetRecordUpdateManyWithWhereWithoutAssetInput[]
    deleteMany?: AssetRecordScalarWhereInput | AssetRecordScalarWhereInput[]
  }

  export type RepairRecordUncheckedUpdateManyWithoutAssetNestedInput = {
    create?: XOR<RepairRecordCreateWithoutAssetInput, RepairRecordUncheckedCreateWithoutAssetInput> | RepairRecordCreateWithoutAssetInput[] | RepairRecordUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: RepairRecordCreateOrConnectWithoutAssetInput | RepairRecordCreateOrConnectWithoutAssetInput[]
    upsert?: RepairRecordUpsertWithWhereUniqueWithoutAssetInput | RepairRecordUpsertWithWhereUniqueWithoutAssetInput[]
    createMany?: RepairRecordCreateManyAssetInputEnvelope
    set?: RepairRecordWhereUniqueInput | RepairRecordWhereUniqueInput[]
    disconnect?: RepairRecordWhereUniqueInput | RepairRecordWhereUniqueInput[]
    delete?: RepairRecordWhereUniqueInput | RepairRecordWhereUniqueInput[]
    connect?: RepairRecordWhereUniqueInput | RepairRecordWhereUniqueInput[]
    update?: RepairRecordUpdateWithWhereUniqueWithoutAssetInput | RepairRecordUpdateWithWhereUniqueWithoutAssetInput[]
    updateMany?: RepairRecordUpdateManyWithWhereWithoutAssetInput | RepairRecordUpdateManyWithWhereWithoutAssetInput[]
    deleteMany?: RepairRecordScalarWhereInput | RepairRecordScalarWhereInput[]
  }

  export type AssetCreateNestedOneWithoutRecordsInput = {
    create?: XOR<AssetCreateWithoutRecordsInput, AssetUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: AssetCreateOrConnectWithoutRecordsInput
    connect?: AssetWhereUniqueInput
  }

  export type DepartmentCreateNestedOneWithoutRecordsInput = {
    create?: XOR<DepartmentCreateWithoutRecordsInput, DepartmentUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutRecordsInput
    connect?: DepartmentWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAssetRecordsInput = {
    create?: XOR<UserCreateWithoutAssetRecordsInput, UserUncheckedCreateWithoutAssetRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssetRecordsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumAssetRecordActionFieldUpdateOperationsInput = {
    set?: $Enums.AssetRecordAction
  }

  export type AssetUpdateOneRequiredWithoutRecordsNestedInput = {
    create?: XOR<AssetCreateWithoutRecordsInput, AssetUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: AssetCreateOrConnectWithoutRecordsInput
    upsert?: AssetUpsertWithoutRecordsInput
    connect?: AssetWhereUniqueInput
    update?: XOR<XOR<AssetUpdateToOneWithWhereWithoutRecordsInput, AssetUpdateWithoutRecordsInput>, AssetUncheckedUpdateWithoutRecordsInput>
  }

  export type DepartmentUpdateOneRequiredWithoutRecordsNestedInput = {
    create?: XOR<DepartmentCreateWithoutRecordsInput, DepartmentUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutRecordsInput
    upsert?: DepartmentUpsertWithoutRecordsInput
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutRecordsInput, DepartmentUpdateWithoutRecordsInput>, DepartmentUncheckedUpdateWithoutRecordsInput>
  }

  export type UserUpdateOneRequiredWithoutAssetRecordsNestedInput = {
    create?: XOR<UserCreateWithoutAssetRecordsInput, UserUncheckedCreateWithoutAssetRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssetRecordsInput
    upsert?: UserUpsertWithoutAssetRecordsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAssetRecordsInput, UserUpdateWithoutAssetRecordsInput>, UserUncheckedUpdateWithoutAssetRecordsInput>
  }

  export type AssetCreateNestedOneWithoutRepairRecordsInput = {
    create?: XOR<AssetCreateWithoutRepairRecordsInput, AssetUncheckedCreateWithoutRepairRecordsInput>
    connectOrCreate?: AssetCreateOrConnectWithoutRepairRecordsInput
    connect?: AssetWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumRepairResultFieldUpdateOperationsInput = {
    set?: $Enums.RepairResult
  }

  export type AssetUpdateOneRequiredWithoutRepairRecordsNestedInput = {
    create?: XOR<AssetCreateWithoutRepairRecordsInput, AssetUncheckedCreateWithoutRepairRecordsInput>
    connectOrCreate?: AssetCreateOrConnectWithoutRepairRecordsInput
    upsert?: AssetUpsertWithoutRepairRecordsInput
    connect?: AssetWhereUniqueInput
    update?: XOR<XOR<AssetUpdateToOneWithWhereWithoutRepairRecordsInput, AssetUpdateWithoutRepairRecordsInput>, AssetUncheckedUpdateWithoutRepairRecordsInput>
  }

  export type UserCreateNestedOneWithoutOperatorLogsInput = {
    create?: XOR<UserCreateWithoutOperatorLogsInput, UserUncheckedCreateWithoutOperatorLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOperatorLogsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutOperatorLogsNestedInput = {
    create?: XOR<UserCreateWithoutOperatorLogsInput, UserUncheckedCreateWithoutOperatorLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOperatorLogsInput
    upsert?: UserUpsertWithoutOperatorLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOperatorLogsInput, UserUpdateWithoutOperatorLogsInput>, UserUncheckedUpdateWithoutOperatorLogsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumDeviceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[]
    notIn?: $Enums.DeviceType[]
    not?: NestedEnumDeviceTypeFilter<$PrismaModel> | $Enums.DeviceType
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[]
    notIn?: $Enums.DeviceType[]
    not?: NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel> | $Enums.DeviceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceTypeFilter<$PrismaModel>
    _max?: NestedEnumDeviceTypeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumAssetStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[]
    notIn?: $Enums.AssetStatus[]
    not?: NestedEnumAssetStatusFilter<$PrismaModel> | $Enums.AssetStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumAssetStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[]
    notIn?: $Enums.AssetStatus[]
    not?: NestedEnumAssetStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssetStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetStatusFilter<$PrismaModel>
    _max?: NestedEnumAssetStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumAssetRecordActionFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetRecordAction | EnumAssetRecordActionFieldRefInput<$PrismaModel>
    in?: $Enums.AssetRecordAction[]
    notIn?: $Enums.AssetRecordAction[]
    not?: NestedEnumAssetRecordActionFilter<$PrismaModel> | $Enums.AssetRecordAction
  }

  export type NestedEnumAssetRecordActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetRecordAction | EnumAssetRecordActionFieldRefInput<$PrismaModel>
    in?: $Enums.AssetRecordAction[]
    notIn?: $Enums.AssetRecordAction[]
    not?: NestedEnumAssetRecordActionWithAggregatesFilter<$PrismaModel> | $Enums.AssetRecordAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetRecordActionFilter<$PrismaModel>
    _max?: NestedEnumAssetRecordActionFilter<$PrismaModel>
  }

  export type NestedEnumRepairResultFilter<$PrismaModel = never> = {
    equals?: $Enums.RepairResult | EnumRepairResultFieldRefInput<$PrismaModel>
    in?: $Enums.RepairResult[]
    notIn?: $Enums.RepairResult[]
    not?: NestedEnumRepairResultFilter<$PrismaModel> | $Enums.RepairResult
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumRepairResultWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RepairResult | EnumRepairResultFieldRefInput<$PrismaModel>
    in?: $Enums.RepairResult[]
    notIn?: $Enums.RepairResult[]
    not?: NestedEnumRepairResultWithAggregatesFilter<$PrismaModel> | $Enums.RepairResult
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRepairResultFilter<$PrismaModel>
    _max?: NestedEnumRepairResultFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type OperationLogCreateWithoutOperatorInput = {
    action: string
    targetType: string
    targetId: number
    detail: JsonNullValueInput | InputJsonValue
    ipAddress: string
    createdAt?: Date | string
  }

  export type OperationLogUncheckedCreateWithoutOperatorInput = {
    id?: number
    action: string
    targetType: string
    targetId: number
    detail: JsonNullValueInput | InputJsonValue
    ipAddress: string
    createdAt?: Date | string
  }

  export type OperationLogCreateOrConnectWithoutOperatorInput = {
    where: OperationLogWhereUniqueInput
    create: XOR<OperationLogCreateWithoutOperatorInput, OperationLogUncheckedCreateWithoutOperatorInput>
  }

  export type OperationLogCreateManyOperatorInputEnvelope = {
    data: OperationLogCreateManyOperatorInput | OperationLogCreateManyOperatorInput[]
  }

  export type AssetRecordCreateWithoutOperatorInput = {
    action: $Enums.AssetRecordAction
    userName: string
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    requestId: string
    createdAt?: Date | string
    asset: AssetCreateNestedOneWithoutRecordsInput
    department: DepartmentCreateNestedOneWithoutRecordsInput
  }

  export type AssetRecordUncheckedCreateWithoutOperatorInput = {
    id?: number
    assetId: number
    action: $Enums.AssetRecordAction
    userName: string
    departmentId: number
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    requestId: string
    createdAt?: Date | string
  }

  export type AssetRecordCreateOrConnectWithoutOperatorInput = {
    where: AssetRecordWhereUniqueInput
    create: XOR<AssetRecordCreateWithoutOperatorInput, AssetRecordUncheckedCreateWithoutOperatorInput>
  }

  export type AssetRecordCreateManyOperatorInputEnvelope = {
    data: AssetRecordCreateManyOperatorInput | AssetRecordCreateManyOperatorInput[]
  }

  export type OperationLogUpsertWithWhereUniqueWithoutOperatorInput = {
    where: OperationLogWhereUniqueInput
    update: XOR<OperationLogUpdateWithoutOperatorInput, OperationLogUncheckedUpdateWithoutOperatorInput>
    create: XOR<OperationLogCreateWithoutOperatorInput, OperationLogUncheckedCreateWithoutOperatorInput>
  }

  export type OperationLogUpdateWithWhereUniqueWithoutOperatorInput = {
    where: OperationLogWhereUniqueInput
    data: XOR<OperationLogUpdateWithoutOperatorInput, OperationLogUncheckedUpdateWithoutOperatorInput>
  }

  export type OperationLogUpdateManyWithWhereWithoutOperatorInput = {
    where: OperationLogScalarWhereInput
    data: XOR<OperationLogUpdateManyMutationInput, OperationLogUncheckedUpdateManyWithoutOperatorInput>
  }

  export type OperationLogScalarWhereInput = {
    AND?: OperationLogScalarWhereInput | OperationLogScalarWhereInput[]
    OR?: OperationLogScalarWhereInput[]
    NOT?: OperationLogScalarWhereInput | OperationLogScalarWhereInput[]
    id?: IntFilter<"OperationLog"> | number
    operatorId?: IntFilter<"OperationLog"> | number
    action?: StringFilter<"OperationLog"> | string
    targetType?: StringFilter<"OperationLog"> | string
    targetId?: IntFilter<"OperationLog"> | number
    detail?: JsonFilter<"OperationLog">
    ipAddress?: StringFilter<"OperationLog"> | string
    createdAt?: DateTimeFilter<"OperationLog"> | Date | string
  }

  export type AssetRecordUpsertWithWhereUniqueWithoutOperatorInput = {
    where: AssetRecordWhereUniqueInput
    update: XOR<AssetRecordUpdateWithoutOperatorInput, AssetRecordUncheckedUpdateWithoutOperatorInput>
    create: XOR<AssetRecordCreateWithoutOperatorInput, AssetRecordUncheckedCreateWithoutOperatorInput>
  }

  export type AssetRecordUpdateWithWhereUniqueWithoutOperatorInput = {
    where: AssetRecordWhereUniqueInput
    data: XOR<AssetRecordUpdateWithoutOperatorInput, AssetRecordUncheckedUpdateWithoutOperatorInput>
  }

  export type AssetRecordUpdateManyWithWhereWithoutOperatorInput = {
    where: AssetRecordScalarWhereInput
    data: XOR<AssetRecordUpdateManyMutationInput, AssetRecordUncheckedUpdateManyWithoutOperatorInput>
  }

  export type AssetRecordScalarWhereInput = {
    AND?: AssetRecordScalarWhereInput | AssetRecordScalarWhereInput[]
    OR?: AssetRecordScalarWhereInput[]
    NOT?: AssetRecordScalarWhereInput | AssetRecordScalarWhereInput[]
    id?: IntFilter<"AssetRecord"> | number
    assetId?: IntFilter<"AssetRecord"> | number
    action?: EnumAssetRecordActionFilter<"AssetRecord"> | $Enums.AssetRecordAction
    userName?: StringFilter<"AssetRecord"> | string
    departmentId?: IntFilter<"AssetRecord"> | number
    actionDate?: DateTimeFilter<"AssetRecord"> | Date | string
    expectedReturnDate?: DateTimeNullableFilter<"AssetRecord"> | Date | string | null
    proofImage?: StringNullableFilter<"AssetRecord"> | string | null
    remark?: StringNullableFilter<"AssetRecord"> | string | null
    operatorId?: IntFilter<"AssetRecord"> | number
    requestId?: StringFilter<"AssetRecord"> | string
    createdAt?: DateTimeFilter<"AssetRecord"> | Date | string
  }

  export type AssetCreateWithoutDepartmentInput = {
    assetCode: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
    template?: AssetTemplateCreateNestedOneWithoutAssetsInput
    records?: AssetRecordCreateNestedManyWithoutAssetInput
    repairRecords?: RepairRecordCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateWithoutDepartmentInput = {
    id?: number
    assetCode: string
    templateId?: number | null
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
    records?: AssetRecordUncheckedCreateNestedManyWithoutAssetInput
    repairRecords?: RepairRecordUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetCreateOrConnectWithoutDepartmentInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutDepartmentInput, AssetUncheckedCreateWithoutDepartmentInput>
  }

  export type AssetCreateManyDepartmentInputEnvelope = {
    data: AssetCreateManyDepartmentInput | AssetCreateManyDepartmentInput[]
  }

  export type AssetRecordCreateWithoutDepartmentInput = {
    action: $Enums.AssetRecordAction
    userName: string
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    requestId: string
    createdAt?: Date | string
    asset: AssetCreateNestedOneWithoutRecordsInput
    operator: UserCreateNestedOneWithoutAssetRecordsInput
  }

  export type AssetRecordUncheckedCreateWithoutDepartmentInput = {
    id?: number
    assetId: number
    action: $Enums.AssetRecordAction
    userName: string
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    operatorId: number
    requestId: string
    createdAt?: Date | string
  }

  export type AssetRecordCreateOrConnectWithoutDepartmentInput = {
    where: AssetRecordWhereUniqueInput
    create: XOR<AssetRecordCreateWithoutDepartmentInput, AssetRecordUncheckedCreateWithoutDepartmentInput>
  }

  export type AssetRecordCreateManyDepartmentInputEnvelope = {
    data: AssetRecordCreateManyDepartmentInput | AssetRecordCreateManyDepartmentInput[]
  }

  export type AssetUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: AssetWhereUniqueInput
    update: XOR<AssetUpdateWithoutDepartmentInput, AssetUncheckedUpdateWithoutDepartmentInput>
    create: XOR<AssetCreateWithoutDepartmentInput, AssetUncheckedCreateWithoutDepartmentInput>
  }

  export type AssetUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: AssetWhereUniqueInput
    data: XOR<AssetUpdateWithoutDepartmentInput, AssetUncheckedUpdateWithoutDepartmentInput>
  }

  export type AssetUpdateManyWithWhereWithoutDepartmentInput = {
    where: AssetScalarWhereInput
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type AssetScalarWhereInput = {
    AND?: AssetScalarWhereInput | AssetScalarWhereInput[]
    OR?: AssetScalarWhereInput[]
    NOT?: AssetScalarWhereInput | AssetScalarWhereInput[]
    id?: IntFilter<"Asset"> | number
    assetCode?: StringFilter<"Asset"> | string
    templateId?: IntNullableFilter<"Asset"> | number | null
    deviceType?: EnumDeviceTypeFilter<"Asset"> | $Enums.DeviceType
    brand?: StringFilter<"Asset"> | string
    model?: StringFilter<"Asset"> | string
    serialNumber?: StringFilter<"Asset"> | string
    os?: StringFilter<"Asset"> | string
    cpu?: StringFilter<"Asset"> | string
    memory?: StringFilter<"Asset"> | string
    storage?: StringFilter<"Asset"> | string
    status?: EnumAssetStatusFilter<"Asset"> | $Enums.AssetStatus
    currentUserName?: StringFilter<"Asset"> | string
    departmentId?: IntFilter<"Asset"> | number
    purchaseDate?: DateTimeFilter<"Asset"> | Date | string
    warrantyExpiry?: DateTimeNullableFilter<"Asset"> | Date | string | null
    remark?: StringNullableFilter<"Asset"> | string | null
    version?: IntFilter<"Asset"> | number
  }

  export type AssetRecordUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: AssetRecordWhereUniqueInput
    update: XOR<AssetRecordUpdateWithoutDepartmentInput, AssetRecordUncheckedUpdateWithoutDepartmentInput>
    create: XOR<AssetRecordCreateWithoutDepartmentInput, AssetRecordUncheckedCreateWithoutDepartmentInput>
  }

  export type AssetRecordUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: AssetRecordWhereUniqueInput
    data: XOR<AssetRecordUpdateWithoutDepartmentInput, AssetRecordUncheckedUpdateWithoutDepartmentInput>
  }

  export type AssetRecordUpdateManyWithWhereWithoutDepartmentInput = {
    where: AssetRecordScalarWhereInput
    data: XOR<AssetRecordUpdateManyMutationInput, AssetRecordUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type AssetCreateWithoutTemplateInput = {
    assetCode: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
    department: DepartmentCreateNestedOneWithoutAssetsInput
    records?: AssetRecordCreateNestedManyWithoutAssetInput
    repairRecords?: RepairRecordCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateWithoutTemplateInput = {
    id?: number
    assetCode: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    departmentId: number
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
    records?: AssetRecordUncheckedCreateNestedManyWithoutAssetInput
    repairRecords?: RepairRecordUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetCreateOrConnectWithoutTemplateInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutTemplateInput, AssetUncheckedCreateWithoutTemplateInput>
  }

  export type AssetCreateManyTemplateInputEnvelope = {
    data: AssetCreateManyTemplateInput | AssetCreateManyTemplateInput[]
  }

  export type AssetUpsertWithWhereUniqueWithoutTemplateInput = {
    where: AssetWhereUniqueInput
    update: XOR<AssetUpdateWithoutTemplateInput, AssetUncheckedUpdateWithoutTemplateInput>
    create: XOR<AssetCreateWithoutTemplateInput, AssetUncheckedCreateWithoutTemplateInput>
  }

  export type AssetUpdateWithWhereUniqueWithoutTemplateInput = {
    where: AssetWhereUniqueInput
    data: XOR<AssetUpdateWithoutTemplateInput, AssetUncheckedUpdateWithoutTemplateInput>
  }

  export type AssetUpdateManyWithWhereWithoutTemplateInput = {
    where: AssetScalarWhereInput
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyWithoutTemplateInput>
  }

  export type AssetTemplateCreateWithoutAssetsInput = {
    name: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    os: string
    cpu: string
    memory: string
    storage: string
    remark?: string | null
    isActive?: boolean
    sortOrder: number
  }

  export type AssetTemplateUncheckedCreateWithoutAssetsInput = {
    id?: number
    name: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    os: string
    cpu: string
    memory: string
    storage: string
    remark?: string | null
    isActive?: boolean
    sortOrder: number
  }

  export type AssetTemplateCreateOrConnectWithoutAssetsInput = {
    where: AssetTemplateWhereUniqueInput
    create: XOR<AssetTemplateCreateWithoutAssetsInput, AssetTemplateUncheckedCreateWithoutAssetsInput>
  }

  export type DepartmentCreateWithoutAssetsInput = {
    name: string
    sortOrder: number
    isActive?: boolean
    records?: AssetRecordCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateWithoutAssetsInput = {
    id?: number
    name: string
    sortOrder: number
    isActive?: boolean
    records?: AssetRecordUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentCreateOrConnectWithoutAssetsInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutAssetsInput, DepartmentUncheckedCreateWithoutAssetsInput>
  }

  export type AssetRecordCreateWithoutAssetInput = {
    action: $Enums.AssetRecordAction
    userName: string
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    requestId: string
    createdAt?: Date | string
    department: DepartmentCreateNestedOneWithoutRecordsInput
    operator: UserCreateNestedOneWithoutAssetRecordsInput
  }

  export type AssetRecordUncheckedCreateWithoutAssetInput = {
    id?: number
    action: $Enums.AssetRecordAction
    userName: string
    departmentId: number
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    operatorId: number
    requestId: string
    createdAt?: Date | string
  }

  export type AssetRecordCreateOrConnectWithoutAssetInput = {
    where: AssetRecordWhereUniqueInput
    create: XOR<AssetRecordCreateWithoutAssetInput, AssetRecordUncheckedCreateWithoutAssetInput>
  }

  export type AssetRecordCreateManyAssetInputEnvelope = {
    data: AssetRecordCreateManyAssetInput | AssetRecordCreateManyAssetInput[]
  }

  export type RepairRecordCreateWithoutAssetInput = {
    faultDescription: string
    repairVendor: string
    repairCost: number
    repairResult: $Enums.RepairResult
    startDate: Date | string
    endDate: Date | string
    remark?: string | null
  }

  export type RepairRecordUncheckedCreateWithoutAssetInput = {
    id?: number
    faultDescription: string
    repairVendor: string
    repairCost: number
    repairResult: $Enums.RepairResult
    startDate: Date | string
    endDate: Date | string
    remark?: string | null
  }

  export type RepairRecordCreateOrConnectWithoutAssetInput = {
    where: RepairRecordWhereUniqueInput
    create: XOR<RepairRecordCreateWithoutAssetInput, RepairRecordUncheckedCreateWithoutAssetInput>
  }

  export type RepairRecordCreateManyAssetInputEnvelope = {
    data: RepairRecordCreateManyAssetInput | RepairRecordCreateManyAssetInput[]
  }

  export type AssetTemplateUpsertWithoutAssetsInput = {
    update: XOR<AssetTemplateUpdateWithoutAssetsInput, AssetTemplateUncheckedUpdateWithoutAssetsInput>
    create: XOR<AssetTemplateCreateWithoutAssetsInput, AssetTemplateUncheckedCreateWithoutAssetsInput>
    where?: AssetTemplateWhereInput
  }

  export type AssetTemplateUpdateToOneWithWhereWithoutAssetsInput = {
    where?: AssetTemplateWhereInput
    data: XOR<AssetTemplateUpdateWithoutAssetsInput, AssetTemplateUncheckedUpdateWithoutAssetsInput>
  }

  export type AssetTemplateUpdateWithoutAssetsInput = {
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type AssetTemplateUncheckedUpdateWithoutAssetsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type DepartmentUpsertWithoutAssetsInput = {
    update: XOR<DepartmentUpdateWithoutAssetsInput, DepartmentUncheckedUpdateWithoutAssetsInput>
    create: XOR<DepartmentCreateWithoutAssetsInput, DepartmentUncheckedCreateWithoutAssetsInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutAssetsInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutAssetsInput, DepartmentUncheckedUpdateWithoutAssetsInput>
  }

  export type DepartmentUpdateWithoutAssetsInput = {
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    records?: AssetRecordUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutAssetsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    records?: AssetRecordUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type AssetRecordUpsertWithWhereUniqueWithoutAssetInput = {
    where: AssetRecordWhereUniqueInput
    update: XOR<AssetRecordUpdateWithoutAssetInput, AssetRecordUncheckedUpdateWithoutAssetInput>
    create: XOR<AssetRecordCreateWithoutAssetInput, AssetRecordUncheckedCreateWithoutAssetInput>
  }

  export type AssetRecordUpdateWithWhereUniqueWithoutAssetInput = {
    where: AssetRecordWhereUniqueInput
    data: XOR<AssetRecordUpdateWithoutAssetInput, AssetRecordUncheckedUpdateWithoutAssetInput>
  }

  export type AssetRecordUpdateManyWithWhereWithoutAssetInput = {
    where: AssetRecordScalarWhereInput
    data: XOR<AssetRecordUpdateManyMutationInput, AssetRecordUncheckedUpdateManyWithoutAssetInput>
  }

  export type RepairRecordUpsertWithWhereUniqueWithoutAssetInput = {
    where: RepairRecordWhereUniqueInput
    update: XOR<RepairRecordUpdateWithoutAssetInput, RepairRecordUncheckedUpdateWithoutAssetInput>
    create: XOR<RepairRecordCreateWithoutAssetInput, RepairRecordUncheckedCreateWithoutAssetInput>
  }

  export type RepairRecordUpdateWithWhereUniqueWithoutAssetInput = {
    where: RepairRecordWhereUniqueInput
    data: XOR<RepairRecordUpdateWithoutAssetInput, RepairRecordUncheckedUpdateWithoutAssetInput>
  }

  export type RepairRecordUpdateManyWithWhereWithoutAssetInput = {
    where: RepairRecordScalarWhereInput
    data: XOR<RepairRecordUpdateManyMutationInput, RepairRecordUncheckedUpdateManyWithoutAssetInput>
  }

  export type RepairRecordScalarWhereInput = {
    AND?: RepairRecordScalarWhereInput | RepairRecordScalarWhereInput[]
    OR?: RepairRecordScalarWhereInput[]
    NOT?: RepairRecordScalarWhereInput | RepairRecordScalarWhereInput[]
    id?: IntFilter<"RepairRecord"> | number
    assetId?: IntFilter<"RepairRecord"> | number
    faultDescription?: StringFilter<"RepairRecord"> | string
    repairVendor?: StringFilter<"RepairRecord"> | string
    repairCost?: FloatFilter<"RepairRecord"> | number
    repairResult?: EnumRepairResultFilter<"RepairRecord"> | $Enums.RepairResult
    startDate?: DateTimeFilter<"RepairRecord"> | Date | string
    endDate?: DateTimeFilter<"RepairRecord"> | Date | string
    remark?: StringNullableFilter<"RepairRecord"> | string | null
  }

  export type AssetCreateWithoutRecordsInput = {
    assetCode: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
    template?: AssetTemplateCreateNestedOneWithoutAssetsInput
    department: DepartmentCreateNestedOneWithoutAssetsInput
    repairRecords?: RepairRecordCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateWithoutRecordsInput = {
    id?: number
    assetCode: string
    templateId?: number | null
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    departmentId: number
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
    repairRecords?: RepairRecordUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetCreateOrConnectWithoutRecordsInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutRecordsInput, AssetUncheckedCreateWithoutRecordsInput>
  }

  export type DepartmentCreateWithoutRecordsInput = {
    name: string
    sortOrder: number
    isActive?: boolean
    assets?: AssetCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateWithoutRecordsInput = {
    id?: number
    name: string
    sortOrder: number
    isActive?: boolean
    assets?: AssetUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentCreateOrConnectWithoutRecordsInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutRecordsInput, DepartmentUncheckedCreateWithoutRecordsInput>
  }

  export type UserCreateWithoutAssetRecordsInput = {
    username: string
    password: string
    realName: string
    role: $Enums.Role
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    operatorLogs?: OperationLogCreateNestedManyWithoutOperatorInput
  }

  export type UserUncheckedCreateWithoutAssetRecordsInput = {
    id?: number
    username: string
    password: string
    realName: string
    role: $Enums.Role
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    operatorLogs?: OperationLogUncheckedCreateNestedManyWithoutOperatorInput
  }

  export type UserCreateOrConnectWithoutAssetRecordsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAssetRecordsInput, UserUncheckedCreateWithoutAssetRecordsInput>
  }

  export type AssetUpsertWithoutRecordsInput = {
    update: XOR<AssetUpdateWithoutRecordsInput, AssetUncheckedUpdateWithoutRecordsInput>
    create: XOR<AssetCreateWithoutRecordsInput, AssetUncheckedCreateWithoutRecordsInput>
    where?: AssetWhereInput
  }

  export type AssetUpdateToOneWithWhereWithoutRecordsInput = {
    where?: AssetWhereInput
    data: XOR<AssetUpdateWithoutRecordsInput, AssetUncheckedUpdateWithoutRecordsInput>
  }

  export type AssetUpdateWithoutRecordsInput = {
    assetCode?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    template?: AssetTemplateUpdateOneWithoutAssetsNestedInput
    department?: DepartmentUpdateOneRequiredWithoutAssetsNestedInput
    repairRecords?: RepairRecordUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateWithoutRecordsInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetCode?: StringFieldUpdateOperationsInput | string
    templateId?: NullableIntFieldUpdateOperationsInput | number | null
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    repairRecords?: RepairRecordUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type DepartmentUpsertWithoutRecordsInput = {
    update: XOR<DepartmentUpdateWithoutRecordsInput, DepartmentUncheckedUpdateWithoutRecordsInput>
    create: XOR<DepartmentCreateWithoutRecordsInput, DepartmentUncheckedCreateWithoutRecordsInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutRecordsInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutRecordsInput, DepartmentUncheckedUpdateWithoutRecordsInput>
  }

  export type DepartmentUpdateWithoutRecordsInput = {
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assets?: AssetUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutRecordsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assets?: AssetUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type UserUpsertWithoutAssetRecordsInput = {
    update: XOR<UserUpdateWithoutAssetRecordsInput, UserUncheckedUpdateWithoutAssetRecordsInput>
    create: XOR<UserCreateWithoutAssetRecordsInput, UserUncheckedCreateWithoutAssetRecordsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAssetRecordsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAssetRecordsInput, UserUncheckedUpdateWithoutAssetRecordsInput>
  }

  export type UserUpdateWithoutAssetRecordsInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    realName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mustChangePass?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorLogs?: OperationLogUpdateManyWithoutOperatorNestedInput
  }

  export type UserUncheckedUpdateWithoutAssetRecordsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    realName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mustChangePass?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorLogs?: OperationLogUncheckedUpdateManyWithoutOperatorNestedInput
  }

  export type AssetCreateWithoutRepairRecordsInput = {
    assetCode: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
    template?: AssetTemplateCreateNestedOneWithoutAssetsInput
    department: DepartmentCreateNestedOneWithoutAssetsInput
    records?: AssetRecordCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateWithoutRepairRecordsInput = {
    id?: number
    assetCode: string
    templateId?: number | null
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    departmentId: number
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
    records?: AssetRecordUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetCreateOrConnectWithoutRepairRecordsInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutRepairRecordsInput, AssetUncheckedCreateWithoutRepairRecordsInput>
  }

  export type AssetUpsertWithoutRepairRecordsInput = {
    update: XOR<AssetUpdateWithoutRepairRecordsInput, AssetUncheckedUpdateWithoutRepairRecordsInput>
    create: XOR<AssetCreateWithoutRepairRecordsInput, AssetUncheckedCreateWithoutRepairRecordsInput>
    where?: AssetWhereInput
  }

  export type AssetUpdateToOneWithWhereWithoutRepairRecordsInput = {
    where?: AssetWhereInput
    data: XOR<AssetUpdateWithoutRepairRecordsInput, AssetUncheckedUpdateWithoutRepairRecordsInput>
  }

  export type AssetUpdateWithoutRepairRecordsInput = {
    assetCode?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    template?: AssetTemplateUpdateOneWithoutAssetsNestedInput
    department?: DepartmentUpdateOneRequiredWithoutAssetsNestedInput
    records?: AssetRecordUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateWithoutRepairRecordsInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetCode?: StringFieldUpdateOperationsInput | string
    templateId?: NullableIntFieldUpdateOperationsInput | number | null
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    records?: AssetRecordUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type UserCreateWithoutOperatorLogsInput = {
    username: string
    password: string
    realName: string
    role: $Enums.Role
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    assetRecords?: AssetRecordCreateNestedManyWithoutOperatorInput
  }

  export type UserUncheckedCreateWithoutOperatorLogsInput = {
    id?: number
    username: string
    password: string
    realName: string
    role: $Enums.Role
    isActive?: boolean
    mustChangePass?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    assetRecords?: AssetRecordUncheckedCreateNestedManyWithoutOperatorInput
  }

  export type UserCreateOrConnectWithoutOperatorLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOperatorLogsInput, UserUncheckedCreateWithoutOperatorLogsInput>
  }

  export type UserUpsertWithoutOperatorLogsInput = {
    update: XOR<UserUpdateWithoutOperatorLogsInput, UserUncheckedUpdateWithoutOperatorLogsInput>
    create: XOR<UserCreateWithoutOperatorLogsInput, UserUncheckedCreateWithoutOperatorLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOperatorLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOperatorLogsInput, UserUncheckedUpdateWithoutOperatorLogsInput>
  }

  export type UserUpdateWithoutOperatorLogsInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    realName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mustChangePass?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assetRecords?: AssetRecordUpdateManyWithoutOperatorNestedInput
  }

  export type UserUncheckedUpdateWithoutOperatorLogsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    realName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mustChangePass?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assetRecords?: AssetRecordUncheckedUpdateManyWithoutOperatorNestedInput
  }

  export type OperationLogCreateManyOperatorInput = {
    id?: number
    action: string
    targetType: string
    targetId: number
    detail: JsonNullValueInput | InputJsonValue
    ipAddress: string
    createdAt?: Date | string
  }

  export type AssetRecordCreateManyOperatorInput = {
    id?: number
    assetId: number
    action: $Enums.AssetRecordAction
    userName: string
    departmentId: number
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    requestId: string
    createdAt?: Date | string
  }

  export type OperationLogUpdateWithoutOperatorInput = {
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: IntFieldUpdateOperationsInput | number
    detail?: JsonNullValueInput | InputJsonValue
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperationLogUncheckedUpdateWithoutOperatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: IntFieldUpdateOperationsInput | number
    detail?: JsonNullValueInput | InputJsonValue
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperationLogUncheckedUpdateManyWithoutOperatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: IntFieldUpdateOperationsInput | number
    detail?: JsonNullValueInput | InputJsonValue
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetRecordUpdateWithoutOperatorInput = {
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    asset?: AssetUpdateOneRequiredWithoutRecordsNestedInput
    department?: DepartmentUpdateOneRequiredWithoutRecordsNestedInput
  }

  export type AssetRecordUncheckedUpdateWithoutOperatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetId?: IntFieldUpdateOperationsInput | number
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetRecordUncheckedUpdateManyWithoutOperatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetId?: IntFieldUpdateOperationsInput | number
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetCreateManyDepartmentInput = {
    id?: number
    assetCode: string
    templateId?: number | null
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
  }

  export type AssetRecordCreateManyDepartmentInput = {
    id?: number
    assetId: number
    action: $Enums.AssetRecordAction
    userName: string
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    operatorId: number
    requestId: string
    createdAt?: Date | string
  }

  export type AssetUpdateWithoutDepartmentInput = {
    assetCode?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    template?: AssetTemplateUpdateOneWithoutAssetsNestedInput
    records?: AssetRecordUpdateManyWithoutAssetNestedInput
    repairRecords?: RepairRecordUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateWithoutDepartmentInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetCode?: StringFieldUpdateOperationsInput | string
    templateId?: NullableIntFieldUpdateOperationsInput | number | null
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    records?: AssetRecordUncheckedUpdateManyWithoutAssetNestedInput
    repairRecords?: RepairRecordUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateManyWithoutDepartmentInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetCode?: StringFieldUpdateOperationsInput | string
    templateId?: NullableIntFieldUpdateOperationsInput | number | null
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type AssetRecordUpdateWithoutDepartmentInput = {
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    asset?: AssetUpdateOneRequiredWithoutRecordsNestedInput
    operator?: UserUpdateOneRequiredWithoutAssetRecordsNestedInput
  }

  export type AssetRecordUncheckedUpdateWithoutDepartmentInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetId?: IntFieldUpdateOperationsInput | number
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    operatorId?: IntFieldUpdateOperationsInput | number
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetRecordUncheckedUpdateManyWithoutDepartmentInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetId?: IntFieldUpdateOperationsInput | number
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    operatorId?: IntFieldUpdateOperationsInput | number
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetCreateManyTemplateInput = {
    id?: number
    assetCode: string
    deviceType: $Enums.DeviceType
    brand: string
    model: string
    serialNumber: string
    os: string
    cpu: string
    memory: string
    storage: string
    status: $Enums.AssetStatus
    currentUserName: string
    departmentId: number
    purchaseDate: Date | string
    warrantyExpiry?: Date | string | null
    remark?: string | null
    version?: number
  }

  export type AssetUpdateWithoutTemplateInput = {
    assetCode?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    department?: DepartmentUpdateOneRequiredWithoutAssetsNestedInput
    records?: AssetRecordUpdateManyWithoutAssetNestedInput
    repairRecords?: RepairRecordUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateWithoutTemplateInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetCode?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    records?: AssetRecordUncheckedUpdateManyWithoutAssetNestedInput
    repairRecords?: RepairRecordUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateManyWithoutTemplateInput = {
    id?: IntFieldUpdateOperationsInput | number
    assetCode?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    os?: StringFieldUpdateOperationsInput | string
    cpu?: StringFieldUpdateOperationsInput | string
    memory?: StringFieldUpdateOperationsInput | string
    storage?: StringFieldUpdateOperationsInput | string
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    currentUserName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    warrantyExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type AssetRecordCreateManyAssetInput = {
    id?: number
    action: $Enums.AssetRecordAction
    userName: string
    departmentId: number
    actionDate: Date | string
    expectedReturnDate?: Date | string | null
    proofImage?: string | null
    remark?: string | null
    operatorId: number
    requestId: string
    createdAt?: Date | string
  }

  export type RepairRecordCreateManyAssetInput = {
    id?: number
    faultDescription: string
    repairVendor: string
    repairCost: number
    repairResult: $Enums.RepairResult
    startDate: Date | string
    endDate: Date | string
    remark?: string | null
  }

  export type AssetRecordUpdateWithoutAssetInput = {
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutRecordsNestedInput
    operator?: UserUpdateOneRequiredWithoutAssetRecordsNestedInput
  }

  export type AssetRecordUncheckedUpdateWithoutAssetInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    operatorId?: IntFieldUpdateOperationsInput | number
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetRecordUncheckedUpdateManyWithoutAssetInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: EnumAssetRecordActionFieldUpdateOperationsInput | $Enums.AssetRecordAction
    userName?: StringFieldUpdateOperationsInput | string
    departmentId?: IntFieldUpdateOperationsInput | number
    actionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expectedReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    proofImage?: NullableStringFieldUpdateOperationsInput | string | null
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    operatorId?: IntFieldUpdateOperationsInput | number
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepairRecordUpdateWithoutAssetInput = {
    faultDescription?: StringFieldUpdateOperationsInput | string
    repairVendor?: StringFieldUpdateOperationsInput | string
    repairCost?: FloatFieldUpdateOperationsInput | number
    repairResult?: EnumRepairResultFieldUpdateOperationsInput | $Enums.RepairResult
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RepairRecordUncheckedUpdateWithoutAssetInput = {
    id?: IntFieldUpdateOperationsInput | number
    faultDescription?: StringFieldUpdateOperationsInput | string
    repairVendor?: StringFieldUpdateOperationsInput | string
    repairCost?: FloatFieldUpdateOperationsInput | number
    repairResult?: EnumRepairResultFieldUpdateOperationsInput | $Enums.RepairResult
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RepairRecordUncheckedUpdateManyWithoutAssetInput = {
    id?: IntFieldUpdateOperationsInput | number
    faultDescription?: StringFieldUpdateOperationsInput | string
    repairVendor?: StringFieldUpdateOperationsInput | string
    repairCost?: FloatFieldUpdateOperationsInput | number
    repairResult?: EnumRepairResultFieldUpdateOperationsInput | $Enums.RepairResult
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}