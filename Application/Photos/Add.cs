
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command:IRequest<Result<Photo>>
        {
            public IFormFile File{get;set;}
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
        private readonly IPhotoAccessor photoAccessor;
        private readonly IUserAccessor userAccessor;
        private readonly DataContext context;
            public Handler (DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor){
            this.context = context;
            this.userAccessor = userAccessor;
            this.photoAccessor = photoAccessor;
                
            }
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(p=> p.Photos)
                .FirstOrDefaultAsync(x=> x.UserName==userAccessor.GetUsername());

                if(user==null) return null;

                var photoUploadResult = await photoAccessor.AddPhoto(request.File);

                var photo= new Photo{
                    Id=photoUploadResult.PublicId,
                    Url=photoUploadResult.Url
                };

                if(!user.Photos.Any(x=>x.IsMain)){ photo.IsMain=true;}
                
                user.Photos.Add(photo);

                var result= await context.SaveChangesAsync()> 0;

                if(result) return Result<Photo>.Success(photo);

                return Result<Photo>.Failure("Problem adding photo");
            }
        }
    }
}