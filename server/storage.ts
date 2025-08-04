import {
  users,
  members,
  chitGroups,
  groupMembers,
  transactions,
  auctions,
  documents,
  staffPerformance,
  type User,
  type UpsertUser,
  type Member,
  type InsertMember,
  type ChitGroup,
  type InsertChitGroup,
  type GroupMember,
  type Transaction,
  type InsertTransaction,
  type Auction,
  type InsertAuction,
  type Document,
  type InsertDocument,
  type StaffPerformance,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sum, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Member operations
  getMembers(): Promise<Member[]>;
  getMember(id: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, member: Partial<InsertMember>): Promise<Member>;
  deleteMember(id: string): Promise<void>;
  
  // Chit Group operations
  getChitGroups(): Promise<ChitGroup[]>;
  getChitGroup(id: string): Promise<ChitGroup | undefined>;
  createChitGroup(group: InsertChitGroup): Promise<ChitGroup>;
  updateChitGroup(id: string, group: Partial<InsertChitGroup>): Promise<ChitGroup>;
  
  // Group Member operations
  addMemberToGroup(groupId: string, memberId: string): Promise<GroupMember>;
  getGroupMembers(groupId: string): Promise<GroupMember[]>;
  
  // Transaction operations
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction>;
  getMemberTransactions(memberId: string): Promise<Transaction[]>;
  
  // Auction operations
  getAuctions(): Promise<Auction[]>;
  getAuction(id: string): Promise<Auction | undefined>;
  createAuction(auction: InsertAuction): Promise<Auction>;
  updateAuction(id: string, auction: Partial<InsertAuction>): Promise<Auction>;
  getUpcomingAuctions(): Promise<Auction[]>;
  
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocuments(): Promise<Document[]>;
  getMemberDocuments(memberId: string): Promise<Document[]>;
  
  // Dashboard metrics
  getDashboardMetrics(): Promise<{
    totalMembers: number;
    activeGroups: number;
    monthlyCollections: string;
    pendingAuctions: number;
    paymentSummary: {
      collected: string;
      pending: string;
      overdue: string;
      collectionRate: number;
    };
  }>;

  // Ledger operations
  getLedgerEntries(filters: {
    groupId?: string;
    memberId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]>;
  
  getLedgerSummary(filters: {
    groupId?: string;
    memberId?: string;
  }): Promise<{
    totalCredits: string;
    totalDebits: string;
    balance: string;
    transactionCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Member operations
  async getMembers(): Promise<Member[]> {
    return await db.select().from(members).orderBy(desc(members.createdAt));
  }

  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async createMember(member: InsertMember): Promise<Member> {
    const [created] = await db.insert(members).values(member).returning();
    return created;
  }

  async updateMember(id: string, member: Partial<InsertMember>): Promise<Member> {
    const [updated] = await db
      .update(members)
      .set({ ...member, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
    return updated;
  }

  async deleteMember(id: string): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }

  // Chit Group operations
  async getChitGroups(): Promise<ChitGroup[]> {
    return await db.select().from(chitGroups).orderBy(desc(chitGroups.createdAt));
  }

  async getChitGroup(id: string): Promise<ChitGroup | undefined> {
    const [group] = await db.select().from(chitGroups).where(eq(chitGroups.id, id));
    return group;
  }

  async createChitGroup(group: InsertChitGroup): Promise<ChitGroup> {
    const [created] = await db.insert(chitGroups).values(group).returning();
    return created;
  }

  async updateChitGroup(id: string, group: Partial<InsertChitGroup>): Promise<ChitGroup> {
    const [updated] = await db
      .update(chitGroups)
      .set({ ...group, updatedAt: new Date() })
      .where(eq(chitGroups.id, id))
      .returning();
    return updated;
  }

  // Group Member operations
  async addMemberToGroup(groupId: string, memberId: string): Promise<GroupMember> {
    const [groupMember] = await db
      .insert(groupMembers)
      .values({ groupId, memberId })
      .returning();
    return groupMember;
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    return await db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
  }

  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [created] = await db.insert(transactions).values(transaction).returning();
    return created;
  }

  async updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction> {
    const [updated] = await db
      .update(transactions)
      .set({ ...transaction, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return updated;
  }

  async getMemberTransactions(memberId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.memberId, memberId))
      .orderBy(desc(transactions.createdAt));
  }

  // Auction operations
  async getAuctions(): Promise<Auction[]> {
    return await db.select().from(auctions).orderBy(desc(auctions.auctionDate));
  }

  async getAuction(id: string): Promise<Auction | undefined> {
    const [auction] = await db.select().from(auctions).where(eq(auctions.id, id));
    return auction;
  }

  async createAuction(auction: InsertAuction): Promise<Auction> {
    const [created] = await db.insert(auctions).values(auction).returning();
    return created;
  }

  async updateAuction(id: string, auction: Partial<InsertAuction>): Promise<Auction> {
    const [updated] = await db
      .update(auctions)
      .set({ ...auction, updatedAt: new Date() })
      .where(eq(auctions.id, id))
      .returning();
    return updated;
  }

  async getUpcomingAuctions(): Promise<Auction[]> {
    return await db
      .select()
      .from(auctions)
      .where(and(
        eq(auctions.status, 'scheduled'),
        gte(auctions.auctionDate, new Date())
      ))
      .orderBy(auctions.auctionDate);
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const [created] = await db.insert(documents).values(document).returning();
    return created;
  }

  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(desc(documents.createdAt));
  }

  async getMemberDocuments(memberId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.memberId, memberId))
      .orderBy(desc(documents.createdAt));
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<{
    totalMembers: number;
    activeGroups: number;
    monthlyCollections: string;
    pendingAuctions: number;
    paymentSummary: {
      collected: string;
      pending: string;
      overdue: string;
      collectionRate: number;
    };
  }> {
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    // Total members
    const [{ count: totalMembers }] = await db
      .select({ count: count() })
      .from(members)
      .where(eq(members.status, 'active'));

    // Active groups
    const [{ count: activeGroups }] = await db
      .select({ count: count() })
      .from(chitGroups)
      .where(eq(chitGroups.status, 'active'));

    // Monthly collections
    const [{ sum: monthlyCollections }] = await db
      .select({ sum: sum(transactions.amount) })
      .from(transactions)
      .where(and(
        eq(transactions.status, 'paid'),
        gte(transactions.paidDate, startOfMonth),
        lte(transactions.paidDate, endOfMonth)
      ));

    // Pending auctions
    const [{ count: pendingAuctions }] = await db
      .select({ count: count() })
      .from(auctions)
      .where(eq(auctions.status, 'scheduled'));

    // Payment summary
    const [{ sum: collected }] = await db
      .select({ sum: sum(transactions.amount) })
      .from(transactions)
      .where(eq(transactions.status, 'paid'));

    const [{ sum: pending }] = await db
      .select({ sum: sum(transactions.amount) })
      .from(transactions)
      .where(eq(transactions.status, 'pending'));

    const [{ sum: overdue }] = await db
      .select({ sum: sum(transactions.amount) })
      .from(transactions)
      .where(and(
        eq(transactions.status, 'pending'),
        lte(transactions.dueDate, new Date())
      ));

    const totalDue = (Number(collected || 0) + Number(pending || 0));
    const collectionRate = totalDue > 0 ? (Number(collected || 0) / totalDue) * 100 : 0;

    return {
      totalMembers: Number(totalMembers),
      activeGroups: Number(activeGroups),
      monthlyCollections: (Number(monthlyCollections || 0) / 100000).toFixed(1) + 'L',
      pendingAuctions: Number(pendingAuctions),
      paymentSummary: {
        collected: (Number(collected || 0) / 100000).toFixed(1) + 'L',
        pending: (Number(pending || 0) / 100000).toFixed(1) + 'L',
        overdue: (Number(overdue || 0) / 100000).toFixed(1) + 'L',
        collectionRate: Math.round(collectionRate * 10) / 10,
      },
    };
  }

  // Ledger operations
  async getLedgerEntries(filters: {
    groupId?: string;
    memberId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    const conditions = [];
    
    if (filters.groupId) {
      conditions.push(eq(transactions.groupId, filters.groupId));
    }
    
    if (filters.memberId) {
      conditions.push(eq(transactions.memberId, filters.memberId));
    }
    
    if (filters.startDate) {
      conditions.push(gte(transactions.createdAt, new Date(filters.startDate)));
    }
    
    if (filters.endDate) {
      conditions.push(lte(transactions.createdAt, new Date(filters.endDate)));
    }

    const baseQuery = db
      .select({
        id: transactions.id,
        date: transactions.createdAt,
        description: sql<string>`CASE 
          WHEN ${transactions.type} = 'payment' THEN 'Payment Received'
          WHEN ${transactions.type} = 'withdrawal' THEN 'Chit Amount Disbursed'
          WHEN ${transactions.type} = 'fine' THEN 'Fine Applied'
          WHEN ${transactions.type} = 'bonus' THEN 'Bonus Applied'
          ELSE ${transactions.type}
        END`,
        type: transactions.type,
        amount: transactions.amount,
        status: transactions.status,
        receiptNumber: transactions.receiptNumber,
        memberName: sql<string>`${members.firstName} || ' ' || ${members.lastName}`,
        groupName: chitGroups.groupName,
        notes: transactions.notes,
      })
      .from(transactions)
      .leftJoin(members, eq(transactions.memberId, members.id))
      .leftJoin(chitGroups, eq(transactions.groupId, chitGroups.id));

    if (conditions.length > 0) {
      return await baseQuery.where(and(...conditions)).orderBy(desc(transactions.createdAt));
    }

    return await baseQuery.orderBy(desc(transactions.createdAt));
  }

  async getLedgerSummary(filters: {
    groupId?: string;
    memberId?: string;
  }): Promise<{
    totalCredits: string;
    totalDebits: string;
    balance: string;
    transactionCount: number;
  }> {
    const conditions = [];
    
    if (filters.groupId) {
      conditions.push(eq(transactions.groupId, filters.groupId));
    }
    
    if (filters.memberId) {
      conditions.push(eq(transactions.memberId, filters.memberId));
    }

    const baseQuery = db.select({
      totalCredits: sum(sql`CASE WHEN ${transactions.type} IN ('payment', 'bonus') THEN ${transactions.amount} ELSE 0 END`),
      totalDebits: sum(sql`CASE WHEN ${transactions.type} IN ('withdrawal', 'fine') THEN ${transactions.amount} ELSE 0 END`),
      transactionCount: count(),
    }).from(transactions);

    let result;
    if (conditions.length > 0) {
      [result] = await baseQuery.where(and(...conditions));
    } else {
      [result] = await baseQuery;
    }
    
    const totalCredits = Number(result.totalCredits || 0);
    const totalDebits = Number(result.totalDebits || 0);
    const balance = totalCredits - totalDebits;

    return {
      totalCredits: (totalCredits / 100000).toFixed(1) + 'L',
      totalDebits: (totalDebits / 100000).toFixed(1) + 'L',
      balance: (balance / 100000).toFixed(1) + 'L',
      transactionCount: Number(result.transactionCount),
    };
  }
}

export const storage = new DatabaseStorage();
