using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text.Json.Serialization;

namespace ShoppingListAdmin.Desktop.Models
{
    public class ProductListModel : INotifyPropertyChanged
    {
        private ObservableCollection<ProductModel> _products;
        private string _id;
        private string _title;
        private UserModel _owner;
        private DateTime _createdAt;
        private DateTime _updatedAt;
        private int _priority;
        private string _status;
        private bool _deleted;

        [JsonPropertyName("_id")]
        public string Id
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

        [JsonPropertyName("title")]
        public string Title
        {
            get => _title;
            set
            {
                if (_title != value)
                {
                    _title = value;
                    OnPropertyChanged(nameof(Title));
                }
            }
        }

        [JsonPropertyName("owner")]
        public UserModel Owner
        {
            get => _owner;
            set
            {
                if (_owner != value)
                {
                    _owner = value;
                    OnPropertyChanged(nameof(Owner));
                }
            }
        }

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt
        {
            get => _createdAt;
            set
            {
                if (_createdAt != value)
                {
                    _createdAt = value;
                    OnPropertyChanged(nameof(CreatedAt));
                }
            }
        }

        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt
        {
            get => _updatedAt;
            set
            {
                if (_updatedAt != value)
                {
                    _updatedAt = value;
                    OnPropertyChanged(nameof(UpdatedAt));
                }
            }
        }

        [JsonPropertyName("priority")]
        public int Priority
        {
            get => _priority;
            set
            {
                if (_priority != value)
                {
                    _priority = value;
                    OnPropertyChanged(nameof(Priority));
                }
            }
        }

        [JsonPropertyName("status")]
        public string Status
        {
            get => _status;
            set
            {
                if (_status != value)
                {
                    _status = value;
                    OnPropertyChanged(nameof(Status));
                }
            }
        }

        [JsonPropertyName("deleted")]
        public bool Deleted
        {
            get => _deleted;
            set
            {
                if (_deleted != value)
                {
                    _deleted = value;
                    OnPropertyChanged(nameof(Deleted));
                }
            }
        }

        // Termékek listája
        [JsonPropertyName("products")]
        public ObservableCollection<ProductModel> Products
        {
            get => _products;
            set
            {
                if (_products != value)
                {
                    _products = value;
                    OnPropertyChanged(nameof(Products));
                }
            }
        }

        // INotifyPropertyChanged esemény, amely értesíti a ViewModel-t a változásról
        public event PropertyChangedEventHandler? PropertyChanged;

        // Esemény kiváltása, ha valamelyik property változik
        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        // Alapértelmezett konstruktor
        public ProductListModel()
        {
            _products = new ObservableCollection<ProductModel>();
            _id = string.Empty;
            _title = string.Empty;
            _owner = new UserModel();
            _createdAt = DateTime.Now;
            _updatedAt = DateTime.Now;
            _priority = 0;
            _status = "active";
            _deleted = false;
        }

        // Termék hozzáadása a listához
        public void AddProduct(ProductModel product)
        {
            if (product != null)
            {
                Products.Add(product);
                OnPropertyChanged(nameof(Products));
            }
        }

        // Termék eltávolítása a listából
        public void RemoveProduct(ProductModel product)
        {
            if (product != null && Products.Contains(product))
            {
                Products.Remove(product);
                OnPropertyChanged(nameof(Products));
            }
        }

        // Adott termék keresése ID alapján
        public ProductModel FindProductById(string id)
        {
            return Products.FirstOrDefault(p => p.Id == id) ?? new ProductModel();
        }
    }
}
