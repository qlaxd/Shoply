# Project File Structure

## Backend
- **Forráskód/Backend/server.js**: The main entry point for the backend server. It sets up the Express server, connects to the MongoDB database, and initializes middleware and routes.
- **Forráskód/Backend/routes/**: Contains all the route definitions for the backend API.
    - **Forráskód/Backend/routes/auth.js**: Handles authentication-related routes such as login, registration, and token verification.
    - **Forráskód/Backend/routes/lists.js**: Manages routes related to shopping lists, including creating, updating, and deleting lists.
- **Forráskód/Backend/controllers/**: Contains the logic for handling requests and responses.
    - **Forráskód/Backend/controllers/authController.js**: Contains functions for user authentication, including login, registration, and token management.
    - **Forráskód/Backend/controllers/listController.js**: Handles operations related to shopping lists, such as adding items, updating lists, and sharing lists.
- **Forráskód/Backend/models/**: Defines the data models used by the application.
    - **Forráskód/Backend/models/User.js**: Defines the schema for user data, including fields for username, email, and password.
    - **Forráskód/Backend/models/List.js**: Defines the schema for shopping lists, including fields for list name, items, and shared users.
- **Forráskód/Backend/middleware/**: Contains middleware functions for request processing.
    - **Forráskód/Backend/middleware/authMiddleware.js**: Middleware for verifying JWT tokens and protecting routes.
- **Forráskód/Backend/utils/**: Utility functions and helpers.
    - **Forráskód/Backend/utils/logger.js**: A utility for logging messages and errors.

## Frontend
- **Forráskód/Web/src/index.js**: The main entry point for the React application. It renders the root component and sets up the Redux store.
- **Forráskód/Web/src/App.js**: The main application component that defines the structure and routing of the app.
- **Forráskód/Web/src/components/**: Contains reusable React components.
    - **Forráskód/Web/src/components/Header.js**: The header component that displays the application name and navigation links.
    - **Forráskód/Web/src/components/List.js**: A component for displaying a shopping list and its items.
    - **Forráskód/Web/src/components/ListItem.js**: A component for displaying individual items in a shopping list.
- **Forráskód/Web/src/pages/**: Contains components for different pages of the application.
    - **Forráskód/Web/src/pages/Home.js**: The home page component that displays the user's shopping lists.
    - **Forráskód/Web/src/pages/Login.js**: The login page component for user authentication.
    - **Forráskód/Web/src/pages/Register.js**: The registration page component for new users.
- **Forráskód/Web/src/redux/**: Contains Redux-related files for state management.
    - **Forráskód/Web/src/redux/actions/**: Defines action creators for Redux.
        - **Forráskód/Web/src/redux/actions/authActions.js**: Actions related to user authentication.
        - **Forráskód/Web/src/redux/actions/listActions.js**: Actions related to shopping lists.
    - **Forráskód/Web/src/redux/reducers/**: Defines reducers for handling state changes.
        - **Forráskód/Web/src/redux/reducers/authReducer.js**: Reducer for authentication state.
        - **Forráskód/Web/src/redux/reducers/listReducer.js**: Reducer for shopping list state.
    - **Forráskód/Web/src/redux/store.js**: Configures and exports the Redux store.

## Shared
- **Forráskód/shared/**: Contains code that is shared between the backend and frontend.
    - **Forráskód/shared/constants.js**: Defines constants used throughout the application.
    - **Forráskód/shared/validation.js**: Contains validation functions for input data.

## Configuration
- **Forráskód/Backend/.env.example**: Example environment variables for the backend.
- **Forráskód/Web/.env.example**: Example environment variables for the frontend.
- **Forráskód/Backend/package.json**: Lists backend dependencies and scripts.
- **Forráskód/Web/package.json**: Lists frontend dependencies and scripts.
- **Forráskód/Backend/.gitignore**: Specifies files and directories to be ignored by Git in the backend.
- **Forráskód/Web/.gitignore**: Specifies files and directories to be ignored by Git in the frontend.

## Scripts
- **Forráskód/Backend/scripts/**: Contains scripts for backend operations.
    - **Forráskód/Backend/scripts/start.sh**: A script to start the backend server.
- **Forráskód/Web/scripts/**: Contains scripts for frontend operations.
    - **Forráskód/Web/scripts/start.sh**: A script to start the frontend development server.

This structure provides a clear separation of concerns, making it easier to manage and scale the application.