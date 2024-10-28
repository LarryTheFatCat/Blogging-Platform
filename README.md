# Blogging Application

To whomever is reading this, it was created using the following tools:

- React.JS
- Next.JS
- TailwindCSS
- NextUI
- Firebase (Firebase Authentication, Firestore DB, Storage)

### To Get Started

1. Go to [Firebase](https://www.firebase.com/)
2. Click "Go to console" located on the Navigation bar on the top left
3. Click "Create a project"
4. Set the name to anything you wish for it to be
5. Enable/Disable google analytics, it's up to you
6. Finally click Create Project
7. Located on the sidebar on the middle-left side of the screen click "Build"
8. Under the "Build" section, click on "Authentication"
9. Click "Get started" and enable Email/Password authentication
10. Go back to the "Build" section and click on "Firestore Database"
11. Click "Create database" and choose "Start in test mode"
12. Go back to the "Build" section once more and click on "Storage"
13. Click "Get started" and follow the prompts to set up storage

### Setting up the project

1. Clone this repository to your local machine
2. Run `npm install` to install all dependencies
3. Create a `.env.local` file in the root directory of the project
4. Add your Firebase configuration to the `.env` file:

```.env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5) Run `npm run dev` to start the development server
6) Open `http://localhost:3000` in your browser to view the application

### Features

- User authentication (sign up, login, logout)
- Create, read, update, and delete blog posts
- Upload and manage images for blog posts
- Responsive design using TailwindCSS and NextUI

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### License

This project is licensed under the MIT License.

### Issues

If you encounter any problems or have suggestions for improvements, please open an issue on the GitHub repository. When reporting issues, please include:

1. A clear and descriptive title
2. Steps to reproduce the problem
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Your environment (OS, browser, version, etc.)
