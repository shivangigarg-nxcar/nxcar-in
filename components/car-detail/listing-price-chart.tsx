"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { Car, Loader2, X, ArrowLeft } from "lucide-react";
import { useCarChartData } from "@hooks/use-car-chart-data";

const BAR_COLORS = ["#D2E8FF", "#EAF3FF", "#EAF7FF", "#DDEDFF", "#E9EBFF"];

function buildTooltipContent(el: HTMLElement, car: { price: number; region?: string; distance?: number; mileage?: number; Transmission?: string; Fuel_type?: string }) {
  el.textContent = "";
  const container = document.createElement("div");
  container.style.cssText = "font-size:12px;line-height:1.6;color:#4A4A4C";
  const lines = [
    ["Price", `${(car.price / 100000).toFixed(1)}L`],
    ["Region", car.region || ""],
    ["Distance", `${Math.floor((car.distance || car.mileage || 0) / 1000).toLocaleString()}K km`],
    ["Transmission", car.Transmission || ""],
    ["Fuel", car.Fuel_type || ""],
  ];
  lines.forEach(([label, value]) => {
    const row = document.createElement("div");
    const b = document.createElement("b");
    b.textContent = `${label}: `;
    row.appendChild(b);
    row.appendChild(document.createTextNode(String(value)));
    container.appendChild(row);
  });
  el.appendChild(container);
}

interface ListingPriceChartProps {
  vehicleId: string;
  city: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  mileage: number;
}

