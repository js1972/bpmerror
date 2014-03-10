/*global bpm, metadataAsString, odataAsString, tasksMetaDataAsString, tasksOdataAsString, claimResponseString, completeResponseString*/
(function() {
	"use strict";

	$.sap.require("sap.ui.core.Component");
	$.sap.require("sap.ui.core.util.MockServer");
	$.sap.require("bpm.error.model.mockdata");
	$.sap.declare("bpm.error.model.mockbpmserver2.Component");

	//---------------------------------------------------------------------------------------------------------------------------------------------------
	// Metadata
	//---------------------------------------------------------------------------------------------------------------------------------------------------

	sap.ui.core.Component.extend("bpm.error.model.mockbpmserver2.Component", {
		metadata: {
			"abstract": true,
			version: "1.0",
			includes: [], //array of css and/or javascript files that should be used in the component
			dependencies: { // external dependencies
				libs: [], // array of required libraries, e.g. UX3 if your component depends on them 
				ui5version: "1.13.0"
			},
			publicMethods: [],
			initOnBeforeRender: true,
			properties: {
				// put desired properties here, e.g.
				// initialText: { name:"initialText", type:"string", defaultValue:"Lorem impsum dolor sit amet" }
			}
		}
	});

	//---------------------------------------------------------------------------------------------------------------------------------------------------
	// Framework Methods
	//---------------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 * Initialize the component
	 */
	bpm.error.model.mockbpmserver2.Component.prototype.init = function() {
		this.taskDataMock = new sap.ui.core.util.MockServer({
			rootUri: "/bpmodata/taskdata.svc",
			requests: [
				{
					method: "GET",
					path: ".*metadata.*",
					response: function(oXHR) {
						console.log("*** metadata request to: " + oXHR.url + "***");
						oXHR.respond(
							200,
							{
								"Content-Type": "application/xml"
							},
							metadataAsString
						);
					}
				},
				{
					method: "GET",
					path: ".*InputData.*",
					response: function(oXHR) {
						console.log("*** odata request to: " + oXHR.url + "***");
						oXHR.respond(
							200,
							{
								"Content-Type": "application/json"
							},
							odataAsString
						);
					}
				},
				{
					method: "POST",
					path: ".*OutputData.*",
					response: function(oXHR) {
						console.log("*** odata request to: " + oXHR.url + "***");
						oXHR.respond(
							200,
							{
								"Content-Type": "application/xml"
							},
							completeResponseString
						);
					}
				}
			]
		});

		this.taskMock = new sap.ui.core.util.MockServer({
			rootUri: "/bpmodata/tasks.svc",
			requests: [
				{
					method: "GET",
					path: ".*metadata.*",
					response: function(oXHR) {
						console.log("*** metadata request to: " + oXHR.url + "***");
						oXHR.respond(
							200,
							{
								"Content-Type": "application/xml"
							},
							tasksMetaDataAsString

						);
					}
				},
				{
					method: "GET",
					path: ".*TaskCollection.*",
					response: function(oXHR) {
						console.log("*** odata request to: " + oXHR.url + "***");
						oXHR.respond(
							200,
							{
								"Content-Type": "application/json"
							},
							tasksOdataAsString
						);
					}
				},
				{
					method: "POST",
					path: ".*Claim.*",
					response: function(oXHR) {
						console.log("*** odata request to: " + oXHR.url + "***");
						oXHR.respond(
							200,
							{
								"Content-Type": "application/xml"
							},
							claimResponseString
						);
					}
				}
			]
		});
	};


	//---------------------------------------------------------------------------------------------------------------------------------------------------
	// Public Methods
	//---------------------------------------------------------------------------------------------------------------------------------------------------
	bpm.error.model.mockbpmserver2.Component.prototype.start = function() {
		this.taskDataMock.start();
		this.taskMock.start();
	};

	//---------------------------------------------------------------------------------------------------------------------------------------------------
	// Private Methods
	//---------------------------------------------------------------------------------------------------------------------------------------------------
}());