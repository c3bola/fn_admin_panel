import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { 
  LucideAngularModule, 
  Users, UserPlus, Zap, Monitor, Clock, ArrowUp, ArrowRight,
  Bot, ShieldAlert, Bus, ShoppingCart, WalletCards, 
  Star, Megaphone, FileText, Gift,
  MessageSquare, AlertTriangle, Heart, Image as ImageIcon,
  ChevronDown
} from 'lucide-angular';
import * as echarts from 'echarts';

@Component({
  selector: 'app-global-dashboard',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './global-dashboard.html'
})
export class GlobalDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  private chartInstance: echarts.ECharts | null = null;
  private resizeListener = () => this.chartInstance?.resize();

  readonly Users = Users;
  readonly UserPlus = UserPlus;
  readonly Zap = Zap;
  readonly Monitor = Monitor;
  readonly Clock = Clock;
  readonly ArrowUp = ArrowUp;
  readonly ArrowRight = ArrowRight;
  readonly Bot = Bot;
  readonly ShieldAlert = ShieldAlert;
  readonly Bus = Bus;
  readonly ShoppingCart = ShoppingCart;
  readonly WalletCards = WalletCards;
  readonly Star = Star;
  readonly Megaphone = Megaphone;
  readonly FileText = FileText;
  readonly Gift = Gift;
  readonly MessageSquare = MessageSquare;
  readonly AlertTriangle = AlertTriangle;
  readonly Heart = Heart;
  readonly ImageIcon = ImageIcon;
  readonly ChevronDown = ChevronDown;

  ngAfterViewInit(): void {
    this.initChart();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.chartInstance?.dispose();
  }

  private initChart(): void {
    const element = this.chartContainer.nativeElement;
    this.chartInstance = echarts.init(element);

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#160d2e',
        borderColor: '#2d1b54',
        textStyle: { color: '#ffffff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: '8%',
        containLabel: true
      },
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
          formatter: (value: any) => (value >= 1000 ? `${value / 1000}K` : `${value}`)
        }
      },
      series: [
        {
          name: 'Membros',
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          itemStyle: { color: '#a855f7' },
          lineStyle: { width: 3, color: '#a855f7' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(168, 85, 247, 0.4)' },
                { offset: 1, color: 'rgba(168, 85, 247, 0.0)' }
              ]
            }
          },
          data: [5230, 5612, 5998, 6342, 6785, 7156, 7842]
        }
      ]
    };

    this.chartInstance.setOption(option);
  }
}