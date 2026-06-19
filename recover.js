const fs = require('fs');
const readline = require('readline');
const path = '/Users/filippo/.gemini/antigravity-ide/brain/ed292bd3-ceea-4dc9-916a-9c5f9fa913ed/.system_generated/logs/transcript.jsonl';

async function recover() {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  
  let lastContentTravel = null;
  let lastContentTicket = null;

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const call of obj.tool_calls) {
          if (call.name === 'multi_replace_file_content' || call.name === 'replace_file_content') {
            if (call.args && call.args.TargetFile && call.args.TargetFile.includes('travel-solution-card.tsx')) {
               // We will just print the step_index and arguments
               console.log("Found travel-solution-card at step", obj.step_index);
            }
            if (call.args && call.args.TargetFile && call.args.TargetFile.includes('ticket-card.tsx')) {
               console.log("Found ticket-card at step", obj.step_index);
            }
          }
        }
      }
    } catch(e) {}
  }
}
recover();
