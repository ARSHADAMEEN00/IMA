# login

/api/auth/login #post

## body {

phoneNumber,
password
}

## response {

user:{
role:[],
},
token:"",
message: "User Authenticated Successfully",
isSuccess: true
}

# register

/api/auth/signup post

## body{

    username, phoneNumber, password, email

}

## response {

user,
isSuccess: true,
message: "Successfully created the account, login to continue"

}

# logout

/api/auth/logout #post

header authorization token required

# response{

message: "Successfully logged out",
isSuccess: true  
}

# get logged user details / profile

/api/auth/profile #get

header authorization token required

# password update

/api/auth/profile/password method #put
header authorization token required
