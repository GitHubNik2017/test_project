var vacancies = [];

function takeVacancies(offset) {
    var req = "https://api.zp.ru/v1/vacancies?period=today&city_id=826&limit=100&offset=" + offset +
        "&fields[]=header&fields[]=rubrics";

    $.ajax({
        url: req,
        type: "GET",
        dataType: "json",
        success: function (data) {
            vacancies = vacancies.concat(data.vacancies);

            if (data.vacancies.length >= 100) {
                takeVacancies(offset + 100);
            } else {
                writeTables();
            }
        }
    });
}

function writeTables() {

    var dataRubrics = {};
    var dataHeaders = {};

    for (var i = 0; i < vacancies.length; i++) {
        var rubrics = vacancies[i].rubrics;

        for (var j = 0; j < rubrics.length; j++) {
            var currentRubric = rubrics[j].title;
            dataRubrics[currentRubric] ? dataRubrics[currentRubric]++ : dataRubrics[currentRubric] = 1
        }

        var headers = vacancies[i].header;
        var header = [];
        header = headers.toUpperCase().split(' ');

        for (var b = 0; b < header.length; b++) {
            var current_header = header[b][0] + header[b].slice(1).toLowerCase();
            current_header = current_header.replace(/[\(\)\.\,\"\;]/g, "");

            if (current_header.length > 3) {
                dataHeaders[current_header] ? dataHeaders[current_header]++ : dataHeaders[current_header] = 1
            }
        }
    }

    takeTables(dataRubrics, 'table_0');
    takeTables(dataHeaders, 'table_1');
}

function compareQuantity(a, b) {
    return b[1] - a[1]
}

function takeTables(data, id) {

    var sortable = [];
    for (var prop in data) {
        sortable.push([prop, data[prop]]);
    }
    sortable.sort(compareQuantity);
    var div = document.getElementById(id);
    var table = document.createElement('table');

    var html = '<tbody>';

    for (var i = 0; i < sortable.length; i++) {
        html += '<tr><td>' + sortable[i][0] + '</td><td>' + sortable[i][1] + '</td></tr>'
    }
    table.innerHTML = html + '</tr></tbody>';
    div.appendChild(table)
}

takeVacancies(0);