# bpmerror

BPM task visualisation app based on SAPUI5. This app caters for error tasks using the BPM OData API.

__This app was scaffolded using the yeoman openui5 generator!__

See the source code comments for more details. The app can be easily changed to work with any message structure in BPM.
The Gruntfile is configured to proxy resources from localhost to the BPM server. This way the same code base can be used for local development as well as deployment onto the BPM server.

## Getting Started
Don't forget to run ```npm install``` after cloning this repo.

## Deploy to BPM server
To deploy your app simply follow these manual steps (will add a grunt task to do this later):

1. Create a project for your app in NWDS
2. Create an EAR (application) project containing the above project
3. Open the WebContent folder of your apps project and import all your files (this repo)
4. Modify Gruntfile.js: Set connect.options.base to specify your web roots; connect.proxies to specify your BPM server and also the location of your local sapui5 resources
5. Modify the Config.js file to specify a username and password for your BPM system for local development
5. Modify the EAR projects (or create one if necessary) application.xml (deployment descriptor) to specify a context-root (this is the base of your url path i.e. if context-root is BPMErrorUI, then the url to your app will be http://<server>:<port>/BPMErrorUI)
5. Deploy the EAR project to the BPM server

