/*!
 * ${copyright}
 */
sap.ui.define([
	"sap/ui/core/sample/common/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.core.sample.odata.v4.FieldGroups.FieldGroups", {
		onBeforeRendering : function () {
			this.firstName = this.byId("firstName").getValue();
		},

		onValidateFieldGroup : function () {
			// Only request side effects if the value really has changed. (In multi-framed
			// BeforePush this event may be fired due to a focus loss to another frame.)
			var sFirstName = this.byId("firstName").getValue();

			if (sFirstName !== this.firstName) {
				this.byId("contact").getBindingContext().requestSideEffects([
					{$PropertyPath : "FirstName"},
					{$PropertyPath : "LastName"}
				]);
				this.firstName = sFirstName;
			}
		}
	});
});
