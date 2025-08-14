import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateAdviceRequest {
  cleaned_query_text: string;
  detected_language?: string;
  language: string;
  dataset_context?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cleaned_query_text, detected_language, language, dataset_context }: GenerateAdviceRequest = await req.json();

    if (!cleaned_query_text) {
      return new Response(
        JSON.stringify({ error: 'Query text is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine response language
    const responseLanguage = detected_language || language || 'English';
    const isHindi = responseLanguage.toLowerCase().includes('hindi') || responseLanguage === 'hi';
    
    // Build context from dataset information
    let datasetContext = '';
    if (dataset_context) {
      if (dataset_context.weather && dataset_context.weather.length > 0) {
        const weather = dataset_context.weather[0];
        datasetContext += `\nCurrent Weather Data for ${weather.location}:
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Rainfall: ${weather.rainfall}mm
- Forecast: ${weather.forecast}`;
      }
      
      if (dataset_context.marketPrices && dataset_context.marketPrices.length > 0) {
        datasetContext += '\nCurrent Market Prices:';
        dataset_context.marketPrices.forEach((price: any) => {
          datasetContext += `\n- ${price.crop}: ₹${price.price} ${price.unit} at ${price.market} (${price.trend})`;
        });
      }
      
      if (dataset_context.cropAdvisories && dataset_context.cropAdvisories.length > 0) {
        const advisory = dataset_context.cropAdvisories[0];
        datasetContext += `\nCrop Advisory for ${advisory.crop} in ${advisory.region}:
- Sowing Time: ${advisory.sowingTime}
- Harvest Time: ${advisory.harvestTime}
- Current Recommendations: ${advisory.recommendations.join(', ')}`;
        if (advisory.pestAlerts.length > 0) {
          datasetContext += `\n- Pest Alerts: ${advisory.pestAlerts.join(', ')}`;
        }
      }
      
      if (dataset_context.soilHealth && dataset_context.soilHealth.length > 0) {
        const soil = dataset_context.soilHealth[0];
        datasetContext += `\nSoil Health Data for ${soil.region}:
- pH: ${soil.ph}
- Nitrogen: ${soil.nitrogen} kg/ha
- Phosphorus: ${soil.phosphorus} kg/ha
- Potassium: ${soil.potassium} kg/ha
- Organic Matter: ${soil.organicMatter}%`;
      }
      
      if (dataset_context.schemes && dataset_context.schemes.length > 0) {
        datasetContext += '\nRelevant Government Schemes:';
        dataset_context.schemes.forEach((scheme: any) => {
          datasetContext += `\n- ${scheme.name}: ${scheme.benefits}`;
        });
      }
    }
    
    // Create contextual prompt for Indian farmers
    const systemPrompt = `You are an expert agricultural advisor specializing in Indian farming practices. Provide concise, actionable advice for Indian farmers based on their queries and the provided real-time data.

${datasetContext ? `IMPORTANT: Use the following real-time data in your response:${datasetContext}

When referencing this data, mention the specific sources and incorporate the actual numbers/facts provided.` : ''}

Guidelines:
- Give practical, implementable advice suitable for Indian climate and soil conditions
- ${datasetContext ? 'PRIORITIZE the real-time data provided above in your recommendations' : 'Consider local crops, seasonal patterns, and traditional farming methods'}
- Consider local crops, seasonal patterns, and traditional farming methods
- Mention specific varieties, timing, and techniques when relevant
- Keep advice under 200 words and explanation under 150 words
- Be culturally sensitive and consider resource constraints of small farmers
- ${datasetContext ? 'Cite specific data sources when using the provided information' : ''}
- ${isHindi ? 'Respond in Hindi (Devanagari script)' : `Respond in ${responseLanguage} if possible, otherwise in English`}

Format your response as JSON with two fields:
- "advice": Practical, actionable farming advice ${datasetContext ? '(incorporating the real-time data provided)' : ''}
- "explanation": Brief explanation of why this advice works ${datasetContext ? '(referencing specific data sources when applicable)' : ''}

User Query: ${cleaned_query_text}`;

    console.log('Sending request to Gemini API...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, errorData);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service is currently busy. Please try again in a moment.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate advice. Please try again.' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Gemini API response received');

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid response structure from Gemini API:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to generate advice. Please try again.' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Try to parse JSON response
    let advice: string;
    let explanation: string;

    try {
      const parsed = JSON.parse(generatedText);
      advice = parsed.advice || generatedText;
      explanation = parsed.explanation || '';
    } catch {
      // If not JSON, treat as plain text advice
      advice = generatedText;
      explanation = 'AI-generated farming advice based on your query.';
    }

    return new Response(
      JSON.stringify({ 
        advice: advice.trim(),
        explanation: explanation.trim()
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in generate-advice function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});