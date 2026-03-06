import express from 'express';
import { generatePresignedUrl, saveDocumentRecord, getUserDocuments } from '../controllers/documentController';
import { protectRoute } from '../middlewares/authMiddleware';

const router = express.Router();

// Route to get all documents for the logged in user
router.get('/', protectRoute, getUserDocuments);

// Route to create a pre-signed url to upload file to S3 securely direct from client
router.post('/presigned-url', protectRoute, generatePresignedUrl);

// Route to save the document details in MongoDB once successful client-side upload finishes
router.post('/', protectRoute, saveDocumentRecord);

export default router;
