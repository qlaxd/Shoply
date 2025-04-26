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

        [ObservableProperty]
        private bool _isLoading;

        [ObservableProperty]
        private string _errorMessage;

        public ObservableCollection<ProductListModel> Lists { get; set; }

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
            _listService = new ListService(authToken);
            Lists = new ObservableCollection<ProductListModel>();

            // Initialize commands
            LoadListsCommand = new AsyncRelayCommand(ExecuteLoadListsCommand);
            CreateListCommand = new AsyncRelayCommand<ProductListModel>(ExecuteCreateListCommand);
            UpdateListCommand = new AsyncRelayCommand<ProductListModel>(ExecuteUpdateListCommand);
            DeleteListCommand = new AsyncRelayCommand<ProductListModel>(ExecuteDeleteListCommand);

            // Load initial data
            LoadListsCommand.Execute(null);
        }

        public ListsViewModel()
        {
        }

        private async Task ExecuteLoadListsCommand()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                var lists = await _listService.GetAllListsAsync();
                Lists.Clear();
                foreach (var list in lists)
                {
                    Lists.Add(list);
                }
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
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                await _listService.CreateListAsync(list);
                await ExecuteLoadListsCommand();
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
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                await _listService.UpdateListAsync(list.Id, list);
                await ExecuteLoadListsCommand();
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
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                await _listService.DeleteListAsync(list.Id);
                await ExecuteLoadListsCommand();
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
