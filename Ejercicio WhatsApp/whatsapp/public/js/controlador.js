$("#slc-usuario").change(function() {
    //alert("USUARIO seleccionado: " + $("#slc-usuario").val());
    $('#img-usuario').attr("src");
});

function seleccionarContacto(codigoContacto, nombreContacto, imagen) {
    //alert("CONTACTO seleccionado: " + codigoContacto + ", Nombre: " + nombreContacto);
    //modifico para q se actualice el nombreContacto
    $("#nombre-contacto").html(nombreContacto);
    $("#img-contacto").attr("src", imagen);
    $("#txt-receptor").val(codigoContacto);
    cargaMensaje();
}

//crear funcion para cargar mensajes
function cargaMensaje() {
    let codigoReceptor = $("#txt-receptor").val();
    let codigoEmisor = $("#slc-usuario").val();
    //creo un json
    let parametros = {
        codigoReceptor,
        codigoEmisor
    };
    ////utilizo ajax para realizar peticiones asincronas
    $.ajax({
        url: "/mensajes",
        dataType: "json",
        data: parametros,
        method: "POST",
        success: function(respuestas) {
            console.log(respuestas);
            var cssClass = "";
            $("#conversation").html("");

            for (let respuesta of respuestas) {
                if (codigoEmisor == respuesta.codigo) {
                    cssClass = "sender";
                } else {
                    cssClass = "receiver";
                }

                $("#conversation").append(
                    `
                    <div class="row message-body">
                    <div class="col-sm-12 message-main-${cssClass}">
                        <div class="${cssClass}">
                            <div class="message-text">
                                ${respuesta.mensaje}
                            </div>
                            <span class="message-time pull-right">
                 ${respuesta.hora}
            </span>
                        </div>
                    </div>
                </div>`


                );
            }
        }

    });

}

//Este es el boton que envia los mensajes
$("#btn-enviar").click(function() {
    //alert("Enviar mensaje: " + $("#txta-mensaje").val());
    let codigoReceptor = $("#txt-receptor").val();
    let codigoEmisor = $("#slc-usuario").val();
    let mensaje = $("#txta-mensaje").val();
    let parametros = {
        codigoEmisor,
        codigoReceptor,
        mensaje
    };
    //utilizo ajax para realizar peticiones asincronas
    $.ajax({
        url: "/enviarMensaje",
        dataType: "json",
        data: parametros,
        method: "POST",
        success: function(respuestas) {
            console.log(respuestas);
            if (respuestas.affectedRows == 1) {
                $("#txta-mensaje").val("");
                cargaMensaje();
            }
        }
    });

});

//boton eliminar
$("#btn-eliminar").click(function() {
    var codigoReceptor = $("#txt-receptor").val();
    var codigoEmisor = $("#slc-usuario").val();
    var parametros = {
        codigoEmisor,
        codigoReceptor
    }
    $.ajax({
        url: "/eliminarConversacion",
        method: "POST",
        data: parametros,
        dataType: "json",
        success: function(respuesta) {
            if (respuesta.affectedRows > 0) {
                $("#conversation").html("");
            }
        }

    });

});

//carga la informacion Select(Combobox) y los contactos (Divs)
$(document).ready(function() {
    $.ajax({
        url: "/usuarios", // a que  direccion hago la llamada
        dataType: "json", // como sera el tipo de dato q recibira
        success: (respuestas) => {
            //console.log(respuestas);
            for (let respuesta of respuestas) {
                $("#slc-usuario").append(
                    `<option value= "${respuesta.codigo_usuario}"> ${respuesta.nombre_usuario}</option>`
                );

                $("#div-contactos").append(
                    `<div class="row sideBar-body" onclick="seleccionarContacto(${respuesta.codigo_usuario},'${respuesta.nombre_usuario}','${respuesta.url_imagen_perfil}');">
              		<div class="col-sm-3 col-xs-3 sideBar-avatar">
                	    <div class="avatar-icon">
                  		    <img src="${respuesta.url_imagen_perfil}">
                	    </div>
              		</div>
             	    <div class="col-sm-9 col-xs-9 sideBar-main">
                		<div class="row">
                  		<div class="col-sm-8 col-xs-8 sideBar-name">
                    	<span class="name-meta">${respuesta.nombre_usuario}</span>
                    </div>
                    <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
                    	<span class="time-meta pull-right">18:18</span>
                    </div>
                </div>
              </div>
            </div>`
                );
            }
        }
    });
});