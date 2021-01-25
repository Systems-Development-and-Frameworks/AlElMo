# alelmo

## GraphQL architecture motivation
We decided to solve the task using a remote GraphQL API for a few reasons. Firstly, a remote backend is a very useful feature for the future development of this app. Furthermore it was not appealing to us to use docker on each developer's machine to work on the backend together. Lastly, due to time constraints we were hoping to choose the approach that would be faster for us to implement.

## GraphCMS motivation and setup
We followed the suggestion and opted for the GraphCMS as our Headless CMS for its ease of use through the GUI and API playground, support of all required features and a helpful documentation.  
To create a free, fully hosted Headless CMS sign up on [GraphCMS](https://auth.graphcms.com) and create a new project from scratch.
Now you can create your models and their fields according to the schema.
We created a model for Post and for Person.

![Person](https://i.imgur.com/2H2OVm3.png)

![Post](https://i.imgur.com/4ZEqpvU.png)

To access the Headless CMS from the application you can find the API access URL in the GraphCMS settings.

## .env
To use this project you need a file called ```.env``` in the folder ```alelmo\backend```. This file contains this 3 attributes (please insert your attributes instead of the brackets):
```
JWT_SECRET=[your JWT_SECRET]
GRAPH_CMS_API_TOKEN=[your GRAPH_CMS_API_TOKEN]
GRAPH_CMS_ENDPOINT=[your GRAPH_CMS_ENDPOINT]
```

## Project setup
```
npm install
```

### Run tests
```
npm run test
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Lints and fixes files
```
npm run lint
```

### Lints and fixes files
```
npm run lint:fix
```
