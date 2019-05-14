//$(function () {
//    $('#dateTimePicker').datetimepicker({
//        ignoreReadonly: true,
//        format: "DD/MM/YYYY HH:mm",
//        maxDate: new Date()
        
//    });
//});
$('#dateTimePicker').datebox({
    mode: "datetimeflipbox",
    beforeToday: true,
    useTodayButton: true,
    defaultValue: new Date(),
    overrideDatetimeFormat: "%Y-%m-%d %k:%M",
    showInitialValue: true
    
    // ...etc...
});
    //$('.dateTimePicker2').datetimepicker({
    //    useCurrent: false,
    //    format: "DD/MMM/YYYY HH:mm"
    //});
    //$('.dateTimePicker').on("dp.change", function (e) {
    //    $('.dateTimePicker2').data("DateTimePicker").minDate(e.date);
    //});
    //$('.dateTimePicker2').on("dp.change", function (e) {
    //    $('.dateTimePicker').data("DateTimePicker").maxDate(e.date);
    //});


