# PROJECTOR
----
This is the backend side of the Projector Project.  
Projector is an Opensource Project management tools, that helps you manage your teams/company.

----
## Start working with the server's API:  

* Register:  
POST `/api/users` with name, email and password  
* Authenticate: (Get a token)  
POST `/api/auth`  with name and password  

Most of the API's require you to to be logged in.  
Thus, in most request you'll need the set a header called `x-auth-token` with your token as the value.  

----
## Start creating objects with this server's API:  
* Projects: /api/projects
* Epics: /api/epics