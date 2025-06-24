# BACKEND


### Authentication Checks

- Login       : /api/auth/login 
    - takes email and password from body
- SignUp      : /api/auth/signup
- Logout      : /api/auth/logout
- OnBoarding  : /api/auth/onboarding
- Me          : /api/auth/me

### User Module
- User contains: fullName, email, password, bio, profilePic, nativeLanguage, learningLanguage, location, isBoarded(boolean), friends(Users)
- Before saving a user, hashes the password using **bcrypt**.
- Each user model has a match password function to check during Authentication.


## Login
- ***Frontend***: Takes input from input fields and while submits the data, the data is sent to **Tanstack (useQueryClient)** 

/*Learn about Mutations in tanstack and useQuery Client*/,

- ***Backend***: call goes to /api/auth/login. If the details don't matched with the database data, it sends the appropriate error or else if the data matches with the database, it creates JWT token having userid and JWT secret key that can stay active upto 7days

## Working of JWT
after a successfull logging in / signing up, a small token that contains userId, secretcode and expiry time. after converting them into unreadable format, it is stored in local storage as a cookie. 
when ever user opens the app, it checks the token and secretKey in the localStorage along with the backend server, if they are matched and it is within the expiry time, then the respective user will be fetched from the database and logging in will be not required.

