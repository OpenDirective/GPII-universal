/*!
GPII Configuration Manager Tests

Copyright 2012 OCAD University
Copyright 2012 Raising The Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function () {
    fluid.registerNamespace("gpii.tests.configurationManager");
    
    var configurationSpec = [{
        "id": "org.gnome.desktop.a11y.magnifier",
        "settingHandlers": [
            {
                "type": "gpii.tests.configurationManager.mocksettingHandler",
                "settings": {
                    "cross-hairs-clip": true,
                    "cross-hairs-color": "red"
                },
                "options": {}
            }
        ],
        "launchHandlers": [
            {
                "type": "gpii.tests.configurationManager.mockLaunchHandler",
                "start": {
                    "schema": "org.gnome.desktop.a11y.applications",
                    "key": "screen-magnifier-enabled",
                    "value": true
                },
                "stop": {
                    "schema": "org.gnome.desktop.a11y.applications",
                    "key": "screen-magnifier-enabled",
                    "value": false
                }
            }
        ]
    }];
    
    var expectedSettingsStore = [{
        "id": "org.gnome.desktop.a11y.magnifier",
        "settingHandlers": [
            {
                "type": "gpii.tests.configurationManager.mocksettingHandler",
                "settings": {
                    "cross-hairs-clip": false,
                    "cross-hairs-color": "red"
                },
                "options": {}
            }
        ],
        "launchHandlers": [
            {
                "type": "gpii.tests.configurationManager.mockLaunchHandler",
                "start": {
                    "schema": "org.gnome.desktop.a11y.applications",
                    "key": "screen-magnifier-enabled",
                    "value": true
                },
                "stop": {
                    "schema": "org.gnome.desktop.a11y.applications",
                    "key": "screen-magnifier-enabled",
                    "value": false
                }
            }
        ]
    }];

	var createPayloadForsettingHandlerRequest = {
		"type": "gpii.settings.gsettingHandler",
		"settings": {
			"cross-hairs-clip": true,
			"cross-hairs-color": "red"
		},
		"options": {}
	};
		
	var createPayloadForsettingHandlerResponse = {
		"org.gnome.desktop.a11y.magnifier": {
			"settings": {
				"cross-hairs-clip": true,
				"cross-hairs-color": "red",
			},
			"options": {}
        }
    };
    
    var parseHandlerResponseFunctionRequest = {
		"org.gnome.desktop.a11y.magnifier": {
			"settings": {
				"cross-hairs-clip": { "oldValue":  false, "newValue": true },
				"cross-hairs-color": { "oldValue":  "red", "newValue": "red", statusCode: 500, statusMessage: "Internal Error"},
			}
		}
    };
    
	var parseHandlerResponseFunctionExpectedResponse = {
		"cross-hairs-clip": false,
		"cross-hairs-color": "red"
    };
    
    var invokeSettingHandlersRequest = [
		{
			"type": "gpii.tests.configurationManager.mocksettingHandler",
			"settings": {
				"cross-hairs-clip": true,
				"cross-hairs-color": "red"
			},
			"options": {}
		}
	];
    
    var invokeSettingHandlersExpectedSnapshot = [
		{
			"type": "gpii.tests.configurationManager.mocksettingHandler",
			"settings": {
				"cross-hairs-clip": false,
				"cross-hairs-color": "red"
			},
			"options": {}
		}
	];
	
	var invokeLaunchHandlersRequest = [
		{
			"type": "gpii.tests.configurationManager.mockLaunchHandler",
			"start": {
				"schema": "org.gnome.desktop.a11y.applications",
				"key": "screen-magnifier-enabled",
				"value": true
			},
			"stop": {
				"schema": "org.gnome.desktop.a11y.applications",
				"key": "screen-magnifier-enabled",
				"value": false
			}
		}
	];
	
	var launchHandlerExpectedPayloadStart = {
		"schema": "org.gnome.desktop.a11y.applications",
		"key": "screen-magnifier-enabled",
		"value": true
	};

	var launchHandlerExpectedPayloadStop = {
		"schema": "org.gnome.desktop.a11y.applications",
		"key": "screen-magnifier-enabled",
		"value": false
	};

	//This payload will be checked against in the mockLaunchHandler.
	//should be set to launchHandlerExpectedPayloadStart or
	//launchHandlerExpectedPayloadStop depending on what is being tested.
	var launchHandlerExpectedPayload = {}; 

	gpii.tests.configurationManager.mockLaunchHandler = function (data) {
		jqUnit.assertDeepEq("Expected Payload sent to the launch handler",  launchHandlerExpectedPayload, data);
	};
	
	var settingHandlerExpectedInputNewSettings = {
		"org.gnome.desktop.a11y.magnifier": {
			"settings": {
				"cross-hairs-clip": true,
				"cross-hairs-color": "red"
			},
			"options": {}
		}
	};
	
	var settingHandlerExpectedInputRestoreSettings = {
		"org.gnome.desktop.a11y.magnifier": {
			"settings": {
				"cross-hairs-clip": false,
				"cross-hairs-color": "red"
			},
			"options": {}
		}
	}
	
	//This payload will be checked against in the mockSettingsHandler.
	//should be set to settingHandlerExpectedInputNewSettings or
	//settingHandlerExpectedInputRestoreSettings depending on what is being tested.
	var settingHandlerExpectedInput = {};
	
	gpii.tests.configurationManager.mocksettingHandler = function (data) {
		jqUnit.assertDeepEq("expected input sent to settingHandler", data, settingHandlerExpectedInput);
		return parseHandlerResponseFunctionRequest;
	};
	
    gpii.tests.configurationManager.runTests = function () {
        var testCase = jqUnit.TestCase("Configuration Manager");
        
        testCase.test("gpii.configurationManager.createPayloadForsettingHandler()", function () {
        	jqUnit.expect(1);
        	var response = gpii.configurationManager.createPayloadForsettingHandler("org.gnome.desktop.a11y.magnifier", createPayloadForsettingHandlerRequest);
        	jqUnit.assertDeepEq("createPayloadForsettingHandler returning the correct payload", createPayloadForsettingHandlerResponse, response);
        });
        
		testCase.test("gpii.configurationManager.parseHandlerResponse()", function () {
        	jqUnit.expect(1);
        	var response = gpii.configurationManager.parseHandlerResponse("org.gnome.desktop.a11y.magnifier", parseHandlerResponseFunctionRequest);
        	jqUnit.assertDeepEq("parseHandlerResponse returning the correct payload", parseHandlerResponseFunctionExpectedResponse, response);
        });

		testCase.test("gpii.configurationManager.invokeSettingHandlers()", function() {
			jqUnit.expect(2);
			//set the expected input of the mock settingsHandler
			settingHandlerExpectedInput = settingHandlerExpectedInputNewSettings;
			invokeSettingHandlersRequestSnapshot = fluid.copy(invokeSettingHandlersRequest);
			gpii.configurationManager.invokeSettingHandlers("org.gnome.desktop.a11y.magnifier", invokeSettingHandlersRequest, invokeSettingHandlersRequestSnapshot)
			jqUnit.assertDeepEq("invokeSettingHandlers properly updated the settingHandler block", invokeSettingHandlersRequestSnapshot, invokeSettingHandlersExpectedSnapshot)
		});
		
		
		testCase.test("gpii.configurationManager.invokeLaunchHandlers()", function() {
			jqUnit.expect(2);
			launchHandlerExpectedPayload = launchHandlerExpectedPayloadStart;
			gpii.configurationManager.invokeLaunchHandlers(invokeLaunchHandlersRequest, "start");
			
			launchHandlerExpectedPayload = launchHandlerExpectedPayloadStop;
			gpii.configurationManager.invokeLaunchHandlers(invokeLaunchHandlersRequest, "stop");	
		});
		
       testCase.asyncTest("gpii.configurationManager.set() and delete()", function () {    
           	//2 tests for the settingsHandler (see mockSettingsHandler function above)
           	//2 tests for the launchHandler (see mockLaunchHandler function above)
           	//and the two asserts below
           	jqUnit.expect(6);
            var confMan = gpii.configurationManager();
            launchHandlerExpectedPayload = launchHandlerExpectedPayloadStart;
			settingHandlerExpectedInput = settingHandlerExpectedInputNewSettings;

            confMan.set(undefined, configurationSpec, function(success) {
            	jqUnit.assertDeepEq("SET: The expected data has been saved to the settings store: ", confMan.settingsStore, expectedSettingsStore);
            	start();
            });
            
			launchHandlerExpectedPayload = launchHandlerExpectedPayloadStop;
			settingHandlerExpectedInput = settingHandlerExpectedInputRestoreSettings;

            confMan.delete(undefined, undefined, function(success) {
            	jqUnit.assertDeepEq("DELETE: The original settings restored, stop message to launch handler, empty settings store", {}, confMan.settingsStore);
            	start();
            });

        });
	};	
}());
