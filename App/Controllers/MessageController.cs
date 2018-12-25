using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App.Interfaces;
using App.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace App.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private IHubContext<CustomHub, ITypedHubClient> _hubContext;
        public MessageController(IHubContext<CustomHub, ITypedHubClient> hubContext)
        {
            _hubContext = hubContext;
        }
    }
}