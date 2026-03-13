import { NextRequest, NextResponse } from 'next/server';
import { fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vehicleId } = await params;
    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });
    }

    const result = await (async () => {
      const detailResponse = await fetchWithTimeout(`${BASE_URL}/listcar-individual`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ vehicle_id: String(vehicleId) }),
      }, 10000);

      const data = await detailResponse.json();

      if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
        return { __error: data[0], __status: 404 };
      }

      if (!data || !data.individual || !data.individual.vehicle_id) {
        return { __error: "Car not found", __status: 404 };
      }

      const car = data.individual;

      let imagesArray: string[] = [];
      if (data.images && Array.isArray(data.images)) {
        imagesArray = data.images
          .map((img: any) => img.image_url || img.url || "")
          .filter((url: string) => url !== "");
      } else if (car.images) {
        imagesArray = car.images.split(",").map((img: string) => img.trim()).filter((img: string) => img !== "");
      }

      let featuresRaw: any[] = [];
      if (data.feature && Array.isArray(data.feature)) {
        featuresRaw = data.feature;
      } else if (data.features && Array.isArray(data.features)) {
        featuresRaw = data.features;
      } else if (data.individual?.feature && Array.isArray(data.individual.feature)) {
        featuresRaw = data.individual.feature;
      }

      const features = featuresRaw
        .filter((f: any) => f.type === "feature" && f.name)
        .map((f: any) => ({ name: f.name, category: f.category || "Other" }));

      let insurance: any = {};
      if (data.insurance && typeof data.insurance === "object") {
        insurance = data.insurance;
      } else if (data.individual?.insurance && typeof data.individual.insurance === "object") {
        insurance = data.individual.insurance;
      }

      const parseOwnership = (ownership: string): string => {
        const num = parseInt(ownership, 10);
        if (num === 1) return "First Owner";
        if (num === 2) return "Second Owner";
        if (num === 3) return "Third Owner";
        if (num >= 4) return `${num}th Owner`;
        return ownership || "N/A";
      };

      const carscope = car.carscope || {};
      let rcData: Record<string, string> = {};
      try {
        if (carscope.rc_report_generate) {
          rcData = JSON.parse(carscope.rc_report_generate);
        }
      } catch { rcData = {}; }

      const specs = {
        engineCC: parseInt(carscope.vehicle_cc || rcData.vehicleCubicCapacity || "0", 10) || 0,
        cylinders: parseInt(rcData.vehicleCylindersNo || "0", 10) || 0,
        bodyType: carscope.bodyType || rcData.bodyType || "",
        color: carscope.colorOfCar || rcData.vehicleColour || car.color || "",
        grossWeight: parseInt(rcData.grossVehicleWeight || "0", 10) || 0,
        unladenWeight: parseInt(rcData.unladenWeight || "0", 10) || 0,
        wheelbase: parseInt(rcData.wheelbase || "0", 10) || 0,
        registrationDate: rcData.registrationDate || "",
        registrationNumber: rcData.registrationNumber || car.rto_location || "",
        insuranceProvider: insurance.provider_name || "",
        insuranceExpiry: insurance.expiry_date || "",
        manufacturingDate: rcData.manufacturingDate || "",
      };

      let insights: any[] = [];
      if (carscope.ai_insights && Array.isArray(carscope.ai_insights)) {
        insights = carscope.ai_insights.map((i: any) => ({
          heading: i.heading || "",
          body: i.body || i.text || "",
        }));
      }

      let rcDetails = null;
      if (Object.keys(rcData).length > 0) {
        rcDetails = {
          regNo: rcData.registrationNumber || "",
          vehicleClass: rcData.vehicleClass || "",
          chassis: rcData.chassisNumber || "",
          engine: rcData.engineNumber || "",
          manufacturerName: rcData.manufacturerName || "",
          model: rcData.model || "",
          color: rcData.vehicleColour || "",
          fuelType: rcData.fuelType || "",
          normsType: rcData.normsType || "",
          bodyType: rcData.bodyType || "",
          ownerCount: rcData.ownerCount || "",
          ownerName: rcData.ownerName || "",
          status: rcData.status || "",
          statusAsOn: rcData.statusAsOn || "",
          regAuthority: rcData.registeredAt || "",
          regDate: rcData.registrationDate || "",
          rcExpiryDate: rcData.rcExpiryDate || "",
          vehicleTaxUpto: rcData.vehicleTaxUpto || "",
          insuranceCompany: rcData.insuranceCompany || "",
          insuranceUpto: rcData.insuranceUpto || "",
          insurancePolicyNumber: rcData.insurancePolicyNumber || "",
          financer: rcData.financer || "",
          puccNumber: rcData.puccNumber || "",
          puccUpto: rcData.puccUpto || "",
          blacklistStatus: rcData.blacklistStatus || "",
          financed: rcData.financed === "true" || rcData.financed === "Yes",
        };
      }

      let carscopeData = null;
      if (Object.keys(carscope).length > 0) {
        carscopeData = {
          inspectionReportUrl: carscope.inspection_report || null,
          rcFrontUrl: carscope.rc_front || null,
          rcBackUrl: carscope.rc_back || null,
          rcDetails,
          warrantyPackages: [],
          insuranceQuotes: null,
          warrantyPrices: {} as Record<string, string>,
        };
      }

      let detailedSpecs: { name: string; value: string; category: string }[] = [];
      if (car.specs && typeof car.specs === 'object') {
        const specsObj = car.specs;
        for (const key of Object.keys(specsObj)) {
          const s = specsObj[key];
          if (s && s.type === 'spec' && s.name && s.value) {
            detailedSpecs.push({ name: s.name, value: s.value, category: s.category || 'General' });
          }
        }
      }

      const priceMap = {
        buyerLower: parseFloat(car.buyer_lower_price) || 0,
        buyerUpper: parseFloat(car.buyer_upper_price) || 0,
        sellerLower: parseFloat(car.seller_lower_price) || 0,
        sellerUpper: parseFloat(car.seller_upper_price) || 0,
      };

      return {
        id: car.vehicle_id,
        images: imagesArray,
        make: car.make || "",
        model: car.model || "",
        variant: car.variant || "",
        year: parseInt(car.year, 10) || 0,
        price: parseFloat(car.price) || 0,
        predictionPrice: car.prediction_price || car.predictionPrice || "",
        emi: parseFloat(car.emi) || 0,
        kilometersDriven: parseInt(car.mileage, 10) || 0,
        fuelType: car.fuel_type || "",
        transmission: car.transmission || "",
        seats: parseInt(car.seats, 10) || 0,
        ownership: parseOwnership(car.ownership),
        city: car.city_name || car.location_name || "",
        rtoLocation: car.rto_location || "",
        sellerName: car.seller_name || car.seller_username || "",
        sellerPhone: car.seller_phone_number || "",
        sellerAddress: car.seller_address || "",
        listingDate: car.created_date || "",
        status: car.status || "",
        specs,
        features,
        insights,
        carscope: carscopeData,
        detailedSpecs,
        priceMap,
        rawData: { ...car },
      };
    })();

    if (result && (result as any).__error) {
      return NextResponse.json({ error: (result as any).__error }, { status: (result as any).__status });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch car details" }, { status: 500 });
  }
}
