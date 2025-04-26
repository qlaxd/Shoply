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
        private string _name;
        private string _owner;
        private DateTime _createdAt;
        private DateTime _updatedAt;

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

        [JsonPropertyName("name")]
        public string Name
        {
            get => _name;
            set
            {
                if (_name != value)
                {
                    _name = value;
                    OnPropertyChanged(nameof(Name));
                }
            }
        }

        [JsonPropertyName("owner")]
        public string Owner
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
            _name = string.Empty;
            _owner = string.Empty;
            _createdAt = DateTime.Now;
            _updatedAt = DateTime.Now;
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
