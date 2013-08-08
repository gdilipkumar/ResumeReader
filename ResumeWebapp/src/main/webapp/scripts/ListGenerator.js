/**
 * Created with JetBrains WebStorm.
 * User: dilip
 * Date: 5/8/13
 * Time: 12:35 PM
 * To change this template use File | Settings | File Templates.
 */

resumeReader.ListGenerator = function () {
    var domEle = resumeReader.ElementCreator,
        ids = resumeReader.ids,
        idsPrefix = resumeReader.idsPrefix;
    "use strict";
    function createResultsList(activeHits, inactiveHits, probableHits) {
        var resultListContainer = domEle.createDomEle("div", "", "", ""),
            tabContent = domEle.createDomEle("div", "", "tab-content", ""),
            activeList = domEle.createDomEle("div", "active", "tab-pane active", ""),
            inactiveList = domEle.createDomEle("div", "inactive", "tab-pane", ""),
            probableList = domEle.createDomEle("div", "probable", "tab-pane", ""),
            navigationBar = domEle.createDomEle("ul", "", "nav nav-tabs nav-pills",
                " <li class='active '> <a class='span2' href='#active' data-toggle='tab'>Active</a> </li>" +
                    "<li><a class='span2' href='#probable' data-toggle='tab'>Probable</a></li>" +
                    "<li><a class='span2' href='#inactive' data-toggle='tab'>Inactive</a></li>");

        // creating active and inactive lists
        activeList.appendChild(createList(activeHits, idsPrefix.activeList));
        probableList.appendChild(createList(probableHits, idsPrefix.probableList));
        inactiveList.appendChild(createList(inactiveHits, idsPrefix.inactiveList));

        tabContent.appendChild(activeList);
        tabContent.appendChild(probableList);
        tabContent.appendChild(inactiveList);

        resultListContainer.appendChild(navigationBar);
        resultListContainer.appendChild(tabContent);

        return resultListContainer;
    }

    function createList(hits, idPrefix) {
        "use strict";
        var resultsList = domEle.createDomEle("ul", ids.resultList, "nav nav-tabs nav-stacked", "");
        for (var i = 0; i < hits.length; i++) {
            var listEle = domEle.createDomEle("li", "", "resultListElement", "");
            listEle.appendChild(createListItemHeader(idPrefix + i, hits[i].title, hits[i].filepath));
            listEle.appendChild(createListItemSummaryDiv(idPrefix + i, hits[i].summary));
            resultsList.insertBefore(listEle, null);
        }
        return resultsList;
    }

    function createListItemHeader(id, title, path) {
        title = (title == "" ? "TITLE" : title);
        var titleDiv = domEle.createDomEle("div", idsPrefix.itemDiv + id, "itemHeader", ""),
            titleLabel = domEle.createDomEle("span", "", "titleLabel", title),
            viewLink = domEle.createDomEle("a", "", "offset1 pull-right", "<i class='icon-eye-open'></i>"),
            expandButton = domEle.createDomEle("a", "", "expandSummary offset1 pull-right",
                "<i id='" + idsPrefix.itemCollapseIcon + id + "' class = 'icon-chevron-down'></i>");
       //var viewLink = "<a data-toggle='modal' class='btn' href='"+resumeReader.url.view + "?filename=" + path +"' data-target=''#myModal'>click me</a>"
        viewLink.href = encodeURI(resumeReader.url.view + "?filename=" + path);
        viewLink.setAttribute('data-toggle',"modal");
        viewLink.setAttribute('data-target',"#myModal");
        //viewLink.href = "#";
        /*viewLink.onclick = function(e) {
            e.preventDefault();
            $('#myModal').modal({
               //remote: resumeReader.url.view + "?filename=" + path
                remote: "remote.html"
            });
        };*/
        //viewLink.target = "_blank";
        expandButton.href = "#";
        expandButton.onclick = function (e) {
            e.preventDefault();
            var summaryCollapseIcon = $("#" + idsPrefix.itemCollapseIcon + id);
            $("#itemSummary" + id).slideToggle("slow", function () {
                summaryCollapseIcon.attr("class", (summaryCollapseIcon.attr("class") == "icon-chevron-down"
                    ? "icon-chevron-up" : "icon-chevron-down"))
            });
        };
        titleDiv.appendChild(titleLabel);
        titleDiv.appendChild(expandButton);
        titleDiv.appendChild(viewLink);
        return titleDiv;
    }

    function createListItemSummaryDiv(id, summary) {
        var summaryDiv = domEle.createDomEle("div", idsPrefix.itemSummary + id, "summaryDiv", ""),
            summaryPara = domEle.createDomEle("p", "", "summaryPara", summary);

        summaryDiv.style.display = "none";
        summaryDiv.appendChild(summaryPara);
        return summaryDiv;
    }

    return {
        createResultsList: function (activeHits, inActiveHits, probableHits) {
            return createResultsList(activeHits, inActiveHits, probableHits);
        }
    };
}();
