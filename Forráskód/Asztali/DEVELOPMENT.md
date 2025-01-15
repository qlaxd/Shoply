# Olvasd el a README.md-t is

1. **ViewModel létrehozása**:
   - Hozz létre egy `UsersViewModel` és egy `AdminsViewModel` osztályt a ViewModels mappában.

2. **Commandok létrehozása**:
   - Hozz létre `RelayCommand`-okat a `UsersViewModel` és `AdminsViewModel` osztályokban a nézetek közötti váltáshoz.

3. **Nézetek létrehozása**:
   - Hozz létre `UsersView.xaml` és `AdminsView.xaml` fájlokat a Views mappában.

4. **Commandok bekötése**:
   - Kösd be a `ShowUsersCommand` és `ShowAdminsCommand` parancsokat a gombokhoz a UsersMenu.xaml fájlban.

### 1. UsersViewModel és AdminsViewModel létrehozása

**UsersViewModel.cs**:
```cs
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace ShoppingListAdmin.Desktop.ViewModels
{
    public partial class UsersViewModel : ObservableObject
    {
        // Felhasználók listája és egyéb logika
    }
}
```


**AdminsViewModel.cs** példa:
```cs
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace ShoppingListAdmin.Desktop.ViewModels
{
    public partial class AdminsViewModel : ObservableObject
    {
        // Adminisztrátorok listája
        [ObservableProperty]
        private ObservableCollection<Admin> _admins;

        // Konstruktor
        public AdminsViewModel()
        {
            _admins = new ObservableCollection<Admin>();
        }

        // Parancs az adminisztrátorok betöltésére
        [RelayCommand]
        public async Task LoadAdminsAsync()
        {
            // Itt töltheted be az adminisztrátorok listáját, például egy adatbázisból vagy API-ból
            var admins = await AdminService.GetAdminsAsync();
            Admins.Clear();
            foreach (var admin in admins)
            {
                Admins.Add(admin);
            }
        }
    }

    // Admin osztály példa
    public class Admin
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }
}
```


1. **ObservableProperty**:
   - Az ObservableProperty attribútumot használjuk az `Admins` tulajdonság létrehozásához. Ez automatikusan létrehozza a `get` és `set` metódusokat, valamint az értesítési logikát, amikor a tulajdonság értéke megváltozik.

2. **Konstruktor**:
   - A konstruktorban inicializáljuk az `Admins` listát egy üres `ObservableCollection<Admin>` példánnyal.

3. **RelayCommand**:
   - A `LoadAdminsAsync` parancs egy aszinkron metódus, amely betölti az adminisztrátorok listáját. A parancs végrehajtásakor az `AdminService.GetAdminsAsync` metódust hívjuk meg, amely visszaadja az adminisztrátorok listáját. Ezután töröljük az aktuális listát, és hozzáadjuk az új adminisztrátorokat.

### 2. Commandok létrehozása
##### A `MainViewModel`-ben a következő módosításokat kellett elvégezni, hogy a felhasználók és adminisztrátorok nézetek közötti váltás működjön:

1. **ViewModel-ek példányosítása**:
    - A `UsersViewModel` és `AdminsViewModel` példányainak létrehozása és tárolása a `MainViewModel`-ben.

2. **CurrentViewModel property hozzáadása**:
    - Egy `CurrentViewModel` vagy `CurrentChildView` (a kódban CurrentChildView) property hozzáadása, amely az aktuálisan megjelenített nézetet tárolja.

3. **RelayCommand-ok létrehozása**:
    - `ShowUsersCommand` és `ShowAdminsCommand` parancsok létrehozása, amelyek a megfelelő nézetek megjelenítéséért felelősek.

**MainViewModel.cs**:
```cs
using CommunityToolkit.Mvvm.Input;

namespace ShoppingListAdmin.Desktop.ViewModels
{
    public partial class MainViewModel : ObservableObject
    {
        private readonly UsersViewModel _usersViewModel;
        private readonly AdminsViewModel _adminsViewModel;

        public MainViewModel(UsersViewModel usersViewModel, AdminsViewModel adminsViewModel)
        {
            _usersViewModel = usersViewModel;
            _adminsViewModel = adminsViewModel;
        }

        [ObservableProperty]
        private ObservableObject _currentViewModel;

        [RelayCommand]
        public void ShowUsers()
        {
            // Felhasználók nézet megjelenítése
        }

        [RelayCommand]
        public void ShowAdmins()
        {
            // Adminisztrátorok nézet megjelenítése
        }
    }
}
```

### 3. Nézetek létrehozása

**UsersView.xaml**:
```xaml
<UserControl x:Class="ShoppingListAdmin.Desktop.Views.Users.UsersView"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008" 
             mc:Ignorable="d" 
             d:DesignHeight="450" d:DesignWidth="800">
    <Grid>
        <DataGrid>
            <!-- DataGrid oszlopok -->
        </DataGrid>
    </Grid>
</UserControl>
```

