"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { BarChart3, Car as CarIcon } from "lucide-react";
import * as d3 from "d3";

interface PriceMapData {
  buyerLower: number;
  buyerUpper: number;
  sellerLower: number;
  sellerUpper: number;
}

interface PriceMapProps {
  priceMap: PriceMapData;
  askingPrice: number;
  year: number;
  make: string;
  model: string;
  variant?: string;
  city?: string;
}

function formatLakh(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)}L`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
  return price.toLocaleString("en-IN");
}

function formatPriceNoSymbol(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return price.toLocaleString("en-IN");
}

const BAR_COLORS = {
  sellerLow: "#F59E0B",
  sellerHigh: "#F97316",
  buyerLow: "#10B981",
  buyerHigh: "#3B82F6",
  asking: "#8B5CF6",
};

interface BarEntry {
  label: string;
  value: number;
  color: string;
  key: string;
}

export const PriceMap = React.memo(function PriceMap({
  priceMap,
  askingPrice,
  year,
  make,
  model,
  variant,
  city,
}: PriceMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pm = priceMap;
  const fairLow = pm.buyerLower;
  const fairHigh = pm.buyerUpper;
  const fairMid = (fairLow + fairHigh) / 2;

  let priceLabel = "";
  let labelColor = "";
  if (askingPrice < fairLow) {
    priceLabel = "Below Market";
    labelColor = "text-green-600 dark:text-green-400";
  } else if (askingPrice > fairHigh) {
    priceLabel = "Above Market";
    labelColor = "text-red-500 dark:text-red-400";
  } else if (askingPrice <= fairMid) {
    priceLabel = "Good Deal";
    labelColor = "text-green-600 dark:text-green-400";
  } else {
    priceLabel = "Fair Price";
    labelColor = "text-primary";
  }

  const bars: BarEntry[] = useMemo(() => {
    const entries: BarEntry[] = [];
    if (pm.sellerLower > 0)
      entries.push({ label: "Dealer\nBuy Low", value: pm.sellerLower, color: BAR_COLORS.sellerLow, key: "sellerLow" });
    if (pm.sellerUpper > 0)
      entries.push({ label: "Dealer\nBuy High", value: pm.sellerUpper, color: BAR_COLORS.sellerHigh, key: "sellerHigh" });
    if (pm.buyerLower > 0)
      entries.push({ label: "Market\nLow", value: pm.buyerLower, color: BAR_COLORS.buyerLow, key: "buyerLow" });
    if (askingPrice > 0)
      entries.push({ label: "Asking\nPrice", value: askingPrice, color: BAR_COLORS.asking, key: "asking" });
    if (pm.buyerUpper > 0)
      entries.push({ label: "Market\nHigh", value: pm.buyerUpper, color: BAR_COLORS.buyerHigh, key: "buyerHigh" });
    return entries;
  }, [pm, askingPrice]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || bars.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const isMobile = width < 400;
    const height = isMobile ? 260 : 300;
    const margin = {
      top: 35,
      right: isMobile ? 10 : 16,
      bottom: isMobile ? 55 : 50,
      left: isMobile ? 50 : 60,
    };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(bars.map((d) => d.key))
      .range([0, chartWidth])
      .padding(0.35);

    const maxVal = Math.max(...bars.map((d) => d.value)) * 1.12;
    const y = d3.scaleLinear().domain([0, maxVal]).range([chartHeight, 0]).nice();

    const gridTicks = y.ticks(5);
    g.selectAll(".grid-line")
      .data(gridTicks)
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", chartWidth)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .style("stroke", "currentColor")
      .style("opacity", 0.07)
      .style("stroke-dasharray", "3,3");

    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `₹${formatLakh(d as number)}`)
      )
      .selectAll("text")
      .style("font-size", isMobile ? "9px" : "11px")
      .style("fill", "currentColor");

    g.selectAll(".domain").style("stroke", "currentColor").style("opacity", 0.15);
    g.selectAll(".tick line").style("stroke", "currentColor").style("opacity", 0.1);

    if (fairLow > 0 && fairHigh > 0) {
      const yFairLow = y(fairLow);
      const yFairHigh = y(fairHigh);

      g.append("rect")
        .attr("x", 0)
        .attr("y", yFairHigh)
        .attr("width", chartWidth)
        .attr("height", yFairLow - yFairHigh)
        .attr("fill", "#10B981")
        .attr("opacity", 0.06)
        .attr("rx", 4)
        .style("pointer-events", "none");

      g.append("line")
        .attr("x1", 0).attr("x2", chartWidth)
        .attr("y1", yFairLow).attr("y2", yFairLow)
        .style("stroke", "#10B981").style("stroke-width", 1)
        .style("stroke-dasharray", "4,3").style("opacity", 0.4)
        .style("pointer-events", "none");

      g.append("line")
        .attr("x1", 0).attr("x2", chartWidth)
        .attr("y1", yFairHigh).attr("y2", yFairHigh)
        .style("stroke", "#3B82F6").style("stroke-width", 1)
        .style("stroke-dasharray", "4,3").style("opacity", 0.4)
        .style("pointer-events", "none");
    }

    const tooltip = d3.select(tooltipRef.current);

    const barGroups = g
      .selectAll(".bar-group")
      .data(bars)
      .enter()
      .append("g")
      .attr("class", "bar-group");

    barGroups
      .append("rect")
      .attr("x", (d) => x(d.key)!)
      .attr("y", chartHeight)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", (d) => d.color)
      .attr("opacity", 0.88)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("opacity", 1);
        tooltip.style("visibility", "visible").html(
          `<div style="font-weight:600;margin-bottom:2px;">${d.label.replace("\n", " ")}</div>
           <div style="font-size:13px;font-weight:700;">₹${formatPriceNoSymbol(d.value)}</div>`
        );
      })
      .on("mousemove", function (event) {
        const rect = container.getBoundingClientRect();
        const tooltipEl = tooltipRef.current;
        if (!tooltipEl) return;
        const tw = tooltipEl.offsetWidth;
        let left = event.clientX - rect.left + 12;
        if (left + tw > width) left = event.clientX - rect.left - tw - 12;
        tooltip
          .style("left", `${left}px`)
          .style("top", `${event.clientY - rect.top - 10}px`);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", 0.88);
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(700)
      .delay((_, i) => i * 80)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => chartHeight - y(d.value));

    barGroups
      .append("text")
      .attr("x", (d) => (x(d.key)! + x.bandwidth() / 2))
      .attr("y", (d) => y(d.value) - 8)
      .attr("text-anchor", "middle")
      .style("font-size", isMobile ? "9px" : "10px")
      .style("font-weight", "600")
      .style("fill", (d) => d.color)
      .style("opacity", 0)
      .text((d) => `₹${formatLakh(d.value)}`)
      .transition()
      .duration(400)
      .delay((_, i) => i * 80 + 500)
      .style("opacity", 1);

    const askingBar = bars.find((b) => b.key === "asking");
    if (askingBar) {
      const cx = x(askingBar.key)! + x.bandwidth() / 2;

      g.append("text")
        .attr("x", cx)
        .attr("y", y(askingBar.value) - 24)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("opacity", 0)
        .text("🚗")
        .transition()
        .duration(400)
        .delay(800)
        .style("opacity", 1);
    }

    const xAxisG = g
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`);

    xAxisG.selectAll(".domain").remove();

    bars.forEach((d) => {
      const cx = x(d.key)! + x.bandwidth() / 2;
      const lines = d.label.split("\n");
      lines.forEach((line, li) => {
        xAxisG
          .append("text")
          .attr("x", cx)
          .attr("y", 16 + li * 13)
          .attr("text-anchor", "middle")
          .style("font-size", isMobile ? "8px" : "10px")
          .style("font-weight", li === 0 ? "600" : "400")
          .style("fill", "currentColor")
          .style("opacity", 0.7)
          .text(line);
      });
    });

  }, [bars, fairLow, fairHigh]);

  return (
    <Card data-testid="price-map-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold" data-testid="text-price-map-title">
              Price Map
            </h2>
          </div>
          <Badge
            className={`${labelColor} border-current bg-current/10 font-semibold`}
            data-testid="badge-price-label"
          >
            {priceLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Asking Price</p>
              <p className="text-lg font-bold" data-testid="text-price-map-asking">
                ₹ {formatPriceNoSymbol(askingPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Nxcar Fair Range</p>
              <p className="text-sm font-semibold text-primary" data-testid="text-price-map-fair">
                ₹{formatPriceNoSymbol(fairLow)} – ₹{formatPriceNoSymbol(fairHigh)}
              </p>
            </div>
          </div>

          <div ref={containerRef} className="relative w-full" data-testid="price-map-chart">
            <svg ref={svgRef} className="w-full text-foreground" />
            <div
              ref={tooltipRef}
              className="absolute pointer-events-none bg-popover text-popover-foreground border border-border rounded-lg shadow-lg px-3 py-2 text-xs z-50"
              style={{ visibility: "hidden" }}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CarIcon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span>
              <span className="font-medium text-foreground">Hover on bars</span> to view pricing details
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {bars.map((b) => (
              <div key={b.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: b.color }}
                />
                <span>{b.label.replace("\n", " ")}</span>
              </div>
            ))}
          </div>

          <div className="bg-muted/40 rounded-xl p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              The fair market range for{" "}
              <span className="font-medium text-foreground">
                {year} {make} {model}
              </span>{" "}
              is between{" "}
              <span className="font-medium text-foreground">
                ₹{formatPriceNoSymbol(fairLow)}
              </span>{" "}
              and{" "}
              <span className="font-medium text-foreground">
                ₹{formatPriceNoSymbol(fairHigh)}
              </span>
              . Dealers typically buy 15–20% lower to cover refurbishment and overhead.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
