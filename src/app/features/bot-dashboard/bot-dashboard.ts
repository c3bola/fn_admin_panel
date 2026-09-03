import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule, 
  MessageSquare, Users, Crosshair, Heart, Clock, 
  ArrowUp, ArrowDown, ChevronRight, Swords, Vote, Flame, Trophy, Sparkles
} from 'lucide-angular';
import * as echarts from 'echarts';

@Component({
  selector: 'app-bot-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './bot-dashboard.html'
})
export class BotDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sparkline1') sparkline1!: ElementRef;
  @ViewChild('sparkline2') sparkline2!: ElementRef;
  @ViewChild('sparkline3') sparkline3!: ElementRef;
  @ViewChild('sparkline4') sparkline4!: ElementRef;
  @ViewChild('sparkline5') sparkline5!: ElementRef;
  @ViewChild('donutChart') donutChart!: ElementRef;
  @ViewChild('barChart') barChart!: ElementRef;

  private charts: echarts.ECharts[] = [];
  private resizeListener = () => this.charts.forEach(c => c.resize());

  readonly MessageSquare = MessageSquare;
  readonly Users = Users;
  readonly Crosshair = Crosshair;
  readonly Heart = Heart;
  readonly Clock = Clock;
  readonly ArrowUp = ArrowUp;
  readonly ArrowDown = ArrowDown;
  readonly ChevronRight = ChevronRight;
  readonly Swords = Swords;
  readonly Vote = Vote;
  readonly Flame = Flame;
  readonly Trophy = Trophy;
  readonly Sparkles = Sparkles;

  ngAfterViewInit(): void {
    this.initSparklines();
    this.initDonutChart();
    this.initBarChart();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.charts.forEach(c => c.dispose());
  }

  private createSparkline(element: HTMLElement, color: string, data: number[]): void {
    const chart = echarts.init(element);
    this.charts.push(chart);
    chart.setOption({
      grid: { left: 0, right: 0, top: 0, bottom: 0 },
      xAxis: { type: 'category', show: false },
      yAxis: { type: 'value', show: false },
      series: [{
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { color, width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${color}33` },
            { offset: 1, color: `${color}00` }
          ])
        },
        data
      }]
    });
  }

  private initSparklines(): void {
    this.createSparkline(this.sparkline1.nativeElement, '#a855f7', [12, 14, 13, 16, 15, 17, 19]);
    this.createSparkline(this.sparkline2.nativeElement, '#3b82f6', [3.8, 4.0, 4.2, 4.1, 4.5, 4.6, 4.8]);
    this.createSparkline(this.sparkline3.nativeElement, '#06b6d4', [1.8, 1.9, 2.1, 2.0, 2.2, 2.1, 2.3]);
    this.createSparkline(this.sparkline4.nativeElement, '#ec4899', [6.2, 6.8, 7.1, 7.5, 7.9, 8.2, 8.7]);
    this.createSparkline(this.sparkline5.nativeElement, '#10b981', [0.9, 0.85, 0.8, 0.78, 0.72, 0.7, 0.68]);
  }

  private initDonutChart(): void {
    const chart = echarts.init(this.donutChart.nativeElement);
    this.charts.push(chart);
    chart.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: '#160d2e',
        borderColor: '#2d1b54',
        textStyle: { color: '#ffffff' }
      },
      series: [
        {
          name: 'Comandos',
          type: 'pie',
          radius: ['60%', '85%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#0c0817',
            borderWidth: 3
          },
          label: { show: false },
          data: [
            { value: 4384, name: '/loveme', itemStyle: { color: '#a855f7' } },
            { value: 3287, name: '/tryhardme', itemStyle: { color: '#3b82f6' } },
            { value: 2819, name: '/bananame', itemStyle: { color: '#f59e0b' } },
            { value: 2506, name: '/elementais', itemStyle: { color: '#06b6d4' } },
            { value: 1874, name: '/coleção', itemStyle: { color: '#ec4899' } },
            { value: 800, name: 'Outros', itemStyle: { color: '#6366f1' } }
          ]
        }
      ]
    });
  }

  private initBarChart(): void {
    const chart = echarts.init(this.barChart.nativeElement);
    this.charts.push(chart);
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#160d2e',
        borderColor: '#2d1b54',
        textStyle: { color: '#ffffff' }
      },
      grid: { left: '3%', right: '3%', bottom: '8%', top: '8%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['22 Mai', '23 Mai', '24 Mai', '25 Mai', '26 Mai', '27 Mai', '28 Mai'],
        axisLine: { lineStyle: { color: '#374151' } },
        axisLabel: { color: '#9ca3af', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#1f2937', type: 'dashed' } },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 11,
          formatter: (v: number) => (v >= 1000 ? `${v / 1000}K` : `${v}`)
        }
      },
      series: [
        { name: 'LoveMe', type: 'bar', barWidth: 8, itemStyle: { color: '#a855f7', borderRadius: [3, 3, 0, 0] }, data: [1950, 1850, 1750, 1980, 1600, 1720, 2100] },
        { name: 'TryHardMe', type: 'bar', barWidth: 8, itemStyle: { color: '#3b82f6', borderRadius: [3, 3, 0, 0] }, data: [1400, 1300, 1250, 1380, 1200, 1280, 1420] },
        { name: 'BananaMe', type: 'bar', barWidth: 8, itemStyle: { color: '#f59e0b', borderRadius: [3, 3, 0, 0] }, data: [1100, 950, 890, 1050, 800, 900, 1150] },
        { name: 'Elementais', type: 'bar', barWidth: 8, itemStyle: { color: '#06b6d4', borderRadius: [3, 3, 0, 0] }, data: [850, 720, 680, 820, 650, 700, 900] },
        { name: 'Coleção', type: 'bar', barWidth: 8, itemStyle: { color: '#ec4899', borderRadius: [3, 3, 0, 0] }, data: [600, 520, 480, 590, 450, 490, 680] }
      ]
    });
  }
}