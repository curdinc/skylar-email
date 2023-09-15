// import { sql } from "drizzle-orm";
// import {
//   index,
//   integer,
//   pgTable,
//   serial,
//   text,
//   timestamp,
//   varchar,
// } from "drizzle-orm/pg-core";

// import { user } from "./user";

// // Do not use defaultNow, it's to be deprecated https://github.com/drizzle-team/drizzle-orm/issues/657
// export const inviteCode = pgTable("inviteCode", {
//   id: serial("id").primaryKey(),
//   inviteCode: text("inviteCode").unique().notNull(),
//   createdByUserId: integer("userId")
//     .references(() => user.id, {
//       onDelete: "cascade",
//       onUpdate: "cascade",
//     })
//     .notNull(),
//   usedByUserId: integer("usedByUserId")
//     .references(() => user.id, {
//       onDelete: "cascade",
//       onUpdate: "cascade",
//     })
//     .unique(),
//   createdAt: timestamp("createdAt", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
//   usedAt: timestamp("usedAt", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
// });

// const EMAIL_PROVIDERS = ["gmail", "outlook"] as const;
// const EMAIL_CATEGORIES = ["important", "feed", "receipt", "block"] as const;

// // token length: https://developers.google.com/identity/protocols/oauth2#:~:text=to%20service%20accounts.-,Token%20size,Refresh%20tokens%3A%20512%20bytes
// export const emailProviderOAuth = pgTable(
//   "emailProviderOAuth",
//   {
//     id: serial("id").primaryKey(),
//     userId: integer("userId").references(() => user.id),
//     refreshToken: varchar("refreshToken", { length: 512 }).notNull(),
//     provider: text("providers", {
//       enum: EMAIL_PROVIDERS,
//     }).notNull(),
//     email: varchar("email", { length: 255 }).notNull(),
//   },
//   (table) => {
//     return {
//       idTokenIdx: index("idTokenIdx").on(
//         table.userId,
//         table.provider,
//         table.email,
//       ),
//     };
//   },
// );

// export const emailProviderDetails = pgTable("emailProviderDetails", {
//   id: serial("id"),
//   emailProviderOAuthId: integer("emailProviderOAuthId").references(
//     () => emailProviderOAuth.id,
//   ),
//   inboxName: varchar("inboxName", { length: 255 }).notNull(),
//   categorizedAt: timestamp("categorizedAt", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
//   updatedAt: timestamp("updatedAt", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
// });

// export const senderCategory = pgTable("senderCategory", {
//   id: serial("id").primaryKey(),
//   userId: integer("userId").references(() => user.id),
//   emailProviderDetails: integer("emailProviderDetails").references(
//     () => emailProviderDetails.id,
//   ),
//   category: varchar("category", {
//     length: 255,
//     enum: EMAIL_CATEGORIES,
//   }).notNull(),
//   senderEmail: varchar("senderEmail", { length: 255 }).notNull(),
//   createdAt: timestamp("createdAt", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
//   updatedAt: timestamp("updatedAt", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
// });

// export const email = pgTable("email", {
//   id: serial("id").primaryKey(),
//   userId: integer("userId").references(() => user.id),
//   emailProviderDetails: integer("emailProviderDetails").references(
//     () => emailProviderDetails.id,
//   ),
//   senderEmail: varchar("senderEmail", { length: 255 }).notNull(),
//   subject: varchar("subject", { length: 255 }).notNull(),
//   bodyUri: text("bodyUri").notNull(),
//   attachmentUris: text("attachmentUris")
//     .array()
//     // TODO: check if this sql statement is correct
//     .default(sql`ARRAY[]::text[]`),
//   receivedAt: timestamp("receivedAt", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAe MP`),
//   updatedAt: timestamp("updatedAt", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
// });

// export const emailCategory = pgTable("emailCategory", {
//   id: serial("id").primaryKey(),
//   userId: integer("userId").references(() => user.id),
//   email: integer("email").references(() => email.id),
//   category: varchar("category", {
//     length: 255,
//     enum: EMAIL_CATEGORIES,
//   }).notNull(),
//   createdAt: timestamp("createdAt", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
//   updatedAt: timestamp("updatedAt", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
// });

// export const someStripeDbStorageItem = pgTable("subscription", {
//   id: serial("id").primaryKey(),
//   userId: integer("userId").references(() => user.id),
//   customerId: varchar("customerId", { length: 255 }).notNull(),
//   subscriptionId: varchar("subscriptionId", { length: 255 }).notNull(),
//   // ...
// });
