var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "SCHOOL-DB";
var relationName = "STUDENT-TABLE";
var connToken = "90934443|-31949228832348696|90956940";

$(document).ready(function () {
    resetForm();
    $("#rollNo").on("change", getStudent);
});

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
    var rollNo = $("#rollNo").val();
    return JSON.stringify({ Roll_No: rollNo });
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullName").val(record.Full_Name);
    $("#class").val(record.Class);
    $("#birthDate").val(record.Birth_Date);
    $("#address").val(record.Address);
    $("#enrollmentDate").val(record.Enrollment_Date);

    enableFieldsForEditing();
}

function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#class").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollmentDate").val("");

    $("#rollNo").prop("disabled", false);
    $("#fullName").prop("disabled", true);
    $("#class").prop("disabled", true);
    $("#birthDate").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollmentDate").prop("disabled", true);

    $("#saveButton").prop("disabled", true);
    $("#updateButton").prop("disabled", true);
    $("#resetButton").prop("disabled", true);

    $("#rollNo").focus();
}

function validateData() {
    var rollNo = $("#rollNo").val();
    var fullName = $("#fullName").val();
    var classVal = $("#class").val();
    var birthDate = $("#birthDate").val();
    var address = $("#address").val();
    var enrollmentDate = $("#enrollmentDate").val();

    if (rollNo === "") {
        alert("Roll No is missing");
        $("#rollNo").focus();
        return "";
    }
    if (fullName === "") {
        alert("Full Name is missing");
        $("#fullName").focus();
        return "";
    }
    if (classVal === "") {
        alert("Class is missing");
        $("#class").focus();
        return "";
    }
    if (birthDate === "") {
        alert("Birth Date is missing");
        $("#birthDate").focus();
        return "";
    }
    if (address === "") {
        alert("Address is missing");
        $("#address").focus();
        return "";
    }
    if (enrollmentDate === "") {
        alert("Enrollment Date is missing");
        $("#enrollmentDate").focus();
        return "";
    }

    return JSON.stringify({
        Roll_No: rollNo,
        Full_Name: fullName,
        Class: classVal,
        Birth_Date: birthDate,
        Address: address,
        Enrollment_Date: enrollmentDate
    });
}

function enableFieldsForNewEntry() {
    $("#fullName").prop("disabled", false);
    $("#class").prop("disabled", false);
    $("#birthDate").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#enrollmentDate").prop("disabled", false);
    $("#saveButton").prop("disabled", false);
    $("#resetButton").prop("disabled", false);
}

function enableFieldsForEditing() {
    $("#fullName").prop("disabled", false);
    $("#class").prop("disabled", false);
    $("#birthDate").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#enrollmentDate").prop("disabled", false);
    $("#rollNo").prop("disabled", true);
    $("#updateButton").prop("disabled", false);
    $("#resetButton").prop("disabled", false);
}

function getStudent() {
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, dbName, relationName, rollNoJsonObj);

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        enableFieldsForNewEntry();
        $("#rollNo").prop("disabled", true);
        console.log("New entry. Roll No does not exist in the database.");
    } else if (resJsonObj.status === 200) {
        fillData(resJsonObj);
        console.log("Roll No found. Data populated successfully.");
    } else {
        console.error("Unexpected response:", resJsonObj);
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;

    var putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    alert("Record saved successfully!");
    resetForm();
}

function updateData() {
    var jsonChg = validateData();
    if (jsonChg === "") return;

    var updateRequest = createUPDATERecordRequest(
        connToken,
        jsonChg,
        dbName,
        relationName,
        localStorage.getItem("recno")
    );
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    alert("Record updated successfully!");
    resetForm();
}
