/**
 * Created with JetBrains WebStorm.
 * User: dilip
 * Date: 12/8/13
 * Time: 2:33 PM
 * To change this template use File | Settings | File Templates.
 */

resumeReader.Configuration = function () {
    "use strict";
    function loadConfigValues() {
        $.ajax({type: "get",
            url: resumeReader.url.config,
            success: function (response) {
                var values = jQuery.parseJSON(response),
                    ids = resumeReader.ids;
                $("#" + ids.txtResumeDir).val(values.resumeDir);
                $("#" + ids.txtEmployeeList).val(values.employeeListFile);

                // enabling submit button
                $(".inputBox").change(function () {
                    $("#btnConfigUpdate").prop("disabled", false);
                });

                //$("#keyInputModal").modal("show");
            },
            error: function (xhr) {
                printErrorAlert(xhr);
            }
        });
    }

    function printErrorAlert(xhr) {
        $("#alertText").html("An error occured:" + xhr.status + "<br />" + xhr.statusText +
            "<br/>" + xhr.responseText);
        var alertBox = $("#alertBox");
        alertBox.removeClass("hide");
        alertBox.removeClass("alert-success");
        alertBox.addClass("alert-error");
    }

    function printSuccessAlert(response) {
        $("#alertText").text(response);
        var alertBox = $("#alertBox");
        alertBox.removeClass("hide");
        alertBox.removeClass("alert-error");
        alertBox.addClass("alert-success");
    }

    function doUpdateConfig(userData, btnUpdate) {
        var prevText = btnUpdate.text();
        $.ajax({type: "post",
            url: resumeReader.url.config,
            data: userData,
            beforeSend: function (xhr) {
                btnUpdate.text("please wait..");
            },
            success: function (response) {
                printSuccessAlert(response);
                loadConfigValues();
            },
            error: function (xhr) {
                printErrorAlert(xhr);
                loadConfigValues();
            },
            complete: function (xhr, status) {
                btnUpdate.text(prevText);
                btnUpdate.prop("disabled", "true");
                $(".inputBox").prop("disabled", "true");
            }
        });
    }

    function updateConfiguration() {
        var ids = resumeReader.ids,
            btnUpdate = $("#btnConfigUpdate"),
            resumeDir = $("#" + ids.txtResumeDir),
            employeeFile = $("#" + ids.txtEmployeeList);
        // building data object, based on user requirements.
        var userData = {
            resumeDir: (resumeDir.attr("disabled") === "disabled") ? "" : resumeDir.val(),
            employeeFile: (employeeFile.attr("disabled") === "disabled") ? "" : employeeFile.val()
        };
        // updating if and only if something is changed
        if (userData.resumeDir !== "" || userData.employeeFile !== "") {
            bootbox.prompt('Enter security key', function (result) {
                userData.securityKey = result;
                doUpdateConfig(userData, btnUpdate);
            });
        } else {
            $("#alertText").html("Text boxes are in disabled state, so nothing to update..!");
            var alertBox = $("#alertBox");
            alertBox.removeClass("hide");
            alertBox.removeClass("alert-success");
            alertBox.addClass("alert-error");
            loadConfigValues();
        }
    }


    function doUpdate(userData, button) {
        var progressBarDiv = $("#progressBarDiv"),
            progressBar = $("#progressBar"),
            interval;
        $.ajax({type: "post",
            url: resumeReader.url.update,
            data: userData,
            beforeSend: function (xhr) {
                button.button("loading");
                progressBarDiv.removeClass("hide");
                var i = 0;
                // for showing progress bar.
                interval = setInterval(function () {
                    if (i < 90) {
                        progressBar.css("width", i + "%");
                        i++;
                    }
                }, 100);
            },
            success: function (response) {
                printSuccessAlert(response);
            },
            error: function (xhr) {
                printErrorAlert(xhr);
            },
            complete: function (xhr, status) {
                progressBar.css("width", "100%");
                clearInterval(interval);
                button.button("reset");
                // closing progress bar after 1 sec
                setTimeout(function () {
                    progressBarDiv.addClass("hide");
                    progressBar.css("width", "0%");
                }, 1000);
            }
        });
    }

    function updateIndex(e) {
        bootbox.prompt('Enter Security key', function (result) {
            if (typeof result == 'undefined' || result == null || result === "") {
                // doing nothing on empty security key.
                return;
            }
            // getting selected button.
            // data-value is the attribute holding clean update and normal update
            var btn = $("#" + e.target.id),
                data = {
                    cleanUpdate: btn.attr("data-value"),
                    securityKey: result
                };
            // performing update
            doUpdate(data, btn);
        });
    }

    function orderFileNames(fileObj) {
        var sortable = [];
        for (var file in fileObj) {
            if (fileObj.hasOwnProperty(file)) {
                var obj = {
                    name: fileObj[file],
                    path: file
                };
                sortable.push(obj);
            }
        }
        sortable.sort(function (file1, file2) {
            return file1.name - file2.name;
        });
        return sortable;
    }

    function filterByName(str, targetDiv) {
        var selected = targetDiv.find("label");
        for (var i = 0; i < selected.length; i++) {
            var selecter = selected[i].getElementsByTagName("span")[0];
            if(selecter.innerHTML.toLowerCase().lastIndexOf(str.toLowerCase()) === -1) {
                selected[i].setAttribute("class","hide");
            } else {
                selected[i].setAttribute("class","");
            }
        }
    }

    function printList(fileObj, targetDiv) {
        var keys = Object.keys(fileObj);
        keys = keys.sort();
        for (var i = 0; i < keys.length; i++) {
            targetDiv.append("<label><input type='checkbox' value='" + keys[i] + "'> <span>" + fileObj[keys[i]] + "</span></label>");
        }
        /*var sorted = orderFileNames(fileObj);
         for (var i = 0; i < sorted.length; i++) {
         targetDiv.append("<label><input type='checkbox' value='" + sorted[i].path + "'> " + sorted[i].name + "</label>");
         }*/
    }

    function printFileFetchError(xhr, targetDiv) {
        targetDiv.html("An error occured:" + xhr.status + "<br />" + xhr.statusText +
            "<br/>" + xhr.responseText);
    }

    function loadFileList(targetDiv) {
        $.ajax({
            url: "resumereader/upload",
            success: function (response) {
                targetDiv.empty();
                printList(JSON.parse(response), targetDiv);
            },
            error: function (xhr) {
                printFileFetchError(xhr, targetDiv);
            }
        });
    }

    return {
        loadConfigValues: function () {
            return loadConfigValues();
        },
        updateIndex: function (e) {
            return updateIndex(e);
        },
        updateConfiguration: function () {
            return updateConfiguration();
        },
        loadFileList: function (targetDiv) {
            loadFileList(targetDiv);
        },
        filterByName: function (str) {
            filterByName(str, $("#fileDeleteModal").find(".modal-body"));
        }
    }
}();