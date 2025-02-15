/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/util/Mobile",
	"sap/ui/Device",
	"sap/ui/core/Core",
	"sap/m/ColumnListItem",
	"sap/m/Column",
	"sap/m/Table",
	"sap/m/Text",
	"sap/m/Label",
	"sap/m/MessageToast"
], function(Mobile, Device, Core, ColumnListItem, Column, Table, Text, Label, MessageToast) {
	"use strict";



	Mobile.init();

	QUnit.module("");

	QUnit.test("ShouldRemoveAPopin", function(assert) {
		// SUT
		var hasPopin,
			sut = new ColumnListItem(),
			column = [new Column({
				demandPopin : true,
				// make the column bigger than the screen
				minScreenWidth : "48000px"
			}), new Column()],
			table = new Table({
				columns : column,
				items : sut
			});

		table.placeAt("qunit-fixture");
		Core.applyChanges();
		hasPopin = sut.hasPopin();

		// Act
		sut.removePopin();

		// Assert
		assert.ok(hasPopin, "did have a popin before deleting it");
		assert.equal(sut.$Popin().length, 0,"popin got removed from dom");

		//Cleanup
		table.destroy();
	});

	QUnit.test("ShouldToggleActiveClass", function(assert) {
		var testCase = function(sFunctionName,hasClass){
			//Arrange
			var className = "sapMLIBActive",
				sut = new ColumnListItem({
					cells: new Text()
				}),
				column = [new Column({
					demandPopin : true,
					// make the column bigger than the screen
					minScreenWidth : "48000px"
				}), new Column()],
				table = new Table({
					columns : column,
					items : sut
				});

			table.placeAt("qunit-fixture");
			Core.applyChanges();

			//Act
			sut[sFunctionName]();

			//Assert
			assert.equal(sut.$Popin().hasClass(className), hasClass);

			table.destroy();
		};

		testCase("_activeHandlingInheritor",true);
		testCase("_inactiveHandlingInheritor",false);
	});

	QUnit.test("Should not clone headers for popinDisplay:WithoutHeader", function(assert) {
		// SUT
		var sut = new ColumnListItem({
				cells : [new Text({
					text: "Cell1"
				}), new Text({
					text: "Cell2"
				})]
			}),
			column1 = new Column({
				header : new Text({
					text : "Header1"
				}),

				// make the size bigger than the screen to force to go to popin
				minScreenWidth : "48000px",
				demandPopin : true
			}),
			column2 = new Column({
				header : new Text({
					text : "Header2"
				})
			}),
			table = new Table({
				columns : [column1, column2],
				items : sut
			});

		table.placeAt("qunit-fixture");
		Core.applyChanges();

		// Assert
		assert.ok(sut.hasPopin(), "Popin is generated");
		assert.strictEqual(sut._aClonedHeaders.length, 1, "Popin has cloned header");
		assert.strictEqual(sut.$Popin().find(".sapMListTblSubRowCell").length, 1, "sapMListTblSubRowCell added to popin cell");
		assert.strictEqual(sut.$Popin().find(".sapMListTblSubCntHdr").length, 1, "Popin header is found in the dom");
		assert.strictEqual(sut.$Popin().find(".sapMListTblSubCntSpr").length, 1, "Popin separator is found in the dom");
		assert.strictEqual(sut.$Popin().find(".sapMListTblSubCntVal").length, 1, "Popin cell content found in the dom");
		assert.equal(sut.getContentAnnouncement(), "Header2 Cell2 . Header1 Cell1", "content announcement is correct");

		column1.setPopinDisplay("WithoutHeader");
		Core.applyChanges();

		assert.strictEqual(sut._aClonedHeaders.length, 0, "Does not have any cloned headers");
		assert.strictEqual(sut.$Popin().find(".sapMListTblSubCntHdr").length, 0, "Popin header is not found in the dom");
		assert.strictEqual(sut.$Popin().find(".sapMListTblSubCntSpr").length, 0, "Popin separator is not found in the dom");
		assert.strictEqual(sut.$Popin().find(".sapMListTblSubCntVal").length, 1, "Popin cell content found in the dom");

		column1.destroy();
		Core.applyChanges();

		assert.strictEqual(sut._aClonedHeaders.length, 0, "Does not have any cloned headers");
		assert.strictEqual(sut.$Popin().length, 0, "No popin in the dom");

		//Cleanup
		table.destroy();
	});

	QUnit.test("Test for correct column id", function(assert) {
		var oCLI = new ColumnListItem({
			cells: [
				new Text({text: "Cell data"})
			]
		});
		var oCol = new Column("testColumn", {
			header: new Label({text: "Column Header"})
		});
		var sut = new Table("idResponsiveTable", {
			columns: [oCol],
			items: [oCLI]
		});
		sut.placeAt("qunit-fixture");
		Core.applyChanges();

		var $cell = oCLI.getCells()[0].getDomRef();
		var $td = $cell.parentElement;
		assert.equal($td.getAttribute("data-sap-ui-column"), oCol.getId(), "Column id is correctly associated with cell (data-sap-ui-column)");
		assert.equal($td.getAttribute("headers"), oCol.getId(), "Column id is correctly associated with cell (headers)");

		// cleanup
		sut.destroy();
	});

	QUnit.test("No press event on text selection", function(assert) {
		this.clock = sinon.useFakeTimers();
		var oCLI = new ColumnListItem({
			type: "Active",
			press: function(e) {
				MessageToast.show("Item pressed");
			},
			cells: [
				new Text({text: "Hello World"}),
				new Text({text: "Hello World"})
			]
		});
		var oCol = new Column({
			header: new Label({text: "Column Header"}),
			demandPopin: true,
			minScreenWidth: "4000000px"
		});
		var oTable = new Table({
			columns: [oCol, new Column()],
			items: [oCLI]
		});
		oTable.placeAt("qunit-fixture");
		Core.applyChanges();

		var fnPress = this.spy(oCLI, "firePress");
		oCLI.focus();
		var bHasSelection;
		this.stub(window, "getSelection").callsFake(function() {
			return {
				toString: function() {
					return bHasSelection ? "Hello World" : "";
				},
				focusNode: oCLI.getDomRef("subcell")
			};
		});

		bHasSelection = true;
		assert.equal(window.getSelection().toString(), "Hello World");
		oCLI.$("sub").trigger("tap");
		assert.notOk(fnPress.called, "Press event not fired");

		bHasSelection = false;
		assert.equal(window.getSelection().toString(), "");
		oCLI.$("sub").trigger("tap");
		this.clock.tick(0);
		assert.ok(fnPress.called, "Press event fired");

		// clean up
		oTable.destroy();
	});

	QUnit.module("Dummy Column", {
		beforeEach: function() {
			this.sut = new ColumnListItem({
				cells : [new Text({
					text: "Cell"
				}), new Text({
					text: "Cell"
				})]
			});
			this.table = new Table({
				columns : [
					new Column({width: "15rem"}),
					new Column({width: "150px"})
				],
				items : this.sut,
				fixedLayout: "Strict"
			});


			this.table.placeAt("qunit-fixture");
			Core.applyChanges();
		},
		afterEach: function() {
			this.table.destroy();
		}
	});

	QUnit.test("When there is a dummy col rendered, the dummy cells should also be created", function(assert) {
		assert.ok(this.sut.$().find(".sapMListTblDummyCell").length > 0, "Dummy cell are rendered");
	});

	QUnit.test("Dummy column position when table does not have popins", function(assert) {
		var aTdElements = this.sut.$().children();
		assert.ok(aTdElements[aTdElements.length - 1].classList.contains("sapMListTblDummyCell"), "Dummy cell is rendered as the last td element");
	});

	QUnit.test("Dummy column position when table does has popins", function(assert) {
		var oColumn = this.table.getColumns()[1];
		oColumn.setMinScreenWidth("48000px");
		oColumn.setDemandPopin(true);
		Core.applyChanges();

		var aTdElements = this.sut.$().children();
		assert.notOk(aTdElements[aTdElements.length - 1].classList.contains("sapMListTblDummyCell"), "Dummy cell is rendered as the last td element");
	});
});