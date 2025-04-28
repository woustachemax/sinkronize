# Hello World, Welcome to Sinkronize 

A wise person once said, **"You can just build things."**
However, turning that simple idea into reality often requires either significant prompting or the collaboration of a highly skilled co-builder to stay on track and effectively "build things."
That's precisely where Sinkronize comes in.

Sinkronize isn;t just a passion project, a complete end-to-end application designed to connect individuals who share your ambition but may need assistance or are ready to offer their expertise in building.

## How It Was Built

Sinkronize uses a simple yet powerful text-based set of tools, including:

* **Frontend Framework:** Next.js (based on React, helps build fast web pages)
* **Backend Environment:** Node.js (runs the server-side code)
* **Database:** PostgreSQL (stores the application's data)
* **ORM (Object-Relational Mapper):** Prisma (helps the application talk to the database)
* **Validation:** Zod (makes sure the data is correct)
* **Password Hashing:** bcrypt (keeps user passwords secure)
* **Styling and Icons:** Tailwind CSS and Lucide React (for a modern look and icons)
* **Authentication:** Google Auth (easy way for users to log in)
* **Chat:** Real-time messaging (we're still working on this!)
* **UI Design:** Figma (tool used to plan how the app looks)

---

## Clone and Build Locally

To run this project on your computer, follow these steps:

### What You Need

1.  **Node.js** - Make sure you have Node.js (version 16 or newer) installed. Get it here: [https://nodejs.org/](https://nodejs.org/)
2.  **PostgreSQL** - You need PostgreSQL installed on your computer or access to a PostgreSQL database. Download it here: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
3.  **Yarn or npm** - You can use either Yarn or npm to install the necessary tools.

---

### Step-by-Step Instructions

1.  **Get the code:**

    ```bash
    git clone https://github.com/woustachemax/sinkronize.git
    cd sinkronize
    ```

2.  **Install the tools:**

    Use either npm:

    ```bash
    npm install
    ```

    Or Yarn:

    ```bash
    yarn install
    ```

3.  **Set up the database:**

    * Create a new database named `sinkronize` in your local PostgreSQL.
    * Find the `.env` file in the main folder of the project and open it.
    * Change the lines that start with `DATABASE_URL` and `JWT_SECRET` to match your PostgreSQL settings and a secret key. Here's an example:

        ```env
        DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/sinkronize"
        JWT_SECRET="your_secret_key_here"
        ```

4.  **Prepare the database:**

    Sinkronize uses Prisma to manage the database. Run this command to set up the database structure:

    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

5.  **Start the application:**

    After setting up the database, start the local development server:

    ```bash
    npm run dev
    ```

    This will make the project accessible in your web browser at `http://localhost:3000`.

## Features in Progress

* **Real-Time Chat:** We are currently building a live chat feature so users can talk to each other.

---

Thank you for checking out Sinkronize!

Feel free to help out and contribute, 🤎 [woustachemax](https://woustachemax.github.io/portfolio/).