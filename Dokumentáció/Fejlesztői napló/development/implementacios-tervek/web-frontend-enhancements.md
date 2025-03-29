# Plan: Enhancing the Web Application (Focus: Product Catalog)

**Phase 1: Analysis & Planning**

1.  **Information Gathering:** Review project structure, relevant source code (`ProductCatalogPage`, `ProductCatalogBrowser`, `CategorySelector`), and documentation (`funkciok.md`). (Completed)
2.  **Identify Improvement Areas:** Pinpoint opportunities in UI, UX, performance, and features based on the analysis. (Completed)
3.  **Formulate Recommendations:** Create specific, actionable suggestions. (Completed)
4.  **User Review:** Present the plan and recommendations for feedback and approval. (Completed)
5.  **Save Plan:** Write the approved plan to a Markdown file. (Completed)
6.  **Transition:** Suggest switching to 'code' mode for implementation. (Completed - already in code mode)

**Phase 2: Implementation (Requires 'code' mode)**

1.  Implement backend changes (API endpoints for efficient filtering, sorting, pagination, category counts).
2.  Implement frontend changes based on the approved recommendations.
3.  Test thoroughly across different devices and scenarios.

---

## Recommendations

### I. General Web Application Improvements

*   **Performance - Backend Counts:**
    *   **Recommendation:** Modify the backend API (`CategoryService`, `ProductCatalogService`) to calculate and return product counts per category directly, instead of fetching all products in `CategorySelector.jsx` just for counts.
    *   **Impact:** High (Significant performance improvement, especially with large catalogs).
    *   **Priority:** High.
*   **State Management:**
    *   **Recommendation:** Evaluate if a global state management solution (React Context API, Zustand, Redux Toolkit) would simplify state sharing (e.g., selected list, user info) compared to prop drilling, especially if the application grows.
    *   **Impact:** Medium (Improved maintainability and scalability).
    *   **Priority:** Medium.
*   **Error Handling:**
    *   **Recommendation:** Implement more robust and user-friendly error states beyond Snackbars. Consider dedicated error components or visual cues within the affected sections (e.g., inline error messages for failed data fetching).
    *   **Impact:** Medium (Improved UX).
    *   **Priority:** Medium.

### II. Specific 'Termékkatalógus' Page Improvements

#### A. Layout, Visual Design, Clarity, Responsiveness

*   **Clarity - Page Structure:**
    *   **Recommendation:** Clarify the purpose of the Tabs (`selectedTab` state in `ProductCatalogPage.jsx`). If they represent different views (e.g., "Browse Catalog", "My Favorite Products"), ensure clear labeling and distinct content.
    *   **Impact:** Medium (Improved navigation and understanding).
    *   **Priority:** Medium.
*   **Visual Design - Product Card (`ProductCatalogItem`):**
    *   **Recommendation:** Refine the information hierarchy on the product card. Consider making the product name more prominent, grouping related info (like category/tags), and potentially using icons more consistently for details (unit, brand). Evaluate if the current hover effect is optimal or potentially distracting.
    *   **Impact:** Medium (Improved readability and aesthetics).
    *   **Priority:** Medium.
*   **Responsiveness:**
    *   **Recommendation:** While Material UI provides base responsiveness, conduct thorough testing on various screen sizes (small mobile, large mobile, tablet, desktop). Pay special attention to the grid layout, card content truncation, and the usability of filter/sort controls on smaller screens. Ensure the category chips/list and search/filter/sort buttons adapt gracefully.
    *   **Impact:** High (Ensures usability across devices).
    *   **Priority:** High.

#### B. Filtering, Sorting, Search

*   **Performance - Backend Operations:**
    *   **Recommendation:** Move filtering, sorting, and pagination logic to the backend API. The frontend should send parameters (search query, sort order, filters, page number, items per page) and receive only the relevant subset of data.
    *   **Impact:** High (Crucial for performance and scalability).
    *   **Priority:** High.
