using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingListAdmin.Desktop.Models
{
    public class UserListModel
    {
        public int Id { get; set; }               // Egyedi azonosító
        public string Name { get; set; }          // Lista neve
        public ObservableCollection<UserModel> Users { get; set; } // Felhasználók listája
    }
}
