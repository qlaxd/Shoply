# Olvasd el a README.md-t is

1. **ViewModel létrehozása**:
   - Hozz létre egy UsersViewModel és egy `AdminsViewModel` osztályt a ViewModels mappában.

2. **Commandok létrehozása**:
   - Hozz létre RelayCommand-okat a UsersViewModel és `AdminsViewModel` osztályokban a nézetek közötti váltáshoz.

3. **Nézetek létrehozása**:
   - Hozz létre UsersView.xaml és `AdminsView.xaml` fájlokat a Views mappában.

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

**AdminsViewModel.cs**:
```cs
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace ShoppingListAdmin.Desktop.ViewModels
{
    public partial class AdminsViewModel : ObservableObject
    {
        // Adminisztrátorok listája és egyéb logika
    }
}
```

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
Ne feledd nyugodtan használhatod a `Discord`-ra a `Resources` channelre beküldött `ZIP` fájlt ihletnek.