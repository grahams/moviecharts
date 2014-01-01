

/**
 * This is a Google Apps script

 * Takes my Google Apps movie spreadsheet and sends you an email containing
 * the data in JSON format.
 */
function myFunction() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2012");

    if (sheet !== null) {
        var rowCount = sheet.getMaxRows();
        var retVal = "[";

        for(var x = 2; x <= rowCount; x += 1) {
            var movieTitle = sheet.getRange(x, 1).getValue();
            var viewingDate = sheet.getRange(x, 2).getValue();
            var movieURL = sheet.getRange(x, 3).getValue();
            var viewFormat = sheet.getRange(x, 4).getValue();
            var viewLocation = sheet.getRange(x, 5).getValue();
            var firstViewing = sheet.getRange(x, 6).getValue();
            var movieGenre = sheet.getRange(x, 7).getValue();
            var movieReview = sheet.getRange(x, 8).getValue();

            retVal += "{";

            retVal += "\"movieTitle\": \"";
            retVal += encodeURIComponent(movieTitle) + "\",";

            retVal += "\"viewingDate\": \"";
            retVal += encodeURIComponent(viewingDate) + "\",";

            retVal += "\"movieURL\": \"";
            retVal += encodeURIComponent(movieURL) + "\",";

            retVal += "\"viewFormat\": \"";
            retVal += encodeURIComponent(viewFormat) + "\",";

            retVal += "\"viewLocation\": \"";
            retVal += encodeURIComponent(viewLocation) + "\",";

            retVal += "\"firstViewing\": \"";
            retVal += encodeURIComponent(firstViewing) + "\",";

            retVal += "\"movieGenre\": \"";
            retVal += encodeURIComponent(movieGenre) + "\",";

            retVal += "\"movieReview\": \"";
            retVal += encodeURIComponent(movieReview) + "\"";

            retVal += "}";

            if(x !== rowCount) {
                retVal += ",";
            }
        } 

        retVal += "]";

        MailApp.sendEmail("example@example.com", "Movie List", retVal);
    }
}
