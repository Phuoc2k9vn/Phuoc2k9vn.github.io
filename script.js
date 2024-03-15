function register() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var ip = document.getElementById('ip').value;

    var accountInfo = username + "/" + password + "/" + ip + "\n";

    var file = new File([""], "reg.txt");
    var fileReader = new FileReader();

    fileReader.onloadend = function () {
        var content = fileReader.result;
        content += accountInfo;
        var blob = new Blob([content], { type: 'text/plain' });

        var url = window.URL.createObjectURL(blob);

        var link = document.createElement('a');
        link.href = url;
        link.download = "reg.txt";
        link.click();
    };

    fileReader.readAsText(file);

    return false;
}

function login() {
    var loginUsername = document.getElementById('loginUsername').value;
    var loginPassword = document.getElementById('loginPassword').value;

    var fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.onchange = function (e) {
        var file = e.target.files[0];
        var fileReader = new FileReader();

        fileReader.onloadend = function () {
            var content = fileReader.result;
            var accounts = content.split('\n');

            for (var i = 0; i < accounts.length; i++) {
                var accountInfo = accounts[i].split('/');
                var username = accountInfo[0];
                var password = accountInfo[1];

                if (username === loginUsername && password === loginPassword) {
                    window.location.href = 'NavidH/index.html';
                    return;
                }
            }

            alert('Invalid username or password.');
        };

        fileReader.readAsText(file);
    };

    fileInput.click();

    return false;
}