**AdminsView.xaml**:
```xaml
<UserControl x:Class="ShoppingListAdmin.Desktop.Views.Admins.AdminsView"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008" 
             mc:Ignorable="d" 
             d:DesignHeight="450" d:DesignWidth="800">
    <Grid>
        <DataGrid>
            <!-- DataGrid oszlopok -->
        </DataGrid>
    </Grid>
</UserControl>
```

### 4. Commandok bekötése

**UsersMenu.xaml**:
- A UsersMenu egy UserControl, amely a felhasználói felület egy részét képezi, és gombokat tartalmaz a különböző nézetek közötti váltáshoz. Ebben az esetben a UsersMenu gombokat tartalmaz a felhasználók és adminisztrátorok nézetek megjelenítéséhez.
```xaml
<UserControl x:Class="ShoppingListAdmin.Desktop.Views.Users.UsersMenu"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008" 
             mc:Ignorable="d" 
             d:DesignHeight="30" d:DesignWidth="800">
    <Border Background="{StaticResource backgroundColorThird}"> 
        <StackPanel Grid.Row="1" Orientation="Horizontal">
            <Button Content="Felhasználók" Command="{Binding ShowUsersCommand}" />
            <Button Content="Adminisztrátorok" Command="{Binding ShowAdminsCommand}" />
        </StackPanel>
    </Border>
</UserControl>
```

### 5. **MainView.xaml** módosítása
- Ez a a fő ablak XAML fájlja, amely tartalmazza a teljes alkalmazás felhasználói felületének elrendezését. Ez az ablak tartalmazza a navigációs menüt és a tartalom megjelenítésére szolgáló területet.
```xaml
<Window x:Class="ShoppingListAdmin.Desktop.Views.MainView"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:ShoppingListAdmin.Desktop.Views"
        xmlns:viewModel="clr-namespace:ShoppingListAdmin.Desktop.ViewModels"
        d:DataContext="{d:DesignInstance Type=viewModel:MainViewModel, IsDesignTimeCreatable=True}"
        mc:Ignorable="d"
        Title="ADMIN" Height="700" Width="1300"
        WindowStartupLocation="CenterScreen"
        WindowStyle="None">
    <Window.DataContext>
        <viewModel:MainViewModel/>
    </Window.DataContext>
    <Grid>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="200"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>
        <local:UsersMenu Grid.Column="0"/>
        <ContentControl Grid.Column="1" Content="{Binding CurrentViewModel}"/>
    </Grid>
</Window>
```
- Window: A MainView egy Window, amely az alkalmazás fő ablakát definiálja.

- DataContext: A Window.DataContext a MainViewModel-hez van kötve, amely az ablak adatforrása.

- Grid Layout: A Grid két oszlopot tartalmaz: az első oszlop a navigációs menü számára, a második oszlop pedig a tartalom megjelenítésére szolgál.

- UsersMenu: Az első oszlopban található a UsersMenu UserControl, amely a felhasználók és adminisztrátorok nézetek közötti váltáshoz szükséges gombokat tartalmazza.

- ContentControl: A második oszlopban található a ContentControl, amely a CurrentChildView property-hez van kötve. Ez a property határozza meg, hogy melyik nézet jelenik meg az ablak tartalmi részében.

Ne feledd nyugodtan használhatod a `Discord`-ra a `Resources` channelre beküldött `ZIP` fájlt ihletnek.

# Adatok lekérése a Backendről Api-val és ezek megjelenítése

### Először is, szükség lesz egy HTTP kliensre, amely kommunikál a MERN backenddel. (HttpClient osztály)

### 1. **Services/HttpClient.cs vagy ApiService.cs**
```cs
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ShoppingListAdmin.Desktop.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;

        public ApiService()
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("http://your-backend-url.com/api/")
            };
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<HttpResponseMessage> GetAsync(string endpoint)
        {
            return await _httpClient.GetAsync(endpoint);
        }

        public async Task<HttpResponseMessage> PostAsync<T>(string endpoint, T data)
        {
            return await _httpClient.PostAsJsonAsync(endpoint, data);
        }

        public async Task<HttpResponseMessage> PutAsync<T>(string endpoint, T data)
        {
            return await _httpClient.PutAsJsonAsync(endpoint, data);
        }

        public async Task<HttpResponseMessage> DeleteAsync(string endpoint)
        {
            return await _httpClient.DeleteAsync(endpoint);
        }
    }
}
```

