using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.Models;
using ShoppingListAdmin.Desktop.Services;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System;
using System.Diagnostics;

namespace ShoppingListAdmin.Desktop.ViewModels.Categories
{
    public partial class CategoryViewModel : BaseViewModel
    {
        private readonly CategoryService _categoryService;
        private CategoryModel? _selectedCategory;

        [ObservableProperty]
        private bool _isLoading;

        [ObservableProperty]
        private string _errorMessage;

        public ObservableCollection<CategoryModel> Categories { get; set; }

        public CategoryModel? SelectedCategory
        {
            get => _selectedCategory;
            set => SetProperty(ref _selectedCategory, value);
        }

        public CategoryViewModel(CategoryService categoryService)
        {
            _categoryService = categoryService ?? throw new ArgumentNullException(nameof(categoryService));
            Categories = new ObservableCollection<CategoryModel>();
            LoadCategories();
        }

        public CategoryViewModel()
        {
        }

        private async void LoadCategories()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                var categories = await _categoryService.GetAllCategoriesAsync();
                Categories.Clear();
                foreach (var category in categories)
                {
                    Categories.Add(category);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a kategóriák betöltése közben: {ex.Message}";
                Debug.WriteLine($"Error in LoadCategories: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }

        [RelayCommand]
        public async Task CreateCategoryAsync(CategoryModel category)
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                await _categoryService.CreateCategoryAsync(category);
                LoadCategories();
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a kategória létrehozása közben: {ex.Message}";
                Debug.WriteLine($"Error in CreateCategoryAsync: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }

        [RelayCommand]
        public async Task UpdateCategoryAsync(CategoryModel category)
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                await _categoryService.UpdateCategoryAsync(category.Id, category);
                LoadCategories();
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a kategória frissítése közben: {ex.Message}";
                Debug.WriteLine($"Error in UpdateCategoryAsync: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }

        [RelayCommand]
        public async Task DeleteCategoryAsync(CategoryModel category)
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                await _categoryService.DeleteCategoryAsync(category.Id);
                LoadCategories();
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a kategória törlése közben: {ex.Message}";
                Debug.WriteLine($"Error in DeleteCategoryAsync: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }
    }
}