const fs = require('fs');

const path = 'app/os/home/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// The replacement UI for the CEO section
const ceoSection = `
      {/* CEO Strategic Goal Section */}
      {goal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 bg-gradient-to-r from-accent-main/10 to-surface border border-accent-main/20 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_40px_-15px_rgba(99,102,241,0.2)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-main/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-accent-main/20 p-1.5 rounded-lg text-accent-main">
                  <RocketLaunch size={18} weight="duotone" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-main">CEO Strategic Objective</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                "{goal}"
              </h2>
              <p className="text-sm text-text-muted max-w-2xl">
                The CEO agent is currently orchestrating the organization to hit this target. Cross-departmental tasks are prioritized automatically based on direct revenue impact.
              </p>
            </div>
            
            <div className="w-full md:w-auto bg-background/50 backdrop-blur-sm border border-border-main p-4 rounded-xl shrink-0 min-w-[280px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">AI Prediction</span>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <ChartLineUp size={12} weight="bold" /> On Track
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-dim">Probability of Success</span>
                    <span className="text-white font-medium">84%</span>
                  </div>
                  <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[84%]" />
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border-soft">
                  <div className="flex gap-2 items-start text-xs">
                    <WarningCircle size={14} className="text-accent-main shrink-0 mt-0.5" />
                    <span className="text-text-muted leading-relaxed">
                      <strong className="text-text-main font-medium">Recommendation:</strong> Re-allocate Marketing budget to Outbound Sales to accelerate pipeline by 12%.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Metric Cards */}`;

// Replace the Top Metric Cards comment with the new CEO section and the Top Metric Cards comment
content = content.replace(
  "{/* Top Metric Cards */}",
  ceoSection
);

// We also need to make sure RocketLaunch, ChartLineUp, WarningCircle are imported if not already
if (!content.includes("RocketLaunch")) {
    content = content.replace(
        "import { Target, CheckCircle, Clock, Lightning, Users, ArrowRight, Buildings } from '@phosphor-icons/react';",
        "import { Target, CheckCircle, Clock, Lightning, Users, ArrowRight, Buildings, RocketLaunch, WarningCircle, ChartLineUp } from '@phosphor-icons/react';"
    );
}

fs.writeFileSync(path, content);
console.log('Successfully injected CEO Strategic Goal UI!');
