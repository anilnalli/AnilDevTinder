// snippet-start:[ses.JavaScript.createclientv3]
const { SESClient }= require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "us-east-1";
// Create SES service object.
const sesClient = new SESClient({ region: REGION,credentials:{
    accessKeyId:"AKIASCLAWDUOLPIVAMWB",
    secretAccessKey:"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"
} });
module.exports= { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]