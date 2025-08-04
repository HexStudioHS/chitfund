import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const paymentStatusEnum = pgEnum('payment_status', ['paid', 'pending', 'overdue']);
export const auctionStatusEnum = pgEnum('auction_status', ['scheduled', 'pending', 'completed', 'cancelled']);
export const memberStatusEnum = pgEnum('member_status', ['active', 'inactive', 'suspended']);
export const groupStatusEnum = pgEnum('group_status', ['active', 'completed', 'cancelled']);
export const staffRoleEnum = pgEnum('staff_role', ['admin', 'manager', 'agent', 'staff']);
export const transactionTypeEnum = pgEnum('transaction_type', ['payment', 'withdrawal', 'fine', 'bonus']);

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: staffRoleEnum("role").default('staff'),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Members table
export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberCode: varchar("member_code").notNull().unique(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email"),
  phone: varchar("phone").notNull(),
  address: text("address"),
  panNumber: varchar("pan_number"),
  aadhaarNumber: varchar("aadhaar_number"),
  gstNumber: varchar("gst_number"),
  familyCode: varchar("family_code"),
  introducerId: varchar("introducer_id"),
  nomineeFirstName: varchar("nominee_first_name"),
  nomineeLastName: varchar("nominee_last_name"),
  nomineeRelation: varchar("nominee_relation"),
  status: memberStatusEnum("status").default('active'),
  riskScore: integer("risk_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chit Groups table
export const chitGroups = pgTable("chit_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupName: varchar("group_name").notNull(),
  groupCode: varchar("group_code").notNull().unique(),
  chitAmount: decimal("chit_amount", { precision: 15, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // in months
  frequency: varchar("frequency").notNull(), // weekly, bi-weekly, monthly, tri-monthly
  totalMembers: integer("total_members").notNull(),
  currentRound: integer("current_round").default(1),
  monthlyContribution: decimal("monthly_contribution", { precision: 15, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: groupStatusEnum("status").default('active'),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Group Members (many-to-many relationship)
export const groupMembers = pgTable("group_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => chitGroups.id).notNull(),
  memberId: varchar("member_id").references(() => members.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  isWinner: boolean("is_winner").default(false),
  winningRound: integer("winning_round"),
});

// Auctions table
export const auctions = pgTable("auctions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => chitGroups.id).notNull(),
  roundNumber: integer("round_number").notNull(),
  auctionDate: timestamp("auction_date").notNull(),
  chitAmount: decimal("chit_amount", { precision: 15, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 15, scale: 2 }).default('0'),
  winnerId: varchar("winner_id").references(() => members.id),
  status: auctionStatusEnum("status").default('scheduled'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").references(() => members.id).notNull(),
  groupId: varchar("group_id").references(() => chitGroups.id).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  status: paymentStatusEnum("status").default('pending'),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  receiptNumber: varchar("receipt_number"),
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documents table
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: varchar("file_name").notNull(),
  originalName: varchar("original_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type").notNull(),
  filePath: text("file_path").notNull(),
  memberId: varchar("member_id").references(() => members.id),
  groupId: varchar("group_id").references(() => chitGroups.id),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Staff Performance table
export const staffPerformance = pgTable("staff_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  staffId: varchar("staff_id").references(() => users.id).notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  collectionsTarget: decimal("collections_target", { precision: 15, scale: 2 }),
  collectionsAchieved: decimal("collections_achieved", { precision: 15, scale: 2 }),
  membersManaged: integer("members_managed"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdGroups: many(chitGroups),
  transactions: many(transactions),
  documents: many(documents),
  performance: many(staffPerformance),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  introducer: one(members, {
    fields: [members.introducerId],
    references: [members.id],
  }),
  groupMemberships: many(groupMembers),
  transactions: many(transactions),
  documents: many(documents),
  wonAuctions: many(auctions),
}));

export const chitGroupsRelations = relations(chitGroups, ({ one, many }) => ({
  creator: one(users, {
    fields: [chitGroups.createdBy],
    references: [users.id],
  }),
  members: many(groupMembers),
  auctions: many(auctions),
  transactions: many(transactions),
  documents: many(documents),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(chitGroups, {
    fields: [groupMembers.groupId],
    references: [chitGroups.id],
  }),
  member: one(members, {
    fields: [groupMembers.memberId],
    references: [members.id],
  }),
}));

export const auctionsRelations = relations(auctions, ({ one }) => ({
  group: one(chitGroups, {
    fields: [auctions.groupId],
    references: [chitGroups.id],
  }),
  winner: one(members, {
    fields: [auctions.winnerId],
    references: [members.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  member: one(members, {
    fields: [transactions.memberId],
    references: [members.id],
  }),
  group: one(chitGroups, {
    fields: [transactions.groupId],
    references: [chitGroups.id],
  }),
  createdBy: one(users, {
    fields: [transactions.createdBy],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  member: one(members, {
    fields: [documents.memberId],
    references: [members.id],
  }),
  group: one(chitGroups, {
    fields: [documents.groupId],
    references: [chitGroups.id],
  }),
  uploadedBy: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

export const staffPerformanceRelations = relations(staffPerformance, ({ one }) => ({
  staff: one(users, {
    fields: [staffPerformance.staffId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChitGroupSchema = createInsertSchema(chitGroups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuctionSchema = createInsertSchema(auctions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;

export type ChitGroup = typeof chitGroups.$inferSelect;
export type InsertChitGroup = z.infer<typeof insertChitGroupSchema>;

export type GroupMember = typeof groupMembers.$inferSelect;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Auction = typeof auctions.$inferSelect;
export type InsertAuction = z.infer<typeof insertAuctionSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type StaffPerformance = typeof staffPerformance.$inferSelect;
