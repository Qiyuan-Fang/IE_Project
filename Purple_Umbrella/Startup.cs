using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Owin;
using Purple_Umbrella.Models;

[assembly: OwinStartupAttribute(typeof(Purple_Umbrella.Startup))]
namespace Purple_Umbrella
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            //CreateVisitor();
        }

        // In this method we will create default User roles and Admin user for login   
        //private void CreateVisitor()
        //{
        //    ApplicationDbContext context = new ApplicationDbContext();

        //    var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
        //    var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

        //    if (!roleManager.RoleExists("Visitor"))
        //    {

        //        //Create Visitor role   
        //        var role = new Microsoft.AspNet.Identity.EntityFramework.IdentityRole();
        //        role.Name = "Visitor";
        //        roleManager.Create(role);

        //        //Here we create a Visitor user who can view the website          

        //        var user = new ApplicationUser();
        //        user.UserName = "Visitor";
        //        user.Email = "visitor@visitor.com";

        //        string userPWD = "IE@2019";

        //        var chkUser = userManager.Create(user, userPWD);

        //        //Add the User to Role Visitor   
        //        if (chkUser.Succeeded)
        //        {
        //            var result1 = userManager.AddToRole(user.Id, "Visitor");

        //        }
        //    }
        //}
    }
}
