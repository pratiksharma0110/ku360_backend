
# KU 360 Backend

This is the backend for the KU 360 application. It handles the server-side logic, routes, middleware, and database interactions.

## Getting Started

Follow the steps below to set up and run the project.

### Prerequisites

Ensure that you have the following installed on your machine:

- **Node.js**: [Download here](https://nodejs.org/)
- **npm** (Node Package Manager): Comes bundled with Node.js

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ku360-backend.git
   ```
   
2. Go to the project directory and create a `.env` file:

   ```bash
   cd ku360_backend
   ```

3. Add the following to your `.env` file:

   ```plaintext
   # Database URI
   DB_URI=mongodb+srv://${username}:${password}@${cluster}/KU360?authSource=${authSource}&authMechanism=${authMechanism}
   # (Generate the connection string from MongoDB website)


   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_SECRET_KEY=<your_cloudinary_secret_key>

   # Token Secrets
   ACCESS_TOKEN_SECRET=<your_access_token_secret>
   REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
   ```

   Replace placeholder values (`<your_cloudinary_cloud_name>`, `<your_access_token_secret>`, etc.) with your actual configuration values.

4. Install all required modules:

   ```bash
   npm install
   ```
   
5. Running the server:

   - For development (with live reload):

     ```bash
     npm run dev
     ```

   - For production:

     ```bash
     npm start
     ```

### Important

- **Do not commit your `.env` file** to version control. Make sure it's included in your `.gitignore` file.

---

