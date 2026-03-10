import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const body = await request.json();
    const { recentlyViewedIds = [], preferences } = body;

    const recentlyViewedCars = recentlyViewedIds.length > 0
      ? await storage.getCarsByIds(recentlyViewedIds)
      : [];

    const allCars = await storage.getCars(50);

    const userPreferences = preferences || await storage.getUserCarPreferences(sessionId);

    const browsingHistory = recentlyViewedCars.map(car => ({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      fuelType: car.fuelType,
      transmission: car.transmission,
      kilometers: car.kilometers,
      location: car.location,
    }));

    const availableCars = allCars.map(car => ({
      id: car.id,
      name: car.name,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      fuelType: car.fuelType,
      transmission: car.transmission,
      kilometers: car.kilometers,
      location: car.location,
    }));

    const prompt = `You are an AI car recommendation engine for Nxcar, India's trusted used car platform.

Analyze the user's browsing history and preferences to recommend the best matching cars.

USER'S BROWSING HISTORY:
${browsingHistory.length > 0 ? JSON.stringify(browsingHistory, null, 2) : 'No browsing history available'}

USER'S STATED PREFERENCES:
${userPreferences ? JSON.stringify({
  budgetMin: userPreferences.budgetMin,
  budgetMax: userPreferences.budgetMax,
  preferredBrands: userPreferences.preferredBrands,
  preferredFuelTypes: userPreferences.preferredFuelTypes,
  preferredTransmissions: userPreferences.preferredTransmissions,
  maxKilometers: userPreferences.maxKilometers,
  minYear: userPreferences.minYear,
  usageType: userPreferences.usageType
}, null, 2) : 'No preferences set'}

AVAILABLE CARS FOR RECOMMENDATION:
${JSON.stringify(availableCars, null, 2)}

Based on the browsing patterns and preferences, recommend up to 6 cars that would be the best match. For each recommendation, provide:
1. The car ID
2. A personalized reason why this car is recommended (2-3 sentences, mention specific features that match their interests)
3. A match score from 1-100

Respond in this exact JSON format:
{
  "recommendations": [
    {
      "carId": <number>,
      "reason": "<string>",
      "matchScore": <number>
    }
  ],
  "insights": "<A brief 1-2 sentence summary of what the user seems to be looking for>"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const aiResponse = JSON.parse(content);

    const recommendedCarIds = aiResponse.recommendations.map((r: any) => r.carId);
    const recommendedCars = await storage.getCarsByIds(recommendedCarIds);

    const enrichedRecommendations = aiResponse.recommendations.map((rec: any) => {
      const car = recommendedCars.find(c => c.id === rec.carId);
      return {
        ...rec,
        car,
      };
    }).filter((rec: any) => rec.car);

    return NextResponse.json({
      recommendations: enrichedRecommendations,
      insights: aiResponse.insights,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
