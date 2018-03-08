/* Javascript Customizado do Medline
Aqui somente o Javascript criado e editado exclusivamente para o Medline, indepedente do Bootstrap
*/

$(document).ready(function(){
    $(".push_menu").click(function(){
         $(".wrapper").toggleClass("active");
    });
});

$(document).ready(function(){
    $('.avatar-user').click(function(){
        $('#cadastro-de').text('Paciente');
        $('#modal-avatar').attr('src', '../images/default_user_avatar.jpg');
    });

    $('.avatar-medico').click(function(){
        $('#cadastro-de').text('Médico');
        $('#modal-avatar').attr('src', '../images/doctor_avatar.png');
    });

    $('.avatar-clinica').click(function(){
        $('#cadastro-de').text('Clínica');
        $('#modal-avatar').attr('src', '../images/hospital_avatar.png');
    });
})

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});
