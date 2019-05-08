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
           
        }

    }
}
