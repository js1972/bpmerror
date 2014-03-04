/*global bpm*/
(function() {
	"use strict";

	jQuery.sap.declare("bpm.error.model.Config");

	bpm.error.model.Config = {};

	(function () {
		var responderOn = jQuery.sap.getUriParameters().get("responderOn");
		bpm.error.model.Config.isMock = ("true" === responderOn);
	}());

	bpm.error.model.Config.getServiceUrl = function () {
		var taskId = jQuery.sap.getUriParameters().get("taskId");
		return  bpm.error.model.Config.getHost() + "/bpmodata/taskdata.svc/" + taskId + "/";
	};

	bpm.error.model.Config.getServiceUrlTasKInfo = function () {
		return  bpm.error.model.Config.getHost() + "/bpmodata/tasks.svc/";
	};


	/*
	The username and password here are only required for local development
	where you want to connect to a real odata service.
	*/

	bpm.error.model.Config.getUser = function () {
		return "username";
	};

	bpm.error.model.Config.getPwd = function () {
		return "password"; //dummy value - enter your BPM credentials here for local development
	};

	bpm.error.model.Config.getHost = function () {
		return "";
	};
}());