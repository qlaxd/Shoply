using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingListAdmin.Desktop.Models
{
    public class UserModel : INotifyPropertyChanged
    {
        private int _id;
        private string _username;
        private string _email;
        private string _password;
        private string _role;

        // Felhasználó egyedi azonosítója
        public int Id
        {
            get => _id;
            set
            {
                if (_id != value)
                {
                    _id = value;
                    OnPropertyChanged(nameof(Id));
                }
            }
        }

        // Felhasználó neve
        public string Username
        {
            get => _username;
            set
            {
                if (_username != value)
                {
                    _username = value;
                    OnPropertyChanged(nameof(Username));
                }
            }
        }

        // Felhasználó e-mail címe
        public string Email
        {
            get => _email;
            set
            {
                if (_email != value)
                {
                    _email = value;
                    OnPropertyChanged(nameof(Email));
                }
            }
        }

        // Felhasználó jelszava
        public string Password
        {
            get => _password;
            set
            {
                if (_password != value)
                {
                    _password = value;
                    OnPropertyChanged(nameof(Password));
                }
            }
        }

        // Felhasználó szerepköre
        public string Role
        {
            get => _role;
            set
            {
                if (_role != value)
                {
                    _role = value;
                    OnPropertyChanged(nameof(Role));
                }
            }
        }

        // INotifyPropertyChanged esemény, amely értesíti a ViewModel-t a változásról
        public event PropertyChangedEventHandler PropertyChanged;

        // Esemény kiváltása, ha valamelyik property változik
        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        // Alapértelmezett konstruktor
        public UserModel() { }

        // Paraméterekkel rendelkező konstruktor
        public UserModel(int id, string username, string email, string password, string role)
        {
            Id = id;
            Username = username;
            Email = email;
            Password = password;
            Role = role;
        }
    }
}
