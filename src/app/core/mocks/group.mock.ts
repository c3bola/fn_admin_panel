export const GROUP_MESSAGES_MOCK: Record<string, string> = {
  description: 'Grupo oficial da comunidade Fortnite Brasil focado no modo Salve o Mundo. Dicas, estratégias, trocas e muita ajuda entre jogadores!',
  welcome: 'Olá {{user}}, bem-vindo ao Fortnite Salve o Mundo!',
  welcomeNight: 'O grupo está em modo noturno, {{user}}. Leia as regras!',
  exit: '{{user}} saiu do esquadrão.',
  warn: 'Atenção {{user}}, você recebeu uma advertência.\nVocê tem {{warn_count}}/{{max_warns}} warns.',
  ban: '{{user}} foi banido pelo Sistema.'
};

export const GROUP_SETTINGS_MOCK = {
  botStatus: true,
  antiSpam: true,
  antiLinks: true,
  antiFlood: true,
  antiCaps: false,
  detectRusso: true,
  detectArabe: true,
  detectOriental: false,
  banType: 'temporario' as const,
  preWarnAction: 'silenciar_temp' as const,
  warnLimit: 3,
  banTime: 24,
  muteTime: 1
};