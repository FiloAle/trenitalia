function activateMarquee(  classe) {
    var ie =  isIE();
    $(classe).each(function (b, e) {


        // Lunghezza
         
        var eouter = $(e).outerWidth(true);
        var ewidth = $(e).width();
        var d = $(e).find("div");
        var douter = $(d).outerWidth(true);
        var dwidth = $(d).width();
       
        if (douter > ewidth) {
         

            if (ie) {
               
                 
                $(d).each(function (b, e) {
                    var content = $(e).html();
                    console.log("content " +content.trim());
                   
                    $(e).html("<marquee>" + content.trim() + "</marquee>");
                })
            } else {
                $(this).css("--widthTransform", "-100%");
                /* Ora devo calcorare il tempo...*/

                var nsec = Math.round(douter * 0.05);

                $(this).css("--marqueeTime", nsec + "s");

            }
        } else
        {
            $(e).removeClass("marquee");
        }


    }

        );
     
}
 


function setFinalSize(infosupplementare) {
    //var hbarraInfoStazioni = $("#barraInfoStazioneId").height(); 

    //var hWindow = $(window).height(); // window sembra più accurato; sembra sia in pt (o unità) e non pixel...sembra.
    // Cerca tutte le altezze dei vari pezzi della pagina
   // var hlastUpdate = $("#lastUpdateId").height();
   // var hnomeStazione = $("#nomeStazioneId").height();
    // var hbarraBottoni = $("#barrabottoniId").height();
    var hbarraInfostazioneConBiancoIn;
    if ((infosupplementare == null) || (infosupplementare == ""))
    {
        hbarraInfostazioneConBiancoIn = 0;
    }
    else
    {
        hbarraInfostazioneConBiancoIn = $("#barraInformazioneId").innerHeight();
    }
    

    var hWindowOut = $(window).outerHeight(); // window sembra più accurato; sembra sia in pt (o unità) e non pixel...sembra.
    // Cerca tutte le altezze dei vari pezzi della pagina
    //var hlastUpdateOut = $("#lastUpdateId").outerHeight();
    //var hnomeStazioneOut = $("#nomeStazioneId").outerHeight();
    //var hbarraBottoniOut = $("#barrabottoniId").outerHeight();
    //var hbarraInfostazioneConBiancoOut = $("#barraInformazioneId").outerHeight();

    //var hWindowIn = $(window).innerHeight(); // window sembra più accurato; sembra sia in pt (o unità) e non pixel...sembra.
    //// Cerca tutte le altezze dei vari pezzi della pagina
    //var hlastUpdateIn = $("#lastUpdateId").innerHeight();
    //var hnomeStazioneIn = $("#nomeStazioneId").innerHeight();
    //var hbarraBottoniIn = $("#barrabottoniId").innerHeight();
    //var hbarraInfostazioneConBiancoIn = $("#barraInformazioneId").innerHeight();

    var hmonitor = $("#monitor").height();
    var hheadertab = $("#headerTabId").height();
   // var hbodyTabId = $("#bodyTabId").height();
  //  var hrow = $("#bodyTabId").find("tr:first").height();

 //   var hmonitorOut = $("#monitor").outerHeight();
    //var hheadertabOut = $("#headerTabId").outerHeight();
    //var hbodyTabIdOut = $("#bodyTabId").outerHeight();
  //  var hrowOut = $("#bodyTabId").find("tr:first").outerHeight();

    //var hmonitorIn = $("#monitor").innerHeight();
    //var hheadertabIn = $("#headerTabId").innerHeight();
    //var hbodyTabIdIn = $("#bodyTabId").innerHeight();
  //  var hrowInn = $("#bodyTabId").find("tr:first").innerHeight();
    
    var posTab = $("#monitor").position().top;
    //alert("La finestra è alta " + hWindow + "\n Posizione " +
    //     posTab + "\n Last update " + hlastUpdate + "\n hnomeStazione " + hnomeStazione + " \n hbarraBottoni " + hbarraBottoni + " \n hbarraInfostazioneConBianco " + hbarraInfostazioneConBianco );
    //alert("Outer La finestra è alta " + hWindowOut + "\n Last hlastUpdateOut " + hlastUpdateOut + "\n hnomeStazioneOut " + hnomeStazioneOut + " \n hbarraBottoniOut " + hbarraBottoniOut + " \n hbarraInfostazioneConBiancoOut " + hbarraInfostazioneConBiancoOut);
    //alert("Inner La finestra è alta " + hWindowIn + "\n Last hlastUpdateIn " + hlastUpdateIn + "\n hnomeStazioneIn " + hnomeStazioneIn + " \n hbarraBottoniIn " + hbarraBottoniIn + " \n hbarraInfostazioneConBiancoIn " + hbarraInfostazioneConBiancoIn);
    //alert("hmonitor " + hmonitor + "\n hheadertab " + hheadertab + "\n hbodyTabId " + hbodyTabId + " \n hrow " + hrow + " \n hrowOut " + hrowOut + " \n hrowInn " + hrowInn);
    //alert("hmonitorOut " + hmonitorOut + "\n hheadertabOut" + hheadertabOut + "\n bodyTabIdOut " + hbodyTabIdOut + " \n hrow " + hrow + " \n hrowOut " + hrowOut + " \n hrowInn " + hrowInn);
    //alert("hmonitorIn " + hmonitorIn + "\n hheadertabIn" + hheadertabIn + "\n hbodyTabIdIn " + hbodyTabIdIn + " \n hrow " + hrow + " \n hrowOut " + hrowOut + " \n hrowInn " + hrowInn);
    ////a.height("1000px");

    // Prima prova...
    var altezzaRigha;
    if (navigator.userAgent.indexOf("Chrome") != -1)
    {
        altezzaRigha = $("#bodyTabId").find("tr:first").outerHeight();
    } else
    {
        altezzaRigha = $("#bodyTabId").find("tr:first").height();
    }
      
      
   var spazioPerRighe = hWindowOut - posTab - hheadertab;
   spazioPerRighe = spazioPerRighe - hbarraInfostazioneConBiancoIn;
   var percRigaIncompleta = spazioPerRighe % altezzaRigha;
    //   alert("hbarraInfostazioneConBiancoIn:" + hbarraInfostazioneConBiancoIn + "\n percRigaIncompleta " + percRigaIncompleta)
   
    
   
   if ((infosupplementare != null) && (infosupplementare != ""))
   {
       // Se c'è ingrandisco la barra gialla
       var nuovoVal = $("#barraInfoStazioneId").height() + percRigaIncompleta;
       $("#barraInfoStazioneId").height(nuovoVal);
   }
   else
   {
       // se non c'è ...mi arrangio altrimenti
       //alert("altezza last update:" + $("#lastUpdateId").height() + "\n percRigaIncompleta " + percRigaIncompleta);
       var nuovoVal = $("#lastUpdateId").height() + percRigaIncompleta;
       $("#lastUpdateId").height(nuovoVal);
       //alert("altezza last update:" + $("#lastUpdateId").height());
      
   }
}
  
 
 