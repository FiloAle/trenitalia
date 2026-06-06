function isIE() {
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    return isIE || isEdge;// || isEdge;
}





function apriFermateSuccessive(trenoid) {
    //var popUpId = $(elem).html().trim();

    /*var prova = document.getElementById("FermateSuccessivePopup");
    if (prova != null)
    {
        
         
        document.getElementById("FermateSuccessivePopup").style.display = "block";
        alert("Belin che cavolo");
    }
    else
    {
        alert("E se non c'è non c'è!");
    }
    */

    //var popup = document.getElementById("FermateSuccessive_" + trenoid);
    //var popup = document.getElementById("Provadelleprove" );
    //// var popup = $("#FermateSuccessive_" + trenoid);
    //if (popup == null)
    //{
    //    alert("AHIA");    
    //}
    //popup.style.dispaly = "block";


    var popup = $("#FermateSuccessive_" + trenoid);
    popup.on('mousedown', function (e) {
        var dr = $(this).addClass("drag").css("cursor", "move");
        height = dr.outerHeight();
        width = dr.outerWidth();
        ypos = dr.offset().top + height - e.pageY,
        xpos = dr.offset().left + width - e.pageX;
        $(document.body).on('mousemove', function (e) {
            var itop = e.pageY + ypos - height;
            var ileft = e.pageX + xpos - width;
            if (dr.hasClass("drag")) {
                dr.offset({ top: itop, left: ileft });
            }
        }).on('mouseup', function (e) {
            dr.removeClass("drag");
        });
    });
     
    
    var popup = $("#FermateSuccessive_" + trenoid);
    popup.on('touchstart', function (e) {
        var dr = $(this).addClass("drag").css("cursor", "move");
        height = dr.outerHeight();
        width = dr.outerWidth();
        ypos = dr.offset().top + height - e.pageY,
        xpos = dr.offset().left + width - e.pageX;
        $(document.body).on('touchmove', function (e) {
            var itop = e.pageY + ypos - height;
            var ileft = e.pageX + xpos - width;
            if (dr.hasClass("drag")) {
                dr.offset({ top: itop, left: ileft });
            }
        }).on('touchleave', function (e) {
            dr.removeClass("drag");
        });
    });
     

    //  var popup = $("#Provadelleprove" );
    var pos = $('#btn_'+ trenoid).offset();
    var top = pos.top - 300;
    popup.css({
        position: 'absolute',
        top: top
         
    });
    popup.show();
    //// DEVO ASSOCIARE GLI ELEMENTI VARIIII
    //popup.dialog("open");
}

function chiudiInfo(trenoid)
{
    var popup = $("#FermateSuccessive_" + trenoid);
    popup.hide();
}


//lento ma IE non supporta le CSS var()
function animateTextLoopIE(div) {
    var conteiners = $(div);
    for (var i = 0; i < conteiners.length; i++) {
        var content = $(conteiners[i]).html();
        $(conteiners[i]).html("<marquee>" + content + "</marquee>");
    }
    $(div).addClass("move");
    $(div).removeClass("m");
}

function animateGroup(cssClass, cssVar) {
    var parentWidth = $($(cssClass)[0]).outerWidth();
    var maxWidth = 0;
    var elements = $(cssClass + " div");
    $.each(elements, function (i, v) {
        var width = $(v).outerWidth();
        if (width > maxWidth)
            maxWidth = width;

        if (width > parentWidth)
            $(v).addClass("m");
    });

    document.documentElement.style.setProperty(cssVar, (maxWidth * -1) + "px");
    if (maxWidth > parentWidth) {
        if (window.isInternetExplorer) {
            animateTextLoopIE(cssClass + " .m");
        }
        else {
            var dim = (maxWidth * -1) + "px";
            var conteiners = $(cssClass + " .m");
            for (var i = 0; i < conteiners.length; i++) {
                conteiners[i].style.setProperty(cssVar, dim);
            }
            $(cssClass + " .m").addClass("move");
            $(cssClass + " .move").removeClass("m");
        }
    }
}

function stopCssAmination(cssClass, cssVar) {
    $(cssClass + " div").removeClass("move");
    document.documentElement.style.setProperty(cssVar, "0px");
}


function stopFooterAmination() {
    $(".footer div").removeClass("move");
    document.documentElement.style.setProperty('--footerWidth', "0px");
}

function animateFooter() {
    var parentWidth = $($(".footer")[0]).outerWidth();
    var width = $(".footer div").outerWidth();

    if (width > parentWidth) {
        $(".footer div").addClass("move");
        document.documentElement.style.setProperty('--footerWidth', (width * -1) + "px");
    }
}

function checkLenght(s) {
    while (s.length < 2)
        s = "0" + s;

    return s;
}

function getTime(date) {
    if (date === null || typeof date === "undefined")
        return "";

    try {

        var time = date.split("T")[1].split("Z")[0].split(":");
        var h = checkLenght("" + time[0]);
        var m = checkLenght("" + time[1]);
        var s = checkLenght("" + time[2]);

        return h + ":" + m + ":" + s;
    }
    catch (e) {
        console.error("Error splitting date: [" + date + "] " + e);
    }

    return "";
}

function getSDate(date) {
    var time = getTime(date);

    var jDate = new Date(date);
    var d = checkLenght("" + jDate.getDate());
    var m = checkLenght("" + (jDate.getMonth() + 1));
    var y = checkLenght("" + jDate.getFullYear());

    return d + "/" + m + "/" + y + " " + time;
}