### 2. ViewModel-ek frissítése
 - A `ViewModel`-ekben használhatod az `ApiService`-t (vagy `httpClient`-t attól függ mi a neve) az adatok lekérésére és kezelésére.

 **ViewModels/UsersViewModel.cs**
 ```cs
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.Services;
using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace ShoppingListAdmin.Desktop.ViewModels
{
    public partial class UsersViewModel : ObservableObject
    {
        private readonly ApiService _apiService;

        [ObservableProperty]
        private ObservableCollection<User> _users;

        public UsersViewModel()
        {
            _apiService = new ApiService();
            _users = new ObservableCollection<User>();
            LoadUsersCommand = new RelayCommand(async () => await LoadUsersAsync());
        }

        public IRelayCommand LoadUsersCommand { get; }

        private async Task LoadUsersAsync()
        {
            var response = await _apiService.GetAsync("users");
            if (response.IsSuccessStatusCode)
            {
                var users = await response.Content.ReadAsAsync<IEnumerable<User>>();
                Users.Clear();
                foreach (var user in users)
                {
                    Users.Add(user);
                }
            }
        }
    }
}
 ```

 ### 3. Model létrehozása
  Hozz létre egy modellt, amely megfelel a backend által visszaadott adatoknak (a backendet is módosítani kell, mert hiányzik a PasswordHash a válaszból ha jól emlékszek)

**Models/User.cs**
```cs
namespace ShoppingListAdmin.Desktop.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
    }
}
```

### 4. View frissítése

Frissítsd a nézetet, hogy megjelenítse a felhasználók listáját.

**Views/UsersView.xaml**:
```xaml
<UserControl x:Class="ShoppingListAdmin.Desktop.Views.Users.UsersView"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008" 
             xmlns:viewModels="clr-namespace:ShoppingListAdmin.Desktop.ViewModels.Users"
             d:DataContext="{d:DesignInstance Type=viewModels:UsersViewModel, IsDesignTimeCreatable=True}"
             mc:Ignorable="d" 
             d:DesignHeight="450" d:DesignWidth="800">
    <Grid>
        <DataGrid AutoGenerateColumns="False" ItemsSource="{Binding Users}">
            <DataGrid.Columns>
                <DataGridTextColumn Header="ID" Binding="{Binding Id}" Width="*"/>
                <DataGridTextColumn Header="Felhasználónév" Binding="{Binding Username}" Width="*"/>
                <DataGridTextColumn Header="Email" Binding="{Binding Email}" Width="*"/>
                <DataGridTextColumn Header="Jelszó hash" Binding="{Binding PasswordHash}" Width="*"/>
                <DataGridTemplateColumn Header="Műveletek" Width="*">
                    <DataGridTemplateColumn.CellTemplate>
                        <DataTemplate>
                            <StackPanel Orientation="Horizontal">
                                <Button Content="Módosítás" Command="{Binding DataContext.EditUserCommand, RelativeSource={RelativeSource AncestorType=UserControl}}" CommandParameter="{Binding}"/>
                                <Button Content="Törlés" Command="{Binding DataContext.DeleteUserCommand, RelativeSource={RelativeSource AncestorType=UserControl}}" CommandParameter="{Binding}"/>
                            </StackPanel>
                        </DataTemplate>
                    </DataGridTemplateColumn.CellTemplate>
                </DataGridTemplateColumn>
            </DataGrid.Columns>
        </DataGrid>
    </Grid>
</UserControl>
```

### 5. Dependency Injection beállítása

Győződj meg róla, hogy az `ApiService` és a ViewModel-ek megfelelően vannak regisztrálva a Dependency Injection konténerben.

**App.xaml.cs**:
```cs
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShoppingListAdmin.Desktop.Services;
using ShoppingListAdmin.Desktop.ViewModels;

namespace ShoppingListAdmin.Desktop
{
    public partial class App : Application
    {
        private readonly IHost _host;

        public App()
        {
            _host = Host.CreateDefaultBuilder()
                .ConfigureServices((context, services) =>
                {
                    services.AddSingleton<ApiService>();
                    services.AddSingleton<UsersViewModel>();
                    // További ViewModel-ek regisztrálása
                })
                .Build();
        }

        protected override async void OnStartup(StartupEventArgs e)
        {
            await _host.StartAsync();
            var mainWindow = _host.Services.GetRequiredService<MainWindow>();
            mainWindow.Show();
            base.OnStartup(e);
        }

        protected override async void OnExit(ExitEventArgs e)
        {
            await _host.StopAsync();
            base.OnExit(e);
        }
    }
}
```

### Összefoglalás

1. **HTTP kliens beállítása**: Az `ApiService` osztály segítségével kommunikálhatsz a MERN backenddel.
2. **ViewModel-ek frissítése**: A ViewModel-ekben használhatod az `ApiService`-t az adatok lekérésére és kezelésére.
3. **Model létrehozása**: Hozz létre egy modellt, amely megfelel a backend által visszaadott adatoknak.
4. **View frissítése**: Frissítsd a nézetet, hogy megjelenítse a felhasználók listáját.
5. **Dependency Injection beállítása**: Győződj meg róla, hogy az `ApiService` és a ViewModel-ek megfelelően vannak regisztrálva a Dependency Injection konténerben.