import re

with open('app/os/home/page.tsx', 'r') as f:
    content = f.read()

ceo_card = """
        {/* CEO Recommendations & Goals */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="col-span-12 md:col-span-8 bg-surface border border-border-main rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-main/10 border border-accent-main/20 flex items-center justify-center">
                <Target size={20} className="text-accent-main" weight="duotone" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-main">CEO Strategic Objective</h2>
                <p className="text-sm text-text-muted">Alex is actively optimizing operations for this goal.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-text-dim mb-1">Target</div>
              <div className="text-xl font-bold text-emerald-400">$100,000 MRR</div>
            </div>
          </div>

          <div className="bg-background rounded-2xl p-5 border border-border-main">
            <div className="flex gap-4">
              <div className="mt-1">
                <Lightbulb size={24} weight="duotone" className="text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-text-main">Alex (CEO)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-main/10 text-accent-main font-medium">Live Recommendation</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  Based on our target revenue goal, I recommend we instantly deploy a <strong>Marketing Outreach Mission</strong>. Our engineering tasks are 80% complete, meaning we can shift bandwidth to lead generation. Shall I spin up 3 new agents to handle cold outreach?
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-accent-main text-white rounded-lg text-sm font-bold hover:bg-accent-hover transition-colors">
                    Approve Strategy
                  </button>
                  <button className="px-4 py-2 bg-surface-2 text-text-main rounded-lg text-sm font-medium hover:bg-surface transition-colors">
                    Modify Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
"""

# We'll inject this right before the Activity Feed.
content = content.replace("        {/* Activity Feed */}", ceo_card + "\n        {/* Activity Feed */}")

with open('app/os/home/page.tsx', 'w') as f:
    f.write(content)
