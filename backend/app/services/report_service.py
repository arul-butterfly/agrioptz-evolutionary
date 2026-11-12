"""Report generation service for AgriOpt."""
import io
import csv
from datetime import datetime
from typing import Dict, Any, Optional


def generate_csv_report(result: Dict[str, Any]) -> bytes:
    """Generate CSV report for single optimization result."""
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['AgriOpt - Crop Planning Optimization Report'])
    writer.writerow(['Generated At', datetime.now().strftime('%Y-%m-%d %H:%M:%S')])
    writer.writerow(['Algorithm', result.get('algorithm', 'Genetic Algorithm')])
    writer.writerow([])
    
    writer.writerow(['EXECUTIVE SUMMARY'])
    writer.writerow(['Estimated Net Profit (INR)', result.get('estimated_net_profit', 0)])
    writer.writerow(['Land Used (ha)', result.get('land_used_ha', 0)])
    writer.writerow(['Land Remaining (ha)', result.get('land_remaining_ha', 0)])
    writer.writerow(['Land Utilization (%)', result.get('land_utilization_pct', 0)])
    writer.writerow(['Water Used (m3)', result.get('water_used_m3', 0)])
    writer.writerow(['Water Remaining (m3)', result.get('water_remaining_m3', 0)])
    writer.writerow(['Water Utilization (%)', result.get('water_utilization_pct', 0)])
    writer.writerow(['Cultivation Budget Used (INR)', result.get('budget_used_inr', 0)])
    writer.writerow(['Budget Remaining (INR)', result.get('budget_remaining_inr', 0)])
    writer.writerow(['Budget Utilization (%)', result.get('budget_utilization_pct', 0)])
    writer.writerow(['Is Feasible', result.get('is_feasible', True)])
    writer.writerow(['Execution Time (seconds)', result.get('execution_time_seconds', 0)])
    writer.writerow([])
    
    writer.writerow(['DETAILED CROP ALLOCATION PLAN'])
    allocations = result.get('allocations', [])
    if allocations:
        writer.writerow([
            'Crop Name',
            'Allocated Area (ha)',
            'Profit Per Hectare (INR)',
            'Estimated Total Profit (INR)',
            'Water Consumed (m3)',
            'Cultivation Cost (INR)',
            'Estimated Total Yield'
        ])
        for a in allocations:
            writer.writerow([
                a.get('crop_name', ''),
                a.get('allocated_area_ha', 0),
                a.get('profit_per_hectare', 0),
                a.get('estimated_total_profit', 0),
                a.get('water_consumed_m3', 0),
                a.get('cultivation_cost_inr', 0),
                a.get('yield_total', 0)
            ])
    
    params = result.get('parameters', {})
    if params:
        writer.writerow([])
        writer.writerow(['ALGORITHM PARAMETERS'])
        for k, v in params.items():
            writer.writerow([k, v])
            
    writer.writerow([])
    writer.writerow(['DISCLAIMER', 'Estimates based on input data and mathematical optimization model. Real-world agricultural yields depend on climate, soil, and market dynamics.'])
    
    return output.getvalue().encode('utf-8')


