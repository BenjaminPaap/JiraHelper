function unique(value, index, self) {
    return self.indexOf(value) === index;
}

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    var content = document.body.textContent;
    var regex = /\b([A-Z]{2,3}-\d+)\b/g;
    var matches = content.match(regex);

    matches = matches.filter(unique);
    matches.forEach(function(match) {
        var elements = $(':contains('+match+')');

        elements.each(function(idx) {
            if ($(this).children().length == 0) {
                $(this).html($(this).text().replace(new RegExp(match, 'g'), '<a href="'+msg.details.jira+'/browse/'+match+'">'+match+'</a>'));
            }
        });
    });
});
