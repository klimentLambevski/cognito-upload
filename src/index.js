import {AuthenticationDetails, CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import * as jwt from 'jsonwebtoken';
import {test} from "./test.ts";

console.log(test);
let authenticationData = {
    Username : 'kliment.lambevski@gmail.com',
    Password : 'Shadows1!',
};

let authenticationDetails = new AuthenticationDetails(authenticationData);
let poolData = {
    UserPoolId : 'us-east-1_1xuF2ZPj5', // Your user pool id here
    ClientId : '1uk1lhb9tbiqbvgv31osp0njca' // Your client id here
};
let userPool = new CognitoUserPool(poolData);
let userData = {
    Username : 'kliment.lambevski@gmail.com',
    Pool : userPool
};

let s3 = null;
let cognitoUserData = null;
let cognitoUser = new CognitoUser(userData);
cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
        cognitoUserData = jwt.decode(result.getAccessToken().getJwtToken());

        console.log(cognitoUserData);

        //POTENTIAL: Region needs to be set if not already set previously elsewhere.
        AWS.config.region = 'us-east-1';

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:d55ef4a6-34a9-4fbd-8f93-89a5c5b8aea2',
            // IdentityId : 'us-east-1:78e0c5a9-f9cb-49e1-a424-7ead94003e04', // your identity pool id here
            Logins : {
                // Change the key below according to the specific region your user pool is in.
                'cognito-idp.us-east-1.amazonaws.com/us-east-1_1xuF2ZPj5' : result.getIdToken().getJwtToken()
            }
        });

        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.get((error) => {
            if (error) {
                console.error(error);
            } else {
                // Instantiate aws sdk service objects now that the credentials have been updated.
                // example: let s3 = new AWS.S3();
                console.log('Successfully logged!', AWS.config.credentials);
                s3 = new AWS.S3({
                    params: {Bucket: 'upload.gotaguyapp.com'}
                });
                console.log(s3.config.credentials.params.IdentityId);
            }
        });
    },

    onFailure: function(err) {
        alert(err);
    },

});

window.inputChange = (inputUpload) => {
    console.log('yeyeyey', AWS.config.credentials);
    let files = inputUpload.files;
    if (!files.length) {
        return alert('Please choose a file to upload first.');
    }
    let file = files[0];
    let photoKey = `avatar/${cognitoUserData.sub}/${file.name}`;

    console.log(inputUpload, photoKey, file)
    s3.upload({
        Key: photoKey,
        Body: file,
        ACL: 'public-read',
        ContentType: file.type
    }, function(err, data) {
        if (err) {
            return console.log('There was an error uploading your photo: ', err.message);
        }
        console.log('Successfully uploaded photo.');

    });
};