export function ListingPriceChart(props: ListingPriceChartProps) {
  const {
    filteredRegion,
    regions,
    carData,
    loading,
    error,
    yearlyData,
    myCarData,
    overallTotalCount,
    handleToggleButton,
    cityWiseCount,
  } = useCarChartData(props);

  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [detailYear, setDetailYear] = useState<string | null>(null);

  const cityColors = React.useMemo(() => {
    const colors: Record<string, string> = {};
    Object.values(carData).forEach((yearData: any) => {
      yearData.cars?.forEach((car: any) => {
        if (car.region && car.Color) colors[car.region] = car.Color;
      });
    });
    return colors;
  }, [carData]);

  const visibleCities = React.useMemo(() => {
    const entries = Object.entries(cityColors);
    if (entries.length > 9) {
      const colored = entries.filter(([, c]) => c !== "#FFECB5" && c !== "rgb(128, 128, 128)");
      return colored.length > 9
        ? [...colored.slice(0, 9), ["Others", "#FFECB5"] as [string, string]]
        : colored;
    }
    return entries.slice(0, 9);
  }, [cityColors]);

  const getFilteredData = useCallback(
    (data: any, region: string, city: string) => {
      if (!data) return {};
      const processed: Record<string, any> = {};
      const normalizedCity = city?.toLowerCase();

      Object.entries(data).forEach(([year, yearData]: any) => {
        const filteredCars =
          region === "All"
            ? yearData.cars
            : yearData.cars.filter((car: any) => car.region.toLowerCase() === normalizedCity);

        processed[year] = { ...yearData, cars: filteredCars };
      });
      return processed;
    },
    []
  );

  useEffect(() => {
    if (!svgRef.current || !carData || Object.keys(carData).length === 0) return;
    if (detailYear) return;

    const filteredCarData = getFilteredData(carData, filteredRegion, filteredRegion);
    const allYearsSet = new Set(Object.keys(filteredCarData));
    if (myCarData?.year) allYearsSet.add(myCarData.year.toString());
    const allYears = Array.from(allYearsSet).sort();

    const filteredYearlyData = allYears.map((year) => {
      const yearData = filteredCarData[year] || { cars: [] };
      let maxPrice = Math.max(...(yearData.cars?.map((c: any) => c.price) || []), 0);
      if (myCarData && myCarData.year.toString() === year) {
        maxPrice = Math.max(maxPrice, myCarData.price);
      }
      return { year, maxPrice, cars: yearData.cars || [] };
    });

    d3.select(svgRef.current).selectAll("*").remove();

    const containerWidth = containerRef.current?.getBoundingClientRect().width || 700;
    const isMobile = containerWidth < 500;
    const isTablet = containerWidth < 700;

    const width = isMobile ? 320 : isTablet ? 500 : 682;
    const height = isMobile ? 200 : isTablet ? 220 : 245;
    const margin = {
      top: isMobile ? 15 : 20,
      right: isMobile ? 10 : 20,
      bottom: isMobile ? 40 : 50,
      left: isMobile ? 60 : 70,
    };

    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, width]).padding(0.1).domain(allYears);
    const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(filteredYearlyData, (d) => d.maxPrice) || 0]);

    const bars = svg
      .selectAll(".bar")
      .data(filteredYearlyData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.year) || 0)
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.maxPrice))
      .attr("height", (d) => height - y(d.maxPrice))
      .style("fill", (_, i) => BAR_COLORS[i % BAR_COLORS.length])
      .style("cursor", "pointer")
      .style("rx", "2");

    svg
      .append("g")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""))
      .style("stroke-opacity", "0.1")
      .select(".domain")
      .remove();

    const yAxis = svg
      .append("g")
      .call(d3.axisLeft(y).tickFormat((d) => `${(Number(d) / 100000).toFixed(1)}L`))
      .style("color", "#6A717D");
    yAxis.select(".domain").remove();
    yAxis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 25)
      .attr("x", -(height / 2) + 5)
      .attr("fill", "#585A5A")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "400")
      .style("font-family", "Noto Sans, sans-serif")
      .text("Price ( In ₹ )");

    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style("color", "#6A717D");
    xAxis.selectAll("text").style("font-size", isMobile ? "6.5px" : "12px");
    xAxis.select(".domain").remove();
    xAxis
      .append("text")
      .attr("x", width / 2)
      .attr("y", isMobile ? 35 : 45)
      .attr("font-size", "12px")
      .attr("fill", "#585A5A")
      .attr("text-anchor", "middle")
      .text("Year (With Distance Spread 0-150K Km)");

    const dotR = isMobile ? 3 : isTablet ? 4 : 5;

    Object.entries(filteredCarData).forEach(([year, yearData]: any) => {
      const filteredCars = yearData.cars.filter((car: any) => {
        if (myCarData && car.price === myCarData.price && (car.distance === myCarData.mileage || car.mileage === myCarData.mileage)) return false;
        return true;
      });

      svg
        .selectAll(`.dp-${year}`)
        .data(filteredCars)
        .enter()
        .append("circle")
        .attr("cx", (d: any) => {
          const barX = x(d.year);
          if (barX === undefined) return 0;
          const dist = Math.min(Math.max(d.mileage || d.distance || 0, 0), 150000);
          return barX + x.bandwidth() * (dist / 150000);
        })
        .attr("cy", (d: any) => y(d.price))
        .attr("r", dotR)
        .attr("fill", (d: any) => d.Color || "#999")
        .style("cursor", "pointer")
        .on("mouseover", function (event: any, d: any) {
          d3.select(this).attr("r", dotR * 1.5);
          if (!tooltipRef.current) return;
          const tooltip = d3.select(tooltipRef.current);
          const cx = event.clientX;
          const cy = event.clientY;
          const onLeft = cx + 200 > window.innerWidth;
          tooltip
            .style("visibility", "visible")
            .style("opacity", "1")
            .style("left", `${onLeft ? cx - 210 : cx + 10}px`)
            .style("top", `${cy - 50}px`);
          buildTooltipContent(tooltipRef.current!, d);
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", dotR);
          if (tooltipRef.current) {
            d3.select(tooltipRef.current).style("visibility", "hidden").style("opacity", "0");
          }
        });
    });

    if (myCarData) {
      const barX = x(myCarData.year.toString());
      if (barX !== undefined) {
        const dist = Math.min(Math.max(myCarData.mileage || 0, 0), 150000);
        const xPos = barX + x.bandwidth() * (dist / 150000);
        const yPos = y(myCarData.price);
        const carIcon = svg.append("g").attr("transform", `translate(${xPos}, ${yPos})`).style("cursor", "pointer");
        const cr = isMobile ? 10 : 25;
        carIcon
          .append("circle")
          .attr("r", cr)
          .attr("fill", "#4AA09B")
          .style("opacity", 0.5)
          .style("filter", "drop-shadow(0 0 8px #41CFC7)");
        const cs = isMobile ? 0.02 : 0.05;
        carIcon
          .append("path")
          .attr(
            "d",
            "M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"
          )
          .attr("fill", "none")
          .attr("stroke", "#FFFFFF")
          .attr("stroke-width", "20")
          .attr("transform", `scale(${cs}) translate(-250, -240)`)
          .style("filter", "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))");
      }
    }

    bars.on("click", (_, d) => setDetailYear(d.year));

    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [carData, filteredRegion, myCarData, yearlyData, props.city, getFilteredData, detailYear]);

  if (error || (!loading && overallTotalCount < 5)) return null;

  return (
    <div ref={containerRef} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6" data-testid="section-listing-price-chart">
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800" data-testid="text-chart-title">
              Listing Price Map {props.model} {props.variant}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {regions.slice(0, 6).map((r) => (
                <button
                  key={r}
                  onClick={() => handleToggleButton(r)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    filteredRegion === r
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-slate-600 border-slate-300 hover:border-teal-400"
                  }`}
                  data-testid={`button-region-${r.toLowerCase()}`}
                >
                  {r === "All" ? "All" : r}
                  {r !== "All" && cityWiseCount[r] ? ` (${cityWiseCount[r]})` : ""}
                </button>
              ))}
            </div>
          </div>

          <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />

          {filteredRegion === "All" && visibleCities.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 px-2">
              {visibleCities.map(([city, color]) => (
                <div key={city} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-600">{city}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-3 px-2">
            <p className="text-xs text-slate-500">
              Please <span className="text-teal-600 font-medium cursor-pointer">click on the bar</span> for which you want to view the pricing.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Car className="w-4 h-4 text-teal-600" />
              Chosen Car
            </div>
          </div>
        </>
      )}

      <div
        ref={tooltipRef}
        className="fixed z-[9999] pointer-events-none bg-gradient-to-br from-[#B8FFF2] to-[#E0FFFA] rounded-2xl px-3 py-2 shadow-lg"
        style={{ visibility: "hidden", opacity: 0, transition: "opacity 0.2s" }}
      />

      {detailYear && (
        <DetailedYearView
          year={detailYear}
          carData={carData}
          filteredRegion={filteredRegion}
          city={props.city}
          myCarData={myCarData}
          yearlyData={yearlyData}
          model={props.model}
          variant={props.variant}
          onClose={() => setDetailYear(null)}
        />
      )}
    </div>
  );
}

function DetailedYearView({
  year,
  carData,
  filteredRegion,
  city,
  myCarData,
  yearlyData,
  model,
  variant,
  onClose,
}: {
  year: string;
  carData: any;
  filteredRegion: string;
  city: string;
  myCarData: any;
  yearlyData: any[];
  model: string;
  variant: string;
  onClose: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    let yearCars =
      filteredRegion === "All"
        ? [...(carData[year]?.cars || [])]
        : (carData[year]?.cars || []).filter((c: any) => c.region.toLowerCase() === filteredRegion.toLowerCase());

    if (myCarData && myCarData.year.toString() === year) {
      yearCars.push({ ...myCarData, _isMyCar: true });
    }

    if (yearCars.length === 0) {
      onClose();
      return;
    }

    d3.select(svgRef.current).selectAll("*").remove();

    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth <= 768;
    const innerWidth = isMobile ? 260 : isTablet ? 480 : 640;
    const innerHeight = isMobile ? 160 : isTablet ? 170 : 180;
    const margin = {
      top: isMobile ? 15 : 20,
      right: isMobile ? 20 : 40,
      bottom: isMobile ? 50 : 60,
      left: isMobile ? 55 : 70,
    };

    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", innerHeight + margin.top + margin.bottom)
      .attr("viewBox", `0 0 ${innerWidth + margin.left + margin.right} ${innerHeight + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, 150000]).range([0, innerWidth]);
    const minP = Math.min(...yearCars.map((c: any) => c.price));
    const maxP = Math.max(...yearCars.map((c: any) => c.price));
    const range = maxP - minP;
    const yScale = d3
      .scaleLinear()
      .domain([Math.max(minP - range * 0.9, 0), maxP + range * 0.2])
      .range([innerHeight, 0]);

    const yearIndex = yearlyData.findIndex((yd) => yd.year === year);
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", BAR_COLORS[yearIndex % BAR_COLORS.length])
      .attr("opacity", 0.3);

    svg
      .append("g")
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ""))
      .style("stroke-opacity", "0.1")
      .select(".domain")
      .remove();

    const yAxis = svg
      .append("g")
      .call(d3.axisLeft(yScale).tickFormat((d) => `${(Number(d) / 100000).toFixed(1)}L`))
      .style("color", "#4A4A4C");
    yAxis.select(".domain").remove();
    yAxis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", isMobile ? -45 : -55)
      .attr("x", -(innerHeight / 2))
      .attr("dy", "1em")
      .attr("fill", "#585A5A")
      .attr("font-size", isMobile ? "11px" : "13px")
      .attr("text-anchor", "middle")
      .text("Price (in ₹)");

    const xAxisG = svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => (Number(d) >= 1000 ? `${Number(d) / 1000}K` : `${d}`)))
      .style("color", "#6A717D");
    xAxisG.select(".domain").remove();
    xAxisG
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", isMobile ? 30 : 40)
      .attr("fill", "#585A5A")
      .attr("font-size", isMobile ? "10px" : "12px")
      .attr("text-anchor", "middle")
      .text(`${year} (Distance Travelled in km)`);

    yearCars.forEach((car: any) => {
      const isMyCar = car._isMyCar;
      if (!isMyCar && myCarData && car.price === myCarData.price && (car.distance === myCarData.mileage || car.mileage === myCarData.mileage)) return;

      const dist = Math.min(Math.max(car.mileage || car.distance || 0, 0), 150000);
      const cx = xScale(dist);
      const cy = yScale(car.price);
      const carScale = isMobile ? 0.02 : 0.04;

      const g = svg.append("g").attr("transform", `translate(${cx}, ${cy})`).style("cursor", "pointer");

      if (isMyCar) {
        g.append("circle")
          .attr("r", isMobile ? 14 : 22)
          .attr("fill", "#4AA09B")
          .style("opacity", 0.6)
          .style("filter", "drop-shadow(0 0 8px #41CFC7)");
        g.append("path")
          .attr(
            "d",
            "M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"
          )
          .attr("fill", "none")
          .attr("stroke", "#FFFFFF")
          .attr("stroke-width", "20")
          .attr("transform", `scale(${carScale}) translate(-250, -240)`)
          .style("filter", "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))");
      } else {
        g.append("path")
          .attr(
            "d",
            "M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"
          )
          .attr("fill", car.Color || "#999")
          .attr("transform", `scale(${carScale}) translate(-250, -240)`)
          .style("filter", "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))");

        g.on("mouseover", function (event: any) {
          d3.select(this)
            .select("path")
            .transition()
            .duration(200)
            .attr("transform", `scale(${carScale * 1.3}) translate(-250, -240)`);
          if (!tooltipRef.current) return;
          const tooltip = d3.select(tooltipRef.current);
          const cx = event.clientX;
          const cy = event.clientY;
          tooltip
            .style("visibility", "visible")
            .style("opacity", "1")
            .style("left", `${cx + 10}px`)
            .style("top", `${cy - 50}px`);
          buildTooltipContent(tooltipRef.current!, car);
        }).on("mouseout", function () {
          d3.select(this)
            .select("path")
            .transition()
            .duration(200)
            .attr("transform", `scale(${carScale}) translate(-250, -240)`);
          if (tooltipRef.current) {
            d3.select(tooltipRef.current).style("visibility", "hidden").style("opacity", "0");
          }
        });
      }
    });

    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [year, carData, filteredRegion, city, myCarData, yearlyData, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid="detail-year-view">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-gradient-to-r from-[#EAFFFE] to-white rounded-2xl p-4 sm:p-6 mx-4 max-w-[800px] w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-3"
          data-testid="button-back-all-years"
        >
          <ArrowLeft className="w-4 h-4" />
          All Years
        </button>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-3">
          Listing Price Map {model} {variant}
        </h3>

        <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />

        <div
          ref={tooltipRef}
          className="fixed z-[99999] pointer-events-none bg-gradient-to-br from-[#B8FFF2] to-[#E0FFFA] rounded-2xl px-3 py-2 shadow-lg"
          style={{ visibility: "hidden", opacity: 0, transition: "opacity 0.2s" }}
        />
      </div>
    </div>
  );
}
