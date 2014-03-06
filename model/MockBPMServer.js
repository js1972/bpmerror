/*global bpm, metadataAsString, odataAsString, tasksMetaDataAsString, tasksOdataAsString, claimResponseString, completeResponseString*/
(function() {
	"use strict";

	$.sap.declare("bpm.error.model.MockBPMServer");
	$.sap.require("bpm.error.model.mockdata");
	$.sap.require("sap.ui.core.util.MockServer");

	/*
	 * Interface
	 */
	bpm.error.model.MockServer = {
		start: function() {}
	};

	/*
	 * Implementation
	 * Constructor function
	 */
	bpm.error.model.MockBPMServer = function() {
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

	// Implement interface on prototype
	bpm.error.model.MockBPMServer.prototype = Object.create(bpm.error.model.MockServer);
	bpm.error.model.MockBPMServer.prototype.start = function() {
		this.taskDataMock.start();
		this.taskMock.start();
	};
}());