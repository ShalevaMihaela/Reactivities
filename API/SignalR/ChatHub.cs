using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub:Hub
    {
        public readonly IMediator mediator;
        public ChatHub(IMediator mediator)
        {
            this.mediator = mediator;
            
        }

        public async Task SendComment(Create.Command command){
            var comment = await mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString())
            .SendAsync("RecieveComment",comment.Value);
        }

        public override async Task OnConnectedAsync(){
            var httpcontext = Context.GetHttpContext();
            var activityId=httpcontext.Request.Query["activityId"];

            await Groups.AddToGroupAsync(Context.ConnectionId,activityId);
            var result = await mediator.Send(new List.Query{ActivityId=Guid.Parse(activityId)});
            await Clients.Caller.SendAsync("LoadComments",result.Value);
        }
    }
}