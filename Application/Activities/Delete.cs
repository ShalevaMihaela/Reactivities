using System;
using System.Runtime.InteropServices;
using Application.Core;
using MediatR;
using Persistence;


namespace Application.Activities
{
    public class Delete
    {
        public class Command:IRequest<Result<Unit>>{
            public Guid Id {get; set;}

        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext context;
            public Handler(DataContext context)
            {
            this.context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity= await context.Activities.FindAsync(request.Id);
                if(activity==null) return null;

                context.Remove(activity);

                var result = await context.SaveChangesAsync()> 0;
                if(!result) return Result<Unit>.Failure("Failed to delete the activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }

    }
}