*   **Filtering - Advanced Options:**
    *   **Recommendation:** Implement multi-select facet filtering. Replace or augment the single `CategorySelector` with a dedicated filter panel (potentially in a drawer/modal) allowing users to filter by:
        *   Multiple Categories (checkboxes).
        *   Tags (checkboxes/chips).
        *   Brand (checkboxes/searchable list).
        *   Price Range (slider or input fields - *requires adding price data*).
        *   Other relevant attributes (e.g., "On Sale", ratings - *requires adding data*).
        *   Update the `AdvancedSearch` component to reflect the number of *active* filters clearly.
    *   **Impact:** High (Significantly improved product discovery).
    *   **Priority:** High.
*   **Sorting - More Options:**
    *   **Recommendation:** Add more sorting options:
        *   Price (Low to High, High to Low - *requires adding price data*).
        *   Rating/Popularity (High to Low).
        *   Date Added (Newest First).
        *   Relevance (if search is implemented effectively).
        *   Update the sort selection UI (currently a menu in `ProductCatalogBrowser`) to accommodate these.
    *   **Impact:** Medium (Improved user control).
    *   **Priority:** Medium.
*   **Search - Enhancements:**
    *   **Recommendation:** Improve the search functionality:
        *   Implement backend search for efficiency.
        *   Add auto-suggestions/autocomplete as the user types.
        *   Consider typo tolerance (fuzzy search).
        *   Search across multiple fields (name, description, tags, brand).
    *   **Impact:** High (Improved usability and product discovery).
    *   **Priority:** High.

#### C. Product Information Presentation

*   **Pricing:**
    *   **Recommendation:** Add price information to the `ProductCatalog` model (backend) and display it clearly on the `ProductCatalogItem` card. Consider showing regular vs. sale prices if applicable.
    *   **Impact:** High (Essential information for users).
    *   **Priority:** High.
*   **Product Variations:**
    *   **Recommendation:** Define how product variations (e.g., different sizes, colors, flavors) are handled. This might involve:
        *   Grouping variations under a single main product card with options to select.
        *   Displaying variations as separate cards with clear links between them.
        *   Requires backend model changes.
    *   **Impact:** High (Accurate product representation).
    *   **Priority:** High (depending on product types).
*   **Detailed View:**
    *   **Recommendation:** Ensure a clear path to a more detailed product view (potentially using the `ProductDetails` component mentioned in `ProductCatalogPage.jsx`). This view should show larger images, full description, specifications, user reviews (if implemented), etc. Clicking the card title or an "info" icon could navigate here.
    *   **Impact:** Medium (Provides comprehensive information).
    *   **Priority:** Medium.
*   **Units:**
    *   **Recommendation:** Clarify the `defaultUnit` display. Ensure it's contextually relevant (e.g., "kg", "liter", "pack" instead of just "db" - piece). Allow users to potentially select different units when adding to the list if applicable.
    *   **Impact:** Low-Medium (Improved clarity).
    *   **Priority:** Low.

#### D. User Engagement

*   **Wishlist/Favorites:**
    *   **Recommendation:** Implement a "Save for Later" or "Add to Favorites" feature, allowing users to bookmark products from the catalog without adding them directly to a shopping list.
    *   **Impact:** Medium (Enhances user retention and planning).
    *   **Priority:** Medium.
*   **Ratings & Reviews:**
    *   **Recommendation:** Consider adding a simple rating system (e.g., 5-star) and potentially user reviews for products in the catalog. This requires backend support.
    *   **Impact:** Medium-High (Builds social proof and aids decision-making).
    *   **Priority:** Medium-Low (Can be added later).
*   **Visual Feedback:**
    *   **Recommendation:** Enhance visual feedback on actions. For example, when adding a product to the list, provide a brief animation or confirmation directly on the card or button, in addition to the Snackbar.
    *   **Impact:** Low (Minor UX polish).
    *   **Priority:** Low.