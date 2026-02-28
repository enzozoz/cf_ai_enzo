# AI Usage Documentation
I used Claude for the assignment to help debug during the initial beginnings of this project in addition to following Cloudflare's documentation on building a chat agent (found here: https://developers.cloudflare.com/agents/getting-started/build-a-chat-agent/)

## PROMPTS
**CONTEXT**
This was during the set up process and when I had copied and pasted from the documentation, I got an error in the file from this line. I had initially pushed through but by the time we had supposedly added AI as part of the environmental variables, it wasn't there and the errors were not resolved. Hence, I asked Claude how to resolved it.

**PROMPT**
i am getting an error on this line:
    const workersai = createWorkersAI({ binding: this.env.AI });

there exists a red underline under AI in this.env.AI. the error that is showing up is:
property AI does not exist on type Env

**CLAUDE RESPONSE**
That's expected for now — the Env type hasn't been generated yet because we haven't run wrangler types. The red underline will go away after we do that.

**WHAT I DID**
I ended up putting it in manually.

**CONTEXT**
After getting the basic foundation of the chat agent down (or so I thought), when running npm run dev and initiating vite for the backend, nothing was popping up. I saw a white page and didn't know why.

**PROMPT**
Failed to load resource: the server responded with a status of 404 (Not Found)
i see a white page when opening localhost 5173. when i open the chrome console, this is what i see

how do i check

no

there's nothing

nothing is red

i see:
localhost
client
env.mjs
?token=5st38WbL04Rn

304 not modified

**CLAUDE RESPONSE**
Which file is the 404 on? Click the error and check the full URL it's trying to load.

In the Chrome console, look at the right side of the error line — it should show a filename and line number like main.tsx:1 or a full URL. Can you see anything next to the error text?

Click the small arrow or triangle to the left of the error message to expand it. Or look for a small gray URL to the right of the error text on the same line.

Let's try a different approach. In the Chrome console, click the Network tab (it's next to Console at the top of DevTools). Then refresh the page. You'll see all the requests — look for any red ones and tell me what files they show.

That's strange. In the Network tab, do you see any requests at all after refreshing? Like localhost, main.tsx, anything?

Good — click on client in the Network tab. What status code does it show (should be a number like 200, 404, etc.)?

That means client.tsx is loading fine. The white page must be a runtime error.
Click back to the Console tab and look for any errors. Also try typing this in the console and pressing Enter:
javascriptdocument.getElementById("root")
What does it return?

**WHAT I DID**
After running that, I saw that line returned null. That meant index was not the updated one. The debugging for this process was very long but this was the main prompt. At another point of time during debugigng, we saw that a file in the chrome console was empty and turns out I forgot to CMD + S (save) my changes. Right...
