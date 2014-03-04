(function() {
	"use strict";

	jQuery.sap.require("sap.ui.commons.MessageBox");
	jQuery.sap.require("sap.m.MessageToast");

	sap.ui.controller("bpm.error.view.Home", {

		onInit: function() {
			var	form = this.getView().byId("form1"),
				bus = sap.ui.getCore().getEventBus();

			this.taskId = jQuery.sap.getUriParameters().get("taskId"),

			// bind the form to the default odata model as well as the taskInfo model
			form.bindElement("/InputData('" + this.taskId + "')", {"expand": "ErrorManagementActionRequest_V01"});
			form.bindElement("taskInfo>/TaskCollection('" + this.taskId + "')", {"expand": "TaskCollection"});

			bus.subscribe("events", "onTaskInfoReady", this.onTaskInfoReady, this);
		},

		/*
		 * onCompleted event handler for the taskInfo odata model.
		 * We can't access the data in the model until the completed event.
		 */
		onTaskInfoReady: function() {
			var	form = this.getView().byId("form1"),
				context = form.getBindingContext("taskInfo");
			
			this.taskStatus = this.getView().getModel("taskInfo").getProperty("Status", context);
			if (this.taskStatus === "COMPLETED") {
				this.disableButtons();
			}
		},

		onProcess: function() {
			this.processingType = "re-send";
			this.claim();
		},

		onCancel: function() {
			this.processingType = "cancel";
			this.claim();
		},

		/*
		 * BPM Claim action. Reserves the task to the executing user. Must be
		 * actioned prior to completing the task.
		 */
		claim: function() {
			// create ODataModel for BPM Tasks OData service
			var tasksSvcURL = "/bpmodata/tasks.svc";
			var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
	
			// send request to BPM Tasks OData service to claim the Task
			tasksODataModel.create("/Claim?InstanceID='" + this.taskId + "'", null, null, function() {
				// success
				this.complete();
			}.bind(this), function(evt) {
				// failure
				sap.ui.commons.MessageBox.alert("Unable to claim task!\n\n" + evt.response.body);
			});
		},

		/*
		 * BPM Complete action. Completes the task in BPM and sets the output data.
		 */
		complete: function() {
			var odataModel = this.getView().getModel(),
				outputData = {
					ErrorManagementActionResponse_V01: {
						ResumeProcess: true
					}
				};

			if (this.processingType === "cancel") {
				outputData.ErrorManagementActionResponse_V01.ResumeProcess = false;
			}

			// Send request to BPM Task Data OData service to complete task
			odataModel.create("/OutputData", outputData, null, function() {
				//success
				this.disableButtons();

				sap.m.MessageToast.show("Task successfully completed: " + this.processingType);
				this.getView().getModel("taskInfo").refresh(true);
				this.getView().invalidate();
			}.bind(this), function(evt) {
				//failure
				sap.ui.commons.MessageBox.alert("An error occured when trying to re-process the task.\nIt is likely that the task has already been completed!\n\n" + evt.response.body);
			});
		},
		
		disableButtons: function() {
			this.byId("btnReprocess").setEnabled(false);
			this.byId("btnCancel").setEnabled(false);
		}

	});

}());