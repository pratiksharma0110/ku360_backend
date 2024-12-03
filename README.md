
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
   git clone https://github.com/pratiksharma0110/ku360-backend.git
   ```
   
2. Go to the project directory and create a `.env` file:

   ```bash
   cd ku360_backend
   ```

3. Add the following to your `.env` file:

   ```plaintext
   # Database URI
   DB_URI="connection string from supabase"

   JWT_SECRET = "any random string"
   JWT_LIFE = "time"
   
    ```

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

