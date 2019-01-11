
var ventana = $(window);
var documento = $(document);

contadorLibros = 0;
pagina = 0;
idLibro = 0;
peticionEnCurso = false;
$("#load").hide();

class Libro {
    constructor(titulo, autor, categoria, descripcion, imagen, id) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.autor = autor;
        this.categoria = categoria;
        this.imagen = imagen;
        this.id = id
    }

}

class contenedorLibros {
    constructor() {
        this.libros = new Array();
    }

    añadir(Libro) {
        this.libros.push(Libro);
    }
}

contenedor = new contenedorLibros();

function buscarLibro() {
    var busqueda = document.getElementById("buscar").value;
    
    if (busqueda != "") {
        $("#load").show();
        $.ajax({
            url: "https://www.googleapis.com/books/v1/volumes?q=intitle:" + busqueda + "&maxResults=8&startIndex=" + pagina,
            dataType: "json",

            success: function (data) {
                
                console.log(data);
                for (i = 0; i < data.items.length; i++) {
                    try {
                        imgLibro = data.items[i].volumeInfo.imageLinks.thumbnail;
                        autLibro = data.items[i].volumeInfo.authors;
                        desLibro = data.items[i].volumeInfo.description;
                        titLibro = data.items[i].volumeInfo.title;
                        catLibro = data.items[i].volumeInfo.categories;
                    }
                    catch (err) {
                        autLibro= "Desconocido";
                        desLibro="Desconocida";
                        titLibro="Desconocido";
                        
                        imgLibro = "error.png";
                    }


                    autLibro = data.items[i].volumeInfo.authors;
                    desLibro = data.items[i].volumeInfo.description;
                    titLibro = data.items[i].volumeInfo.title;
                    catLibro = data.items[i].volumeInfo.categories;
                    idLibro = data.items[i].id;
                    actual = new Libro(titLibro, autLibro, catLibro, desLibro, imgLibro, idLibro);
                    contenedor.añadir(actual);
                    vistaActual = vistaLibro(actual);
                    document.getElementById("resultado").appendChild(vistaActual);


                }
                peticionEnCurso=false;
                $("#load").hide();

            },

            type: 'GET'
        });
    }
    
}

function buscarLibroPrimeraVez() {
    contenedor.libros = [];
    $(".Libro").remove();
    pagina = 0;
    buscarLibro();
}


$(window).scroll(function () {

    // How much the user has scrolled
    const scrollTop = $(window).scrollTop();
    // windowHeigth is the height of the window
    const windowHeight = $(window).height();
    // documentHeight could be larger than windowHeight
    const documentHeight = $(document).height();
    const offset = 100;
    // add windowHeight is neccessary to get to the bottom
    console.log("Fuera")

    if (scrollTop == documentHeight - windowHeight) {
        if (!peticionEnCurso) {
            if ($(".LibroVista").length ==0) {
                peticionEnCurso = true;
                pagina += 8;
                console.log("Dentro");
                buscarLibro();
                }
        }
    }
});


function vistaLibro(Libro) {
    divRaiz = document.createElement("div");

    divImagen = document.createElement("div");

    fotoDiv = document.createElement("img");
    fotoDiv.setAttribute("id", Libro.id);

    fotoDiv.onclick = (function (event) {

        idElegido = event.target.id;
        imgLibro = event.target.src;
        $.ajax({
            url: "https://www.googleapis.com/books/v1/volumes?q=id:" + idElegido,
            dataType: "json",

            success: function (data) {
                autLibro = data.items[0].volumeInfo.authors;
                desLibro = data.items[0].volumeInfo.description;
                titLibro = data.items[0].volumeInfo.title;
                catLibro = data.items[0].volumeInfo.categories;
                $("#resultado").hide();
                // $("header").hide();
                $("#resultado2").append(vistaLibroFinal(titLibro, autLibro, desLibro, catLibro, imgLibro));
                longitud = $(".LibroVista").length;
                if ($(".LibroVista").length > 0) {
                    $("body").click(function (event) {
                        $(".LibroVista").remove();
                        $("#resultado").show();
                        // $("header").show();
                        $("body").off("click", "body");
                        
                    });
                }
                

            },

            type: 'GET'
        });


    });
    fotoDiv.setAttribute("src", "" + Libro.imagen);

    divRaiz.setAttribute("class", "Libro");
    divImagen.setAttribute("class", "Portada")


    divImagen.appendChild(fotoDiv);

    divRaiz.appendChild(divImagen);


    return divRaiz;
}


function vistaLibroFinal(titulo, autor, descripcion, categoria, imagen) {
    divRaiz = document.createElement("div");
    divTexto = document.createElement("div");
    divImagen = document.createElement("div");
    fotoDiv = document.createElement("img");
    divCerrar = document.createElement("div");


    span1 = document.createElement("h6");
    contenido1 = document.createTextNode("Título: ");
    span1.appendChild(contenido1);
    contenido2 = document.createElement("p");
    contenido2.innerText = "" + titulo;
    span1.appendChild(contenido2);

    span2 = document.createElement("h6");
    contenido3 = document.createTextNode("Autor: ");
    span2.appendChild(contenido3);
    contenido4 = document.createElement("p");
    contenido4.innerText = "" + autor;
    span2.appendChild(contenido4);

    span3 = document.createElement("h6");
    contenido5 = document.createTextNode("Descripción: ");
    span3.appendChild(contenido5);
    contenido6 = document.createElement("p");
    contenido6.innerText = "" + descripcion;
    span3.appendChild(contenido6);

    span4 = document.createElement("h6");
    contenido7 = document.createTextNode("Categoría: ");
    span4.appendChild(contenido7);
    contenido8 = document.createElement("p");
    contenido8.innerText = "" + categoria;
    span4.appendChild(contenido8);

    divTexto.appendChild(span1);
    divTexto.appendChild(span2);
    divTexto.appendChild(span3);
    divTexto.appendChild(span4);

    fotoDiv.setAttribute("src", "" + imagen);
    divRaiz.setAttribute("class", "LibroVista");
    divTexto.setAttribute("id", "textoVista");
    divImagen.setAttribute("id", "imgVista");


    divImagen.appendChild(fotoDiv);

    divRaiz.appendChild(divImagen);
    divRaiz.appendChild(divTexto);
    divRaiz.appendChild(divCerrar);

    return divRaiz;
}


$("#buscar").keyup(function (event) {
    if (event.keyCode === 13) {
        buscarLibroPrimeraVez();
    }
});

