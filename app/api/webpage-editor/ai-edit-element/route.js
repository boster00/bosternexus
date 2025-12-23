import { NextResponse } from 'next/server';
import { sendOpenAi } from '@/libs/ai';
import { DataAccessLayer } from '@/libs/supabase/data-access-layer';
import { Logger } from '@/libs/utils/logger';

/**
 * API route for AI-powered element editing
 * Uses OpenAI GPT to modify HTML elements based on user instructions
 */
export async function POST(req) {
  try {
    Logger.info('AI edit element API called');
    
    const body = await req.json();
    Logger.debug('Request body received', { 
      hasOriginalHTML: !!body.originalHTML,
      hasUserPrompt: !!body.userPrompt,
      promptType: body.promptType,
      modelType: body.modelType,
      hasUserId: !!body.userId,
      originalHTMLLength: body.originalHTML?.length || 0,
      userPromptLength: body.userPrompt?.length || 0,
    });
    
    const { originalHTML, userPrompt, promptType, userId, modelType } = body;

    if (!originalHTML || !userPrompt) {
      Logger.warn('Missing required fields', { 
        hasOriginalHTML: !!originalHTML,
        hasUserPrompt: !!userPrompt,
      });
      return NextResponse.json(
        { error: 'originalHTML and userPrompt are required' },
        { status: 400 }
      );
    }

    // Get current user ID if not provided
    let currentUserId = userId;
    Logger.debug('User ID check', { providedUserId: userId });
    
    if (!currentUserId) {
      try {
        Logger.debug('Attempting to get userId from DAL');
        const dal = new DataAccessLayer({
          useServiceRole: false,
          requireUserId: false,
          autoTimestamps: false,
        });
        currentUserId = await dal.getCurrentUserId();
        Logger.debug('Retrieved userId from DAL', { userId: currentUserId });
      } catch (dalError) {
        Logger.error('Error getting userId from DAL', dalError, {
          errorMessage: dalError.message,
          errorStack: dalError.stack,
        });
        // Continue with null userId - will use 'anonymous' in sendOpenAi
      }
    }
    
    Logger.info('Using userId for AI request', { userId: currentUserId || 'anonymous' });

    // Build prompt based on promptType
    Logger.debug('Building prompt', { promptType: promptType || 'default' });
    
    let systemPrompt = '';
    let userMessage = '';

    switch (promptType) {
      case 'none':
        systemPrompt = 'You are an expert HTML editor. Modify the provided HTML element according to the user\'s instructions. Return ONLY the complete modified HTML code, wrapped in ```html and ``` tags.';
        userMessage = `User instructions: ${userPrompt}\n\nOriginal HTML: ${originalHTML}`;
        break;

      case 'replace-all':
        systemPrompt = 'You are an expert HTML editor. Replace ALL contents in the original HTML with the user-provided contents. Remove any part of the original HTML that does not have corresponding user-provided contents. Return ONLY the complete modified HTML code, wrapped in ```html and ``` tags.';
        userMessage = `User input: ${userPrompt}\n\nOriginal HTML: ${originalHTML}`;
        break;

      case 'replace-selective':
        systemPrompt = 'You are an expert HTML editor. Only replace parts of the original HTML that have new contents provided. Keep all unchanged parts exactly as they are. Return ONLY the complete modified HTML code, wrapped in ```html and ``` tags.';
        userMessage = `User input: ${userPrompt}\n\nOriginal HTML: ${originalHTML}`;
        break;

      case 'make-adjustments':
        systemPrompt = 'You are an expert HTML editor. The user has provided instructions about how to change the following HTML. Make the requested adjustments while preserving the overall structure and style. Return ONLY the complete modified HTML code, wrapped in ```html and ``` tags.';
        userMessage = `User instructions: ${userPrompt}\n\nOriginal HTML: ${originalHTML}`;
        break;

      default:
        systemPrompt = 'You are an expert HTML editor. Modify the provided HTML element according to the user\'s instructions. Return ONLY the complete modified HTML code, wrapped in ```html and ``` tags.';
        userMessage = `User instructions: ${userPrompt}\n\nOriginal HTML: ${originalHTML}`;
    }
    
    Logger.debug('Prompt built', { 
      systemPromptLength: systemPrompt.length,
      userMessageLength: userMessage.length,
    });

    // Call OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    // Determine model type (default to 'normal')
    const selectedModelType = modelType === 'advanced' ? 'advanced' : 'normal';
    
    Logger.info('Calling OpenAI', { 
      userId: currentUserId || 'anonymous',
      maxTokens: 2000,
      temperature: 0.7,
      messageCount: messages.length,
      modelType: selectedModelType,
    });
    
    let aiResponse;
    try {
      aiResponse = await sendOpenAi(messages, currentUserId || 'anonymous', 2000, 0.7, selectedModelType);
      Logger.debug('OpenAI response received', { 
        hasResponse: !!aiResponse,
        responseLength: aiResponse?.length || 0,
      });
    } catch (openAiError) {
      Logger.error('OpenAI API call failed', openAiError, {
        errorMessage: openAiError.message,
        errorStack: openAiError.stack,
        userId: currentUserId || 'anonymous',
      });
      return NextResponse.json(
        { 
          error: 'Failed to get AI response',
          details: openAiError.message || 'Unknown error',
        },
        { status: 500 }
      );
    }

    if (!aiResponse) {
      Logger.warn('OpenAI returned null/empty response');
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      );
    }

    // Extract HTML from response (look for ```html ... ```)
    Logger.debug('Extracting HTML from AI response', { 
      responseLength: aiResponse.length,
      responsePreview: aiResponse.substring(0, 200),
    });
    
    let extractedHTML = aiResponse.trim();
    
    // Try to extract content between ```html and ```
    const htmlBlockMatch = extractedHTML.match(/```html\s*([\s\S]*?)\s*```/i);
    if (htmlBlockMatch) {
      extractedHTML = htmlBlockMatch[1].trim();
      Logger.debug('Extracted HTML from ```html block', { 
        extractedLength: extractedHTML.length,
      });
    } else {
      // If no code block, try to extract between ``` and ```
      const codeBlockMatch = extractedHTML.match(/```\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        extractedHTML = codeBlockMatch[1].trim();
        Logger.debug('Extracted HTML from ``` block', { 
          extractedLength: extractedHTML.length,
        });
      } else {
        Logger.debug('No code block found, using response as-is', { 
          extractedLength: extractedHTML.length,
        });
        // If still no match, use the response as-is (might be plain HTML)
      }
    }

    Logger.info('AI edit element success', { 
      extractedHTMLLength: extractedHTML.length,
    });

    return NextResponse.json({
      success: true,
      html: extractedHTML,
      rawResponse: aiResponse,
    });
  } catch (error) {
    Logger.error('AI edit element error', error, {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
    });
    
    return NextResponse.json(
      {
        error: error.message || 'An error occurred',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
