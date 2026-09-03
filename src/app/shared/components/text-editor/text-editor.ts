import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, X, Save, Bold, Italic, Underline, 
  Strikethrough, Link2, Code, Keyboard, Image as ImageIcon, Variable 
} from 'lucide-angular';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-[#130d24] border border-gray-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden">
          
          <!-- Cabeçalho -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-800/60 bg-[#0c0817]">
            <h3 class="text-sm font-bold text-white">{{ title }}</h3>
            <button (click)="closeEditor()" class="text-gray-500 hover:text-white transition-colors">
              <lucide-icon [img]="X" class="h-5 w-5"></lucide-icon>
            </button>
          </div>

          <!-- Barra de Ferramentas (Toolbar Telegram) -->
          <div class="flex items-center gap-1 px-4 py-2 bg-[#1a1333] border-b border-gray-800/60 overflow-x-auto custom-scrollbar">
            <button (click)="formatText('<b>', '</b>')" title="Negrito" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"><lucide-icon [img]="Bold" class="h-4 w-4"></lucide-icon></button>
            <button (click)="formatText('<i>', '</i>')" title="Itálico" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"><lucide-icon [img]="Italic" class="h-4 w-4"></lucide-icon></button>
            <button (click)="formatText('<u>', '</u>')" title="Sublinhado" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"><lucide-icon [img]="Underline" class="h-4 w-4"></lucide-icon></button>
            <button (click)="formatText('<s>', '</s>')" title="Tachado" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"><lucide-icon [img]="Strikethrough" class="h-4 w-4"></lucide-icon></button>
            
            <div class="w-px h-5 bg-gray-700 mx-1"></div>
            
            <button (click)="insertLink()" title="Inserir Link" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"><lucide-icon [img]="Link2" class="h-4 w-4"></lucide-icon></button>
            <button (click)="formatText('<code>', '</code>')" title="Código Monoespaçado" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"><lucide-icon [img]="Code" class="h-4 w-4"></lucide-icon></button>
            
            <div class="w-px h-5 bg-gray-700 mx-1"></div>
            
            <!-- Inserir Botões Inline -->
            <button (click)="insertInlineButton()" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded transition-colors border border-purple-500/30">
              <lucide-icon [img]="Keyboard" class="h-4 w-4"></lucide-icon> Add Botões
            </button>

            <!-- Input de Arquivo Oculto e Botão de Anexo -->
            <input type="file" #fileInput hidden accept="image/*" (change)="onFileSelected($event)">
            <button (click)="fileInput.click()" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors ml-2">
              <lucide-icon [img]="ImageIcon" class="h-4 w-4"></lucide-icon> Anexar Imagem
            </button>

            <div class="flex-1 text-right text-[10px] text-gray-500 font-mono pr-2">
              HTML Parse Mode
            </div>
          </div>

          <!-- Preview de Imagem (Se existir) -->
          @if (attachedImage) {
            <div class="px-6 pt-4 bg-[#06040e]">
              <div class="relative inline-block border border-gray-800 rounded-lg overflow-hidden group">
                <img [src]="attachedImage" class="h-32 w-auto object-cover">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button (click)="removeImage()" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg">
                    <lucide-icon [img]="X" class="h-4 w-4"></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- Área de Texto com Menu Flutuante -->
          <div class="p-6 bg-[#06040e] relative">
            
            <textarea 
              #editorTextarea
              [(ngModel)]="content" 
              (keyup)="checkVariables()"
              (click)="checkVariables()"
              rows="10" 
              class="w-full bg-transparent border-none text-sm text-gray-300 focus:outline-none focus:ring-0 resize-none custom-scrollbar font-mono leading-relaxed"
              placeholder="Digite a mensagem aqui... Use {{ '{' }}{{ '{' }} para ver as variáveis disponíveis."></textarea>

            <!-- Menu de Variáveis Flutuante -->
            @if (showVariablesMenu) {
              <div class="absolute bottom-6 left-6 w-64 bg-[#1a1333] border border-purple-500/50 rounded-xl shadow-2xl shadow-purple-900/20 overflow-hidden z-50">
                <div class="bg-purple-600/20 px-3 py-2 border-b border-purple-500/30 flex items-center gap-2">
                  <lucide-icon [img]="Variable" class="h-3.5 w-3.5 text-purple-400"></lucide-icon>
                  <span class="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Variáveis Disponíveis</span>
                </div>
                <div class="max-h-48 overflow-y-auto custom-scrollbar">
                  @for (v of filteredVariables; track v.key) {
                    <button 
                      (click)="insertVariable(v.key)"
                      class="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors border-b border-gray-800/50 last:border-0 flex flex-col">
                      <span class="text-xs font-bold text-white">{{ '{' }}{{ '{' }}{{ v.key }}{{ '}' }}{{ '}' }}</span>
                      <span class="text-[10px] text-gray-400">{{ v.desc }}</span>
                    </button>
                  }
                  @if (filteredVariables.length === 0) {
                    <div class="px-3 py-4 text-center text-xs text-gray-500">Nenhuma variável encontrada.</div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Rodapé / Ações -->
          <div class="px-6 py-4 border-t border-gray-800/60 flex justify-between items-center bg-[#0c0817]">
            <span class="text-[10px] text-gray-500">Dica: Digite <strong class="text-purple-400">{{ '{' }}{{ '{' }}</strong> para inserir variáveis dinâmicas.</span>
            <div class="flex gap-3">
              <button (click)="closeEditor()" class="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors">Cancelar</button>
              <button (click)="saveEditor()" class="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-purple-600/20">
                <lucide-icon [img]="Save" class="h-4 w-4"></lucide-icon> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class TextEditorComponent {
  @Input() isOpen = false;
  @Input() title = 'Editar Mensagem';
  @Input() content = '';
  @Output() close = new EventEmitter<void>();
  
  // Alteramos o EventEmitter para enviar um objeto, caso o backend no futuro precise da imagem
  @Output() save = new EventEmitter<{ content: string, imageBase64: string | null }>();
  
  @ViewChild('editorTextarea') editorTextarea!: ElementRef<HTMLTextAreaElement>;

  readonly X = X; readonly Save = Save; readonly Bold = Bold; readonly Italic = Italic;
  readonly Underline = Underline; readonly Strikethrough = Strikethrough; 
  readonly Link2 = Link2; readonly Code = Code; readonly Keyboard = Keyboard; 
  readonly ImageIcon = ImageIcon; readonly Variable = Variable;

  attachedImage: string | null = null;
  showVariablesMenu = false;
  
  availableVariables = [
    { key: 'user', desc: 'Menciona o usuário pelo nome (com link)' },
    { key: 'user_id', desc: 'ID numérico do usuário' },
    { key: 'group_name', desc: 'Nome do grupo' },
    { key: 'warn_count', desc: 'Quantidade de warns que o usuário tem' },
    { key: 'max_warns', desc: 'Limite de warns configurado no grupo' },
    { key: 'time', desc: 'Hora atual' },
    { key: 'date', desc: 'Data atual' }
  ];
  filteredVariables = [...this.availableVariables];

  // --- Lógica de Imagem ---
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.attachedImage = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage() {
    this.attachedImage = null;
  }

  closeEditor() {
    this.attachedImage = null;
    this.close.emit();
  }

  saveEditor() {
    this.save.emit({ content: this.content, imageBase64: this.attachedImage });
    this.attachedImage = null;
  }

  // --- Lógica de Texto ---
  formatText(openTag: string, closeTag: string) {
    if (!this.editorTextarea) return;
    const el = this.editorTextarea.nativeElement;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = this.content || '';
    
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end, text.length);

    this.content = before + openTag + selected + closeTag + after;

    setTimeout(() => {
      el.focus();
      const newPos = selected.length > 0 ? start + openTag.length + selected.length + closeTag.length : start + openTag.length;
      el.setSelectionRange(newPos, newPos);
    }, 0);
  }

  insertLink() {
    this.formatText('<a href="SEU_LINK_AQUI">', '</a>');
  }

  insertInlineButton() {
    const buttonStructure = `\n\n[{"Botão 1":"https://t.me/"}, {"Botão 2":"https://t.me/"}]`;
    this.formatText(buttonStructure, '');
  }

  // --- Lógica de Variáveis ---
  checkVariables() {
    if (!this.editorTextarea) return;
    const el = this.editorTextarea.nativeElement;
    const cursorPos = el.selectionStart;
    const textBeforeCursor = (this.content || '').substring(0, cursorPos);
    const match = textBeforeCursor.match(/\{\{([a-zA-Z0-9_]*)$/);
    
    if (match) {
      this.showVariablesMenu = true;
      const search = match[1].toLowerCase();
      this.filteredVariables = this.availableVariables.filter(v => v.key.toLowerCase().includes(search));
    } else {
      this.showVariablesMenu = false;
    }
  }

  insertVariable(vKey: string) {
    const el = this.editorTextarea.nativeElement;
    const cursorPos = el.selectionStart;
    const textBeforeCursor = (this.content || '').substring(0, cursorPos);
    const textAfterCursor = (this.content || '').substring(cursorPos);
    
    const match = textBeforeCursor.match(/\{\{([a-zA-Z0-9_]*)$/);
    if (match) {
      const matchIndex = match.index!;
      const beforeMatch = this.content.substring(0, matchIndex);
      
      const insertion = `{{${vKey}}}`;
      this.content = beforeMatch + insertion + textAfterCursor;
      
      this.showVariablesMenu = false;
      
      setTimeout(() => {
        el.focus();
        const newPos = beforeMatch.length + insertion.length;
        el.setSelectionRange(newPos, newPos);
      }, 0);
    }
  }
}