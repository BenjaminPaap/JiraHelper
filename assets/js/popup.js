var urls = {};
var template, tbody;

String.prototype.render = function(context) {
    var replaceString = this;
    var regex;

    Object.keys(context).forEach(function(find) {
        regex = new RegExp('{{'+find+'}}', "g");
        replaceString = replaceString.replace(regex, context[find]);
    });

    return replaceString;
};

function updateSettings()
{
    chrome.storage.sync.set({
        "config": {
            "urls": urls
        }
    });

    buildTable(tbody, urls);
}

function buildTable(tbody, urls)
{
    tbody.empty();

    Object.keys(urls).forEach(function(url) {
        tbody.append(template.render({
            'page': url,
            'jira': urls[url].jira
        }));
    });
}

(function($) {
    $(document).ready(function() {
        tbody = $('#mappings tbody');
        template = $('script#row').html();

        chrome.storage.sync.get(['config'], function(cfg) {
            urls = cfg.config.urls;

            buildTable(tbody, urls);

            $('#mappings')
                .on('click', '#add', function() {
                    tbody.append(template.render({
                        page: '',
                        jira: ''
                    }));
                })
                .on('click', 'button[name="remove"]', function() {
                    var page = $(this).closest('tr').attr('data-page');

                    if (urls[page] != undefined) {
                        delete urls[page];
                    }

                    updateSettings();
                })
                .on('click', 'button[name="save"]', function() {
                    var tr   = $(this).closest('tr');
                    var page = tr.find('input[name="page"]').val();
                    var pageAttr = tr.attr('data-page');

                    if (page == "") {
                        alert("Page cannot be empty");
                        return;
                    }
                    var jira = tr.find('input[name="jira"]').val();
                    if (jira == "") {
                        alert("Jira-URL cannot be empty");
                        return;
                    }

                    if (pageAttr != undefined && pageAttr != '') {
                        delete urls[pageAttr];
                    }

                    urls[page] = {
                        "jira": jira
                    };

                    updateSettings();
                });
        });
    });
}) (jQuery);
