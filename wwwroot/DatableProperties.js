var fr_lang = {
  sProcessing: "",
  sSearch: "Rechercher&nbsp;:",
  sLengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
  sInfo:
    "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
  sInfoEmpty:
    "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
  sInfoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
  sInfoPostFix: "",
  sLoadingRecords: "&nbsp;",
  sZeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
  sEmptyTable: "Aucune donn&eacute;e disponible dans le tableau",
  oPaginate: {
    sFirst: "Premier",
    sPrevious: "Pr&eacute;c&eacute;dent",
    sNext: "Suivant",
    sLast: "Dernier",
  },
  oAria: {
    sSortAscending: ": activer pour trier la colonne par ordre croissant",
    sSortDescending:
      ": activer pour trier la colonne par ordre d&eacute;croissant",
  },
};
var btn_excel = {
  extend: "excel",
  text: "EXCEL",
  autoPrint: false,
  exportOptions: { columns: "th:not(.notexport)", rows: ":visible" },
};
var btn_pdf = {
  extend: "pdf",
  text: "PDF",
  orientation: "landscape",
  exportOptions: { columns: "th:not(.notexport)", rows: ":visible" },
};

var dt_layout = {
  topStart: "pageLength",
  topEnd: "search",
  bottomStart: "info",
  bottomEnd: "paging",
};

var mic_empty_svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>  <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/></svg>';

var mic_full_svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/>  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/></svg>';
var floppy_svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">  <path d="M11 2H9v3h2z"/>  <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/></svg>';
