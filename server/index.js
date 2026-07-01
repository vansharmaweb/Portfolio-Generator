export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Intercept API calls to generate the bio using Groq
    if (url.pathname === '/api/generate' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { name, role, skills, projects } = body;

        const apiKey = env.GROQ_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: 'Server GROQ_API_KEY is not configured.' }), {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        const skillsText = skills?.filter(Boolean).join(', ') || 'various technologies';
        const projectsText = projects?.map(p => p.title).filter(Boolean).join(', ') || '';

        const prompt = `Write a compelling, professional "About Me" paragraph for a developer portfolio website.

Details:
- Name: ${name || 'the developer'}
- Role: ${role || 'Software Developer'}
- Skills: ${skillsText}
${projectsText ? `- Notable projects: ${projectsText}` : ''}

Requirements:
- 2-3 sentences maximum
- Energetic and personal tone, not corporate
- Mention their role and passion for building
- Subtly weave in 2-3 of their top skills
- Do NOT start with "I am" or "My name is"
- No bullet points, just a clean paragraph
- No quotes around the output`;

        // Direct fetch to Groq's OpenAI-compatible completions endpoint
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 180
          })
        });

        if (!groqResponse.ok) {
          const errData = await groqResponse.json().catch(() => ({}));
          return new Response(JSON.stringify({ error: errData.error?.message || 'Groq API error' }), {
            status: groqResponse.status,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        const resData = await groqResponse.json();
        const text = resData.choices?.[0]?.message?.content?.trim() || '';

        return new Response(JSON.stringify({ text }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // Otherwise, fall back to serving the static frontend assets from client/dist
    return env.ASSETS.fetch(request);
  }
};
