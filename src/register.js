const { CognitoUserPool, CognitoUserAttribute, CognitoUser } = require('amazon-cognito-identity-js');

let poolData = {
    UserPoolId : 'us-east-1_hZxUBgAJ9', // Your user pool id here
    ClientId : '3njmjuaprfe2hgo162qvpdqliv' // Your client id here
};

let userPool = new CognitoUserPool(poolData);

let attributeList = [];

let dataEmail = {
    Name : 'email',
    Value : 'test45@test.com'
};

let dataPhoneNumber = {
    Name : 'phone_number',
    Value : '+15455555555'
};
let attributeEmail = new CognitoUserAttribute(dataEmail);
let attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);

attributeList.push(attributeEmail);
attributeList.push(attributePhoneNumber);

userPool.signUp('username55', 'password', attributeList, null, function(err, result){
    if (err) {
        console.log(err);
        return;
    }
    let cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
});