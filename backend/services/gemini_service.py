import google.generativeai as genai
from typing import List, Dict, Optional
import json
import re
from config import settings

class GeminiService:
    """Service for generating AI responses using Google Gemini."""

    SYSTEM_PROMPT = """You are a professional movie recommendation assistant for Movie Magic.

    Your role:
    - Help users discover movies based on their taste and preferences
    - Ask clarifying questions about genres, moods, actors, directors they enjoy
    - Provide 3-5 movie recommendations at a time with brief explanations
    - Explain WHY each movie matches their preferences
    - For each movie, suggest 2-3 similar thriller movies when relevant

    Your personality:
    - Friendly and enthusiastic about cinema
    - Conversational and warm, not robotic
    - Knowledgeable but approachable, not pretentious

    IMPORTANT - Response Format:
    When recommending movies, ALWAYS respond in this exact JSON format:

    ```json
    {
      "message": "Your conversational response here (2-3 sentences introducing the recommendations)",
      "movies": [
        {
          "id": 550,
          "title": "Fight Club",
          "reason": "Brief explanation why this matches user preferences (1-2 sentences)",
          "thrillers": [
            {"id": 680, "title": "Pulp Fiction"},
            {"id": 13, "title": "Forrest Gump"}
          ]
        }
      ]
    }
    ```

    Guidelines:
    - ALWAYS include the JSON code block with ```json markers
    - Use actual TMDB movie IDs when available from context
    - If you don't have movie IDs, use 0 as placeholder
    - Include 2-3 thriller recommendations per movie when they make sense
    - Keep "reason" concise (1-2 sentences per movie)
    - "message" should be conversational and warm
    - If the user is just chatting without asking for recommendations, respond normally in JSON format with empty "movies" array
    """

    @staticmethod
    def _format_conversation(messages: List[Dict]) -> str:
        """
        Format conversation history for Gemini API.

        Args:
            messages: List of message dictionaries with 'role' and 'content'

        Returns:
            Formatted string combining system prompt and conversation history
        """
        formatted = f"{GeminiService.SYSTEM_PROMPT}\n\n"
        formatted += "--- Conversation History ---\n\n"

        for msg in messages:
            role = msg.get('role', 'user')
            content = msg.get('content', '')

            if role == 'user':
                formatted += f"User: {content}\n\n"
            elif role == 'assistant':
                formatted += f"Assistant: {content}\n\n"

        return formatted

    @staticmethod
    def parse_structured_response(response_text: str) -> Dict:
        """
        Parse structured JSON response from Gemini.

        Extracts JSON from markdown code blocks and returns parsed structure.
        Falls back to plain text response if JSON parsing fails.

        Args:
            response_text: Raw response text from Gemini

        Returns:
            Dict with 'message' and 'movies' keys, or fallback structure
        """
        try:
            # Try to extract JSON from markdown code block
            json_pattern = r'```json\s*(\{.*?\})\s*```'
            match = re.search(json_pattern, response_text, re.DOTALL)

            if match:
                json_str = match.group(1)
                parsed = json.loads(json_str)
                return parsed

            # Try to parse the entire response as JSON
            parsed = json.loads(response_text)
            return parsed

        except (json.JSONDecodeError, AttributeError) as e:
            print(f"Failed to parse structured response: {e}")
            # Fallback: return plain text response
            return {
                "message": response_text,
                "movies": []
            }

    @staticmethod
    def generate_response(messages: List[Dict]) -> str:
        """
        Generate AI response using Gemini.

        Args:
            messages: Full conversation history with role and content for each message

        Returns:
            AI-generated response as string

        Raises:
            Returns user-friendly error message on failure instead of raising exceptions
        """
        try:
            genai.configure(api_key=settings.gemini_access_token)
            model = genai.GenerativeModel("models/gemini-2.5-flash")
            prompt = GeminiService._format_conversation(messages)
            response = model.generate_content(prompt)
            return response.text

        except Exception as e:
            import traceback
            print(f"\nGemini API Error: {type(e).__name__} - {str(e)}")
            traceback.print_exc()

            return (
                "I apologize, but I'm having trouble processing your request right now. "
                "Please try again! I'm here to help with movie recommendations."
            )

    @staticmethod
    def generate_structured_response(messages: List[Dict]) -> Dict:
        """
        Generate structured AI response with movie recommendations.

        Args:
            messages: Full conversation history with role and content for each message

        Returns:
            Dict with 'message' (str) and 'movies' (list) keys

        Example:
            {
                "message": "Here are some great thrillers for you!",
                "movies": [
                    {
                        "id": 550,
                        "title": "Fight Club",
                        "reason": "Psychological thriller...",
                        "thrillers": [{"id": 680, "title": "Pulp Fiction"}]
                    }
                ]
            }
        """
        response_text = GeminiService.generate_response(messages)
        return GeminiService.parse_structured_response(response_text)
