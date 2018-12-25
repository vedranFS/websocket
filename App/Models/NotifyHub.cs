using App.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace App.Models
{
    public class CustomHub : Hub<ITypedHubClient>
    {
        private readonly List<string> Users = new List<string>();
        private string ServerId = "";
        public override Task OnConnectedAsync()
        {
            Users.Add(Context.ConnectionId);
            if (ServerId == "")
            {
                ServerId = Context.ConnectionId;
            }
            Clients.All.SetServerLocaly(ServerId);
            
            Clients.All.GetAllConnectedUsers(JsonConvert.SerializeObject(Users));
            return Clients.User(Context.UserIdentifier).MessageRecived(Context.ConnectionId);
        }

        public Task JoinGroup(string groupName)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public Task SendMessageToGroup(string groupName, Message message)
        {
            return Clients.Group(groupName).GroupMessageRecived(JsonConvert.SerializeObject(message));
        }

        public Task SendMessageToAll(Message message)
        {
            return Clients.All.MessageRecived(JsonConvert.SerializeObject(message));
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Users.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public Task NextUser(int activeUser)
        {
            return Clients.All.NextUserServer(activeUser);
        }
    }
}
