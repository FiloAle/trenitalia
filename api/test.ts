import { searchJourneys } from './search';

async function run() {
  try {
    const d = new Date();
    d.setDate(d.getDate() + 3); // 3 days from now
    
    console.log("Searching Milano Centrale -> Bari Centrale for", d);
    const result = await searchJourneys("Milano Centrale", "Bari Centrale", d);
    
    console.log("Result status: ", result.err ? `Error: ${result.err}` : "Success");
    if (result.data && result.data.routes) {
        console.log(`Found ${result.data.routes.length} routes.`);
        console.log("First route:", JSON.stringify(result.data.routes[0], null, 2));
    } else {
        console.log(result);
    }
  } catch (err) {
    console.error(err);
  }
}

run();
