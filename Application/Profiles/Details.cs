
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query:IRequest<Result<Profile>>
        {
            public string Username{get;set;}
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
        private readonly DataContext context;
        private readonly IMapper mapper;
            public Handler(DataContext context, IMapper mapper)
            {
            this.mapper = mapper;
            this.context = context;
            }

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user= await context.Users
                .ProjectTo<Profile>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(x=>x.Username==request.Username);
                
                return Result<Profile>.Success(user);
            }
        }
    }
}