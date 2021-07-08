document.getElementById("Login").onclick = function () {
    $('#demo-modal').modal();
};
 
document.getElementById("Continue").onclick = function () {
    if(document.getElementById("nameInput").value.length==0){
        alert("Please enter your name");
    }
    else location.href = '/home';
};