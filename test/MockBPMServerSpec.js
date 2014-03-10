/*jshint -W117 */// ignore all globals

describe("BPM mock server", function () {
	$.sap.require("bpm.error.model.MockBPMServer");
	var mockBPM = new bpm.error.model.MockBPMServer();

	it("starts", function () {
		mockBPM.start();
		expect(mockBPM.isStarted()).toBe(true);
	});

	it("stops", function () {
		mockBPM.stop();
		expect(mockBPM.isStarted()).toBe(false);
	});

	it ("captures taskdata metadata request", function () {
		mockBPM.start();
		var result = $.sap.sjax({url: "/bpmodata/taskdata.svc/f4f657eda02b11e3810b00002fc4e8fa/$metadata", dataType: "text"});
		expect(result.statusCode).toBe(200);
		expect(result.data).toBe(metadataAsString);
		mockBPM.stop();
	});

	it ("captures taskdata InputData request", function () {
		mockBPM.start();
		var result = $.sap.sjax({url: "/bpmodata/taskdata.svc/f4f657eda02b11e3810b00002fc4e8fa/InputData('f4f657eda02b11e3810b00002fc4e8fa')?$expand=ErrorManagement_V01&$format=json", dataType: "text"});
		expect(result.statusCode).toBe(200);
		expect(result.data).toBe(odataAsString);
		mockBPM.stop();
	});

	it ("captures tasks metadata request", function () {
		mockBPM.start();
		var result = $.sap.sjax({url: "/bpmodata/tasks.svc/$metadata", dataType: "text"});
		expect(result.statusCode).toBe(200);
		expect(result.data).toBe(tasksMetaDataAsString);
		mockBPM.stop();
	});

	it ("captures tasks TaskCollection request", function () {
		mockBPM.start();
		var result = $.sap.sjax({url: "/bpmodata/tasks.svc/TaskCollection('f4f657eda02b11e3810b00002fc4e8fa')?$format=json", dataType: "text"});
		expect(result.statusCode).toBe(200);
		expect(result.data).toBe(tasksOdataAsString);
		mockBPM.stop();
	});
});
