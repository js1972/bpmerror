/*
Component details:
	- Main Control: sap.m.TileContainer (wrapped in sap.m.Shell to center app on screen
					and limit width - remove if you want a fullscreen app)
	- Views: XML
	- Navigation: EventBus
	
*/
/*global bpm, metadataAsString, odataAsString*/
(function() {
	"use strict";

	jQuery.sap.declare("bpm.error.Component");
	jQuery.sap.require("bpm.error.model.Config");

	sap.ui.core.UIComponent.extend("bpm.error.Component", {

		createContent: function() {
			var url = bpm.error.model.Config.getServiceUrl(),
				urlTaskInfo = bpm.error.model.Config.getServiceUrlTasKInfo(),
				taskModel,
				taskInfoModel;

			// create root view
			var oView = sap.ui.view({
				id: "idViewRoot",
				viewName: "bpm.error.view.Root",
				type: "XML",
				viewData: {
					component: this
				}
			});

			if (bpm.error.model.Config.isMock) {
				jQuery.sap.require("sap.ui.app.MockServer");
				$.sap.require("bpm.error.model.mockdata");

				/*
				The sap.ui.core.util.MockServer.simulate() method does not seem to be
				able to handle BPM odata requests due to the InputData('<taskId>') requests.
				Instead we formulate our own mock responses below...
				*/
				//var oMockServer = new sap.ui.app.MockServer({
				//	rootUri: url
				//});
				//oMockServer.simulate("model/metadata.xml", "model/");
				//oMockServer.simulate("model/metadata.xml", "model/mock.json");

				var oMockServer = new sap.ui.core.util.MockServer({
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
						}
					]
				});

				oMockServer.start();
			}

			// set data model on root view
			
			/*
			Example url to view input data:
			http://app1pod.inpex.com.au:58200/bpmodata/taskdata.svc/aef45374a34a11e3b3910000313ae59a/InputData('aef45374a34a11e3b3910000313ae59a')?$format=json&$expand=ErrorManagementActionRequest_V01
			Example data to view task info:
			http://app1pod.inpex.com.au:58200/bpmodata/tasks.svc/TaskCollection('aef45374a34a11e3b3910000313ae59a')?$format=json
			*/
			if (window.location.host.indexOf("localhost") > -1) {
				taskModel = new sap.ui.model.odata.ODataModel(url, true, "", "", {"Authorization": "Basic " + btoa(bpm.error.model.Config.getUser() + ":" + bpm.error.model.Config.getPwd())});
				taskInfoModel = new sap.ui.model.odata.ODataModel(urlTaskInfo, true, "", "", {"Authorization": "Basic " + btoa(bpm.error.model.Config.getUser() + ":" + bpm.error.model.Config.getPwd())});
			} else {
				taskModel = new sap.ui.model.odata.ODataModel(url, true);
				taskInfoModel = new sap.ui.model.odata.ODataModel(urlTaskInfo, true);
			}

			oView.setModel(taskModel);
			oView.setModel(taskInfoModel, "taskInfo");
			taskInfoModel.attachRequestCompleted({}, function() {
				var bus = sap.ui.getCore().getEventBus();
				bus.publish("events", "onTaskInfoReady");
			});

			/*
			// set device model
			var deviceModel = new sap.ui.model.json.JSONModel({
				isPhone: jQuery.device.is.phone,
				listMode: (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
				listItemType: (jQuery.device.is.phone) ? "Active" : "Inactive"
			});
			deviceModel.setDefaultBindingMode("OneWay");
			oView.setModel(deviceModel, "device");
			*/

			return oView;
		}
	});

}());