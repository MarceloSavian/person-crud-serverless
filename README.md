# Person Crud Serverless

A serverless application built using [SST v3](https://docs.sst.dev), powered by AWS infraestructure including Lambda, API Gateway, Dynamo DB and Event Bridge. The goal of this project was to build a simple insert for a Person and test out new technologies like SST V3.

## 🏗 Architecture

- **API Gateway** for HTTP interface
- **Lambda** functions for business logic
- **DynamoDB** as primary database
- **Event Bridge** to send a simple event
- **SST Console** for managing and debugging in development

## 🚀 Getting Started

- Node.js >= 18
- AWS CLI configured (I suggest you to use [aws-vault](https://github.com/99designs/aws-vault) that already creates all you need in you terminal

## Running Locally

**IMPORTANT**
This project is currently designed to be under marcelosavian.com domain, if you don't want to have a domain configured and generate a random URL you can comment out line 9 and 11 of /infra/api.ts 

Once you have all setup you should first run:

```
npm install
```

After that you can run:

```
npm run dev
```

You can also define a specific stage, and in the current code will deploy the api in a url like `{stage}.api.marcelosavian.com`
```
npm run dev -- --stage=marcelo
```

You should see in you console the link to call you API. You can also use [debug mode with VScode](https://sst.dev/docs/live/#breakpoints) to test it (Although I did not yet managed to make it work) or see logs in [SST console](https://console.sst.dev/) giving the permissions needed.

## Project Structure

```plaintext . 
├── infra/ # Infrastructure defined using SST constructs 
├── functions/ # Lambda function source code 
│  └── data
│  │  └── protocols # All interfaces used by the services 
│  │  └── services # Services with the core logic of the api 
│  └── domain 
│  │  └── models # Main models of the api 
│  │  └── usecases # Definition for the services 
│  └── infra # Here will be all third party packages we can use and also uses the protocols defined by the services protocols 
│  │  └── events # Any event to be sent to EventBridge
│  │  └── repositories # All repositories for the database
│  └── handlers/ 
│    └── routes # Here it's where all the handlers stay they should always be dependent on the core folder 
│    └── shared # Shared between handles like error handlers 
│    └── domain # Definition for the proxy functions
├── sst.config.ts # SST configuration 
└── README.md 
```

## Deployment 

You can deploy you app by running:

```
npm run deploy
```

You can also define a stage:
```
npm run deploy --stage=marcelo
```

