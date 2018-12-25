using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace App.Interfaces
{
    public interface ITypedHubClient
    {
        Task MessageRecived(string message);

        Task GroupMessageRecived(string json);
        Task GetAllConnectedUsers(string jsonUsers);

        Task SetServerLocaly(string serverId);
        Task NextUserServer(int activeUser);
    }
}
