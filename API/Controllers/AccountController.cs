using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{   
    
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController:ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly TokenService tokenService;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            this.tokenService = tokenService;
            this.userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){
            var user = await this.userManager.Users.Include(p=>p.Photos)
            .FirstOrDefaultAsync(x=>x.Email==loginDto.Email);
            if(user==null) return Unauthorized();

            var result = await this.userManager.CheckPasswordAsync(user,loginDto.Password);

            if(result){
                return CreateUserObject(user);
            }
            return Unauthorized();
        }


        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto){
            if(await this.userManager.Users.AnyAsync(x=>x.UserName== registerDto.Username))
            {
                ModelState.AddModelError("username","Username taken");
                return ValidationProblem();
            }
             if(await this.userManager.Users.AnyAsync(x=>x.Email== registerDto.Email))
            {
                ModelState.AddModelError("email","Email taken");
                return ValidationProblem();
            }
            var user = new AppUser{
                    DisplayName=registerDto.DisplayName,
                    Email=registerDto.Email,
                    UserName=registerDto.Username
            };
            var result = await this.userManager.CreateAsync(user, registerDto.Password);

            if(result.Succeeded)
            {
                return CreateUserObject(user);
            }
            return BadRequest(result.Errors);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser(){
            var user= await this.userManager.Users.Include(p=>p.Photos)
            .FirstOrDefaultAsync(x=>x.Email==User.FindFirstValue(ClaimTypes.Email));
            return CreateUserObject(user);
        }

         private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(x=>x.IsMain)?.Url,
                Token = this.tokenService.CreateToken(user),
                Username = user.UserName
            };
        }
    }
}