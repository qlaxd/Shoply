# Admin Platform Enhancement Plan - Phase 2 Frontend (WPF) Implementation

## 1. Introduction

This document details the frontend implementation steps for Phase 2 of the Admin Platform Enhancement Plan, focusing on the C# WPF application located in `Forráskód/Asztali`. The goal of this phase is to introduce an Analytics Dashboard and enhance reporting capabilities within the admin tool.

## 2. Prerequisites

*   **Backend API Endpoints:** This plan assumes the following backend API endpoints (developed in Phase 1 or separately) are available and functional, requiring admin authentication:
    *   `GET /api/statistics/`: Returns aggregated statistics for the statistics page (e.g., total users, new users, total lists, active lists, popular items).
    *   `GET /api/statistics/users`: Returns user growth statistics.
    *   `GET /api/statistics/lists`: Returns list activity statistics.
    *   `GET /api/statistics/products`: Returns product statistics.
*   **Authentication:** The frontend application must have a mechanism to obtain and include the admin user's authentication token (likely JWT) in requests to these endpoints. The existing `ApiService.cs` likely handles this.
*   **Charting Library (Optional):** If graphical charts are desired for the statistics page, a WPF charting library (e.g., `LiveCharts.Wpf`) should be added as a NuGet package to the `ShoppingListAdmin.Desktop.csproj` project.

## 3. Detailed Implementation Plan

### 3.1. Statistics Page Implementation

**Objective:** Create a new section in the admin tool to display key application metrics at a glance.

**Files to Create/Modify:**

1.  **Model (`Models/Statistics.cs`) - Create:**
    *   Define a C# class `StatisticsModel`.
    *   Add properties corresponding to the data returned by the `/api/statistics/` endpoint (e.g., `TotalUsers`, `NewUsersToday`, `TotalLists`, `ActiveLists`, `PopularItems` which might be a `List<ProductCatalogModel>` or similar). Use appropriate data types.
    *   Consider using JSON property attributes (`[JsonPropertyName("...")]`) if C# property names differ from JSON keys.

2.  **Service (`Services/ApiService.cs` or `Services/StatisticsService.cs`) - Modify/Create:**
    *   **If modifying `ApiService.cs`:** Add a new asynchronous method `GetStatisticsAsync()`.
    *   **If creating `StatisticsService.cs`:** Create the new service class, inject `HttpClient` (or reuse configuration from `ApiService`), and add the `GetStatisticsAsync()` method. Register this service in the dependency injection setup (`App.xaml.cs` or similar).
    *   **Method Implementation:**
        *   Construct the request URL for `/api/statistics/`.
        *   Make an authenticated GET request using `HttpClient`.
        *   Handle the response: check for success status, deserialize the JSON response into `StatisticsModel`.
        *   Implement error handling (e.g., network errors, deserialization errors, unauthorized access).
        *   Return the `StatisticsModel` object or `null`/throw exception on error.

3.  **ViewModel (`ViewModels/Statistics/StatisticsViewModel.cs`) - Create:**
    *   Create a new folder `ViewModels/Statistics`.
    *   Create the `StatisticsViewModel` class, inheriting from `ViewModels/Base/BaseViewModel.cs`.
    *   Inject the relevant service (`ApiService` or `StatisticsService`) via the constructor.
    *   Define public properties for each statistic to be displayed (e.g., `int TotalUsers`, `int NewUsersToday`, `ObservableCollection<ProductCatalogModel> PopularItems`). Ensure `INotifyPropertyChanged` is implemented (via `BaseViewModel`).
    *   **(Optional - Charts):** Define properties suitable for the charting library (e.g., `SeriesCollection ChartSeries` for LiveCharts).
    *   Create an `ICommand` (e.g., `LoadStatisticsCommand`) using a helper class or library (like `RelayCommand` if used elsewhere in the project).
    *   Implement the `async void ExecuteLoadStatisticsCommand()` method:
        *   Set an `IsLoading` flag (property in `BaseViewModel`?) to true.
        *   Call the `GetStatisticsAsync()` service method within a try-catch block.
        *   On success, update the ViewModel properties with the data from the returned model.
        *   **(Optional - Charts):** Populate chart series data based on the statistics.
        *   Handle errors appropriately (e.g., set an error message property).
        *   Set `IsLoading` flag to false in a `finally` block.
    *   Call the `LoadStatisticsCommand` automatically when the ViewModel is initialized (e.g., in the constructor or an `InitializeAsync` method).

4.  **View (`Views/Statistics/StatisticsView.xaml`) - Create:**
    *   Create a new folder `Views/Statistics`.
    *   Create a `UserControl` named `StatisticsView.xaml`.
    *   **(XAML):**
        *   Design the layout (e.g., using `Grid`, `StackPanel`).
        *   Add `TextBlock`s or `Label`s to display scalar statistics (e.g., Total Users). Bind their `Text` property to the corresponding ViewModel properties (`{Binding TotalUsers}`).
        *   Add an `ItemsControl` or `DataGrid` to display lists like `PopularItems`. Bind `ItemsSource`. Define `ItemTemplate` or `DataGridColumns`.
        *   **(Optional - Charts):** Add the chart controls from the chosen library (e.g., `<lvc:CartesianChart Series="{Binding ChartSeries}">`). Configure axes as needed. Remember to add the XAML namespace for the charting library.
        *   Consider adding a loading indicator bound to the `IsLoading` property and an error message display bound to an error property in the ViewModel.
    *   **(Code-behind - `StatisticsView.xaml.cs`):** Typically minimal, just the default constructor calling `InitializeComponent()`.

