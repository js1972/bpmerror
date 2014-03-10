# bpmerror

BPM task visualisation app based on SAPUI5. This app caters for error tasks using the BPM OData API.

__This app was scaffolded using the yeoman openui5 generator!__

See the source code comments for more details. The app can be easily changed to work with any message structure in BPM.
The Gruntfile is configured to proxy resources from localhost to the BPM server. This way the same code base can be used for local development as well as deployment onto the BPM server.

The code for the mock server has been wrapped into a module: MockBPMServer.js. There are a number of ways to structure a module. For now, I have chosen to use the module pattern to return a constructor function. You could also use a UI5 faceless component. I've provided an example of this in the model/mockbpmserver2 directory but it is commented-out out Component.js. SAP have not provided any direction on the best architecture. The module pattern however is a web-standard amongst programmers.

## Getting Started
Don't forget to run ```npm install``` after cloning this repo.

There are 3 way to run this app.

1. Deployed on your BPM server using the real BPM odata source
2. On localhost for development using a mock odata source
3. On localhost for development using a real BPM odata source

### Deployed on BPM
When the app is deployed on the BPM server authentication is handled by BPM. Deploying is a particularly slow process so you don't want to develop here.

### Local Development
When developing you really need to be able to code and run the app in real-time on your local machine. Its just too inefficient any other way.
When running on localhost, we use Grunt as a build system. Enter ```grunt serve``` on the command line to start a Node.js web server and launch your app in the default browser.
The Gruntfile includes:

* The connect task sets up the Node.js web server. Enter your web roots as an array on connect.options.base. e.g. ```base: [".", "../sapui5"]``` will setup the web server to serve your app from the current directory and to also serve resources from ../sapui5 (where my SAPUI5 runtime is located).
* When running on localhost and calling the BPM odata service we will run into CORS issues so we need a proxy. We use grunt-connect-proxy to proxy our odata calls from localhost to the BPM server (if you choose to work this way). This is configured in the connect task. By default this repo proxies resources from /bpmodata to the BPM server. We also have a proxy configured to send all sap ui5 resource reqests back to localhost. The point of this is that we can specify the one UI5 bootstrap url in the html file regardless of whether we run the app on localhost or on the bpm server.
* If you want to completely mock the odata service - then run the app with the ?mockdata=true query parameter. This will start up a sap.ui.core.util.MockServer to mock each of the odata services (wrapped in module bpm.error.model.MockBPMServer). Note that the mockdata.js file contains the response strings. These can be collected from manually running the odata calls on the BPM server and then substituting you own values. Ensure you use this url when running with the mock server: ```http://localhost:8080/?taskId=f4f657eda02b11e3810b00002fc4e8fa&mockdata=true```.

## Deploy to BPM server
To deploy your app simply follow these manual steps (will add a grunt task to do this later):

1. Create a project for your app in NWDS
2. Create an EAR (application) project containing the above project
3. Open the WebContent folder of your apps project and import all your files (this repo)
4. Modify Gruntfile.js: Set connect.options.base to specify your web roots; connect.proxies to specify your BPM server and also the location of your local sapui5 resources
5. Modify the Config.js file to specify a username and password for your BPM system for local development
5. Modify the EAR projects (or create one if necessary) application.xml (deployment descriptor) to specify a context-root (this is the base of your url path i.e. if context-root is BPMErrorUI, then the url to your app will be http://<server>:<port>/BPMErrorUI)
5. Deploy the EAR project to the BPM server

## Testing
The root directory contains a test runner (SpecRunner.html) for executing Jasmin unit tests (in the tests directory). Launch the app with ```grunt serve``` and enter ```http://localhost:8080/SpecRunner.html```.
