/**
 * Created by amoghesturi on 11/5/16.
 */

// opens a chat popup window
(function() {
    // Load the style sheet
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'http://localhost:3000/stylesheets/style.css';
    document.getElementsByTagName("body")[0].appendChild(link);

    var popup = document.createElement("iframe");
    popup.id = 'chat-iframe';
    popup.className = 'chat-popup';
    popup.src = "http://localhost:3000/index.html";
    document.getElementsByTagName("body")[0].appendChild(popup);
})();