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

    var o$ = function(selector) {
        var self = this === window ? document : this;

        var elemento;

        if( (selector[0] === "<") && (selector[selector.length - 1] === ">") ) {
            var tag = selector.replace("<", "").replace(">", "");
            var split = tag.split(" ");
            var len = split.length;
            elemento = split[0];
            var attrs = [];
            for( var i = 1; i < len; i++ ) {
                var attr = split.pop();
                if( attr !== elemento )
                    attrs.push( attr );
            }

            elemento = document.createElement(elemento);

            len = attrs.length;

            for( i = 0; i < len; i ++ ) {
                var atr = attrs[i].split("=");
                elemento.attr( atr[0], atr[1].split(/["|']/)[1] );
            }

            if( self !== document )
                this.appendChild(elemento);
        }
        else {
            elemento = self.querySelectorAll( selector );
            elemento = elemento.length > 1 ? elemento: elemento[0];
        }

        return elemento;
    };

    HTMLElement.prototype.o$ = o$;

    NodeList.prototype.o$ = function( selector ) {
        var list = this;
        var aLen = list.length;
        var result = document.createElement("div");
        for( var i = 0; i < aLen; i++ ) {
            var element = list[i].o$(selector);
            if( element ) {
                element.addClass("oQueryTempClass");
                result.appendChild( element )
            }
        }
        result = result.querySelectorAll(".oQueryTempClass");
        result.removeClass("oQueryTempClass");
        return result;
    };

    HTMLElement.prototype.remove = function() {
        var parent = this.parentNode;
        parent.removeChild(this);
    };

    NodeList.prototype.remove = function() {
        var list = this;
        var aLen = list.length;
        for( var i = 0; i < aLen; i++ )
            list[i].remove();
    };

    HTMLElement.prototype.attr = function( attribute, value ) {
        if( typeof attribute == "object" ) {
            for( var key in attribute ) {
                this.setAttribute(key, attribute[key]);
            }
        }
        else {
            this.setAttribute(attribute, value);
        }
    };

    NodeList.prototype.attr = function( attribute, value ) {
        var list = this;
        var aLen = list.length;
        for( var i = 0; i < aLen; i++ )
            list[i].attribute( attribute, value );
    };

    HTMLElement.prototype.css = function( style, value ) {
        if( typeof style == "object" ) {
            for( var key in style ) {
                this.style[key] = style[key];
            }
        }
        else {
            this.style[style] = value;
        }
    };

    NodeList.prototype.css = function( style, value ) {
        var list = this;
        var aLen = list.length;
        for( var i = 0; i < aLen; i++ )
            list[i].css( style, value );
    };

    HTMLElement.prototype.addClass = function( newClass ) {
        this.classList.add(newClass);
    };

    NodeList.prototype.addClass = function( newClass ) {
        var len = this.length;
        for( var i = 0; i < len; i++ )
            this[i].addClass(newClass);
    };

    HTMLElement.prototype.removeClass = function( classToRemove ) {
        this.classList.remove( classToRemove );
    };

    NodeList.prototype.removeClass = function( classToRemove ) {
        var len = this.length;
        for( var i = 0; i < len; i++ )
            this[i].removeClass( classToRemove );
    };

    HTMLElement.prototype.removeAllClass = function() {
        this.className = "";
    };

    NodeList.prototype.removeAllClass = function() {
        var len = this.length;
        for( var i = 0; i < len; i++ )
            this[i].removeAllClass();
    };

    HTMLElement.prototype.haveClass = function( haveit ) {
        return this.classList.contains( haveit );
    };

    NodeList.prototype.haveClass = function( haveit ) {
        var len = this.length;
        var result = [];
        for( var i = 0; i < len; i++ )
            result.push( this[i].haveClass( haveit ) );
        return result;
    };

})();
