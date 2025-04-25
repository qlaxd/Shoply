using ShoppingListAdmin.Desktop.ViewModels;
using ShoppingListAdmin.Desktop.ViewModels.ControlPanel;
using ShoppingListAdmin.Desktop.ViewModels.Login;
using ShoppingListAdmin.Desktop.ViewModels.Users;
using ShoppingListAdmin.Desktop.Views;
using ShoppingListAdmin.Desktop.Views.ControlPanel;
using ShoppingListAdmin.Desktop.Views.Login;
using ShoppingListAdmin.Desktop.Views.Users;
using Microsoft.Extensions.DependencyInjection;
using ShoppingListAdmin.Desktop.ViewModels.Lists;
using ShoppingListAdmin.Desktop.Views.Lists;
using ShoppingListAdmin.Desktop.ViewModels.Statistics;
using ShoppingListAdmin.Desktop.Views.Statistics;
using ShoppingListAdmin.Desktop.ViewModels.Settings;
using ShoppingListAdmin.Desktop.Views.Settings;
using ShoppingListAdmin.Desktop.ViewModels.Products;
using ShoppingListAdmin.Desktop.Views.Products;
using ShoppingListAdmin.Desktop.Views.Admins;
using ShoppingListAdmin.Desktop.Services;

namespace KretaDesktop.Extensions
{
    public static class ViewViewModelsExtensions
    {
        public static void ConfigureViewViewModels(this IServiceCollection services)
        {
            // ApiService singleton regisztrálása
            services.AddSingleton<ApiService>();

            services.AddSingleton<LoginViewModel>();
            services.AddSingleton<LoginView>();

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
            services.AddSingleton<ProductCatalogService>();
            services.AddSingleton<ProductViewModel>();
            services.AddSingleton<ProductView>(s => new ProductView()
            {
                DataContext = s.GetRequiredService<ProductViewModel>()
            });

            // Lists
            services.AddSingleton<ListsViewModel>();
            services.AddSingleton<ListsView>(s => new ListsView()
            {
                DataContext = s.GetRequiredService<ListsViewModel>()
            });

            // Statistics
            services.AddSingleton<StatisticsViewModel>();
            services.AddSingleton<StatisticsView>(s => new StatisticsView()
            {
                DataContext = s.GetRequiredService<StatisticsViewModel>()
            });

            // Settings
            services.AddSingleton<SettingsViewModel>();
            services.AddSingleton<SettingsView>(s => new SettingsView()
            {
                DataContext = s.GetRequiredService<SettingsViewModel>()
            });

            // Admins
            services.AddSingleton<AdminsViewModel>();
            services.AddSingleton<AdminsView>(s => new AdminsView()
            {
                DataContext = s.GetRequiredService<AdminsViewModel>()
            });
        }
    }
}
