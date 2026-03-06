import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '../config/config';
import crypto from 'crypto';

// Initialize S3 Client
const s3Client = new S3Client({
    region: config.awsRegion,
    credentials: {
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey,
    },
});

export const getPresignedUploadUrl = async (fileName: string, contentType: string, userId: string): Promise<{ uploadUrl: string, s3Key: string, publicUrl: string }> => {
    // Sanitize file name
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');

    // Generate a unique S3 key specifically organized by user
    const s3Key = `${config.awsS3BucketFolder}/uploads/users/${userId}/${crypto.randomUUID()}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
        Bucket: config.awsS3BucketName,
        Key: s3Key,
        ContentType: contentType,
        // Optional: ACL configuration depending on bucket setup. usually omit or 'public-read' / 'private'
        // ACL: 'public-read',
    });

    // Generate Pre-signed URL valid for 15 minutes (900 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    // The eventual public URL of the uploaded object (assuming public access or access via CloudFront)
    const publicUrl = `https://${config.awsS3BucketName}.s3.${config.awsRegion}.amazonaws.com/${s3Key}`;

    return { uploadUrl, s3Key, publicUrl };
};
