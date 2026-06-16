function isIE() {
    // Internet Explorer 6-11
    let isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    let isEdge = !isIE && !!window.StyleMedia;

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
        let dr = $(this).addClass("drag").css("cursor", "move");
        height = dr.outerHeight();
        width = dr.outerWidth();
        ypos = dr.offset().top + height - e.pageY,
        xpos = dr.offset().left + width - e.pageX;
        $(document.body).on('mousemove', function (e) {
            let itop = e.pageY + ypos - height;
            let ileft = e.pageX + xpos - width;
            if (dr.hasClass("drag")) {
                dr.offset({ top: itop, left: ileft });
            }
        }).on('mouseup', function (e) {
            dr.removeClass("drag");
        });
    });
     
    
    var popup = $("#FermateSuccessive_" + trenoid);
    popup.on('touchstart', function (e) {
        let dr = $(this).addClass("drag").css("cursor", "move");
        height = dr.outerHeight();
        width = dr.outerWidth();
        ypos = dr.offset().top + height - e.pageY,
        xpos = dr.offset().left + width - e.pageX;
        $(document.body).on('touchmove', function (e) {
            let itop = e.pageY + ypos - height;
            let ileft = e.pageX + xpos - width;
            if (dr.hasClass("drag")) {
                dr.offset({ top: itop, left: ileft });
            }
        }).on('touchleave', function (e) {
            dr.removeClass("drag");
        });
    });
     

    //  var popup = $("#Provadelleprove" );
    let pos = $('#btn_'+ trenoid).offset();
    let top = pos.top - 300;
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
    let popup = $("#FermateSuccessive_" + trenoid);
    popup.hide();
}


//lento ma IE non supporta le CSS var()
function animateTextLoopIE(div) {
    let conteiners = $(div);
    for (let i = 0; i < conteiners.length; i++) {
        let content = $(conteiners[i]).html();
        $(conteiners[i]).html("<marquee>" + content + "</marquee>");
    }
    $(div).addClass("move");
    $(div).removeClass("m");
}

function animateGroup(cssClass, cssVar) {
    let parentWidth = $($(cssClass)[0]).outerWidth();
    let maxWidth = 0;
    let elements = $(cssClass + " div");
    $.each(elements, function (i, v) {
        let width = $(v).outerWidth();
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
            let dim = (maxWidth * -1) + "px";
            let conteiners = $(cssClass + " .m");
            for (let i = 0; i < conteiners.length; i++) {
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
    let parentWidth = $($(".footer")[0]).outerWidth();
    let width = $(".footer div").outerWidth();

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

        let time = date.split("T")[1].split("Z")[0].split(":");
        let h = checkLenght("" + time[0]);
        let m = checkLenght("" + time[1]);
        let s = checkLenght("" + time[2]);

        return h + ":" + m + ":" + s;
    }
    catch (e) {
        console.error("Error splitting date: [" + date + "] " + e);
    }

    return "";
}

function getSDate(date) {
    let time = getTime(date);

    let jDate = new Date(date);
    let d = checkLenght("" + jDate.getDate());
    let m = checkLenght("" + (jDate.getMonth() + 1));
    let y = checkLenght("" + jDate.getFullYear());

    return d + "/" + m + "/" + y + " " + time;
}
