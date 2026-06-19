const fs = require('fs');
const readline = require('readline');
const path = '/Users/filippo/.gemini/antigravity-ide/brain/ed292bd3-ceea-4dc9-916a-9c5f9fa913ed/.system_generated/logs/transcript.jsonl';

async function recover() {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const call of obj.tool_calls) {
          if (call.name === 'multi_replace_file_content' || call.name === 'replace_file_content') {
            if (call.args && call.args.TargetFile && call.args.TargetFile.includes('travel-solution-card.tsx')) {
               if (obj.step_index >= 1889) {
                 console.log("STEP", obj.step_index);
                 console.log("Instruction:", call.args.Instruction);
                 console.log("Chunks:", JSON.stringify(call.args.ReplacementChunks || [call.args], null, 2));
               }
            }
          }
        }
      }
    } catch(e) {}
  }
}
recover();
