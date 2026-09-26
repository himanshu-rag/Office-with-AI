'use client';

type Status = 'working' | 'waiting' | 'thinking' | 'blocked' | 'coffee_break' | 'offline';

const STATUS_CONFIG: Record<Status, { label: string; color: string; dotClass: string; pulse: boolean }> = {
  working:      { label: 'Working',      color: 'text-emerald-400', dotClass: 'bg-emerald-400', pulse: true  },
  waiting:      { label: 'Waiting',      color: 'text-yellow-400',  dotClass: 'bg-yellow-400',  pulse: false },
  thinking:     { label: 'Thinking',     color: 'text-blue-400',    dotClass: 'bg-blue-400',    pulse: true  },
  blocked:      { label: 'Blocked',      color: 'text-red-400',     dotClass: 'bg-red-400',     pulse: false },
  coffee_break: { label: 'Coffee Break', color: 'text-orange-400',  dotClass: 'bg-orange-400',  pulse: false },
  offline:      { label: 'Offline',      color: 'text-zinc-500',    dotClass: 'bg-zinc-500',    pulse: false },
};

export function AgentStatusBadge({
  status,
  showLabel = true,
  size = 'sm',
}: {
  status: string;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md';
}) {
  const cfg = STATUS_CONFIG[status as Status] ?? STATUS_CONFIG.offline;
  const dotSize  = size === 'xs' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-3 h-3' : 'w-2 h-2';
  const textSize = size === 'xs' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 ${cfg.color}`}>
      <span
        className={`${dotSize} rounded-full ${cfg.dotClass} ${cfg.pulse ? 'animate-status-pulse' : ''} flex-shrink-0`}
      />
      {showLabel && (
        <span className={`${textSize} font-medium`}>{cfg.label}</span>
      )}
    </span>
  );
}

export default AgentStatusBadge;
