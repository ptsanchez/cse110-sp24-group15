window.onload = function() {
    window.editor = CodeMirror.fromTextArea(document.getElementById("log-code-snippet"), {
      lineNumbers: true,
      mode: "javascript",
      theme: "dracula",
      tabSize: 2,
      lineWrapping: true
    });
}