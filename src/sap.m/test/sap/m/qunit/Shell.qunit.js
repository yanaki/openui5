/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/theming/Parameters",
	"sap/ui/core/library",
	"sap/m/Shell",
	"sap/m/SplitApp",
	"sap/m/Page",
	"sap/ui/util/Mobile",
	"sap/ui/qunit/utils/waitForThemeApplied"
], function(qutils, createAndAppendDiv, jQuery, Parameters, coreLibrary, Shell, SplitApp, Page, Mobile, waitForThemeApplied) {
	"use strict";

	// shortcut for sap.ui.core.TitleLevel
	var TitleLevel = coreLibrary.TitleLevel;

	createAndAppendDiv("content");


	var oShell = new Shell("myShell", {
		title: "Test Shell",
		headerRightText: "Mr. Right",
		logo: "../images/SAPLogo.jpg",
		logout: function(){
			window.loggedOut = true;
			QUnit.assert.ok(true, "Logging out");
		}
	});

	var oApp = new SplitApp("myApp", {
		masterPages: new Page("page1", {
			title: "Some Master"
		}),
		detailPages: new Page({
			title: "Some Detail"
		})
	});

	oShell.setApp(oApp);
	oShell.placeAt("content");


	QUnit.test("Shell rendered", function(assert) {
		assert.ok(document.getElementById("myShell"), "Shell should be rendered");
		assert.ok(document.getElementById("myApp"), "App should be rendered");
		assert.ok(document.getElementById("page1"), "Initially the first page should be rendered");
	});


	QUnit.test("Shell should hide the branding bar when another Shell-like control is parent and has one", function(assert) {
		assert.strictEqual(oShell.$().find(".sapMShellBrandingBar").length, 1, "branding bar should be rendered");
		assert.strictEqual(oShell.$().find(".sapMShellBrandingBar").css("display"), "block", "branding bar should normally be visible");

		jQuery(document.body).addClass("sapMBrandingBar-CTX");
		assert.strictEqual(oShell.$().find(".sapMShellBrandingBar").css("display"), "none", "branding bar should not be visible when a Shell is ancestor");

		jQuery(document.body).removeClass("sapMBrandingBar-CTX");
		assert.strictEqual(oShell.$().find(".sapMShellBrandingBar").css("display"), "block", "branding bar should normally be visible");
	});


	// Shell features
	QUnit.test("Shell features", function(assert) {
		var sExpectedAltForLogoImage = sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("SHELL_ARIA_LOGO");
		assert.equal(oShell.$("hdrTxt").text(), "Test Shell", "Title should be rendered");
		assert.equal(jQuery(".sapMShellHeaderRightText").text(), "Mr. Right", "Header right text should be rendered");
		assert.equal(oShell.$("logo").attr("src"), "../images/SAPLogo.jpg", "Logo URL should be rendered");
		assert.equal(oShell.$("logo").attr("alt"), sExpectedAltForLogoImage, "Logo ALT should be 'Logo''");
	});

	QUnit.test("Shell without title", function(assert) {
		var oShellNoTitle = new Shell("myShellNotitle", {
		});

		oShellNoTitle.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		assert.ok(!sap.ui.getCore().byId(oShellNoTitle.getId() + "-hdrText"), "No title should be rendered if no title is passed");

		// clean up
		oShellNoTitle.destroy();
	});

	// logout event
	QUnit.test("Shell logout event", function(assert) {
		assert.expect(2); // incl. logout handler
		window.loggedOut = false;
		qutils.triggerTouchEvent("tap", oShell.getId() + "-logout");
		assert.equal(window.loggedOut, true, "Logout handler should be called");
	});


	if (window.getComputedStyle) {
		var sBgVariant = Parameters.get("sapUiGlobalBackgroundVariant");

		// bg image std
		QUnit.test("Shell background standard (tests the sap.m.BackgroundHelper as well)", function(assert) {
			var bgDiv = oShell.$("BG"),
				style = window.getComputedStyle(bgDiv[0]);

			assert.equal(bgDiv.length, 1, "Background image div should be rendered");
			if (sBgVariant == "Variant1"){
				assert.ok(style.backgroundImage.indexOf("img/bg_white_transparent.png") > -1, "Background image from theme should be applied");
			} else {
				assert.ok(style.backgroundImage.indexOf("img/bg_white_transparent.png") < 0, "No Background image from theme should be applied");
			}

			assert.equal(style.backgroundRepeat, "repeat", "Background should be repeated");
		});

		// bg image - and make it custom
		QUnit.test("Shell background custom (tests the sap.m.BackgroundHelper as well)", function(assert) {
			oShell.setBackgroundImage("test/x.png");
			oShell.setBackgroundRepeat(false);
			oShell.setBackgroundColor("#0f0");
			oShell.setBackgroundOpacity(0.5);

			sap.ui.getCore().applyChanges();

			var bgDiv = oShell.$("BG"),
				style = window.getComputedStyle(bgDiv[0]);

			assert.equal(bgDiv.length, 1, "Background image div should be rendered");
			assert.ok(style.backgroundImage.indexOf("test/x.png") > -1, "Custom background image should be applied");
			assert.equal(style.backgroundRepeat, "no-repeat", "Background should not be repeated");
			assert.equal(window.getComputedStyle(bgDiv[0].parentNode).backgroundColor, "rgb(0, 255, 0)", "Background should be green");
			assert.equal(style.opacity, "0.5", "Background opacity should be set");
		});

		// bg image - revert to standard again
		QUnit.test("Shell background reset (tests the sap.m.BackgroundHelper as well)", function(assert) {
			oShell.setBackgroundImage(null);
			oShell.setBackgroundRepeat(true);
			oShell.setBackgroundColor(null);
			oShell.setBackgroundOpacity(1);

			sap.ui.getCore().applyChanges();

			var bgDiv = oShell.$("BG"),
				style = window.getComputedStyle(bgDiv[0]);

			assert.equal(bgDiv.length, 1, "Background image div should be rendered");
			if (sBgVariant == "Variant1"){
				assert.ok(style.backgroundImage.indexOf("img/bg_white_transparent.png") > -1, "Background image from theme should be applied");
			} else {
				assert.ok(style.backgroundImage.indexOf("img/bg_white_transparent.png") < 0, "No Background image from theme should be applied");
			}
			assert.equal(style.backgroundRepeat, "repeat", "Background should be repeated");
			assert.equal(style.opacity, "1", "Background opacity should be set");
		});

		QUnit.module("custom setters");

		QUnit.test("setTitle modifies the dom, sets the property and doesn't re-render", function(assert) {
			var $Dom,
				sExampleTitle = "example title",
				oSetPropertySpy;

			//arrange
			sap.ui.getCore().applyChanges();
			oSetPropertySpy = this.spy(oShell, "setProperty");

			//act
			oShell.setTitle(sExampleTitle);
			$Dom = oShell.$("hdrTxt");

			//assert
			assert.equal($Dom.html(), sExampleTitle, "dom is modified");
			assert.equal(oShell.getTitle(), sExampleTitle, "property is changed");

			assert.equal(oSetPropertySpy.callCount, 1, "setProperty called once");
			assert.equal(oSetPropertySpy.args[0][0], "title", "setProperty called for 'title' property");
			assert.equal(oSetPropertySpy.args[0][2], true, "setProperty called with suppressRendering === true");
		});

		QUnit.test("setHeaderRightText modifies the dom, sets the property and doesn't re-render", function(assert) {
			var $Dom,
				sExampleHeaderText = "username",
				oSetPropertySpy;

			//arrange
			sap.ui.getCore().applyChanges();
			oSetPropertySpy = this.spy(oShell, "setProperty");

			//act
			oShell.setHeaderRightText(sExampleHeaderText);
			$Dom = oShell.$("hdrRightTxt");

			//assert
			assert.equal($Dom.text(), sExampleHeaderText, "dom is modified");
			assert.equal(oShell.getHeaderRightText(), sExampleHeaderText, "property is changed");

			assert.equal(oSetPropertySpy.callCount, 1, "setProperty called once");
			assert.equal(oSetPropertySpy.args[0][0], "headerRightText", "setProperty called for 'headerRightText' property");
			assert.equal(oSetPropertySpy.args[0][2], true, "setProperty called with suppressRendering === true");
		});

		QUnit.test("setAppWidthLimited modifies the dom, sets the property and doesn't re-render", function(assert) {
			var $Dom,
				oSetPropertySpy;

			//arrange
			sap.ui.getCore().applyChanges();
			oSetPropertySpy = this.spy(oShell, "setProperty");

			//act
			oShell.setAppWidthLimited(false);
			$Dom = oShell.$();

			//assert
			assert.equal($Dom.hasClass("sapMShellAppWidthLimited"), false, "dom is modified");
			assert.equal(oShell.getAppWidthLimited(), false, "property is changed");

			assert.equal(oSetPropertySpy.callCount, 1, "setProperty called once");
			assert.equal(oSetPropertySpy.args[0][0], "appWidthLimited", "setProperty called for 'appWidthLimited' property");
			assert.equal(oSetPropertySpy.args[0][2], true, "setProperty called with suppressRendering === true");

			oShell.setAppWidthLimited(true);
			assert.equal($Dom.hasClass("sapMShellAppWidthLimited"), true, "dom is modified");
			assert.equal(oShell.getAppWidthLimited(), true, "property is changed");

			assert.equal(oSetPropertySpy.callCount, 2, "setProperty called second time");
			assert.equal(oSetPropertySpy.args[1][2], true, "setProperty 2nd time called with suppressRendering === true");
		});

		QUnit.test("setBackgroundOpacity modifies the dom only when value is valid, sets the property and doesn't re-render", function(assert) {
			var $Dom,
					sExampleValidOpacity = 0.5,
					sExampleInvalidOpacity = 2.5,
					oSetPropertySpy;

			//arrange
			sap.ui.getCore().applyChanges();
			oSetPropertySpy = this.spy(oShell, "setProperty");

			//act
			oShell.setBackgroundOpacity(sExampleInvalidOpacity);
			$Dom = oShell.$("BG");

			//assert
			assert.notEqual($Dom.css("opacity"), sExampleInvalidOpacity, "dom is not modified");
			assert.notEqual(oShell.getBackgroundOpacity(), sExampleInvalidOpacity, "property is not changed");

			assert.equal(oSetPropertySpy.callCount, 0, "setProperty is not called");


			//act
			oShell.setBackgroundOpacity(sExampleValidOpacity);

			//assert
			assert.equal($Dom.css("opacity"), sExampleValidOpacity.toString(), "dom is modified");
			assert.equal(oShell.getBackgroundOpacity(), sExampleValidOpacity, "property is changed");

			assert.equal(oSetPropertySpy.callCount, 1, "setProperty called once");
			assert.equal(oSetPropertySpy.args[0][0], "backgroundOpacity", "setProperty called for 'backgroundOpacity' property");
			assert.equal(oSetPropertySpy.args[0][2], true, "setProperty called with suppressRendering === true");
		});

		QUnit.test("setHomeIcon calls setIcons, sets the property and doesn't re-render", function(assert) {
			var oSetPropertySpy,
				oMobileSetIconSpy,
				oExampleIcons = {
					'phone': 'phone-icon_57x57.png',
					'phone@2': 'phone-retina_114x114.png',
					'tablet': 'tablet-icon_72x72.png',
					'tablet@2': 'tablet-retina_144x144.png',
					'precomposed': true,
					'favicon': 'favicon.ico'
				};

			//arrange
			sap.ui.getCore().applyChanges();
			oSetPropertySpy = this.spy(oShell, "setProperty");
			oMobileSetIconSpy = this.spy(Mobile, "setIcons");

			//act
			oShell.setHomeIcon(oExampleIcons);

			//assert
			assert.equal(oShell.getHomeIcon(), oExampleIcons, "property is changed");

			assert.equal(oMobileSetIconSpy.callCount, 1, "Mobile.setIcons called once");
			assert.equal(oMobileSetIconSpy.args[0][0], oExampleIcons, "Mobile.setIcons called with the icons object");

			assert.equal(oSetPropertySpy.callCount, 1, "setProperty called once");
			assert.equal(oSetPropertySpy.args[0][0], "homeIcon", "setProperty called for 'homeIcon' property");
			assert.equal(oSetPropertySpy.args[0][2], true, "setProperty called with suppressRendering === true");
		});
	}

	QUnit.module("Shell's 'titleLevel' property is configurable which prevents adding an invalid HTML header level for some scenarios.");

	QUnit.test("Title has default level H1", function(assert){
		// Arrange
		var oShell = new Shell({
			title: "Test Title level of the Shell"
		});

		// System under test
		oShell.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		var $sTitle = oShell.$("hdr");
		assert.strictEqual($sTitle.find( "h1" ).length, 1, "Title has the default titleLevel H1");

		// cleanup
		oShell.destroy();
	});

	QUnit.test("Title has level H3", function(assert){
		// Arrange
		var oShell = new Shell({
			title: "Test Title level of the Shell",
			titleLevel: TitleLevel.H3
		});

		// System under test
		oShell.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		var $sTitle = oShell.$("hdr");
		assert.strictEqual($sTitle.find( "h3" ).length, 1, "Title has titleLevel H3");

		// cleanup
		oShell.destroy();
	});

	QUnit.test("Title level is set correctly", function(assert){
		// Arrange
		var oShell = new Shell({
			title: "Test Title level of the Shell"
		});

		// System under test
		oShell.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oShell.setTitleLevel("H4");
		sap.ui.getCore().applyChanges();

		// Assert
		var $sTitle = oShell.$("hdr");
		assert.strictEqual($sTitle.find( "h4" ).length, 1, "Title has titleLevel H4");

		// cleanup
		oShell.destroy();
	});

	QUnit.test("When set to Auto title has level H1", function(assert){
		// Arrange
		var oShell = new Shell({
			title: "Test Title level of the Shell",
			titleLevel: TitleLevel.Auto
		});

		// System under test
		oShell.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		var $sTitle = oShell.$("hdr");
		assert.strictEqual($sTitle.find( "h1" ).length, 1, "Title has titleLevel H1");

		// cleanup
		oShell.destroy();
	});

	return waitForThemeApplied();
});