5.  **Integration:**
    *   **`ViewModels/MainViewModel.cs` - Modify:**
        *   Add a property for the `StatisticsViewModel` instance (e.g., `public StatisticsViewModel StatisticsVM { get; }`). Instantiate it in the constructor, passing dependencies.
        *   Add an `ICommand` (e.g., `NavigateToStatisticsCommand`) that sets the `CurrentViewModel` property (assuming this pattern is used) to the `StatisticsVM` instance.
    *   **`Views/LeftPanel.xaml` or `Views/Menu.xaml` - Modify:**
        *   Add a `Button` or `RadioButton` for "Statistics".
        *   Bind its `Command` property to the `NavigateToStatisticsCommand` in the `MainViewModel` (likely via `DataContext`).
    *   **`Resources/ViewModelViewDataTamplate.xaml` - Modify:**
        *   Add a `<DataTemplate>` to map `StatisticsViewModel` to `StatisticsView`:
          ```xml
          <DataTemplate DataType="{x:Type vm:StatisticsViewModel}">
              <v:StatisticsView/>
          </DataTemplate>
          ```
          (Ensure `vm` and `v` XML namespaces point to the correct ViewModel and View folders).
    *   **`App.xaml.cs` (or DI Container Setup) - Modify:**
        *   Register `StatisticsViewModel` and `StatisticsService` (if created) with the dependency injection container if one is used.

### 3.2. Basic Reporting UI Implementation

**Objective:** Enhance the existing Statistics section or create new views to display detailed data fetched from the backend statistics endpoints.

**Files to Create/Modify:**

1.  **Models (`Models/*StatsModel.cs` or reuse existing) - Verify/Create:**
    *   Ensure C# classes exist to represent the data structures returned by `/api/statistics/users`, `/api/statistics/lists`, and `/api/statistics/products`. These might be simple classes with properties matching the API response. Reuse existing models like `UserModel` or `ListModel` if the structure matches, otherwise create specific models (e.g., `UserGrowthStatModel`).

2.  **Service (`Services/StatisticsService.cs` or `ApiService.cs`) - Modify/Create:**
    *   Ensure methods exist to call the specific statistics endpoints:
        *   `GetUserGrowthStatsAsync()` -> `GET /api/statistics/users`
        *   `GetListActivityStatsAsync()` -> `GET /api/statistics/lists`
        *   `GetProductStatsAsync()` -> `GET /api/statistics/products`
    *   These methods should handle authentication, make the GET request, deserialize the JSON array response into a `List<YourModel>`, and handle errors.

3.  **ViewModel (`ViewModels/Statistics/StatisticsViewModel.cs`) - Modify:**
    *   Inject the service providing the statistics methods.
    *   Add `ObservableCollection<YourModel>` properties for each data type (e.g., `ObservableCollection<UserGrowthStatModel> UserStats { get; }`). Initialize them.
    *   Add `ICommand` properties for loading each type of data (e.g., `LoadUserStatsCommand`, `LoadListStatsCommand`, `LoadProductStatsCommand`).
    *   Implement the corresponding `async void ExecuteLoad...Command()` methods:
        *   Set `IsLoading` flag.
        *   Clear the relevant `ObservableCollection`.
        *   Call the appropriate service method (e.g., `GetUserGrowthStatsAsync`).
        *   On success, populate the collection with the returned data.
        *   Handle errors.
        *   Clear `IsLoading` flag.
    *   Consider adding properties and logic for basic filtering or sorting if required, which would manipulate the collections.

4.  **View (`Views/Statistics/StatisticsView.xaml`) - Modify:**
    *   Ensure the `DataContext` is set to `StatisticsViewModel`.
    *   Use `TabControl` or separate sections within the view for different reports (Users, Lists, Products).
    *   Use `DataGrid` controls within each section/tab.
        *   Bind `ItemsSource` to the corresponding `ObservableCollection` in the ViewModel (e.g., `{Binding UserStats}`).
        *   Define `DataGrid.Columns` (`DataGridTextColumn`, `DataGridCheckBoxColumn`, etc.) to display the relevant properties from the models. Set `Header` and `Binding` for each column.
        *   Enable sorting/filtering on the `DataGrid` if desired (some basic functionality is built-in).
    *   Add `Button`s to trigger the `Load...Command`s in the ViewModel.
    *   Include loading/error indicators as needed.

5.  **Integration:**
    *   Most integration likely exists if enhancing the current `StatisticsView`.
    *   Update DI registration in `App.xaml.cs` if new services were added or dependencies changed for `StatisticsViewModel`.

## 4. Conclusion

Completing these steps will provide the frontend implementation for Phase 2, adding valuable analytics and reporting features to the WPF admin application. Remember to handle potential errors gracefully (network issues, API errors, data parsing problems) and provide feedback to the user (e.g., loading indicators, error messages).