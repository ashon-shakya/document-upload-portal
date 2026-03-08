# Document Upload Portal

This is a full-stack web application designed for users to securely upload required documentation for onboarding or verification purposes.

## Live Demo & Testing

You can interact with the deployed application via the following URL:
**[https://document-upload-portal-frontend.vercel.app/](https://document-upload-portal-frontend.vercel.app/)**

To explore the Document Upload dashboard, you can log in using the following test credentials:
- **Username:** `john`
- **Password:** `test1234`

Backend URL:
**[https://document-upload-portal-zeta.vercel.app/](https://document-upload-portal-zeta.vercel.app/)**

SWAGGER Documentation
**[https://document-upload-portal-zeta.vercel.app/api-docs](https://document-upload-portal-zeta.vercel.app/api-docs)**

## Tech Stack

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Axios

**Backend:**
- Node.js & Express
- TypeScript
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)
- Zod

## Folder Structure

The repository is organized into two main projects:

- **`portal-frontend/`**: The React-based frontend application built with Vite and TypeScript.
  - `src/api/`: Axios configuration and API processor to interact with the backend.
  - `src/components/`: Reusable UI components (e.g., Modals, forms, ResultModal).
  - `src/pages/`: Main application views (e.g., Login, DocumentUpload, Signup).
  - `src/interfaces/`: TypeScript definitions for the data models.
  - `src/store/`: Redux Toolkit store and slices for state management.
- **`portal-backend/`**: The Node.js and Express backend built with TypeScript.
  - `src/config/`: Configuration setup, environment variable loading, database connection.
  - `src/controllers/`: Request handlers for routes (Auth, Documents).
  - `src/models/`: Mongoose schemas for MongoDB databases.
  - `src/routes/`: Express router definitions.
  - `src/middlewares/`: Express middlewares (e.g., JWT Authentication, Zod Request Validation).
  - `src/helpers/`: Utility functions (e.g., Truuth API integrations, AWS S3 integrations, Response formatting).
  - `src/validators/`: Zod validation schemas for robust payload checking.
  - `src/interfaces/`: TypeScript definitions for incoming requests and system objects.

## Environment Variables

To run this application, you need to create `.env` files in both the `portal-frontend` and `portal-backend` directories.

### Frontend (`portal-frontend/.env`)
```env
# The base URL pointing to the backend API services
VITE_API_BASE_URL=http://localhost:3000/api
```

### Backend (`portal-backend/.env`)
```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database connection string
MONGO_URI=mongodb://localhost:27017/user-portal

# Authentication
# Used to sign and verify JWT tokens
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d

# Swagger
# The base server URL for the interactive Swagger documentation
SWAGGER_SERVERS=http://localhost:3000

# AWS S3 Configuration
# Used for generating pre-signed URLs intended for secure, direct frontend uploads
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
AWS_S3_BUCKET_FOLDER=truuth

# Truuth API Configuration
# Used by the backend to securely authenticate and ping Truuth services
TRUUTH_API_KEY=your_truuth_api_key
TRUUTH_API_SECRET=your_truuth_api_secret
TRUUTH_TENNANT_ALIAS=your_truuth_tenant_alias

# Truuth API Endpoints
# URLs for classification and fraud check verification
TRUUTH_CLASSIFY_URL=https://api.truuth.com/classify
TRUUTH_SUBMIT_FRAUD_CHECK_URL=https://api.truuth.com/tenant/{tenantAlias}/verify/submit
TRUUTH_GET_FRAUD_CHECK_URL=https://api.truuth.com/tenant/{tenantAlias}/verify
```

## How Authentication Works

The application uses **JSON Web Tokens (JWT)** for secure, stateless authentication:

1. **Login/Signup**: Users authenticate with their credentials. Upon success, the backend generates a JWT signed with a secret key.
2. **HttpOnly Cookie**: The JWT is returned to the client and stored in an `HttpOnly` cookie named `token`. This prevents Cross-Site Scripting (XSS) attacks from accessing the token via JavaScript.
3. **Session Management**: During subsequent requests, the browser automatically sends the cookie. The `authMiddleware` verifies the token's validity and attaches the authenticated user's details to the `req.user` object.
4. **Security**: In production, cookies are flagged as `secure` (HTTPS only) and use `sameSite: 'none'` to support expected cross-origin flows safely while preventing CSRF attacks.

## Frontend Processes

This section outlines the testing protocols and the different system lifecycles managed by the React frontend.

### 1. Account Creation (Signup & Login)
To experiment with a new session:
- Navigate to the **Signup** view and fill out a new profile. The credentials will be strictly evaluated by backend validations and bcrypt hashing.
- Switch to the **Login** view to authenticate. Upon logging in, the `AuthContext` checks a `/profile` endpoint to fetch the user's `userData` (including their `userStatus`) and redirects them conditionally to the document upload dashboard.

### 2. Document Submission Process
- Users are presented with cards for Required Documents (e.g., Resume, Passport, Driver Licence) and options to upload Additional Documents.
- The UI strictly disables the final **"Submit"** button until specific completeness rules are met: at least one Passport and one Driver Licence must carry a `CHECK_COMPLETE` status, and the user's Resume must be successfully uploaded.
- Once submitted, the backend upgrades the user's database status to `DOCUMENT_SUBMITTED`, triggering a "Thank You" success overly on the frontend.

### 3. Verification & Status Polling Process
When identity documents (Passports/Licences) are uploaded, they are immediately fed into the **Truuth Classification API**.
- The API analyzes the document to strictly classify it as either an `AUS` `PASSPORT` or `AUS` `DRIVERS_LICENCE`.
- If the document cannot be classified correctly, its status immediately falls to `CLASSIFICATION_FAILED` and the process aborts.
- If it is successfully classified, the backend submits it to the Truuth Fraud Check API and temporarily marks its status as `CHECK_PENDING`.
- The frontend `DocumentUpload` component actively queries the `POST /documents/update-status` endpoint every **5 seconds** passing up the references of any pending documents.
- The backend then polls the Truuth API. Once the API finalises its checks (returning PASS or FAIL), the backend stores the full JSON rationale in the database and updates the document status to `CHECK_COMPLETE` (or `CHECK_FAILED`).
- The frontend seamlessly absorbs these updates, terminating its polling and offering a **"View Result"** button so users can examine their fraud check outcomes and download the details.

### 4. Document Restart Process
- From the "Thank You" successfully submitted overlay, users can elect to press **"Restart Process"**.
- This dispatches an event to `POST /documents/restart`. 
- The backend hard-deletes all uploaded tracking models tied to the user and resets their MongoDB status back to `NEW`.
- The frontend then empties its local states and restarts the upload progress from Scratch (0 required documents uploaded).

## API Documentation (Swagger)

The backend provides interactive **Swagger UI** to visualize and interact with the API endpoints.
To access it, once the backend server is running, navigate to: `http://localhost:3000/api-docs`

### Available Endpoints

**Auth API (`/api/auth`)**:
- `POST /signup`: Register a new user account.
- `POST /login`: Authenticate a user and set an HttpOnly `token` cookie.
- `POST /logout`: Clear the authentication cookie.
- `GET /profile`: Retrieve the authenticated user's details.

**Documents API (`/api/documents`)**:
- `GET /`: Retrieve all documents uploaded by the authenticated user.
- `POST /presigned-url`: Generate a securely signed direct-to-S3 upload URL.
- `POST /`: Save document metadata in MongoDB after a successful client upload to S3; submits classification and fraud checks to Truuth APIs.
- `POST /update-status`: Polling endpoint to check Truuth GET API and update local statuses for pending `externalRefId`s.
- `POST /submit`: Finalizes document submission workflow, updating User profile to `DOCUMENT_SUBMITTED`.
- `POST /restart`: Wipes tracking collections completely for the User, resetting layout to initial states.

## Where Files Are Stored

User-uploaded files are strictly stored in **AWS S3**. No documents are kept on the local application server, ensuring high scalability and security.

- The S3 keys dynamically organise files to ensure separation of concerns:
  `[AWS_S3_BUCKET_FOLDER]/uploads/users/[userId]/[uuid]-[sanitizedFileName]`
- AWS access is strictly governed by IAM roles and credentials provided in the backend configuration.

## User Documentation Upload Flow

The upload flow relies on a direct-to-S3 architecture, keeping the node backend lightweight by offloading file transfer overhead:

1. **Initiate Upload**: From the frontend UI, a user selects a required document (e.g., Resume, Passport, Driver Licence) or an additional document and picks a local file to upload.
2. **Request Pre-signed URL**: The frontend sends a metadata request (`POST /api/documents/presigned-url`) to the backend.
3. **Generate URL**: The backend generates a secure, time-limited (15 minutes) AWS S3 pre-signed upload URL using `@aws-sdk/s3-request-presigner` and returns it back to the client.
4. **Direct Client Upload**: The frontend explicitly executes an HTTP PUT request using the provided pre-signed URL to securely upload the binary file *directly* to AWS S3.
5. **Save Metadata**: Once the S3 upload successfully concludes, the frontend triggers a confirmation request (`POST /api/documents`) to the backend containing the file's S3 Key, generic metadata, and categorized Document Type. The backend saves this record to MongoDB.
6. **Update Progress**: The user's document list and verification tracking progress circle reflects the latest uploaded documents.

## Developer Quick Start

1. Start exactly two terminal sessions.
2. In Terminal A, `cd portal-backend` and run `npm run dev` to start the backend with nodemon.
3. In Terminal B, `cd portal-frontend` and run `npm run dev` to boot the Vite deployment.
4. Using an empty test database, sign up a new account, test uploading to S3, and watch the automated Polling verify the documents via Truuth.
