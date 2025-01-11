using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using ShoppingListAdmin.Desktop.ViewModels.Products;

namespace ShoppingListAdmin.Desktop.ViewModels.Users
{
    public partial class UsersViewModel : BaseViewModel
    {
        private ProductViewModel _productViewModel;

        public UsersViewModel()
        {
            _currentUsersChildView = new ProductViewModel();
            _productViewModel = new ProductViewModel();
        }

        public UsersViewModel(ProductViewModel productViewModel)
        {
            _productViewModel = productViewModel;

            _currentUsersChildView= new ProductViewModel();
        }

        [ObservableProperty]
        private BaseViewModel _currentUsersChildView;

        [RelayCommand]
        public void ShowProductView()
        {
            CurrentUsersChildView = _productViewModel;
        }
    }
}