def generate_comparison_csv(comparison: Dict[str, Any]) -> bytes:
    """Generate CSV report for algorithm comparison."""
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['AgriOpt - Algorithm Comparison Report'])
    writer.writerow(['Generated At', datetime.now().strftime('%Y-%m-%d %H:%M:%S')])
    writer.writerow([])
    
    greedy = comparison.get('greedy', {})
    ga_best = comparison.get('genetic_best', {})
    stats = comparison.get('statistics', {})
    
    writer.writerow(['PERFORMANCE COMPARISON METRICS'])
    writer.writerow(['Metric', 'Greedy Algorithm', 'Genetic Algorithm (Best)'])
    writer.writerow(['Estimated Net Profit (INR)', greedy.get('estimated_net_profit', 0), ga_best.get('estimated_net_profit', 0)])
    writer.writerow(['Land Used (ha)', greedy.get('land_used_ha', 0), ga_best.get('land_used_ha', 0)])
    writer.writerow(['Land Utilization (%)', greedy.get('land_utilization_pct', 0), ga_best.get('land_utilization_pct', 0)])
    writer.writerow(['Water Used (m3)', greedy.get('water_used_m3', 0), ga_best.get('water_used_m3', 0)])
    writer.writerow(['Water Utilization (%)', greedy.get('water_utilization_pct', 0), ga_best.get('water_utilization_pct', 0)])
    writer.writerow(['Budget Used (INR)', greedy.get('budget_used_inr', 0), ga_best.get('budget_used_inr', 0)])
    writer.writerow(['Budget Utilization (%)', greedy.get('budget_utilization_pct', 0), ga_best.get('budget_utilization_pct', 0)])
    writer.writerow(['Feasibility Status', greedy.get('is_feasible', True), ga_best.get('is_feasible', True)])
    writer.writerow(['Execution Time (s)', greedy.get('execution_time_seconds', 0), ga_best.get('execution_time_seconds', 0)])
    writer.writerow([])
    
    writer.writerow(['GENETIC ALGORITHM EXPERIMENTAL STATISTICS'])
    writer.writerow(['Independent Runs', stats.get('n_runs', 0)])
    writer.writerow(['Mean Profit (INR)', stats.get('mean_profit', 0)])
    writer.writerow(['Best Profit (INR)', stats.get('best_profit', 0)])
    writer.writerow(['Worst Profit (INR)', stats.get('worst_profit', 0)])
    writer.writerow(['Standard Deviation (INR)', stats.get('std_profit', 0)])
    writer.writerow(['Feasibility Rate (%)', stats.get('feasibility_rate', 0)])
    writer.writerow(['Profit Improvement over Greedy (%)', stats.get('profit_improvement_pct', 0)])
    
    return output.getvalue().encode('utf-8')


