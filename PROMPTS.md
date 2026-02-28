# AI Usage Documentation
I used Claude for the assignment to help debug during the initial beginnings of this project in addition to following Cloudflare's documentation on building a chat agent (found here: https://developers.cloudflare.com/agents/getting-started/build-a-chat-agent/)

## PROMPTS
# 1: DEBUGGING
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
