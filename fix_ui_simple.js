const fs = require('fs');
const path = 'app/os/home/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /\{\/\* CEO Strategic Goal Section \*\/\}[\s\S]*?\{\/\* Top Metric Cards \*\/\}/m;

const newSection = `{/* CEO Strategic Goal Section */}
      <div className="mb-10 bg-surface-2 border border-accent-main/30 rounded-2xl p-8 relative shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-accent-main p-2 rounded-lg text-white shadow-md shadow-accent-main/20">
            <RocketLaunch size={20} weight="fill" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-accent-main">CEO Strategic Objective</h2>
        </div>
        
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-text-main mb-3">
            {goal || 'Maximize Operational Efficiency & Growth'}
          </h3>
          <p className="text-base text-text-muted max-w-3xl">
            The CEO agent is currently orchestrating the organization to hit this target. Cross-departmental tasks are prioritized automatically based on direct revenue impact.
          </p>
        </div>

        <div className="bg-background/80 border border-border-main p-5 rounded-xl flex items-center gap-5">
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-400/10 text-emerald-400">
            <ChartLineUp size={24} weight="bold" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-text-main">AI Prediction: On Track</span>
              <span className="font-bold text-emerald-400">84% Probability</span>
            </div>
            <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border-soft">
              <div className="h-full bg-emerald-400 w-[84%]" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex gap-3 items-start p-4 rounded-xl bg-accent-main/10 border border-accent-main/20">
          <WarningCircle size={20} className="text-accent-main shrink-0 mt-0.5" />
          <p className="text-sm text-text-main">
            <span className="font-bold text-accent-main">Live Recommendation:</span> Re-allocate Marketing budget to Outbound Sales to accelerate pipeline by 12%.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}`;

content = content.replace(regex, newSection);

fs.writeFileSync(path, content);
console.log('Simplified UI injected');
