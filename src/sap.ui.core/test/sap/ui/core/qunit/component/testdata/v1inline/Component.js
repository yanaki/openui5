sap.ui.define(['jquery.sap.global', 'sap/ui/core/UIComponent'],
	function(jQuery, UIComponent) {
	"use strict";


	var Component = UIComponent.extend("sap.ui.test.v1inline.Component", {

		metadata : {

			"name": "sap.ui.test.v1inline.Component",

			"version": "1.0.0",

			"includes" : [
				"style.css",
				"script.js"
			],

			"dependencies" : {
				"libs" : [
					"sap.ui.layout"
				],
				"components" : [
					"sap.ui.test.other"
				],
				"ui5version" : "1.22.5"
			},

			"config": {
				"any1": {
					"entry": "configuration"
				},
				"any2": {
					"anyobject": {
						"key1": "value1"
					}
				},
				"any3": {
					"anyarray": [1, 2, 3]
				},
				"zero": 0
			},

			"models": {
				"i18n": {
					"type": "sap.ui.model.resource.ResourceModel",
					"uri": "i18n/i18n.properties"
				},
				"sfapi": {
					"type": "sap.ui.model.odata.ODataModel",
					"uri": "./some/odata/service"
				}
			},

			"rootView": "sap.ui.test.view.Main",

			"customizing": {
				"sap.ui.viewReplacements": {
					"sap.ui.test.view.Main": {
						"viewName": "sap.ui.test.view.Main",
						"type": "XML"
					}
				},
				"sap.ui.controllerReplacements": {
					"sap.ui.test.view.Main": "sap.ui.test.view.Main"
				},
				"sap.ui.viewExtensions": {
					"sap.ui.test.view.Main": {
						"extension": {
							"name": "sap.xx.new.Fragment",
							"type": "sap.ui.core.XMLFragment"
						}
					}
				},
				"sap.ui.viewModification": {
					"sap.ui.test.view.Main": {
						"myControlId": {
							"text": "{{mytext}}"
						}
					}
				}
			},

			"routing": {
				"config": {
					"viewType" : "XML",
					"viewPath": "NavigationWithoutMasterDetailPattern.view",
					"targetParent": "myViewId",
					"targetControl": "app",
					"targetAggregation": "pages",
					"clearTarget": false
				},
				"routes": [
					{
						"name" : "myRouteName1",
						"pattern" : "FirstView/{from}",
						"view" : "myViewId"
					}
				]
			},

			"sap.fiori": {
				"key1": "value1",
				"key2": "value2",
				"key3": {
					"subkey1": "subvalue1",
					"subkey2": "subvalue2"
				},
				"key4": ["value1", "value2"]
			},

			"custom.entry": {
				"key1": "value1",
				"key2": "value2",
				"key3": {
					"subkey1": "subvalue1",
					"subkey2": "subvalue2"
				},
				"key4": ["value1", "value2"]
			}

		}

	});


	return Component;

});
