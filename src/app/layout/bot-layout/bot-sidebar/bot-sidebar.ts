import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { 
  LucideAngularModule, ArrowLeft, Home, Terminal, Sparkles, Folder, 
  Grid, Swords, Vote, Settings, Mail, FileCode2,
  BarChart2, Trophy, Award, Activity
} from 'lucide-angular';

@Component({
  selector: 'app-bot-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './bot-sidebar.html'
})
export class BotSidebarComponent {
  readonly ArrowLeft = ArrowLeft;
  readonly Home = Home;
  readonly Terminal = Terminal;
  readonly Sparkles = Sparkles;
  readonly Folder = Folder;
  readonly Grid = Grid;
  readonly Swords = Swords;
  readonly Vote = Vote;
  readonly Settings = Settings;
  readonly Mail = Mail;
  readonly FileCode2 = FileCode2;
  readonly BarChart2 = BarChart2;
  readonly Trophy = Trophy;
  readonly Award = Award;
  readonly Activity = Activity;
}