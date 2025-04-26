using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.Models;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Services;

namespace ShoppingListAdmin.Desktop.ViewModels.Lists
{
    public partial class ListsViewModel : BaseViewModel
    {
        private readonly ListService _listService;
        private ProductListModel? _selectedList;
        private readonly string _authToken;

        [ObservableProperty]
        private bool _isLoading;

        [ObservableProperty]
        private string _errorMessage;

        public ObservableCollection<ProductListModel> Lists { get; private set; }

        public ProductListModel? SelectedList
        {
            get => _selectedList;
            set => SetProperty(ref _selectedList, value);
        }

        // Commands
        public ICommand LoadListsCommand { get; }
        public ICommand CreateListCommand { get; }
        public ICommand UpdateListCommand { get; }
        public ICommand DeleteListCommand { get; }

        public ListsViewModel(string authToken)
        {
            if (string.IsNullOrEmpty(authToken))
            {
                throw new ArgumentException("Auth token cannot be null or empty", nameof(authToken));
            }

            _authToken = authToken;
            Debug.WriteLine("Initializing ListsViewModel...");

            try
            {
                _listService = new ListService(authToken);
                Lists = new ObservableCollection<ProductListModel>();

                // Initialize commands
                LoadListsCommand = new AsyncRelayCommand(ExecuteLoadListsCommand);
                CreateListCommand = new AsyncRelayCommand<ProductListModel>(ExecuteCreateListCommand);
                UpdateListCommand = new AsyncRelayCommand<ProductListModel>(ExecuteUpdateListCommand);
                DeleteListCommand = new AsyncRelayCommand<ProductListModel>(ExecuteDeleteListCommand);

                Debug.WriteLine("ListsViewModel initialized successfully");

                // Load initial data
                _ = ExecuteLoadListsCommand();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error initializing ListsViewModel: {ex}");
                ErrorMessage = $"Hiba történt az inicializálás során: {ex.Message}";
                throw;
            }
        }

        public ListsViewModel()
        {
            // Design-time constructor
            Lists = new ObservableCollection<ProductListModel>();
            LoadListsCommand = new AsyncRelayCommand(ExecuteLoadListsCommand);
            CreateListCommand = new AsyncRelayCommand<ProductListModel>(ExecuteCreateListCommand);
            UpdateListCommand = new AsyncRelayCommand<ProductListModel>(ExecuteUpdateListCommand);
            DeleteListCommand = new AsyncRelayCommand<ProductListModel>(ExecuteDeleteListCommand);
        }

        public async Task ExecuteLoadListsCommand()
        {
            if (string.IsNullOrEmpty(_authToken))
            {
                Debug.WriteLine("Cannot load lists: Auth token is missing");
                ErrorMessage = "Hiba: Hiányzó hitelesítési token";
                return;
            }

            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;
                Debug.WriteLine("Loading lists...");

                var lists = await _listService.GetAllListsAsync();
                
                Lists.Clear();
                foreach (var list in lists)
                {
                    Lists.Add(list);
                }

                Debug.WriteLine($"Successfully loaded {Lists.Count} lists");
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a listák betöltése közben: {ex.Message}";
                Debug.WriteLine($"Error in ExecuteLoadListsCommand: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }

        private async Task ExecuteCreateListCommand(ProductListModel list)
        {
            if (list == null)
            {
                Debug.WriteLine("Cannot create list: List is null");
                ErrorMessage = "Hiba: A lista nem lehet üres";
                return;
            }

            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;
                Debug.WriteLine($"Creating new list: {list.Name}");

                await _listService.CreateListAsync(list);
                await ExecuteLoadListsCommand();

                Debug.WriteLine("List created successfully");
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a lista létrehozása közben: {ex.Message}";
                Debug.WriteLine($"Error in ExecuteCreateListCommand: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }

        private async Task ExecuteUpdateListCommand(ProductListModel list)
        {
            if (list == null)
            {
                Debug.WriteLine("Cannot update list: List is null");
                ErrorMessage = "Hiba: A lista nem lehet üres";
                return;
            }

            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;
                Debug.WriteLine($"Updating list: {list.Name} (ID: {list.Id})");

                await _listService.UpdateListAsync(list.Id, list);
                await ExecuteLoadListsCommand();

                Debug.WriteLine("List updated successfully");
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a lista frissítése közben: {ex.Message}";
                Debug.WriteLine($"Error in ExecuteUpdateListCommand: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }

        private async Task ExecuteDeleteListCommand(ProductListModel list)
        {
            if (list == null)
            {
                Debug.WriteLine("Cannot delete list: List is null");
                ErrorMessage = "Hiba: A lista nem lehet üres";
                return;
            }

            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;
                Debug.WriteLine($"Deleting list: {list.Name} (ID: {list.Id})");

                await _listService.DeleteListAsync(list.Id);
                await ExecuteLoadListsCommand();

                Debug.WriteLine("List deleted successfully");
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a lista törlése közben: {ex.Message}";
                Debug.WriteLine($"Error in ExecuteDeleteListCommand: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }
    }
}
