/*
Component details:
	Connect to OData source on NetWeaver BPM to enable completing a Task.
	URL example: http://localhost:8080/?taskId=aef45374a34a11e3b3910000313ae59a&mockdata=true
*/
/*global bpm*/
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

			// start mock data server if required
			if (bpm.error.model.Config.isMock) {
				$.sap.require("bpm.error.model.MockBPMServer");
				var mockBPM = new bpm.error.model.MockBPMServer();
				mockBPM.start();
			}

			// Set data model on root view
			if (window.location.host.indexOf("localhost") > -1) {
				taskModel = new sap.ui.model.odata.ODataModel(url, true, "", "", {"Authorization": "Basic " + btoa(bpm.error.model.Config.getUser() + ":" + bpm.error.model.Config.getPwd())});
				taskInfoModel = new sap.ui.model.odata.ODataModel(urlTaskInfo, true, "", "", {"Authorization": "Basic " + btoa(bpm.error.model.Config.getUser() + ":" + bpm.error.model.Config.getPwd())});
			} else {
				taskModel = new sap.ui.model.odata.ODataModel(url, true);
				taskInfoModel = new sap.ui.model.odata.ODataModel(urlTaskInfo, true);
			}

			oView.setModel(taskModel);
			oView.setModel(taskInfoModel, "taskInfo");

			// Let listeners know the task info model is ready
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