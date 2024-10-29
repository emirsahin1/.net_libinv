# .net_libinv

### Note: I did not have enough free time to bring the code to a fully prod-ready and clean state, but the functionality is all there.    Ignore the messy parts :)
Front end is built with Next.JS (only client side components)
## Frontend Instructions:
- cd to frontend directory
- npm run install
- modfiy the .env file and modify the URL to point to the API backend

## Backend Instructions:
- The backend requires a running Microsoft SQL Server
- In appsettings.json, modify the connection string to point to your SQL server
- All DB creation is done automatically on startup.
- Install the necessary nuget packages:
    - Auto Mapper
    - Bogus
    - Microsoft.AspNetCore.Identity.EntityFrameworkCore
    - Microsoft.EntityFrameworkCore.SqlServer
    - Microsoft.EntityFrameworkCore.Tools
    - Swashbuckle.AspNetCore
 
That should be all that's needed to run everything.
Please let me know if you have any trouble getting things working.

