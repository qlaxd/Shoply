# React Native Mobile Application Plan

This document outlines the plan for developing the React Native mobile application for the Shopping List project, based on the analysis of the existing web application (backend and frontend).

## 1. Core Feature Set (Mirroring Web App)

The mobile application will implement the essential features currently available in the web application:

*   **User Authentication:**
    *   Login / Register (Email/Username &amp; Password)
    *   Secure session management (e.g., using JWT)
    *   (Consider adding Password Reset functionality)
*   **Dashboard:**
    *   View owned and shared shopping lists.
    *   Basic sorting/filtering options suitable for mobile.
*   **List Creation &amp; Editing:**
    *   Create new lists (Title, Priority).
    *   View/Edit list details (Title, Priority).
    *   Add products (Manual entry, potentially Catalog Search).
    *   Edit products within a list (Name, Quantity, Unit, Notes).
    *   Mark products as purchased/unpurchased.
    *   Delete products from a list.
    *   Delete entire lists (with confirmation).
*   **List Sharing:**
    *   Share lists with other registered users (Search users by username/email).
    *   Assign permissions (View, Edit).
    *   View shared list members and their permissions.
    *   Unshare lists.
*   **User Profile Management:**
    *   View/Edit user profile information.
    *   Change password.

## 2. Mobile-First Architecture &amp; Improvements

The mobile app will be built with React Native, focusing on a native user experience and leveraging mobile capabilities:

*   **Directory Structure:** Follow standard React Native best practices (as previously discussed):
    ```
    /src
    ├── assets/
    ├── components/ (common/, features/)
    ├── constants/
    ├── hooks/
    ├── navigation/
    ├── screens/ (Auth/, Dashboard/, List/, Profile/, Settings?)
    ├── services/ (api/, auth.service, list.service, etc.)
    ├── store/ (e.g., Redux Toolkit slices: auth, lists, ui)
    ├── types/
    └── utils/
    ```
*   **UI/UX:**
    *   **Native Look &amp; Feel:** Utilize a suitable component library (e.g., React Native Paper, NativeBase) or custom components adhering to iOS/Android guidelines.
    *   **Navigation:** Implement native-style navigation (Stacks, Tabs) using React Navigation.
    *   **Gestures:** Incorporate intuitive swipe gestures (e.g., swipe item to delete).
    *   **Optimized Forms:** Design for mobile input (touch targets, keyboard types).
    *   **Loading/Empty States:** Clear visual feedback (skeletons, spinners, empty state messages).
    *   **Dark Mode:** Support system preference.
*   **Performance Optimization:**
    *   **Virtualization:** Use `FlatList`/`SectionList` for long lists.
    *   **Memoization:** Use `React.memo`, `useMemo`, `useCallback`.
    *   **Bundle Size:** Monitor and optimize.
    *   **Image Optimization:** Use appropriate formats/sizes (e.g., WebP).
*   **Offline Data Access &amp; Synchronization:**
    *   **Strategy:** Implement an offline-first approach.
    *   **Local Storage:** Use a robust local storage solution (e.g., AsyncStorage for simple data, WatermelonDB or Realm for more complex relational data and querying).
    *   **Queueing Changes:** Queue offline actions locally.
    *   **Synchronization:** Sync queued changes with the backend upon reconnection. Implement a conflict resolution strategy (backend support needed).
    *   **UI Feedback:** Indicate offline status and sync progress.
*   **Push Notifications:**
    *   **Use Cases:** List shared, shared list updated by others, (optional) reminders.
    *   **Implementation:** Use FCM/APNs via libraries like `@react-native-firebase/messaging`.
*   **Native Device Features:**
    *   **Camera:** Barcode scanning for product lookup/addition.
    *   **Biometrics:** Offer Face ID/Touch ID login for enhanced security and convenience.
    *   **(Optional) Location Services:** Geofenced reminders.

## 3. Required Backend Modifications/Additions

To fully support the mobile application's features, the following backend adjustments are necessary:

*   **Synchronization Support:**
    *   **Timestamps/Versioning:** Ensure reliable `updatedAt` timestamps or version numbers on `List` and embedded `products` for conflict detection.
    *   **Delta Sync API (Recommended):** Endpoint(s) to fetch changes since the last sync time/version.
    *   **Conflict Resolution Logic:** Define backend strategy for handling conflicting updates.
*   **Push Notification Endpoints:**
    *   Register device push tokens per user.
    *   Trigger notifications based on relevant events (list shared, list updated).
*   **Barcode Lookup Endpoint:** `GET /api/product-catalog/barcode/:barcode` to find catalog items by barcode.
*   **Permissions Endpoint (Refinement):** Consider `GET /api/lists/:id/permissions` for explicit permission checking by the client.
*   **API Response Consistency:** Ensure responses include necessary IDs and nested data (e.g., user details in `addedBy`).
*   **User Search Enhancement:** Ensure user search (`/api/users/search`) is efficient and suitable for mobile typeahead/autocomplete scenarios.