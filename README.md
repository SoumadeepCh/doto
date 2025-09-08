# Todo List Web App

This is a full-stack todo list web application built with Next.js, offering a modern and feature-rich user experience. It includes user authentication, todo management, and analytics to track your productivity.

## Features

*   **User Authentication:** Secure sign-up and sign-in functionality.
*   **Todo Management:** Create, read, update, and delete your tasks.
*   **Task Filtering:** Filter tasks by status (all, active, completed).
*   **Productivity Analytics:** Visualize your task completion and productivity over time with charts.
*   **Sample Data:** Option to initialize the app with sample data to quickly explore the features.
*   **Responsive Design:** A clean and responsive UI that works on all devices.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **Database:** [MongoDB](https://www.mongodb.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Analytics:** [Chart.js](https://www.chartjs.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18.x or later)
*   npm or yarn

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/your_repository_.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Set up your environment variables. Create a `.env.local` file and add the following:
    ```
    # MongoDB Connection String
    MONGODB_URI=your_mongodb_connection_string

    # NextAuth.js secret
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000
    ```
4.  Run the development server
    ```sh
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Live Demo

You can view a live demo of the application at [https://doto-lime.vercel.app](https://doto-lime.vercel.app).