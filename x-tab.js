var XFileTab;

(function() {

    var XFileTabProto = Object.create( HTMLElement.prototype );

    XFileTabProto.createdCallback = function() {
        var self = this;
        var ul = o$("<ul>");
        var section = o$("<section>");

        this.appendChild( ul );
        this.appendChild( section );

        var newTab = o$("<li class='newTab'>");
        var tabContNew = o$("<div class='tab-cont-new'>");
        var input = o$("<input type='file'>");

        tabContNew.textContent = "+";
        tabContNew.appendChild( input );
        newTab.appendChild( tabContNew );

        ul.appendChild( newTab );

        input.onchange = function(e) {
            var archivo = e.target.files[0];
            if( archivo ) {
                var reader = new FileReader();
                var fileName = archivo.name;
                reader.readAsText(archivo);
                reader.addEventListener("load", function(d) {
                    addTab( fileName, d.target.result );
                });
            }
        };

        var addTab = function( name, textContent ) {
            var number = ul.o$(".tab");
            if( !number )
                number = 1;
            else
                if( !number.length )
                    number = 2;
                else
                    number = number.length + 1;

            var tab = o$("<li class='tab'>");
            tab.addClass("tab" + number);
            tab.addClass("active");

            var otherTabs = ul.o$("li.active");
            if( otherTabs )
                otherTabs.removeClass("active");

            var tabCont = o$("<div class='tab-cont'>");
            tabCont.innerHTML = name + " ";

            var close = o$("<span class='close'>");
            close.textContent = "x";
            tabCont.appendChild( close );
            tab.appendChild( tabCont );

            ul.insertBefore(tab, newTab);

            var content = o$("<div class='content'>");
            content.addClass( "tab" + number );
            content.textContent = textContent;

            var otherContents = section.o$(".content");
            if( otherContents )
                otherContents.css("display", "none");

            section.appendChild( content );

            tab.addEventListener("click", function() {
                var tab = this.classList[1];
                var activeTab = ul.o$(".tab.active");
                activeTab.removeClass("active");

                this.addClass("active");

                var otherContents = section.o$(".content:not(." + tab +")");
                if( otherContents )
                    otherContents.css("display", "none");

                var content = section.o$("." + tab);
                if( content )
                    content.css("display", "block");

                var close = this.o$("div.tab-cont > span.close");
                close.tabNumber = tab;

                close.addEventListener("click", function() {
                    var tab = this.tabNumber;
                    var toRemove = self.o$("." + tab);

                    toRemove.remove();

                    var toStayTab = self.o$(".tab");
                    var toStayContent = self.o$(".content");

                    if( toStayTab && toStayContent ) {
                        toStayTab.removeAllClass();
                        toStayContent.removeAllClass();

                        var len = toStayTab.length;
                        if( !len ) {
                            len = 1;
                            toStayTab[0] = toStayTab;
                            toStayContent[0] = toStayContent;
                        }

                        for( var i = 0; i < len; i++ ) {
                            toStayTab[i].addClass("tab");
                            toStayTab[i].addClass("tab" + (i + 1));
                            toStayContent[i].addClass("content");
                            toStayContent[i].addClass("tab" + (i + 1));
                        }
                        toStayTab[i-1].addClass("active");
                        toStayContent[i-1].css("display", "block");

                    }
                })
            }, true);

        };

    };

    XFileTab = document.registerElement("x-tab", {
        prototype: XFileTabProto
    });

})();
