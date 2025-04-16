# Admin Platform Enhancement Plan for Shopping List Application

## 1. Introduction

This document outlines the analysis of the current admin platform (`Forráskód/Asztali`) and its backend API (`Forráskód/Backend`) capabilities, compares them against the desired features for a comprehensive admin tool, and proposes a prioritized development plan to bridge the identified gaps.

## 2. Defined Requirements for the Admin Platform

A fully functional admin platform should provide the following capabilities:

**A. User Management:**
    1.  **View Users:** Display a searchable, sortable, paginated list of all registered users.
    2.  **View User Details:** Access detailed profiles for individual users (e.g., registration date, list count, activity logs).
    3.  **Create User:** Manually create new user accounts (optional).
    4.  **Edit User:** Modify user profile information.
    5.  **Manage Roles/Permissions:** Assign/revoke admin privileges, potentially finer-grained roles.
    6.  **Ban/Unban User:** Temporarily or permanently disable user accounts.
    7.  **Delete User:** Permanently remove user accounts.

**B. List Management:**
    1.  **View All Lists:** Display a searchable, sortable, paginated list of *all* shopping lists.
    2.  **Inspect List Content:** View items, collaborators, and history of any list.
    3.  **Modify List Metadata:** Edit list names or other properties (e.g., change ownership).
    4.  **Delete List:** Permanently remove any shopping list.

**C. Item Management:**
    1.  **Manage Global Item Catalog:** Full CRUD operations for the central product catalog.
    2.  **Manage List-Specific Items:** View, edit, or delete items *within any specific user's list*.

**D. Analytics & Reporting:**
    1.  **Dashboard:** Central dashboard with key metrics (user activity, list creation, popular items).
    2.  **Detailed Reports:** Generate reports on user activity, list usage, item popularity.
    3.  **Data Visualization:** Use charts and graphs for trends.

**E. System Configuration:**
    1.  **Manage Settings:** UI to modify backend application settings.
    2.  **Manage Feature Flags:** Enable/disable specific application features dynamically.

**F. Content Moderation:**
    1.  **Review Queue:** (If applicable) Queue for reviewing potentially problematic content.
    2.  **Approve/Reject Content:** Actions to approve or reject flagged content.

## 3. Gap Analysis: Current State vs. Requirements

| Feature Area          | Required Capability                                     | Current Backend Support (via Routes)                                  | Gap                                                                                                |
| :-------------------- | :------------------------------------------------------ | :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **User Management**   | View Users                                              | Yes (`/admin/users`, `/users/search`, `/users/:id`)                   | Minor: UI refinement needed.                                                                       |
|                       | View User Details                                       | Yes (`/users/:id`)                                                    | Minor: Ensure details exposure; add logs if needed.                                                |
|                       | Create User                                             | No explicit admin endpoint                                            | **Yes:** Need API endpoint and UI.                                                                 |
|                       | Edit User                                               | No explicit admin endpoint for *other* users                          | **Yes:** Need API endpoint and UI.                                                                 |
|                       | Manage Roles/Permissions                                | Yes (Promote/Demote Admin)                                            | Minor: Sufficient for basic roles.                                                                 |
|                       | Ban/Unban User                                          | No explicit endpoint                                                  | **Yes:** Need API endpoint (e.g., User `status` field) and UI.                                     |
|                       | Delete User                                             | Yes (`/admin/users/:userId`)                                          | No.                                                                                                |
| **List Management**   | View All Lists                                          | Unclear (`/lists` - likely user-scoped)                               | **Yes:** Need admin endpoint to bypass permissions for viewing *all* lists.                        |
|                       | Inspect List Content                                    | No (Requires `viewPermission`)                                        | **Yes:** Need admin endpoint to bypass permissions.                                                |
|                       | Modify List Metadata                                    | No (Requires `editPermission`/`ownerPermission`)                      | **Yes:** Need admin endpoint to bypass permissions.                                                |
|                       | Delete List                                             | No (Requires `ownerPermission`)                                       | **Yes:** Need admin endpoint to bypass permissions.                                                |
| **Item Management**   | Manage Global Item Catalog                              | Yes (CRUD requires admin)                                             | No.                                                                                                |
|                       | Manage List-Specific Items                              | No (Requires `editPermission`)                                        | **Yes:** Need admin endpoints to bypass permissions for items in any list.                         |
| **Analytics**         | Dashboard                                               | Partial (Separate stats endpoints)                                    | **Yes:** Need backend aggregation endpoint & UI dashboard.                                         |
|                       | Detailed Reports                                        | Partial (Specific area endpoints)                                     | **Yes:** Need UI for reports; potentially more backend endpoints.                                  |
|                       | Data Visualization                                      | No (Backend provides data only)                                       | **Yes:** Need UI implementation (charting).                                                        |
| **System Config**     | Manage Settings                                         | No                                                                    | **Yes:** Need backend models/storage, API, and UI.                                                 |
|                       | Manage Feature Flags                                    | No                                                                    | **Yes:** Need backend models/storage, API, and UI.                                                 |
| **Content Moderation**| Review Queue                                            | No                                                                    | **Yes:** (If needed) Need backend, API, and UI.                                                    |
|                       | Approve/Reject Content                                  | No                                                                    | **Yes:** (If needed) Need API and UI actions.                                                      |

## 4. Prioritized Development Plan

**Phase 1: Foundational Admin Access & User Management Enhancements**
*   **Objective:** Grant admins full visibility and basic control over core entities (Users, Lists).
*   **Priority:** High
*   **Steps:**
    1.  **Backend: Admin List Access Endpoints** (View all/specific lists) - Complexity: Medium
    2.  **Backend: Admin List Modification/Deletion Endpoints** - Complexity: Medium
    3.  **Backend: Admin List Item Management Endpoints** (View/edit/delete items in any list) - Complexity: Medium
    4.  **Backend: Ban/Unban User Endpoint** (Add `status` to User model, update auth) - Complexity: Medium
    5.  **Backend: Edit User Profile (Admin) Endpoint** - Complexity: Medium
    6.  **Frontend (Asztali): Implement List Management Views** (Consume new admin list APIs) - Complexity: Medium
    7.  **Frontend (Asztali): Implement User Management Enhancements** (Ban/Unban UI, Edit Profile UI) - Complexity: Medium

**Phase 2: Analytics Dashboard & Reporting**
*   **Objective:** Provide admins with a high-level overview and basic reporting capabilities.
*   **Priority:** Medium
*   **Steps:**
    1.  **Backend: Aggregated Dashboard Stats Endpoint** - Complexity: Medium
    2.  **Frontend (Asztali): Implement Dashboard View** (Display key metrics, basic charts) - Complexity: High
    3.  **Frontend (Asztali): Basic Reporting UI** (Enhance existing stats views) - Complexity: Medium

**Phase 3: System Configuration & Advanced Features**
*   **Objective:** Allow admins to configure the application and add optional advanced features.
*   **Priority:** Low/Medium (Depending on need)
*   **Steps:**
    1.  **Backend: System Settings Model & API** - Complexity: Medium
    2.  **Frontend (Asztali): Settings Management UI** - Complexity: Medium
    3.  **Backend: Feature Flags Model & API** (Optional) - Complexity: Medium
    4.  **Frontend (Asztali): Feature Flags UI** (Optional) - Complexity: Medium
    5.  **Backend & Frontend: Content Moderation** (Optional) - Complexity: High
    6.  **Backend & Frontend: Create User (Admin)** (Optional) - Complexity: Medium