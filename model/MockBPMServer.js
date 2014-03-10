/*
Implement a BPM Mock Server - this just wraps the sap.ui.core.util.MockServer to mock out
both the tasks and taskdata BPM OData services.

This mock server requires the following taskId in the URL to match the security token request:
"http://localhost:8080/?taskId=f4f657eda02b11e3810b00002fc4e8fa&mockdata=true"

Interface: bpm.error.model.MockServer
Implementation: bpm.error.model.MockBPMServer - Module pattern to return a constructor function.
*/

/*global bpm, metadataAsString, odataAsString, tasksMetaDataAsString, tasksOdataAsString, claimResponseString, completeResponseString, securityRequest*/
(function() {
	"use strict";

	$.sap.declare("bpm.error.model.MockBPMServer");
	$.sap.require("bpm.error.model.mockdata");
	$.sap.require("sap.ui.core.util.MockServer");

	/*
	 * Interface
	 */
	bpm.error.model.MockServer = {
		start: function() {},
		stop: function() {},
		isStarted: function() {}
	};

	/*
	 * Implementation
	 * Constructor function
	 */
	bpm.error.model.MockBPMServer = (function () {
		var Constructor;

		Constructor = function () {
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
									"Content-Type": "application/xml",
									"x-csrf-token": "d3c29a13-5386-4254-af20-ffa26c5fd96e"
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
									"Content-Type": "application/json",
									"x-csrf-token": "d3c29a13-5386-4254-af20-ffa26c5fd96e"
								},
								odataAsString
							);
						}
					},
					{	/* get csrf security token */
						method: "GET",
						path: "/f4f657eda02b11e3810b00002fc4e8fa/",
						response: function(oXHR) {
							console.log("*** Security token refresh request to: " + oXHR.url + "***");
							oXHR.respond(
								200,
								{
									"Content-Type": "application/xml",
									"x-csrf-token": "d3c29a13-5386-4254-af20-ffa26c5fd96e"
								},
								securityRequest
							);
						}
					},
					{
						method: "POST",
						path: ".*OutputData.*",
						response: function(oXHR) {
							console.log("*** POST odata request to: " + oXHR.url + "***");
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
									"Content-Type": "application/xml",
									"x-csrf-token": "d3c29a13-5386-4254-af20-ffa26c5fd96e"
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
									"Content-Type": "application/json",
									"x-csrf-token": "d3c29a13-5386-4254-af20-ffa26c5fd96e"
								},
								tasksOdataAsString
							);
						}
					},
					{
						method: "POST",
						path: ".*Claim.*",
						response: function(oXHR) {
							console.log("*** POST odata request to: " + oXHR.url + "***");
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

		// implement the interface
		Constructor.prototype = Object.create(bpm.error.model.MockServer);

		Constructor.prototype.constructor = Constructor;

		Constructor.prototype.start = function () {
			this.taskDataMock.start();
			this.taskMock.start();
		};

		Constructor.prototype.stop = function () {
			this.taskDataMock.stop();
			this.taskMock.stop();
		};

		Constructor.prototype.isStarted = function () {
			if (this.taskDataMock.isStarted() && this.taskMock.isStarted()) {
				return true;
			} else {
				return false;
			}
		};

		/*
		Constructor.prototype = {
			constructor: Constructor,
			start: function () {
				this.taskDataMock.start();
				this.taskMock.start();
			},
			stop: function () {
				this.taskDataMock.stop();
				this.taskMock.stop();
			}
		};
		*/

		return Constructor;
	})();

}());