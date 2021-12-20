# Note Taking App

This project contains source code and supporting files for a note taking app that you can deploy with the SAM CLI. It includes the following files and folders.

- functions - Code for the application's Lambda functions.
- test.js - Integration tests for the application code. 
- template.yaml - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions, DynamoDb, API Gateway API and Cognito. These resources are defined in the `template.yaml` file in this project.

## Deploy the application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 14](https://nodejs.org/en/), including the NPM package management tool.

To build and deploy this application for the first time, run the following in your shell:

```bash
npm run setup
```

This command will build, package and deploy the application to AWS.

You can find API Gateway Endpoint URL in the output values displayed after deployment.

## Integration tests

Integration tests are defined in the `test.js` file in this project. Use NPM to run tests.

```bash
npm install
npm run test {YOUR_API_URL}
```

## Cleanup

To delete the application, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
aws cloudformation delete-stack --stack-name note-taking-app
```
