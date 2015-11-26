var XFileTab;

(function() {

    var XFileTabProto = Object.create( HTMLElement.prototype );

    XFileTabProto.createdCallback = function() {
        var parent = this;
        var header = o$("<header>");
        header.addClass("tabs");

        var nuevaTab = o$("<div>");
        nuevaTab.addClass("tabN");

        var nuevaTabContent = o$("<div>");
        nuevaTabContent.addClass("tab-boxN");
        nuevaTabContent.innerHTML = "+";

        nuevaTab.appendChild( nuevaTabContent );

        header.appendChild( nuevaTab );

        this.input = o$("<input>");
        this.input.type = "file";

        //var fileName = "";

        this.input.addEvent("change", function(e) {
            var archivo = e.target.files[0];
            var reader = new FileReader();
            var fileName = archivo.name;
            reader.readAsText(archivo);
            reader.addEventListener("load", function(d) {
                addTab( fileName, d.target.result );
            });
        });

        nuevaTab.addEvent("click", function() {

        });

        var content = o$("<section>");
        content.addClass("content");

        parent.appendChild(header);

        parent.appendChild(content);

        var addTab = function( name, textContent ) {
            var tab = o$("<div>");
            tab.addClass("tab");

            var tabBox = o$("<div>");
            tabBox.addClass("tab-box");
            tabBox.innerHTML = "<span class='close'>x</span>";

            tab.appendChild( tabBox );
            tabBox.innerHTML = name + " " + tabBox.innerHTML;

            header.insertBefore(tab, nuevaTab);

            events( tab, textContent );
        };

        var events = function( element, textContent ) {
            var num = header.o$("tab");

            if( num !== undefined )
                num = num.length + 1;
            else
                num = 1;

            // Hacemos activo y mostramos el contenido que acabamos de crear
            element.addClass("tab" + num);
            console.log(element.siblings())
            element.siblings().removeClass("active");

            element.siblings().o$(".tab-box").css("background-color", "#fff");
            element.addClass("active");
            element.o$(".tab-box").css("background-color", "#eee");
            var contentF = element.parentNode.parentNode.o$("section.content");
            var articleF = o$("<article>");

            contentF.appendChild( articleF );

            var hermanosF = articleF.siblings();
            articleF.addClass(element.className.split(" ")[1]);
            hermanosF.css("display", "none");
            articleF.css("display", "block");

            articleF.innerHTML = textContent;

            // Asignamos el evento click para que a lo que se haga click
            // en alguno de los tab, se muestre en contenido
            element.addEvent("click", function() {
                // Quitamos la clase activa de los hermanos
                this.siblings().removeClass("active");
                this.siblings().o$(".tab-box").css("background-color", "#fff");

                // y se la asginamos a la tab que clickeamos
                this.addClass("active");
                this.o$(".tab-box").css("background-color", "#eee");

                // Buscamos el body que sera donde montraremos el contenido del tab
                var content = this.parentNode.parentNode.o$("section.content");

                // Buscamos el div correspondiente al tab que clickeamos
                var article = content.o$("article." + this.className.split(" ")[1]);
                console.log(content);
                // y buscamos los hermanos de ese div
                var hermanos = article.siblings();

                // Ocultamos los hermanos
                hermanos.css("display", "none");

                // Y mostramos el del tab que clickeamos
                article.css("display", "block");
            });

            element.addEvent("mouseover", function() {
                if( !this.haveClass( "active" ) )
                    this.o$(".tab-box").css("background-color", "#FAFAFA");
            });

            element.addEvent("mouseout", function() {
                if( !this.haveClass( "active" ) )
                    this.o$(".tab-box").css("background-color", "#fff");
            });
        };
    };

    XFileTab = document.registerElement("x-filetab", {
        prototype: XFileTabProto
    });

})();