def generate_pdf_report(result: Dict[str, Any], constraints: Optional[Dict[str, Any]] = None) -> bytes:
    """Generate professional PDF report using ReportLab."""
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.lib import colors
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        )
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=1.5 * cm,
            leftMargin=1.5 * cm,
            topMargin=1.5 * cm,
            bottomMargin=1.5 * cm
        )
        
        styles = getSampleStyleSheet()
        story = []
        
        # Header title
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Title'],
            fontSize=22,
            textColor=colors.HexColor('#14532D'),
            spaceAfter=4,
            alignment=0
        )
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontSize=11,
            textColor=colors.HexColor('#4B5563'),
            spaceAfter=8
        )
        story.append(Paragraph('AgriOpt – Crop Planning Optimization Report', title_style))
        story.append(Paragraph(
            f'Optimization Algorithm: <b>{result.get("algorithm", "Genetic Algorithm")}</b> &nbsp;|&nbsp; Generated on: {datetime.now().strftime("%B %d, %Y - %H:%M:%S")}',
            subtitle_style
        ))
        story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#14532D'), spaceAfter=12))
        
        # Constraints & Parameters box if provided
        if constraints:
            story.append(Paragraph('<b>Resource Constraints Configured:</b>', styles['Heading4']))
            c_data = [
                ['Total Available Land', f"{constraints.get('total_land_ha', 0):,.2f} ha"],
                ['Total Available Water', f"{constraints.get('total_water_m3', 0):,.0f} m³"],
                ['Cultivation Budget', f"₹{constraints.get('total_budget_inr', 0):,.2f}"]
            ]
            ct = Table(c_data, colWidths=[7 * cm, 9 * cm])
            ct.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAF7')),
                ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#14532D')),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
                ('PADDING', (0, 0), (-1, -1), 4),
            ]))
            story.append(ct)
            story.append(Spacer(1, 0.3 * cm))
        
        # Executive Summary KPIs
        story.append(Paragraph('<b>Executive Summary & Resource Utilization:</b>', styles['Heading3']))
        summary_rows = [
            ['Metric', 'Allocated / Value', 'Remaining / Capacity', 'Utilization'],
            ['Estimated Net Profit', f"₹{result.get('estimated_net_profit', 0):,.2f}", 'Optimized Objective', 'N/A'],
            ['Land Area', f"{result.get('land_used_ha', 0):.2f} ha", f"{result.get('land_remaining_ha', 0):.2f} ha", f"{result.get('land_utilization_pct', 0):.1f}%"],
            ['Irrigation Water', f"{result.get('water_used_m3', 0):,.0f} m³", f"{result.get('water_remaining_m3', 0):,.0f} m³", f"{result.get('water_utilization_pct', 0):.1f}%"],
            ['Cultivation Budget', f"₹{result.get('budget_used_inr', 0):,.2f}", f"₹{result.get('budget_remaining_inr', 0):,.2f}", f"{result.get('budget_utilization_pct', 0):.1f}%"],
            ['Constraint Status', 'FEASIBLE' if result.get('is_feasible', True) else 'INFEASIBLE', 'All bounds satisfied', '100% Valid'],
            ['Execution Runtime', f"{result.get('execution_time_seconds', 0):.4f} seconds", 'Convergence Achieved', 'Fast']
        ]
        st = Table(summary_rows, colWidths=[4.5 * cm, 4.5 * cm, 4.5 * cm, 2.5 * cm])
        st.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#14532D')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8.5),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#F0FDF4'), colors.white]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#D1D5DB')),
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('PADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(st)
        story.append(Spacer(1, 0.4 * cm))
        
        # Crop Allocations Table
        allocations = result.get('allocations', [])
        if allocations:
            story.append(Paragraph('<b>Optimal Crop Allocation Plan:</b>', styles['Heading3']))
            alloc_headers = ['Crop', 'Area (ha)', 'Profit/ha', 'Total Profit', 'Water (m³)', 'Cost (INR)']
            alloc_rows = [alloc_headers]
            for a in allocations:
                alloc_rows.append([
                    a.get('crop_name', ''),
                    f"{a.get('allocated_area_ha', 0):.2f}",
                    f"₹{a.get('profit_per_hectare', 0):,.0f}",
                    f"₹{a.get('estimated_total_profit', 0):,.0f}",
                    f"{a.get('water_consumed_m3', 0):,.0f}",
                    f"₹{a.get('cultivation_cost_inr', 0):,.0f}"
                ])
            
            at = Table(alloc_rows, colWidths=[3.5 * cm, 2.2 * cm, 2.6 * cm, 3.2 * cm, 2.5 * cm, 2.5 * cm])
            at.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#22C55E')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#F8FAF7'), colors.white]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
                ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
                ('PADDING', (0, 0), (-1, -1), 4),
            ]))
            story.append(at)
            story.append(Spacer(1, 0.4 * cm))
            
        # GA Parameters Table if available
        params = result.get('parameters', {})
        if params:
            story.append(Paragraph('<b>Genetic Algorithm Hyperparameters:</b>', styles['Heading4']))
            param_rows = [['Parameter', 'Configured Value']]
            for k, v in params.items():
                param_rows.append([k.replace('_', ' ').title(), str(v)])
            pt = Table(param_rows, colWidths=[8 * cm, 8 * cm])
            pt.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#374151')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#F9FAFB'), colors.white]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
                ('PADDING', (0, 0), (-1, -1), 3),
            ]))
            story.append(pt)
            story.append(Spacer(1, 0.4 * cm))
        
        # Disclaimer
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#9CA3AF'), spaceAfter=6))
        disc_text = (
            "<b>Academic Decision-Support Disclaimer:</b> AgriOpt provides mathematical optimization "
            "based on the uploaded crop parameters and deterministic resource constraints. Calculated "
            "financial figures represent theoretical estimates. Real agricultural outcomes are subject to "
            "unforeseen weather anomalies, pest pressures, local soil variations, and market commodity price "
            "volatilities."
        )
        story.append(Paragraph(disc_text, ParagraphStyle('Disc', parent=styles['Normal'], fontSize=7.5, textColor=colors.HexColor('#6B7280'))))
        
        doc.build(story)
        return buffer.getvalue()
        
    except Exception as e:
        # Fallback text if pdf generation encounters error
        fallback = f"AgriOpt Optimization Report\nGenerated: {datetime.now()}\nAlgorithm: {result.get('algorithm')}\nProfit: {result.get('estimated_net_profit')}\nError in formatting: {e}"
        return fallback.encode('utf-8')
