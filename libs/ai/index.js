import axios from "axios";
import { Logger } from '@/libs/utils/logger';

/**
 * AI Service Module
 * 
 * Centralized module for all AI-related operations using OpenAI API.
 * Supports model selection (normal/advanced) with configurable defaults.
 */

// Model configuration
// Normal model: GPT-4o (default for most tasks)
// Advanced model: GPT-5.1 (for complex tasks, configurable via env)
// 
// Available models as of 2024:
// - gpt-4o: High-intelligence flagship model (normal/default)
// - gpt-4o-mini: More affordable and efficient version
// - gpt-5.1: Advanced model optimized for coding and agentic tasks (advanced)
// - gpt-5.1-codex: Variant for long-running agentic coding tasks
const MODELS = {
  normal: process.env.OPENAI_MODEL_NORMAL || 'gpt-4o',
  advanced: process.env.OPENAI_MODEL_ADVANCED || 'gpt-5.1',
};

/**
 * Send a chat completion request to OpenAI
 * 
 * @param {Array} messages - Array of message objects with 'role' and 'content'
 * @param {string} userId - User ID for OpenAI user tracking
 * @param {number} maxTokens - Maximum tokens in response (default: 100)
 * @param {number} temperature - Temperature for randomness (default: 1)
 * @param {string} modelType - 'normal' or 'advanced' (default: 'normal')
 * @returns {Promise<string>} The AI response content
 * @throws {Error} If the API call fails
 */
export const sendOpenAi = async (
  messages,
  userId,
  maxTokens = 100,
  temperature = 1,
  modelType = 'normal'
) => {
  const url = "https://api.openai.com/v1/chat/completions";
  
  // Select model based on type
  const model = modelType === 'advanced' ? MODELS.advanced : MODELS.normal;

  Logger.debug('OpenAI API call', {
    model,
    modelType,
    userId: userId || 'anonymous',
    maxTokens,
    temperature,
    messageCount: messages.length,
  });

  // Log messages in development
  if (process.env.NODE_ENV === 'development') {
    console.log("Ask GPT >>>");
    messages.forEach((m) =>
      console.log(" - " + m.role.toUpperCase() + ": " + m.content.substring(0, 200) + (m.content.length > 200 ? '...' : ''))
    );
  }

  const body = JSON.stringify({
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
    user: userId || 'anonymous',
  });

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(url, body, options);

    const answer = res.data.choices[0].message.content;
    const usage = res?.data?.usage;

    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(">>> " + answer.substring(0, 200) + (answer.length > 200 ? '...' : ''));
      console.log(
        "TOKENS USED: " +
          usage?.total_tokens +
          " (prompt: " +
          usage?.prompt_tokens +
          " / response: " +
          usage?.completion_tokens +
          ")"
      );
      console.log("\n");
    }

    Logger.info('OpenAI API call successful', {
      model,
      modelType,
      userId: userId || 'anonymous',
      tokensUsed: usage?.total_tokens,
      promptTokens: usage?.prompt_tokens,
      completionTokens: usage?.completion_tokens,
    });

    return answer;
  } catch (e) {
    Logger.error('OpenAI API call failed', e, {
      model,
      modelType,
      userId: userId || 'anonymous',
      status: e?.response?.status,
      errorData: e?.response?.data,
    });

    console.error("GPT Error: " + e?.response?.status, e?.response?.data);
    
    // Re-throw the error so the API route can handle it properly
    const error = new Error(e?.response?.data?.error?.message || e?.message || "OpenAI API error");
    error.status = e?.response?.status;
    error.responseData = e?.response?.data;
    throw error;
  }
};

/**
 * Get available model names
 * @returns {Object} Object with 'normal' and 'advanced' model names
 */
export const getModels = () => {
  return {
    normal: MODELS.normal,
    advanced: MODELS.advanced,
  };
};

/**
 * Get model name by type
 * @param {string} modelType - 'normal' or 'advanced'
 * @returns {string} Model name
 */
export const getModel = (modelType = 'normal') => {
  return modelType === 'advanced' ? MODELS.advanced : MODELS.normal;
};
