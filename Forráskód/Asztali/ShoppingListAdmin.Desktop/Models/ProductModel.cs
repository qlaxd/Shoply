using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace ShoppingListAdmin.Desktop.Models
{
    public class ProductModel : INotifyPropertyChanged
    {
        private string _id;
        private string _name;
        private string _category;
        private decimal _price;
        private int _quantity;
        private bool _isAvailable;

        // Termék egyedi azonosítója
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

        // Termék neve
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

        // Termék kategóriája
        [JsonPropertyName("category")]
        public string Category
        {
            get => _category;
            set
            {
                if (_category != value)
                {
                    _category = value;
                    OnPropertyChanged(nameof(Category));
                }
            }
        }

        // Termék ára
        [JsonPropertyName("price")]
        public decimal Price
        {
            get => _price;
            set
            {
                if (_price != value)
                {
                    _price = value;
                    OnPropertyChanged(nameof(Price));
                }
            }
        }

        // Termék mennyisége
        [JsonPropertyName("quantity")]
        public int Quantity
        {
            get => _quantity;
            set
            {
                if (_quantity != value)
                {
                    _quantity = value;
                    OnPropertyChanged(nameof(Quantity));
                }
            }
        }

        // Termék elérhetősége
        [JsonPropertyName("isAvailable")]
        public bool IsAvailable
        {
            get => _isAvailable;
            set
            {
                if (_isAvailable != value)
                {
                    _isAvailable = value;
                    OnPropertyChanged(nameof(IsAvailable));
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
        public ProductModel()
        {
            _id = string.Empty;
            _name = string.Empty;
            _category = string.Empty;
        }

        // Paraméterekkel rendelkező konstruktor
        public ProductModel(string id, string name, string category, decimal price, int quantity, bool isAvailable)
        {
            _id = id ?? throw new ArgumentNullException(nameof(id));
            _name = name ?? throw new ArgumentNullException(nameof(name));
            _category = category ?? throw new ArgumentNullException(nameof(category));
            Id = id;
            Name = name;
            Category = category;
            Price = price;
            Quantity = quantity;
            IsAvailable = isAvailable;
        }
    }
}
