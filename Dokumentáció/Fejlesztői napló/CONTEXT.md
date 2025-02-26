# Shopping Lists Web App - Detailed App Flow and Features

This document provides a detailed explanation of the app's flow and features. It's designed for developers working with the MERN stack (MongoDB, Express, React, Node.js) to implement a shared shopping lists application. Note that user authentication (via email) is already implemented.

---

## Table of Contents
1. [Overview](#overview)
2. [User Journey](#user-journey)
3. [Application Flow](#application-flow)
4. [Feature Details](#feature-details)
5. [Data Models](#data-models)
6. [API Endpoints](#api-endpoints)
7. [React Components Overview](#react-components-overview)
8. [Implementation Considerations](#implementation-considerations)
9. [Summary](#summary)

---

## Overview

- **Purpose:**  
  To help users create, manage, and share shopping lists in a collaborative environment. Users can add products to lists, set priorities, and see who contributed to each list.

- **Tech Stack:**  
  - **Frontend:** React  
  - **Backend:** Node.js & Express  
  - **Database:** MongoDB  
  - **Authentication:** Email-based (already implemented)

---

## User Journey

1. **Welcome Screen:**  
   - A clean, minimalistic welcome screen is presented upon app launch.
   - Provides options to sign up or log in.

2. **Sign Up / Login:**  
   - Users sign up with their email (or log in if they already have an account).
   - Upon successful authentication, users are redirected to the Main Dashboard.

3. **Main Dashboard:**  
   - Displays the current shopping lists, sorted by priority.
   - Shows lists that are still "not completed/purchased."
   - Includes a quick-add input and a "+" button to create new lists.

4. **Creating a New List:**  
   - New list creation is initiated via the quick-add input or the "+" button.
   - Upon creation, the user is taken to Edit List mode.

5. **Edit List Mode:**  
   - Users can add products to the list.
   - The app supports collaborative editing: any user can add a product to a shared list.
   - After adding products, the user finalizes the list by giving it a title (e.g., "Weekend Grill Party").

6. **Collaboration & Visibility:**  
   - All active (not completed/purchased) lists are visible on the dashboard.
   - Each product entry shows which user added it.

---

## Application Flow

### 1. Welcome Screen
- **Design:**  
  - A simple, clean UI that immediately directs users to sign up or log in.
- **Action:**  
  - User clicks the sign-up/login button, triggering the authentication flow.

### 2. Authentication (Sign Up / Login)
- **Process:**  
  - Users enter their email credentials.
  - Successful authentication redirects them to the Main Dashboard.

### 3. Main Dashboard
- **Components Displayed:**  
  - **Shopping Lists:**  
    - Lists are sorted by user-defined priority.
    - Only active (not completed/purchased) lists are shown.
    - Each list displays the title, products, and contributor details.
  - **List Creation Options:**  
    - Quick-add input for rapid list creation.
    - A dedicated "+" button to create a new list.

### 4. Creating & Editing a List
- **Initiation:**  
  - User triggers new list creation via quick-add or the "+" button.
- **Edit List Mode:**  
  - User adds products to the list.
  - Collaboration is enabled so multiple users can add products.
  - After populating the list, the user finalizes it by assigning a title.
- **Outcome:**  
  - The finalized list is saved and visible on the dashboard.

### 5. Collaboration & Product Attribution
- **Shared Lists:**  
  - Any authenticated user can add products to a shared list.
  - Each product entry includes metadata about who added it.

---

## Feature Details

- **Clean Welcome Experience:**  
  - A visually appealing, minimalistic entry point to encourage user engagement.

- **Dashboard with Priority Sorting:**  
  - Lists are organized by a priority value, allowing users to see the most important lists first.

- **Quick-Add & Dedicated List Creation:**  
  - Supports rapid creation of lists with minimal input.
  - Provides flexibility in how users initiate new lists.

- **Edit List Mode:**  
  - A focused environment for adding and managing products.
  - Collaborative features allow multiple users to contribute.

- **Product Attribution:**  
  - Clearly displays which user added each product, enhancing transparency in shared environments.

---

## Data Models

### 1. User Schema

### 2. List Schema

### 3. Product Catalog Schema

### 4. AuditLog Schema


## API Endpoints

### Shopping List Endpoints

- [Backend API Dokumentáció](Dokumentáció/Fejlesztői%20napló/api/Backend-API.md)

- **GET /api/lists**  
  Retrieves all active shopping lists for the authenticated user.

- **POST /api/lists**  
  Creates a new shopping list.  
  Payload: Optionally includes initial product details.

- **PUT /api/lists/:id**  
  Updates a specific shopping list (e.g., to add products, update the title, or adjust the priority).

- **DELETE /api/lists/:id**  
  Deletes a shopping list if needed.

### Product Endpoints

- **POST /api/lists/:listId/products**  
  Adds a new product to the specified shopping list.

- **PUT /api/lists/:listId/products/:productId**  
  Updates details or status of a product within a list.

## React Components Overview

1. **WelcomeScreen Component**

   - **Purpose:**  
     Renders the initial welcome UI with sign-up and login options.

2. **Dashboard Component**

   - **Purpose:**  
     Displays active shopping lists sorted by priority.
   - **Features:**  
     - Quick-add input for new lists.
     - A "+" button to create a new list.

3. **ListEditor Component**

   - **Purpose:**  
     Provides the interface for adding products and finalizing a shopping list.
   - **Features:**  
     - Input fields for adding product names.
     - Ability to display and update collaborative product additions.
     - Finalization step to assign a title to the list.

4. **ListItem Component**

   - **Purpose:**  
     Represents individual shopping lists on the dashboard.
   - **Features:**  
     - Displays list title, product count, and priority.
     - Shows details about which user added each product.

## Implementation Considerations

### State Management

- **Options:**  
  Use React Context or Redux for managing global state such as:
  - User authentication data.
  - Shopping list data and real-time updates.

### Real-Time Collaboration

- **Techniques:**  
  Consider using WebSockets (e.g., with Socket.io) to enable real-time updates when multiple users edit a shared list concurrently.

### UI/UX

- **Focus Areas:**  
  - Responsive design for mobile and desktop.
  - Clear loading and error states during API interactions.
  - Intuitive navigation between the dashboard and edit modes.

### Error Handling

- **Strategies:**  
  - Robust error messages for API failures.
  - Fallback UI elements in case of connectivity issues.

## Summary

This document outlines the complete flow and features for the Shopping Lists Web App. The key points include:

- A welcoming, simple entry point leading to secure authentication.
- A Main Dashboard that displays all active shopping lists sorted by priority.
- Easy list creation through quick-add inputs or a dedicated button.
- An Edit List mode that allows collaborative product additions and finalization by assigning a title.
- Detailed data models, API endpoints, and React component structures to guide implementation.
    