using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.Models;
using ShoppingListAdmin.Desktop.Services;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace ShoppingListAdmin.Desktop.ViewModels.Categories
{
    public partial class CategoryViewModel : BaseViewModel
    {
        private readonly CategoryService _categoryService;
        private CategoryModel? _selectedCategory;

        public ObservableCollection<CategoryModel> Categories { get; set; }

        public CategoryModel? SelectedCategory
        {
            get => _selectedCategory;
            set => SetProperty(ref _selectedCategory, value);
        }

        public CategoryViewModel(CategoryService categoryService)
        {
            _categoryService = categoryService;
            Categories = new ObservableCollection<CategoryModel>();
            LoadCategories();
        }

        public CategoryViewModel()
        {
        }

        private async void LoadCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            Categories.Clear();
            foreach (var category in categories)
            {
                Categories.Add(category);
            }
        }

        [RelayCommand]
        public async Task CreateCategoryAsync(CategoryModel category)
        {
            await _categoryService.CreateCategoryAsync(category);
            LoadCategories();
        }

        [RelayCommand]
        public async Task UpdateCategoryAsync(CategoryModel category)
        {
            await _categoryService.UpdateCategoryAsync(category.Id, category);
            LoadCategories();
        }

        [RelayCommand]
        public async Task DeleteCategoryAsync(CategoryModel category)
        {
            await _categoryService.DeleteCategoryAsync(category.Id);
            LoadCategories();
        }
    }
}