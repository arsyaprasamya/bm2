### Table of Contents

- [Folder Structure][1]
- [System Requirement][2]
- [Code Documentation][3]
- [API Docs][4]
  - [Authentication][5]
  - [User][6] 
  - [Project][7]

## Folder Structure
```
/
|-- controllers
|   |-- authController.js (Authentication Controller)
|-- middleware
|   |-- userrole.js (Middleware Untuk Role User)
|-- models
|   |-- user.js (Model User)
|-- routes
|   |-- user.js (Route Untuk User)
|-- services
|   |-- userService.js (Service untuk interaksi controller dengan model)
|-- .env (Konfigurasi environtment untuk local development)
|-- .env.s (Backup Env)
|-- config.js (Load konfigurasi [development => .env, production => NODE_ENV])
|-- docs.md (File Ini)
|-- package.json (file npm)
|-- package-lock.json (file npm)
|-- passportconfig.js (File konfigurasi passport)
|-- server.js (File intuk inisiasi server)
```

## System Requirement

- NodeJS Version ^0.10
- NPM (Node Package Manager)
- MongoDB Version ^0.4

## Code Documentation

- Untuk code documentation silahkan lihat comment di setiap file  

## API Docs
- ### Authentication
  - #### Login
      - End point
        
        - `GET :  /api/auth/login`
      - Header
        
        - `Content-Type : application/json`
      - Parameter
        
        - ``{ username, password }``
      - Response
        - ```
            Content-Type : application/json
            Reponse : { status, jwt }
          ```
- ### User
   - #### Cari User
   
   - #### Tambah User
     - End point
       
       - `POST :  /api/user/add`
     - Header
       
       - `Content-Type : application/json`
     - Parameter
     
       - `empty`
     - Body
     
        - ```
          { 
            first_name(String, required), 
            last_name(String, required), 
            username(String, required), 
            password(String, required), 
            role(Enum[administrator, operator, user], required) 
          }
          ```
     - Response
       - ```
         Content-Type : application/json
         Reponse : 200 : { 
                           "status" : "success"
                           "data" : [{
                                first_name, 
                                last_name, 
                                username, 
                                role
                           }]
                         }
                   401 : { error detail }
         ```
     
   - #### Edit User
     - End point
            
       - `PATCH :  /api/user/edit/:id`
     - Header
            
       - `Content-Type : application/json`
          
     - Parameter
          
        - `id`
     - Body
          
       - ```
         { 
            first_name(String, required), 
            last_name(String, required), 
            username(String, required), 
            password(String, required), 
            role(Enum[administrator, operator, user], required) 
         }
         ```
     - Response
       - ```
         Content-Type : application/json
         Reponse : 200 : { 
                            "status" : "success"
                            "data" : [{
                                        first_name, 
                                        last_name, 
                                        username, 
                                        role
                                    }]
                         }
                   401 : { error detail }
              ```
    
   - #### Hapus User
    - End point          
      - `DELETE :  /api/user/edit/:id`
    - Header       
         - `Content-Type : application/json`
              
    - Parameter        
      - `id`
    - Body   
      - ``` ```
    - Response
      - ```
        Content-Type : application/json
        Reponse : 200 : { 
                          "status" : "success"
                          "data" : "success delete user"
                  401 : { error detail }
                  500 : { internal server error }
        ```
[1]: #folder-structure

[2]: #system-requirement

[3]: #code-documentation

[4]: #api-docs

[5]: #authentication

[6]: #user

[7]: #project