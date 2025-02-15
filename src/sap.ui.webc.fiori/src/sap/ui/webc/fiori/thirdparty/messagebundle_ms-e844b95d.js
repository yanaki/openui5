sap.ui.define(['exports'], function (exports) { 'use strict';

	var messagebundle_ms = {
		BARCODE_SCANNER_DIALOG_CANCEL_BUTTON_TXT: "Batalkan",
		BARCODE_SCANNER_DIALOG_LOADING_TXT: "Memuat",
		FCL_START_COLUMN_TXT: "Lajur pertama",
		FCL_MIDDLE_COLUMN_TXT: "Lajur tengah",
		FCL_END_COLUMN_TXT: "Lajur akhir",
		FCL_START_COLUMN_EXPAND_BUTTON_TOOLTIP: "Kembangkan lajur pertama",
		FCL_START_COLUMN_COLLAPSE_BUTTON_TOOLTIP: "Runtuhkan lajur pertama",
		FCL_END_COLUMN_EXPAND_BUTTON_TOOLTIP: "Kembangkan lajur akhir",
		FCL_END_COLUMN_COLLAPSE_BUTTON_TOOLTIP: "Runtuhkan lajur akhir",
		NOTIFICATION_LIST_ITEM_TXT: "Pemberitahuan",
		NOTIFICATION_LIST_ITEM_SHOW_MORE: "Tunjukkan Selanjutnya",
		NOTIFICATION_LIST_ITEM_SHOW_LESS: "Tunjuk Kurang",
		NOTIFICATION_LIST_ITEM_OVERLOW_BTN_TITLE: "Selanjutnya",
		NOTIFICATION_LIST_ITEM_CLOSE_BTN_TITLE: "Tutup",
		NOTIFICATION_LIST_ITEM_READ: "Baca",
		NOTIFICATION_LIST_ITEM_UNREAD: "Tidak Dibaca",
		NOTIFICATION_LIST_ITEM_HIGH_PRIORITY_TXT: "Keutamaan Tinggi",
		NOTIFICATION_LIST_ITEM_MEDIUM_PRIORITY_TXT: "Keutamaan Sederhana",
		NOTIFICATION_LIST_ITEM_LOW_PRIORITY_TXT: "Keutamaan Rendah",
		NOTIFICATION_LIST_GROUP_ITEM_TXT: "Kumpulan Pemberitahuan",
		NOTIFICATION_LIST_GROUP_ITEM_COUNTER_TXT: "Pembilang",
		NOTIFICATION_LIST_GROUP_ITEM_CLOSE_BTN_TITLE: "Tutup Semua",
		NOTIFICATION_LIST_GROUP_ITEM_TOGGLE_BTN_COLLAPSE_TITLE: "Runtuhkan Kumpulan",
		NOTIFICATION_LIST_GROUP_ITEM_TOGGLE_BTN_EXPAND_TITLE: "Kembangkan Kumpulan",
		TIMELINE_ARIA_LABEL: "Garis masa",
		UPLOADCOLLECTIONITEM_CANCELBUTTON_TEXT: "Batal",
		UPLOADCOLLECTIONITEM_RENAMEBUTTON_TEXT: "Namakan Semula",
		UPLOADCOLLECTIONITEM_ERROR_STATE: "Ditamatkan",
		UPLOADCOLLECTIONITEM_READY_STATE: "Tertunda",
		UPLOADCOLLECTIONITEM_UPLOADING_STATE: "Memuat naik",
		UPLOADCOLLECTIONITEM_TERMINATE_BUTTON_TEXT: "Tamatkan",
		UPLOADCOLLECTIONITEM_RETRY_BUTTON_TEXT: "Cuba semula",
		UPLOADCOLLECTIONITEM_EDIT_BUTTON_TEXT: "Edit",
		UPLOADCOLLECTION_NO_DATA_TEXT: "Tiada fail ditemui.",
		UPLOADCOLLECTION_NO_DATA_DESCRIPTION: "Lepaskan fail untuk muat naiknya, atau gunakan butang \"Muat Naik\".",
		UPLOADCOLLECTION_ARIA_ROLE_DESCRIPTION: "Muat Naik Koleksi",
		UPLOADCOLLECTION_DRAG_FILE_INDICATOR: "Seret fail di sini.",
		UPLOADCOLLECTION_DROP_FILE_INDICATOR: "Lepaskan fail untuk muat naiknya.",
		SHELLBAR_LABEL: "Bar Shell",
		SHELLBAR_LOGO: "Logo",
		SHELLBAR_COPILOT: "CoPilot",
		SHELLBAR_NOTIFICATIONS: "{0} Pemberitahuan",
		SHELLBAR_PROFILE: "Profil",
		SHELLBAR_PRODUCTS: "Produk",
		PRODUCT_SWITCH_CONTAINER_LABEL: "Produk",
		SHELLBAR_SEARCH: "Cari",
		SHELLBAR_OVERFLOW: "Selanjutnya",
		SHELLBAR_CANCEL: "Batalkan",
		WIZARD_NAV_ARIA_LABEL: "Bar Proses Bestari",
		WIZARD_LIST_ARIA_LABEL: "Langkah Bestari",
		WIZARD_LIST_ARIA_DESCRIBEDBY: "Untuk aktifkan, tekan bar ruang atau Enter",
		WIZARD_ACTIONSHEET_STEPS_ARIA_LABEL: "Langkah",
		WIZARD_OPTIONAL_STEP_ARIA_LABEL: "Pilihan",
		WIZARD_STEP_ACTIVE: "Aktif",
		WIZARD_STEP_INACTIVE: "Tidak Aktif",
		WIZARD_STEP_ARIA_LABEL: "Langkah {0}",
		WIZARD_NAV_ARIA_ROLE_DESCRIPTION: "Bestari",
		WIZARD_NAV_STEP_DEFAULT_HEADING: "Langkah",
		VSD_DIALOG_TITLE_SORT: "Paparkan Tetapan",
		VSD_SUBMIT_BUTTON: "OK",
		VSD_CANCEL_BUTTON: "Batalkan",
		VSD_RESET_BUTTON: "Tetapkan Semula",
		VSD_SORT_ORDER: "Urutan Isihan",
		VSD_FILTER_BY: "Tapis Mengikut",
		VSD_SORT_BY: "Diisih Mengikut",
		VSD_ORDER_ASCENDING: "Menaik",
		VSD_ORDER_DESCENDING: "Menurun",
		IM_TITLE_BEFORESEARCH: "Mari dapatkan beberapa hasil",
		IM_SUBTITLE_BEFORESEARCH: "Mula dengan menyediakan kriteria carian anda.",
		IM_TITLE_NOACTIVITIES: "Anda belum menambah apa-apa aktiviti lagi",
		IM_SUBTITLE_NOACTIVITIES: "Adakan anda ingin menambah satu aktiviti sekarang?",
		IM_TITLE_NODATA: "Tiada data lagi",
		IM_SUBTITLE_NODATA: "Setelah mempunyai data, anda akan melihatnya di sini.",
		IM_TITLE_NOMAIL: "Tiada e-mel baharu",
		IM_SUBTITLE_NOMAIL: "Semak semula kemudian.",
		IM_TITLE_NOENTRIES: "Tiada entri lagi",
		IM_SUBTITLE_NOENTRIES: "Setelah mempunyai entri, anda akan melihatnya di sini.",
		IM_TITLE_NONOTIFICATIONS: "Anda tidak mendapat apa-apa pemberitahuan baharu",
		IM_SUBTITLE_NONOTIFICATIONS: "Semak semula kemudian.",
		IM_TITLE_NOSAVEDITEMS: "Anda belum menambah apa-apa kegemaran lagi",
		IM_SUBTITLE_NOSAVEDITEMS: "Adakah anda ingin mencipta senarai item kegemaran anda sekarang?",
		IM_TITLE_NOSEARCHRESULTS: "Tiada hasil ditemui",
		IM_SUBTITLE_NOSEARCHRESULTS: "Cuba mengubah kriteria carian anda.",
		IM_TITLE_NOTASKS: "Anda tidak mendapat apa-apa tugas baharu",
		IM_SUBTITLE_NOTASKS: "Setelah mempunyai tugas, anda akan melihatnya di sini.",
		IM_TITLE_UNABLETOLOAD: "Tidak boleh memuat data",
		IM_SUBTITLE_UNABLETOLOAD: "Semak sambungan Internet anda. Jika tidak membantu, cuba muat semula. Sekiranya ia tidak membantu juga, semak dengan pentadbir anda.",
		IM_TITLE_UNABLETOUPLOAD: "Tidak boleh memuat naik data",
		IM_SUBTITLE_UNABLETOUPLOAD: "Semak sambungan Internet anda. Jika tidak membantu, semak format fail dan saiz fail. Jika tidak, hubungi pentadbir anda."
	};

	exports.default = messagebundle_ms;

});
