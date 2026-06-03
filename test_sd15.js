async function test() {
  const { Client } = await import('@gradio/client');
  try {
    console.log("Connecting to Goztepe/stable-diffusion-v1-5...");
    const client = await Client.connect("Goztepe/stable-diffusion-v1-5");
    console.log("Connected successfully!");
    
    const appInfo = client.config;
    console.log("Registered dependencies:", appInfo.dependencies.map((d, i) => `index ${i}: api_name=${d.api_name}, queue=${d.queue}`));
    
    console.log("Generating test image...");
    const result = await client.predict(0, [
      "A small shiny golden coin, 3D render, solid black background." // Prompt
    ]);
    
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("SD 1.5 test failed:", err);
  }
}

test();
