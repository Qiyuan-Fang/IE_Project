//Display remark instruction
$('#remark_q').ready(function () {
    let remark_q = document.getElementById('remark_q');
    //let data_container = document.createAttribute("data-container");
    //data_container.value = ".row";
    let data_content = document.createAttribute("data-content");
    data_content.value = "<div class='container' style='max-width:276px'><p>You can add your remarks about safety of any street segment by clicking on it, and selecting an appropriate rating.</p></div>";
    //remark_q.setAttributeNode(data_container);
    remark_q.setAttributeNode(data_content);
}).popover({
    html: true,
    container: 'body'
}, 'enable');

//Display setting instruction
$('#setting_q').ready(function () {
    let setting_q = document.getElementById('setting_q');
    let data_container = document.createAttribute("data-container");
    data_container.value = ".row";
    let data_content = document.createAttribute("data-content");
    data_content.value = "<div class='container' style='max-width:276px'><p>The safety index is cauculated based on 5 comfort factors. You can control which factor(s) you care most about.</p></div>";
    setting_q.setAttributeNode(data_container);
    setting_q.setAttributeNode(data_content);
}).popover({
    html: true,
    container: 'body'
}, 'enable');

////Display setting details
$('#setting').ready(function () {
    let setting = document.getElementById('setting');
    let data_toggle = document.createAttribute("data-toggle");
    data_toggle.value = "setting_popover";
    let data_content = document.createAttribute("data-content");
    data_content.value = "<div class='container' style='max-width:400px'>"
        + "<h2 style='color:rgb(112,48,160)'><strong>Settings</strong></h2>"
        + "<div class='row'>"
        + "<h4 style='font-size: 16px;color:#4a4a4a;'> The following factors make me feel more comfortable when I walking outside after dark</h4>"
        + "</div>"

        + "<div class='row'>"
        + "<div class='form-check col-md-1 col-sm-1 col-xs-1'style='padding-right:0px;'>"
        + "<input id='cam' class='form-check-input' type='checkbox' value='' id='defaultCheck1' checked>"
        + "</div>"
        + "<div class='col-md-11 col-sm-11 col-xs-11'>"
        + "<img style='width: 25px; height:25px;' src='../Content/Iteration2/css/img/icon_camera.png'>"
        + "<label style='font-size: 16px;color: rgb(112,48,160)'><strong>&nbsp; Security Camera</strong>&nbsp;</label>"
        + "<img style='width: 20px;height: 25px; text-align: right' src='../Content/Iteration2/css/img/safe.png'>"
        + "</div>"
        + "</div>"

        + "<div class='row'>"
        + "<div class='form-check col-md-1 col-sm-1 col-xs-1' style='padding-right:0px;'>"
        + "<input id='light' class='form-check-input' type='checkbox' value='' id='defaultCheck2' checked>"
        + "</div>"
        + "<div class='col-md-11 col-sm-11 col-xs-11'>"
        + "<img style='width: 30px;height: 30px;' src='../Content/Iteration2/css/img/icon_light.png'>"
        + "<label style='font-size: 16px;color: rgb(112,48,160);'><strong>&nbsp; Street Light</strong>&nbsp;</label>"
        + "<img style='width: 20px;height: 25px; text-align: right' src='../Content/Iteration2/css/img/safe.png'>"
        + "</div>"
        + "</div>"

        + "<div class='row'>"
        + "<div class='form-check col-md-1 col-sm-1 col-xs-1' style='padding-right:0px;'>"
        + "<input id='store' class='form-check-input' type='checkbox' value='' id='defaultCheck3' checked>"
        + "</div>"
        + "<div class='col-md-11 col-sm-11 col-xs-11'>"
        + "<img style='width: 25px;height: 25px;' src='../Content/Iteration2/css/img/icon_cafe.png'>"
        + "<label style='font-size: 16px;color: rgb(112,48,160);'><strong>&nbsp; Open Store</strong>&nbsp;</label>"
        + "<img style='width: 20px;height: 25px; text-align: right' src='../Content/Iteration2/css/img/safe.png'>"
        + "</div>"
        + "</div>"

        + "<div class='row' >"
        + "<div class='form-check col-md-1 col-sm-1 col-xs-1' style='padding-right:0px;'>"
        + "<input id='pede' class='form-check-input' type='checkbox' value='' id='defaultCheck4' checked>"
        + "</div>"
        + "<div class='col-md-11 col-sm-11 col-xs-11'>"
        + "<img style='width: 22px;height: 22px;' src='../Content/Iteration2/css/img/pedestrain.png'>"
        + "<label style='font-size: 16px;color: rgb(112,48,160);'><strong>&nbsp; Pedestrain Flow</strong>&nbsp;</label>"
        + "<img style='width: 20px;height: 25px; text-align: right' src='../Content/Iteration2/css/img/safe.png'>"
        + "</div>"
        + "</div>"

        + "<div class='row'>"
        + "<h4 style='font-size: 16px;color:#4a4a4a'>While the following factor make me feel uncomfortable under the same surrounding</h4>"
        + "</div>"

        + "<div class='row'>"
        + "<div class='form-check col-md-1 col-sm-1 col-xs-1' style='padding-right:0px;'>"
        + "<input id='bar' class='form-check-input' type='checkbox' value='' id='defaultCheck5' checked>"
        + "</div>"
        + "<div class='col-md-11 col-sm-11 col-xs-11'>"
        + "<img style='width: 25px;height: 25px;' src='../Content/Iteration2/css/img/icon_bar.png'>"
        + "<label style='font-size: 16px;color: rgb(112,48,160);'><strong>&nbsp; Bars</strong>&nbsp;</label>"
        + "<img style='width: 25px;height: 25px;' src='../Content/Iteration2/css/img/alarm.png'>"
        + "</div>"
        + "</div>"

        + "<div class='col-md-12' style='text-align:center ;padding: 10px'>"
        + "<button class='btn2 btn-apply round' type='submit' onclick='getSettings()'> Confirm</button>"
        + "</div>"
        + "</div>";
    setting.setAttributeNode(data_toggle);
    setting.setAttributeNode(data_content);
}).popover({
    html: true,
    container: 'body'
}, 'enable');