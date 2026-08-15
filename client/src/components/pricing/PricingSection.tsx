import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    { title: 'Starter', price: 100, features: ['5 UI presets', 'Standard AI Model', 'Capped messages (1k/mo)'], popular: false },
    { title: 'Growth', price: 699, features: ['Full UI/UX customization', 'Custom knowledge base', 'Dedicated dashboard', '50k messages/mo'], popular: true },
    { title: 'Experience', price: 999, features: ['No Message Limits', 'AI Page Navigation', 'Live User Data Context'], popular: false }
  ];

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white font-heading">Flexible Deployment Plans</h2>
        <div className="flex items-center justify-center gap-3 font-body text-sm">
          <span className={!isYearly ? 'text-white font-medium' : 'text-[#ccc3d8]'}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)} 
            className="w-11 h-6 bg-[#262a35] rounded-full p-1 flex items-center cursor-pointer transition-colors"
          >
            <div className={`w-4 h-4 bg-[#7c3aed] rounded-full transition-transform duration-200 ${isYearly ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <span className={isYearly ? 'text-[#4cd7f6] font-medium' : 'text-[#ccc3d8]'}>Yearly <span className="text-xs text-[#4cd7f6]">(-20%)</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end pt-6">
        {plans.map((plan, i) => {
          const calculatedPrice = isYearly ? Math.floor(plan.price * 0.8) : plan.price;
          return (
            <div 
              key={i} 
              className={`p-6 rounded-xl border flex flex-col justify-between ${
                plan.popular 
                  ? 'bg-[#1c1f2a] border-[#7c3aed] shadow-2xl md:scale-105 z-10 min-h-[460px]' 
                  : 'bg-[#111827]/40 border-white/5 min-h-[420px]'
              }`}
            >
              {plan.popular && <div className="absolute top-0 right-0 bg-[#7c3aed] text-white font-mono text-[10px] tracking-widest px-4 py-1 rounded-bl-xl">POPULAR</div>}
              <div className="space-y-4">
                <div>
                  <h4 className={`text-xl font-bold font-heading ${plan.popular ? 'text-[#7c3aed]' : 'text-white'}`}>{plan.title}</h4>
                  <p className="text-xs text-[#ccc3d8] mt-1 font-body">{plan.popular ? 'For growing businesses needing scale.' : plan.title === 'Starter' ? 'For side projects.' : 'Ultimate power.'}</p>
                </div>
                <div className="flex items-baseline gap-1 pt-2 font-heading">
                  <span className="text-4xl font-extrabold text-white">₹{calculatedPrice}</span>
                  <span className="text-[#ccc3d8] text-xs font-body">/mo</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-white/5 font-body text-xs">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-[#dfe2f1]">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${plan.popular ? 'text-[#7c3aed]' : 'text-[#4cd7f6]'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className={`w-full mt-8 py-3 rounded-xl font-bold text-xs tracking-wide cursor-pointer transition-all ${plan.popular ? 'bg-[#7c3aed] text-white hover:brightness-110 shadow-lg' : 'border border-[#4a4455] text-[#ccc3d8] hover:bg-white/5'}`}>
                {plan.title === 'Experience' ? 'Contact Sales' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}