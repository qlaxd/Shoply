using ShoppingListAdmin.Desktop.Views;
using ShoppingListAdmin.Desktop.Views.Login;
using KretaDesktop.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Windows;
using ShoppingListAdmin.Desktop.ViewModels.Login;
using ShoppingListAdmin.Desktop.Services;
using ShoppingListAdmin.Desktop.ViewModels.Categories;
using ShoppingListAdmin.Desktop.ViewModels;
using ShoppingListAdmin.Desktop.ViewModels.Lists;
using ShoppingListAdmin.Desktop.ViewModels.Settings;
using ShoppingListAdmin.Desktop.Views.Settings;
using ShoppingListAdmin.Desktop.ViewModels.Statistics;
using ShoppingListAdmin.Desktop.Views.Statistics;
using ShoppingListAdmin.Desktop.ViewModels.Products;


namespace ShoppingListAdmin.Desktop
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private readonly IHost _host;

        public App()
        {
            _host = Host.CreateDefaultBuilder()
                .ConfigureServices(services =>
                {
                    
                    services.AddSingleton<ApiService>();
                    services.AddSingleton<LoginViewModel>();
                    services.AddSingleton<LoginView>();
                    services.AddSingleton<MainViewModel>();
                    services.AddSingleton<MainView>(s => new MainView
                    {
                        DataContext = s.GetRequiredService<MainViewModel>()
                    });
                    services.ConfigureViewViewModels();

                    
                    services.AddSingleton<ProductService>();
                    services.AddSingleton<AdminService>();
                    services.AddSingleton<CategoryService>(s => new CategoryService(s.GetRequiredService<ApiService>().GetAuthToken()));
                    services.AddSingleton<ProductCatalogService>(s => new ProductCatalogService(s.GetRequiredService<ApiService>().GetAuthToken()));
                    services.AddSingleton<ListService>(s => new ListService(s.GetRequiredService<ApiService>().GetAuthToken()));
                    
                    services.AddSingleton<CategoryViewModel>();
                    services.AddSingleton<ListsViewModel>();
                    services.AddSingleton<ProductViewModel>();
                    services.AddSingleton<StatisticsViewModel>(s => new StatisticsViewModel(s.GetRequiredService<ApiService>()));

                    services.AddSingleton<SettingsViewModel>();
                    services.AddSingleton<SettingsView>(s => new SettingsView()
                    {
                        DataContext = s.GetRequiredService<SettingsViewModel>()
                    });

                    services.AddSingleton<StatisticsViewModel>();
                    services.AddSingleton<StatisticsView>(s => new StatisticsView
                    {
                        DataContext = s.GetRequiredService<StatisticsViewModel>()
                    });

                })
                .Build();
        }

        protected override async void OnStartup(StartupEventArgs e)
        {
            await _host.StartAsync();

            var loginView = _host.Services.GetRequiredService<LoginView>();
            loginView.Show();

            loginView.IsVisibleChanged += (s, ev) =>
            {
                if (loginView.IsVisible == false && loginView.IsLoaded)
                {
                    var mainView = _host.Services.GetRequiredService<MainView>();
                    mainView.Show();
                    loginView.IsVisibleChanged -= (s, ev) =>
                    loginView.Close();
                }
            };
        }

        protected override async void OnExit(ExitEventArgs e)
        {
            await _host.StopAsync();
            _host.Dispose();
            base.OnExit(e);
        }

        private void Application_Startup(object sender, StartupEventArgs e)
        {
            
        }
    }
}
