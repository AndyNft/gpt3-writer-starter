import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

let clicked=false;
let basePromptPrefix="";
let character="";
let secondPrompt="";


const generateAction = async (req, res) => {
  if (!clicked) {
    character=`${req.body.userInput}`;
    basePromptPrefix = `Name the top 3 characteristics in a comma-separated phrase ${character} would show as a fitness coach.`
    
     // Run first prompt
    console.log(`API: ${basePromptPrefix}`)

    const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}`,
    temperature: 0.3,
    max_tokens: 30,
  });

    const basePromptOutput = baseCompletion.data.choices.pop();

    secondPrompt = `The following is a conversation with ${character} who is now my personal fitness coach. The coach has qualities such as ${basePromptOutput.text.trim()}\n${character}:`;
    
    clicked=true;
    }
  else {
    secondPrompt = `${req.body.userInput}\n${character}:`;
    }
 
    console.log(`API: ${secondPrompt}`)
    // Prompt #2
    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature: 0.72,
        max_tokens: 400,
        stop: "Me"
    });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;