import type { Express } from "express";

export function registerNxcarRoutes(app: Express) {
  app.get("/api/nxcar/makes", async (req, res) => {
    try {
      const response = await fetch("https://api.nxcar.in/api/make");
      if (!response.ok) throw new Error("Failed to fetch makes");
      const data = await response.json();
      const makes = (data.make || []).map((m: any) => ({
        id: parseInt(m.make_id),
        make_name: m.make,
        make_image: m.make_image || null,
      }));
      res.json(makes);
    } catch (error) {
      console.error("Error fetching makes:", error);
      res.status(500).json({ error: "Failed to fetch makes" });
    }
  });

  app.get("/api/nxcar/models", async (req, res) => {
    try {
      const makeId = req.query.make_id;
      if (!makeId) {
        return res.status(400).json({ error: "make_id is required" });
      }
      const response = await fetch(`https://api.nxcar.in/model?make_id=${makeId}`);
      if (!response.ok) throw new Error("Failed to fetch models");
      const data = await response.json();
      const models = (data.model || []).map((m: any) => ({
        id: parseInt(m.model_id),
        model_name: m.model,
        make_id: parseInt(makeId as string),
      }));
      res.json(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  app.get("/api/nxcar/years", async (req, res) => {
    try {
      const response = await fetch("https://api.nxcar.in/year");
      if (!response.ok) throw new Error("Failed to fetch years");
      const data = await response.json();
      const years = (data.year || []).map((y: number, index: number) => ({
        id: index + 1,
        year: y,
      }));
      res.json(years);
    } catch (error) {
      console.error("Error fetching years:", error);
      res.status(500).json({ error: "Failed to fetch years" });
    }
  });

  app.get("/api/nxcar/fuel-types", async (req, res) => {
    try {
      const response = await fetch("https://api.nxcar.in/v2/fuel-type");
      if (!response.ok) throw new Error("Failed to fetch fuel types");
      const data = await response.json();
      const fuelTypes = (data.fule_type || []).map((f: any) => ({
        id: parseInt(f.fuel_id),
        fuel_type: f.fuel_type,
      }));
      res.json(fuelTypes);
    } catch (error) {
      console.error("Error fetching fuel types:", error);
      res.status(500).json({ error: "Failed to fetch fuel types" });
    }
  });

  app.get("/api/nxcar/variants", async (req, res) => {
    try {
      const { model_id, fuel_type } = req.query;
      if (!model_id || !fuel_type) {
        return res.status(400).json({ error: "model_id and fuel_type are required" });
      }
      const response = await fetch(`https://api.nxcar.in/specific-variant?model_id=${model_id}&fuel_type=${fuel_type}`);
      if (!response.ok) throw new Error("Failed to fetch variants");
      const data = await response.json();
      const variants = (data.variant || data || []).map((v: any) => ({
        id: parseInt(v.variant_id || v.id),
        variant_name: v.variant || v.variant_name,
        model_id: parseInt(model_id as string),
      }));
      res.json(Array.isArray(variants) ? variants : []);
    } catch (error) {
      console.error("Error fetching variants:", error);
      res.status(500).json({ error: "Failed to fetch variants" });
    }
  });

  app.get("/api/nxcar/partners", async (req, res) => {
    try {
      const cityId = req.query.city_id;
      if (!cityId) {
        return res.status(400).json({ error: "city_id is required" });
      }
      const response = await fetch(`https://api.nxcar.in/partners/web-urls?fltr[][city_id]=${cityId}`);
      if (!response.ok) throw new Error("Failed to fetch partners");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ error: "Failed to fetch partners", allpartners: [] });
    }
  });

  app.get("/api/nxcar/inspection-slots", async (req, res) => {
    try {
      const response = await fetch("https://api.nxcar.in/inspection-slots");
      if (!response.ok) throw new Error("Failed to fetch inspection slots");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching inspection slots:", error);
      res.status(500).json({ status: false, data: [] });
    }
  });

  app.post("/api/nxcar/inspection-franchises", async (req, res) => {
    try {
      const { city_id } = req.body;
      if (!city_id) {
        return res.status(400).json({ error: "city_id is required" });
      }
      const response = await fetch("https://api.nxcar.in/v2/inspection-franchise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city_id }),
      });
      if (!response.ok) throw new Error("Failed to fetch inspection franchises");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching inspection franchises:", error);
      res.status(500).json({ status: false, message: "Failed to fetch franchises", data: [] });
    }
  });
}
