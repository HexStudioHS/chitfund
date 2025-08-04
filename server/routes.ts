import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import {
  insertMemberSchema,
  insertChitGroupSchema,
  insertTransactionSchema,
  insertAuctionSchema,
} from "@shared/schema";

// Dummy isAuthenticated middleware (bypass auth)
const isAuthenticated = (_req: any, _res: any, next: any) => next();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes (dummy user for now)
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    res.json({ id: "test-user", name: "Test User (auth disabled)" });
  });

  // Dashboard metrics
  app.get('/api/dashboard/metrics', isAuthenticated, async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Member routes
  app.get('/api/members', isAuthenticated, async (req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.get('/api/members/:id', isAuthenticated, async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) return res.status(404).json({ message: "Member not found" });
      res.json(member);
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ message: "Failed to fetch member" });
    }
  });

  app.post('/api/members', isAuthenticated, async (req: any, res) => {
    try {
      const memberData = insertMemberSchema.parse(req.body);
      memberData.memberCode = `M${Date.now()}`;
      const member = await storage.createMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      console.error("Error creating member:", error);
      res.status(500).json({ message: "Failed to create member" });
    }
  });

  app.put('/api/members/:id', isAuthenticated, async (req, res) => {
    try {
      const memberData = insertMemberSchema.partial().parse(req.body);
      const member = await storage.updateMember(req.params.id, memberData);
      res.json(member);
    } catch (error) {
      console.error("Error updating member:", error);
      res.status(500).json({ message: "Failed to update member" });
    }
  });

  app.delete('/api/members/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteMember(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ message: "Failed to delete member" });
    }
  });

  // Chit Group routes
  app.get('/api/chit-groups', isAuthenticated, async (req, res) => {
    try {
      const groups = await storage.getChitGroups();
      res.json(groups);
    } catch (error) {
      console.error("Error fetching chit groups:", error);
      res.status(500).json({ message: "Failed to fetch chit groups" });
    }
  });

  app.get('/api/chit-groups/:id', isAuthenticated, async (req, res) => {
    try {
      const group = await storage.getChitGroup(req.params.id);
      if (!group) return res.status(404).json({ message: "Chit group not found" });
      res.json(group);
    } catch (error) {
      console.error("Error fetching chit group:", error);
      res.status(500).json({ message: "Failed to fetch chit group" });
    }
  });

  app.post('/api/chit-groups', isAuthenticated, async (req: any, res) => {
    try {
      const groupData = insertChitGroupSchema.parse(req.body);
      groupData.groupCode = `CG${Date.now()}`;
      groupData.createdBy = "test-user"; // Dummy value
      const group = await storage.createChitGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      console.error("Error creating chit group:", error);
      res.status(500).json({ message: "Failed to create chit group" });
    }
  });

  app.put('/api/chit-groups/:id', isAuthenticated, async (req, res) => {
    try {
      const groupData = insertChitGroupSchema.partial().parse(req.body);
      const group = await storage.updateChitGroup(req.params.id, groupData);
      res.json(group);
    } catch (error) {
      console.error("Error updating chit group:", error);
      res.status(500).json({ message: "Failed to update chit group" });
    }
  });

  app.post('/api/chit-groups/:groupId/members', isAuthenticated, async (req, res) => {
    try {
      const { memberId } = req.body;
      const groupMember = await storage.addMemberToGroup(req.params.groupId, memberId);
      res.status(201).json(groupMember);
    } catch (error) {
      console.error("Error adding member to group:", error);
      res.status(500).json({ message: "Failed to add member to group" });
    }
  });

  app.get('/api/chit-groups/:groupId/members', isAuthenticated, async (req, res) => {
    try {
      const members = await storage.getGroupMembers(req.params.groupId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching group members:", error);
      res.status(500).json({ message: "Failed to fetch group members" });
    }
  });

  // Transactions
  app.get('/api/transactions', isAuthenticated, async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get('/api/transactions/:id', isAuthenticated, async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) return res.status(404).json({ message: "Transaction not found" });
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      transactionData.createdBy = "test-user"; // Dummy user
      transactionData.receiptNumber = `RC${Date.now()}`;
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.put('/api/transactions/:id', isAuthenticated, async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateTransaction(req.params.id, transactionData);
      res.json(transaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });

  app.get('/api/members/:memberId/transactions', isAuthenticated, async (req, res) => {
    try {
      const transactions = await storage.getMemberTransactions(req.params.memberId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching member transactions:", error);
      res.status(500).json({ message: "Failed to fetch member transactions" });
    }
  });

  // Auctions
  app.get('/api/auctions', isAuthenticated, async (req, res) => {
    try {
      const auctions = await storage.getAuctions();
      res.json(auctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      res.status(500).json({ message: "Failed to fetch auctions" });
    }
  });

  app.get('/api/auctions/upcoming', isAuthenticated, async (req, res) => {
    try {
      const auctions = await storage.getUpcomingAuctions();
      res.json(auctions);
    } catch (error) {
      console.error("Error fetching upcoming auctions:", error);
      res.status(500).json({ message: "Failed to fetch upcoming auctions" });
    }
  });

  app.post('/api/auctions', isAuthenticated, async (req, res) => {
    try {
      const auctionData = insertAuctionSchema.parse(req.body);
      const auction = await storage.createAuction(auctionData);
      res.status(201).json(auction);
    } catch (error) {
      console.error("Error creating auction:", error);
      res.status(500).json({ message: "Failed to create auction" });
    }
  });

  app.put('/api/auctions/:id', isAuthenticated, async (req, res) => {
    try {
      const auctionData = insertAuctionSchema.partial().parse(req.body);
      const auction = await storage.updateAuction(req.params.id, auctionData);
      res.json(auction);
    } catch (error) {
      console.error("Error updating auction:", error);
      res.status(500).json({ message: "Failed to update auction" });
    }
  });

  // Documents
  app.post('/api/documents', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const document = await storage.createDocument({
        fileName: randomUUID() + path.extname(req.file.originalname),
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        filePath: req.file.path,
        memberId: req.body.memberId || null,
        groupId: req.body.groupId || null,
        uploadedBy: "test-user",
      });

      res.status(201).json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.get('/api/documents', isAuthenticated, async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get('/api/members/:memberId/documents', isAuthenticated, async (req, res) => {
    try {
      const documents = await storage.getMemberDocuments(req.params.memberId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching member documents:", error);
      res.status(500).json({ message: "Failed to fetch member documents" });
    }
  });

  // Ledger routes
  app.get('/api/ledger', isAuthenticated, async (req, res) => {
    try {
      const { groupId, memberId, startDate, endDate } = req.query;
      const ledgerEntries = await storage.getLedgerEntries({
        groupId: groupId as string,
        memberId: memberId as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });
      res.json(ledgerEntries);
    } catch (error) {
      console.error("Error fetching ledger entries:", error);
      res.status(500).json({ message: "Failed to fetch ledger entries" });
    }
  });

  app.get('/api/ledger/summary', isAuthenticated, async (req, res) => {
    try {
      const { groupId, memberId } = req.query;
      const summary = await storage.getLedgerSummary({
        groupId: groupId as string,
        memberId: memberId as string,
      });
      res.json(summary);
    } catch (error) {
      console.error("Error fetching ledger summary:", error);
      res.status(500).json({ message: "Failed to fetch ledger summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
