using ShoppingListAdmin.Desktop.ViewModels;
using ShoppingListAdmin.Desktop.ViewModels.ControlPanel;
using ShoppingListAdmin.Desktop.ViewModels.Login;
using ShoppingListAdmin.Desktop.ViewModels.Users;
using ShoppingListAdmin.Desktop.Views;
using ShoppingListAdmin.Desktop.Views.ControlPanel;
using ShoppingListAdmin.Desktop.Views.Login;
using ShoppingListAdmin.Desktop.Views.Users;
using Microsoft.Extensions.DependencyInjection;

namespace KretaDesktop.Extensions
{
    public static class ViewViewModelsExtensions
    {
        public static void ConfigureViewViewModels(this IServiceCollection services)
        {
            // MainView
            services.AddSingleton<MainViewModel>();
            services.AddSingleton<MainView>(s => new MainView()
            {
                DataContext = s.GetRequiredService<MainViewModel>()
            });

            // LoginView
            services.AddSingleton<LoginViewModel>();
            services.AddSingleton<LoginView>(s => new LoginView()
            {
                DataContext = s.GetRequiredService<LoginViewModel>()
            });

            // ControlPanel
            services.AddSingleton<ControlPanelViewModel>();
            services.AddSingleton<ControlPanelView>(s => new ControlPanelView()
            {
                DataContext = s.GetRequiredService<ControlPanelViewModel>()
            });
            // Users
            services.AddSingleton<UsersViewModel>();
            services.AddSingleton<UsersView>(s => new UsersView()
            {
                DataContext = s.GetRequiredService<UsersViewModel>()
            });

            // Products
            services.AddSingleton<ProductViewModel>();
            services.AddSingleton<ProductView>(s => new ProductView()
            {
                DataContext = s.GetRequiredService<ProductViewModel>()
            });

        }
    }
}
