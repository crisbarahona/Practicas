$(function() {
    //BOTON GET Products
    $('#getProducts').on('click', function() {
        //peticion al servidor
        $.ajax({
            url: '/products', //se hace peticion al servidor --devuelve arreglo
            success: function(products) { //obtenemos el arreglo
                //console.log(products);
                let tbody = $('tbody'); // llenado de la tabla
                tbody.html(''); //limpiar tabla
                products.forEach(product => {
                    tbody.append(`
                        <tr>
                            <td class="id">${product.id}</td>
                            <td> 
                                <input type= "text" class="name" value="${product.name}"/>
                            </td>
                            <td>
                                <button class="update-button">Update</button>
                                <button class="delete-button">Delete</button>
                            </td>
                        </tr>
                    `)
                })
            }
        })
    });

    // Boton de <Create Product>
    $('#productForm').on('submit', function(e) {
        e.preventDefault(); //elimina refrescar pagina
        let newProduct = $('#newProduct')
            //peticion al servidor
        $.ajax({
            url: '/products',
            method: 'POST',
            data: {
                name: newProduct.val()
            },
            success: function(response) {
                // console.log(response);
                $('#getProducts').click();
            }
        })
    })

    //<Boton de de ACTUALIZAR>

    $('table').on('click', '.update-button', function() {
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        let name = row.find('.name').val();
        //peticion al servidor
        $.ajax({
            url: "/products/" + id,
            method: 'PUT',
            data: {
                name: name
            },
            success: function(response) {
                // console.log(response);
                //actualiza ya el producto
                $('getProducts').click();
            }
        })
    })

    //boton ELIMINAR
    $('table').on('click', '.delete-button', function() {
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        //peticion al servidor
        $.ajax({
            url: '/products/' + id,
            method: 'DELETE',
            success: function(response) {
                console.log(response);
                $('#getProducts').click();
            }
        })
    })
});