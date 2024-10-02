using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement :IAuthorizationRequirement
    {
        
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public IsHostRequirementHandler (DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            this.dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId= context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(userId==null) return Task.CompletedTask;

            var activityId= Guid.Parse(httpContextAccessor.HttpContext?.Request.RouteValues
            .SingleOrDefault(x=>x.Key=="id").Value.ToString());

            var atendee= dbContext.ActivityAtendees
            .AsNoTracking()
            .SingleOrDefaultAsync(x=>x.AppUserId==userId && x.ActivityId==activityId).Result;

            if(atendee==null) return Task.CompletedTask;

            if(atendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}