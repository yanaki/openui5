/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/m/SlideTile",
	"sap/m/GenericTile",
	"sap/ui/model/json/JSONModel",
	"sap/m/TileContent",
	"sap/m/NewsContent",
	"sap/ui/Device",
	"sap/m/NumericContent",
	"sap/m/library",
	"sap/ui/events/KeyCodes",
	"sap/ui/events/jquery/EventExtension" // only used indirectly?
], function(jQuery, SlideTile, GenericTile, JSONModel, TileContent, NewsContent, Device, NumericContent, library, KeyCodes) {
	"use strict";


	// shortcut for sap.m.GenericTileScope
	var GenericTileScope = library.GenericTileScope;


	QUnit.module("Property scope values", {
		beforeEach: function() {
			this.oSlideTile = new SlideTile();
		},
		afterEach: function() {
			this.oSlideTile.destroy();
			this.oSlideTile = null;
		}
	});

	QUnit.test("Default value of scope", function(assert) {
		assert.strictEqual(this.oSlideTile.getProperty("scope"), GenericTileScope.Display);
	});

	QUnit.test("Change value of scope", function(assert) {
		//Arrange
		var result = this.oSlideTile.setScope(GenericTileScope.Actions);
		//Assert
		assert.strictEqual(result, this.oSlideTile, "'this' is returned");
		assert.strictEqual(this.oSlideTile.getProperty("scope"), GenericTileScope.Actions);
	});

	QUnit.test("Change value of scope twice", function(assert) {
		//Arrange
		this.oSlideTile.setScope(GenericTileScope.Actions);
		this.oSlideTile.setScope(GenericTileScope.Display);
		//Assert
		assert.strictEqual(this.oSlideTile.getProperty("scope"), GenericTileScope.Display);
	});

	function fnCreateSlideTile() {
		//Model
		var oSlideTileData = {
			tiles : [{
				header : "Tile 1",
				frameType : "TwoByOne",
				size : "M",
				tileContent : [{
					footer : "Footer 1",
					value : 10
				}, {
					footer : "Footer 2",
					value : 20
				}]
			}, {
				header : "Tile 2",
				frameType : "OneByOne",
				size : "M",
				tileContent : [{
					footer : "Footer 3",
					value : 30
				}, {
					footer : "Footer 4",
					value : 40
				}]
			}, {
				header : "Tile 3",
				frameType : "OneByOne",
				size : "M",
				tileContent : [{
					footer : "Footer 5",
					value : 50
				}, {
					footer : "Footer 6",
					value : 60
				}]
			}]
		};

		//Template
		var oTileContent = new TileContent({
			footer : "{footer}",
			content : new NumericContent({
				value : "{value}"
			})
		});
		var oGenericTile = new GenericTile({
			frameType : "{frameType}",
			header : "{header}",
			size : "{size}",
			tileContent : {
				template : oTileContent,
				path : "tileContent",
				templateShareable: true
			}
		});
		this.oSlideTile = new SlideTile("st", {
			displayTime : 500,
			transitionTime : 0,
			tiles : {
				template : oGenericTile,
				path : "/tiles",
				templateShareable: true
			}
		});

		var oSlideTileModel = new JSONModel(oSlideTileData);
		this.oSlideTile.setModel(oSlideTileModel);
	}

	var oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");

	QUnit.module("Rendering - sap.m.SlideTile", {
		beforeEach : function() {
			fnCreateSlideTile.call(this);
			this.oSlideTile.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function () {
			this.oSlideTile.destroy();
			this.oSlideTile = null;
		}
	});

	QUnit.test("Test tiles displaying", function(assert) {
		var done = assert.async();
		assert.equal(jQuery("#st-wrapper-0").css("left"), "0px", "The first tile is shown");

		setTimeout(function() {
			assert.equal(jQuery("#st-wrapper-1").css("left"), "0px", "The second tile is shown");
			done();
		}, 500);
	});

	QUnit.test("Test ARIA label for single content in Display scope", function(assert) {
		//Arrange
		var sExpectedText = "Tile 1 10 Neutral Footer 1 20 Neutral Footer 2" + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_ACTIVATE");
		this.oSlideTile.removeTile(this.oSlideTile.getTiles()[2].getId());
		this.oSlideTile.removeTile(this.oSlideTile.getTiles()[1].getId());
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(this.oSlideTile.$().attr("aria-label"), sExpectedText, "SlideTile contains expected ARIA-label attribute");
	});

	QUnit.test("Test ARIA label for single content in Actions scope", function(assert) {
		//Arrange
		var sExpectedText = this.oSlideTile._oRb.getText("GENERICTILE_ACTIONS_ARIA_TEXT") + "\n" +
			"Tile 1 10 Neutral Footer 1 20 Neutral Footer 2" + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_ACTIVATE");
		this.oSlideTile.setScope(GenericTileScope.Actions);
		this.oSlideTile.removeTile(this.oSlideTile.getTiles()[2].getId());
		this.oSlideTile.removeTile(this.oSlideTile.getTiles()[1].getId());
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(this.oSlideTile.$().attr("aria-label"), sExpectedText, "SlideTile contains expected ARIA-label attribute");
	});

	QUnit.test("Test ARIA label for multiple contents in Display scope, Tile is sliding", function(assert) {
		//Arrange
		var sExpectedText = "Tile 1 10 Neutral Footer 1 20 Neutral Footer 2" + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_MULTIPLE_CONTENT") + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_TOGGLE_SLIDING") + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_ACTIVATE");

		//Assert
		assert.equal(this.oSlideTile.$().attr("aria-label"), sExpectedText, "SlideTile contains expected ARIA-label attribute");
	});

	QUnit.test("Test ARIA label for multiple contents in Display scope, sliding is stopped", function(assert) {
		//Arrange
		var sExpectedText = "Tile 1 10 Neutral Footer 1 20 Neutral Footer 2" + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_MULTIPLE_CONTENT") + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_TOGGLE_SLIDING") + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_SCROLL_BACK") + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_SCROLL_FORWARD") + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_ACTIVATE");
		this.oSlideTile._toggleAnimation();

		//Assert
		assert.equal(this.oSlideTile.$().attr("aria-label"), sExpectedText, "SlideTile contains expected ARIA-label attribute");
	});

	QUnit.test("Test ARIA label for multiple content in Actions scope", function(assert) {
		//Arrange
		var sExpectedText = this.oSlideTile._oRb.getText("GENERICTILE_ACTIONS_ARIA_TEXT") + "\n" +
			"Tile 1 10 Neutral Footer 1 20 Neutral Footer 2" + "\n" +
			this.oSlideTile._oRb.getText("SLIDETILE_ACTIVATE");
		this.oSlideTile.setScope(GenericTileScope.Actions);
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(this.oSlideTile.$().attr("aria-label"), sExpectedText, "SlideTile contains expected ARIA-label attribute");
	});

	QUnit.test("Test sliding active per default", function(assert) {
		//Assert
		assert.ok(!this.oSlideTile._bAnimationPause, "Animation is active");
	});

	QUnit.test("Test toggle sliding", function(assert) {
		//Arrange
		var spy = sinon.spy(this.oSlideTile, "_toggleAnimation"),
			oEvent = jQuery.Event("keyup");
		oEvent.keyCode = KeyCodes.SPACE;
		//Act
		this.oSlideTile.onkeyup(oEvent);
		//Assert
		assert.ok(spy.calledOnce, "Function _toggleAnimation called once");
	});

	QUnit.test("In Action Scope toggle sliding is not allowed", function(assert) {
		//Arrange
		this.oSlideTile.setScope("Actions");
		sap.ui.getCore().applyChanges();
		var spy = sinon.spy(this.oSlideTile, "_toggleAnimation"),
			oEvent = jQuery.Event("keyup");
		oEvent.keyCode = KeyCodes.SPACE;
		oEvent.target = {
			id : "-otto"
		};
		//Act
		this.oSlideTile.onkeyup(oEvent);
		//Assert
		assert.ok(spy.notCalled, "Function _toggleAnimation not called");
	});

	QUnit.test("Focus stays on SlideTile", function(assert) {
		//Assert
		assert.ok(this.oSlideTile.$().attr("tabindex"), "Focus stays on SlideTile");
		assert.notOk(this.oSlideTile.getTiles()[0].$().attr("tabindex"), "Focus is removed from first GenericTile");
		assert.notOk(this.oSlideTile.getTiles()[1].$().attr("tabindex"), "Focus is removed from second GenericTile");
	});

	QUnit.test("SlideTile in Actions scope", function(assert) {
		//Arrange
		var spyScrollToTile = sinon.spy(this.oSlideTile, "_scrollToTile");
		var spyStartAnimation = sinon.spy(this.oSlideTile, "_startAnimation");
		var spyInvalidate = sinon.spy(this.oSlideTile, "invalidate");
		//Act
		this.oSlideTile.setScope(GenericTileScope.Actions);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(spyScrollToTile.calledOnce, "Function _scrollToTile is called");
		assert.ok(spyStartAnimation.notCalled, "Function _startAnimation is not called");
		assert.ok(spyInvalidate.calledOnce, "Invalidate function is called");
		assert.notOk(document.getElementById("st-pause-play-icon"), "The pause/play button is hidden");
		assert.notOk(document.getElementById("st-tilesIndicator"), "The indicator is hidden");
	});

	QUnit.test("GenericTile view in SlideTile Actions scope", function(assert) {
		//Arrange
		var spy = [],
			oTiles = this.oSlideTile.getTiles();
		for (var i = 0; i < oTiles.length; i++) {
			spy[i] = sinon.spy(oTiles[i], "showActionsView");
		}
		//Act
		this.oSlideTile.setScope(GenericTileScope.Actions);
		sap.ui.getCore().applyChanges();
		//Assert
		for (var i = 0; i < oTiles.length; i++) {
			assert.ok(spy[i].calledWith(true), "The " + i + " Tile shows Actions view");
		}
	});

	QUnit.test("Correct Height and Width are rendered", function(assert) {
		this.oSlideTile.setWidth("100%");
		this.oSlideTile.getTiles()[0].setFrameType("Stretch");
		this.oSlideTile.getTiles()[0].setMode("ArticleMode");
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(this.oSlideTile.getDomRef().style.width, "100%", "Slide tile has rendered in 100% width");
		assert.ok(this.oSlideTile.getDomRef().querySelector(".sapMSTWrapper.sapMGTTileStretch"), "Slide tile wrapper with stretch class exist");

		assert.equal(this.oSlideTile.getTiles()[0].getDomRef().offsetWidth, this.oSlideTile.getDomRef().offsetWidth, "Slide tile and Generic Tile inside it has the same width");
		assert.equal(this.oSlideTile.getTiles()[0].getDomRef().offsetHeight, this.oSlideTile.getDomRef().offsetHeight, "Slide tile and Generic Tile inside it has the same height");
	});

	QUnit.test("When GenericTile frametype is not Stretch", function(assert) {
		this.oSlideTile.setWidth("100%");
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(this.oSlideTile.getDomRef().style.width, "100%", "Slide tile has rendered in 100% width");
		assert.notOk(this.oSlideTile.getDomRef().querySelector(".sapMSTWrapper.sapMGTTileStretch"), "Slide tile wrapper with stretch class doesn't exist");

		assert.equal(this.oSlideTile.getTiles()[0].getDomRef().offsetWidth, 360, "Generic Tile inside Slide tile has the default width");
	});

	QUnit.module("Events - sap.m.SlideTile", {
		beforeEach : function() {
			this.fnPressHandler = function() {
			};
			this.fnSecondPressHandler = function() {
			};
			fnCreateSlideTile.call(this);
			this.oSlideTile.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			sinon.spy(this, "fnPressHandler");
			sinon.spy(this, "fnSecondPressHandler");
		},
		afterEach : function () {
			this.fnPressHandler.restore();
			this.fnSecondPressHandler.restore();
			this.oSlideTile.destroy();
			this.oSlideTile = null;
		}
	});

	//Keyboard and mouse tests only valid on desktop
	if (Device.system.desktop) {
		QUnit.test("SlideTile key down handler test", function(assert) {
			//Arrange
			var spy = sinon.spy(this.oSlideTile.getTiles()[0], "onkeydown"),
				oEvent = jQuery.Event("keydown");
			oEvent.keyCode = KeyCodes.ENTER;
			//Act
			this.oSlideTile.$().trigger(oEvent);
			//Assert
			assert.ok(spy.calledOnce, "Key down handler is triggered");
		});

		QUnit.test("SlideTile key up handler and press delegation on GenericTile test", function(assert) {
			//Arrange
			var oEvent = jQuery.Event("keyup");
			this.oSlideTile.getTiles()[0].attachEvent("press", this.fnPressHandler);
			this.oSlideTile.getTiles()[1].attachEvent("press", this.fnSecondPressHandler);
			oEvent.keyCode = KeyCodes.ENTER;
			//Act
			this.oSlideTile.$().trigger(oEvent);
			//Assert
			assert.ok(this.fnPressHandler.calledOnce, "Press delegation on first GenericTile works");
			assert.ok(this.fnSecondPressHandler.notCalled, "The second GenericTile press event is not triggered");
		});

		QUnit.test("SlideTile keyboard button B test", function(assert) {
			//Arrange
			var spy = sinon.spy(this.oSlideTile, "_scrollToNextTile"),
				oEvent = jQuery.Event("keyup");
			oEvent.which = KeyCodes.B;
			this.oSlideTile._bAnimationPause = true;
			//Act
			this.oSlideTile.$().trigger(oEvent);
			//Assert
			assert.ok(spy.calledOnce, "Backwards scrolling by using key B works");
		});

		QUnit.test("SlideTile keyboard button B test - no scrolling if the Tile is sliding", function(assert) {
			//Arrange
			var spy = sinon.spy(this.oSlideTile, "_scrollToNextTile"),
				oEvent = jQuery.Event("keyup");
			oEvent.which = KeyCodes.B;
			this.oSlideTile._bAnimationPause = false;
			//Act
			this.oSlideTile.$().trigger(oEvent);
			//Assert
			assert.ok(spy.notCalled, "No backward scrolling by using key B if the Tile is sliding");
		});

		QUnit.test("In Action Scope keyboard button B is ignored", function(assert) {
			//Arrange
			this.oSlideTile.setScope("Actions");
			sap.ui.getCore().applyChanges();
			var spy = sinon.spy(this.oSlideTile, "_scrollToNextTile"),
				oEvent = jQuery.Event("keyup");
			oEvent.which = KeyCodes.B;
			this.oSlideTile._bAnimationPause = true;
			//Act
			this.oSlideTile.$().trigger(oEvent);
			//Assert
			assert.ok(spy.notCalled, "Backwards scrolling by using key B is not executed in Actions Scope");
		});

		QUnit.test("SlideTile keyboard button F test", function(assert) {
			//Arrange
			var spy = sinon.spy(this.oSlideTile, "_scrollToNextTile"),
				oEvent = jQuery.Event("keyup");
			oEvent.which = KeyCodes.F;
			this.oSlideTile._bAnimationPause = true;
			//Act
			this.oSlideTile.$().trigger(oEvent);
			//Assert
			assert.ok(spy.calledOnce, "Forwards scrolling by using key F works");
		});

		QUnit.test("SlideTile keyboard button F test - no scrolling if the Tile is sliding", function(assert) {
			//Arrange
			var spy = sinon.spy(this.oSlideTile, "_scrollToNextTile"),
				oEvent = jQuery.Event("keyup");
			oEvent.which = KeyCodes.F;
			this.oSlideTile._bAnimationPause = false;
			//Act
			this.oSlideTile.$().trigger(oEvent);
			//Assert
			assert.ok(spy.notCalled, "No forward scrolling by using key F if the Tile is sliding");
		});

		QUnit.test("In Action Scope keyboard button F is ignored", function(assert) {
			//Arrange
			this.oSlideTile.setScope("Actions");
			sap.ui.getCore().applyChanges();
			var spy = sinon.spy(this.oSlideTile, "_scrollToNextTile"),
				oEvent = jQuery.Event("keyup");
			oEvent.which = KeyCodes.F;
			this.oSlideTile._bAnimationPause = true;
			//Act
			this.oSlideTile.$().trigger(oEvent);
			//Assert
			assert.ok(spy.notCalled, "Forwards scrolling by using key F is not executed in Actions Scope");
		});

	QUnit.test("SlideTile mouse down handler test", function(assert) {
		//Arrange
		var oDom = this.oSlideTile.$().find(".sapMSTIconClickTapArea")[0];
		var oEvent = jQuery.Event("mousedown");
		oEvent.target = oDom;
		//Act
		this.oSlideTile.$().trigger(oEvent);
		//Assert
		assert.ok(this.oSlideTile.$().hasClass("sapMSTIconPressed"), "Press class is added");
	});
}

	QUnit.test("SlideTile touch start handler test - touch on Pause/play icon", function(assert) {
		//Arrange
		var oEvent = {preventDefault: function(){}};
		var oDom = this.oSlideTile.$().find(".sapMSTIconClickTapArea")[0];
		oEvent.target = oDom;
		//Act
		this.oSlideTile.ontouchstart(oEvent);
		//Assert
		assert.ok(this.oSlideTile.$().hasClass("sapMSTIconPressed"), "Press class is added");
	});

	QUnit.test("SlideTile touch start handler test - touch on SlideTile", function(assert) {
		//Arrange
		var oEvent = {preventDefault: function(){}};
		//Act
		this.oSlideTile.ontouchstart(oEvent);
		//Assert
		assert.notOk(this.oSlideTile.$().hasClass("sapMSTIconPressed"), "Press class is not added");
		assert.ok(this.oSlideTile.$().hasClass("sapMSTHvr"), true, "Hover Class is added");
	});

	QUnit.test("SlideTile touch end handler test", function(assert) {
		//Arrange
		var oEvent = {preventDefault: function(){}};
		//Act
		this.oSlideTile.ontouchend(oEvent);
		//Assert
		assert.notOk(this.oSlideTile.$().hasClass("sapMSTHvr"), "Hover Class is removed");
	});

	QUnit.module("Methods - sap.m.SlideTile", {
		beforeEach : function() {
			fnCreateSlideTile.call(this);
			this.oSlideTile.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function () {
			this.oSlideTile.destroy();
			this.oSlideTile = null;
		}
	});

	QUnit.test("Method _getPreviousTileIndex", function(assert) {
		//Arrange
		var iPreviousTileIndex,
			iCurrentTileIndex = 0;
		//Act
		iPreviousTileIndex = this.oSlideTile._getPreviousTileIndex(iCurrentTileIndex);
		//Assert
		assert.equal(iPreviousTileIndex, 2, "Expected previous tile index to the first one returned");
	});

	QUnit.test("Method _getPreviousTileIndex", function(assert) {
		//Arrange
		var iPreviousTileIndex,
			iCurrentTileIndex = 2;
		//Act
		iPreviousTileIndex = this.oSlideTile._getPreviousTileIndex(iCurrentTileIndex);
		//Assert
		assert.equal(iPreviousTileIndex, 1, "Expected previous tile index to the last one returned");
	});

	QUnit.test("Method _getNextTileIndex", function(assert) {
		//Arrange
		var iNextTileIndex,
			iCurrentTileIndex = 0;
		//Act
		iNextTileIndex = this.oSlideTile._getNextTileIndex(iCurrentTileIndex);
		//Assert
		assert.equal(iNextTileIndex, 1, "Expected next tile index to the first one returned");
	});

	QUnit.test("Method _getNextTileIndex", function(assert) {
		//Arrange
		var iNextTileIndex,
			iCurrentTileIndex = 1;
		//Act
		iNextTileIndex = this.oSlideTile._getNextTileIndex(iCurrentTileIndex);
		//Assert
		assert.equal(iNextTileIndex, 2, "Expected next tile index to the last one returned");
	});

	QUnit.test("Method _scrollToTile", function(assert) {
		//Arrange
		var iScrollToTile = 1;
		var sDir = sap.ui.getCore().getConfiguration().getRTL() ? "right" : "left";
		//Act
		this.oSlideTile._scrollToTile(iScrollToTile);
		//Assert
		assert.equal(this.oSlideTile.$("wrapper-" + iScrollToTile).css(sDir), "0px", "The expected tile is displayed");
	});

	QUnit.test("Method _scrollToNextTile - option: scroll backward and stop the animation", function(assert) {
		//Arrange
		var sAriaLabel,
			sAdditionalText = oResBundle.getText("SLIDETILE_MULTIPLE_CONTENT") + "\n" +
				oResBundle.getText("SLIDETILE_TOGGLE_SLIDING") + "\n" +
				oResBundle.getText("SLIDETILE_SCROLL_BACK") + "\n" +
				oResBundle.getText("SLIDETILE_SCROLL_FORWARD") + "\n" +
				oResBundle.getText("SLIDETILE_ACTIVATE"),
			sAriaLabelExpected = "Tile 3 50 Neutral Footer 5 60 Neutral Footer 6\n" + sAdditionalText;
		this.oSlideTile._toggleAnimation();
		//Act
		this.oSlideTile._scrollToNextTile(true, true);
		sAriaLabel = this.oSlideTile.$().attr("aria-label");

		//Assert
		assert.equal(sAriaLabel, sAriaLabelExpected, "Expected backward animation done");
	});

	QUnit.test("Method _scrollToNextTile - option: scroll forward and stop the animation", function(assert) {
		//Arrange
		var sAriaLabel,
			sAdditionalText = oResBundle.getText("SLIDETILE_MULTIPLE_CONTENT") + "\n" +
				oResBundle.getText("SLIDETILE_TOGGLE_SLIDING") + "\n" +
				oResBundle.getText("SLIDETILE_SCROLL_BACK") + "\n" +
				oResBundle.getText("SLIDETILE_SCROLL_FORWARD") + "\n" +
				oResBundle.getText("SLIDETILE_ACTIVATE"),
			sAriaLabelExpected = "Tile 2 30 Neutral Footer 3 40 Neutral Footer 4\n" + sAdditionalText;
		this.oSlideTile._toggleAnimation();
		//Act
		this.oSlideTile._scrollToNextTile(true, false);
		sAriaLabel = this.oSlideTile.$().attr("aria-label");

		//Assert
		assert.equal(sAriaLabel, sAriaLabelExpected, "Expected forward animation done");
	});

	QUnit.test("Method _scrollToNextTile - option: scroll forward twice and stop the animation", function(assert) {
		//Arrange
		var sAriaLabel,
			sAdditionalText = oResBundle.getText("SLIDETILE_MULTIPLE_CONTENT") + "\n" +
				oResBundle.getText("SLIDETILE_TOGGLE_SLIDING") + "\n" +
				oResBundle.getText("SLIDETILE_SCROLL_BACK") + "\n" +
				oResBundle.getText("SLIDETILE_SCROLL_FORWARD") + "\n" +
				oResBundle.getText("SLIDETILE_ACTIVATE"),
			sAriaLabelExpected = "Tile 3 50 Neutral Footer 5 60 Neutral Footer 6\n" + sAdditionalText;
		this.oSlideTile._toggleAnimation();
		//Act
		this.oSlideTile._scrollToNextTile(true, false);
		this.oSlideTile._scrollToNextTile(true, false);
		sAriaLabel = this.oSlideTile.$().attr("aria-label");
		//Assert
		assert.equal(sAriaLabel, sAriaLabelExpected, "Expected forward animation done");
	});

	QUnit.test("Tests if multiple tiles indicator displayed when there are more tiles", function(assert) {
		//Act
		var $indicator = this.oSlideTile.$("tilesIndicator");
		//Assert
		assert.ok($indicator.length > 0, "Multiple tiles indicator displayed when there are more tiles");
	});

	QUnit.test("Tests if multiple tiles indicator not displayed when there is only one tile", function(assert) {
		//Arrange
		this.oSlideTile.removeTile(this.oSlideTile.getTiles()[2].getId());
		this.oSlideTile.removeTile(this.oSlideTile.getTiles()[1].getId());
		sap.ui.getCore().applyChanges();
		//Act
		var $indicator = this.oSlideTile.$("tilesIndicator");
		//Assert
		assert.ok($indicator.length === 0, "Multiple tiles indicator not displayed when there is only one tile");
	});

	QUnit.test("Tests if the number of dots is correct", function(assert) {
		//Act
		var $indicator = this.oSlideTile.$("tilesIndicator");
		var iTilesCount = this.oSlideTile.getTiles().length;
		//Assert
		assert.equal($indicator.children().length, iTilesCount, "The number of indicator dots is same as the number of tiles");
	});

	QUnit.test("Tests if the active dot displayed correctly", function(assert) {
		//Act
		var $indicator = this.oSlideTile.$("tilesIndicator");
		//Assert
		assert.ok(jQuery($indicator[0].children[0]).hasClass("sapMSTActive"), "The first dot is displayed as active");
	});

	QUnit.test("Tests if the active dot displayed properly after click forward button", function(assert) {
		//Act
		var $indicator = this.oSlideTile.$("tilesIndicator");
		this.oSlideTile._scrollToNextTile(true, false);
		//Assert
		assert.ok(jQuery($indicator[0].children[1]).hasClass("sapMSTActive"), "The second dot displayed as active");
	});

	QUnit.test("Tests if the active dot displayed properly after click backward button", function(assert) {
		//Act
		var $indicator = this.oSlideTile.$("tilesIndicator");
		this.oSlideTile._scrollToNextTile(true, true);
		//Assert
		assert.ok(jQuery($indicator[0].children[2]).hasClass("sapMSTActive"),"The third dot displayed as active");
	});

	QUnit.test("Slide Navigation through bullet click", function(assert) {
		var oFirstBullet = document.querySelector('span[id$="tileIndicator-0"]'),
			oSecondBullet = document.querySelector('span[id$="tileIndicator-1"]');
		//Click Second Bullet
		oSecondBullet.click();
		assert.ok(oSecondBullet.classList.contains("sapMSTActive"), "The second bullet is active");
		assert.notOk(oFirstBullet.classList.contains("sapMSTActive"), "The first bullet is inactive");
		//Click First Bullet
		oFirstBullet.click();
		assert.notOk(oSecondBullet.classList.contains("sapMSTActive"), "The second bullet is inactive");
		assert.ok(oFirstBullet.classList.contains("sapMSTActive"), "The first bullet is active");
	});

	QUnit.module("SlideTile has GenericTile with NewsContent", {
		beforeEach: function() {
			var oNewsTileContent = new TileContent({
				content: new NewsContent()
			});
			var oGenericTile = new GenericTile({
				tileContent: [oNewsTileContent]
			});
			this.oSlideTile = new SlideTile("st-news", {
				tiles: [oGenericTile]
			});
			this.oSlideTile.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSlideTile.destroy();
			this.oSlideTile = null;
		}
	});

	QUnit.test("Method _hasNewsContent", function(assert) {
		//Assert
		assert.ok(this.oSlideTile._hasNewsContent(0), "The GenericTile in SlideTile has NewsContent");
	});

	QUnit.test("Icon color is adapted to NewsContent", function(assert) {
		//Act
		this.oSlideTile.setScope("Actions");
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oSlideTile.hasStyleClass("sapMSTDarkBackground"), "The more icon color is adapted to NewsContent");
	});

	QUnit.module("Rendering - EmptyTile", {
		beforeEach : function() {

			//One empty tile
			this.oEmptySlideTile = new SlideTile("st-empty", {
				displayTime : 500,
				transitionTime : 0,
				tiles : []
			});

			this.oEmptySlideTile.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

		},
		afterEach : function() {
			this.oEmptySlideTile.destroy();
			this.oEmptySlideTile = null;
		}
	});

	QUnit.test("Empty tile displaying", function(assert) {
		assert.ok(jQuery("#st-empty").length !== 0, "Empty tile is shown");
	});

	QUnit.module("Play/pause button", {
		beforeEach : function() {
			fnCreateSlideTile.call(this);
			this.oSlideTile.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oSlideTile.destroy();
			this.oSlideTile = null;
		}
	});

	QUnit.test("The pause icon is set initially", function(assert) {
		// Arrange
		// Act
		// Assert
		assert.ok(this.oSlideTile.$().hasClass("sapMSTPauseIcon"), "The pause icon is set");
	});

	QUnit.test("The pause/play icons are switched after a click on the icon", function(assert) {
		// Arrange
		// Act
		this.oSlideTile.$().find(".sapMSTIconClickTapArea").trigger("mousedown");
		this.oSlideTile.$().trigger("mouseup");
		// Assert
		assert.ok(this.oSlideTile._bAnimationPause === true, "The animation is stopped");
		assert.ok(!this.oSlideTile.$().hasClass("sapMSTPauseIcon"), "The play icon is set");
	});

	QUnit.module("Event Tests", {
		beforeEach : function() {
			fnCreateSlideTile.call(this);
			this.oSlideTile.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oSlideTile.destroy();
			this.oSlideTile = null;
		}
	});

	QUnit.test("No press event on 'tap' in Display scope", function(assert) {
		//Arrange
		var bEventNotTriggered = true;
		this.oSlideTile.attachEvent("press", handlePress);

		//Act
		this.oSlideTile.$().trigger('tap');

		//Assert
		function handlePress(oEvent) {
			bEventNotTriggered = false;
		}
		assert.ok(bEventNotTriggered, "No press event is triggered on mouse click.");
	});

	QUnit.test("Press event of inner GenericTile on 'tap' in Display scope", function(assert) {
		//Arrange
		var oGenericTile = this.oSlideTile.getTiles()[0];
		oGenericTile.attachEvent("press", handlePress);

		//Act
		oGenericTile.$().trigger('tap');

		//Assert
		function handlePress(oEvent) {
			assert.ok(true, "Press event of GenericTile is triggered on mouse click.");
		}
	});

	QUnit.test("Press event of inner GenericTile on 'tap' in Actions scope", function(assert) {
		//Arrange
		var bEventNotTriggered = true,
			oGenericTile = this.oSlideTile.getTiles()[0];
		oGenericTile.attachEvent("press", handlePress);
		this.oSlideTile.setScope(GenericTileScope.Actions);
		sap.ui.getCore().applyChanges();

		//Act
		oGenericTile.$().trigger('tap');

		//Assert
		function handlePress(oEvent) {
			bEventNotTriggered = false;
		}
		assert.ok(bEventNotTriggered, "Press event of GenericTile is not triggered on mouse click.");
	});

	QUnit.test("Press event on 'tap' with correct parameters in Actions scope", function(assert) {
		//Arrange
		var oSlideTile = this.oSlideTile;
		this.oSlideTile.setScope(GenericTileScope.Actions);
		sap.ui.getCore().applyChanges();
		this.oSlideTile.attachEvent("press", handlePress);

		//Act
		this.oSlideTile.$().trigger('tap');

		//Assert
		function handlePress(oEvent) {
			assert.equal(oEvent.getParameter("scope"), GenericTileScope.Actions, "Press event has correct parameter 'scope'");
			assert.equal(oEvent.getParameter("action"), GenericTile._Action.Press, "Press event has correct parameter 'action'");
			assert.equal(oEvent.getParameter("domRef"), oSlideTile._oMoreIcon.getDomRef(), "Event parameter 'domRef' points to More Icon");
		}
	});

	QUnit.test("Keyboard key 'Enter' fires press event with correct parameters in Actions scope", function(assert) {
		//Arrange
		var oSlideTile = this.oSlideTile;
		this.oSlideTile.setScope(GenericTileScope.Actions);
		this.oSlideTile.attachEvent("press", handlePress);
		sap.ui.getCore().applyChanges();
		var oEvent = jQuery.Event("keyup");
		oEvent.keyCode = KeyCodes.ENTER;
		oEvent.target = {
			id : "-dummy"
		};
		//Act
		this.oSlideTile.onkeyup(oEvent);

		//Assert
		function handlePress(oEvent) {
			assert.equal(oEvent.getParameter("scope"), GenericTileScope.Actions, "Press event has correct parameter 'scope'");
			assert.equal(oEvent.getParameter("action"), GenericTile._Action.Press, "Press event has correct parameter 'action'");
			assert.equal(oEvent.getParameter("domRef"), oSlideTile._oMoreIcon.getDomRef(), "Event parameter 'domRef' points to More Icon");
		}
	});

	QUnit.test("Keyboard key 'Space' fires press event with correct parameters in Actions scope", function(assert) {
		//Arrange
		var oSlideTile = this.oSlideTile;
		this.oSlideTile.setScope(GenericTileScope.Actions);
		this.oSlideTile.attachEvent("press", handlePress);
		sap.ui.getCore().applyChanges();
		var oEvent = jQuery.Event("keyup");
		oEvent.keyCode = KeyCodes.SPACE;
		oEvent.target = {
			id : "-dummy"
		};
		//Act
		this.oSlideTile.onkeyup(oEvent);

		//Assert
		function handlePress(oEvent) {
			assert.equal(oEvent.getParameter("scope"), GenericTileScope.Actions, "Press event has correct parameter 'scope'");
			assert.equal(oEvent.getParameter("action"), GenericTile._Action.Press, "Press event has correct parameter 'action'");
			assert.equal(oEvent.getParameter("domRef"), oSlideTile._oMoreIcon.getDomRef(), "Event parameter 'domRef' points to More Icon");
		}
	});

	QUnit.test("Keyboard key 'DELETE' fires press event with correct parameters in Actions scope", function(assert) {
		//Arrange
		var oSlideTile = this.oSlideTile;
		this.oSlideTile.setScope(GenericTileScope.Actions);
		this.oSlideTile.attachEvent("press", handlePress);
		sap.ui.getCore().applyChanges();
		var oEvent = jQuery.Event("keyup");
		oEvent.keyCode = KeyCodes.DELETE;
		oEvent.target = {
			id : "-dummy"
		};
		//Act
		this.oSlideTile.onkeyup(oEvent);

		//Assert
		function handlePress(oEvent) {
			assert.equal(oEvent.getParameter("scope"), GenericTileScope.Actions, "Press event has correct parameter 'scope'");
			assert.equal(oEvent.getParameter("action"), GenericTile._Action.Remove, "Press event has correct parameter 'action'");
			assert.equal(oEvent.getParameter("domRef"), oSlideTile._oRemoveButton.getPopupAnchorDomRef(), "Event parameter 'domRef' points to Remove Button");
		}
	});

	QUnit.test("Keyboard key 'BACKSPACE' fires press event with correct parameters in Actions scope", function(assert) {
		//Arrange
		var oSlideTile = this.oSlideTile;
		this.oSlideTile.setScope(GenericTileScope.Actions);
		this.oSlideTile.attachEvent("press", handlePress);
		sap.ui.getCore().applyChanges();
		var oEvent = jQuery.Event("keyup");
		oEvent.keyCode = KeyCodes.BACKSPACE;
		oEvent.target = {
			id : "-dummy"
		};
		//Act
		this.oSlideTile.onkeyup(oEvent);

		//Assert
		function handlePress(oEvent) {
			assert.equal(oEvent.getParameter("scope"), GenericTileScope.Actions, "Press event has correct parameter 'scope'");
			assert.equal(oEvent.getParameter("action"), GenericTile._Action.Remove, "Press event has correct parameter 'action'");
			assert.equal(oEvent.getParameter("domRef"), oSlideTile._oRemoveButton.getPopupAnchorDomRef(), "Event parameter 'domRef' points to Remove Button");
		}
	});

});