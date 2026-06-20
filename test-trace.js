const fetch = require('node-fetch');

async function getDelay() {
    const trainNumber = "18129";
    const stationName = "RIMINI";
    
    const autoUrl = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/${trainNumber}`;
    const autoResp = await fetch(autoUrl);
    const autoText = await autoResp.text();
    console.log("Auto:", autoText);
    
    if (autoText && autoText.trim() !== "") {
        const lines = autoText.trim().split("\n");
        const firstLine = lines[0].trim();
        const parts = firstLine.split("|");
        
        if (parts.length >= 2) {
            const ids = parts[1].split("-");
            if (ids.length >= 3) {
                const originId = ids[1];
                const timestamp = ids[2];

                const andamentoUrl = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/${originId}/${trainNumber}/${timestamp}`;
                console.log("Andamento URL:", andamentoUrl);
                const andamentoResp = await fetch(andamentoUrl);
                const data = await andamentoResp.json();
                
                let delay = null;
                if (data.compRitardo && data.compRitardo.length > 0) {
                    delay = data.compRitardo[0];
                }
                console.log("Comp Ritardo:", delay);
                
                let binario = null;
                if (data.fermate && Array.isArray(data.fermate)) {
                    const fermata = data.fermate.find(f => 
                        f.stazione.toLowerCase().includes(stationName.toLowerCase()) ||
                        stationName.toLowerCase().includes(f.stazione.toLowerCase())
                    );
                    if (fermata) {
                        binario = fermata.binarioEffettivoPartenzaDescrizione || 
                                  fermata.binarioProgrammatoPartenzaDescrizione || 
                                  fermata.binarioEffettivoArrivoDescrizione || 
                                  fermata.binarioProgrammatoArrivoDescrizione || 
                                  null;
                    }
                    console.log("Fermata Found:", !!fermata);
                }
                
                if (delay !== null) {
                    console.log("Returning:", { delay, binario });
                } else {
                    console.log("Delay is null, would fallback");
                }
            }
        }
    }
}
getDelay();
