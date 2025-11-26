import React from 'react';
import { Eye, Skull, Scale, ShieldCheck, ArrowRight } from 'lucide-react';
import { Practice } from '../types';

export const PracticesView: React.FC = () => {
  const practices: Practice[] = [
    {
      id: '1',
      title: 'Premeditatio Malorum',
      description: 'Antecipe o infortúnio para enfraquecer seu golpe.',
      steps: [
        'Encontre silêncio.',
        'Visualize um revés específico.',
        'Observe sua reação sem julgamento.',
        'Aceite a possibilidade.'
      ],
      iconName: 'skull'
    },
    {
      id: '2',
      title: 'A Vista de Cima',
      description: 'A Terra é um ponto pálido. Seus problemas são poeira.',
      steps: [
        'Suba mentalmente acima de sua cidade.',
        'Contemple o planeta do espaço.',
        'Redimensione sua ansiedade.',
        'Retorne com humildade.'
      ],
      iconName: 'eye'
    },
    {
      id: '3',
      title: 'Dicotomia do Controle',
      description: 'A única liberdade verdadeira é dominar sua própria mente.',
      steps: [
        'Identifique a aflição.',
        'Separe: o que é meu? o que é externo?',
        'Descarte o externo.',
        'Abrace sua escolha interna.'
      ],
      iconName: 'scale'
    },
    {
      id: '4',
      title: 'Cidadela Interior',
      description: 'Construa um refúgio onde nada externo pode tocar.',
      steps: [
        'Visualize muros mentais.',
        'Veja insultos como flechas que caem.',
        'Recolha-se na razão.',
      ],
      iconName: 'shield'
    }
  ];

  const getIcon = (name: string) => {
    switch(name) {
      case 'skull': return <Skull size={20} className="text-stone-800" />;
      case 'eye': return <Eye size={20} className="text-stone-800" />;
      case 'scale': return <Scale size={20} className="text-stone-800" />;
      case 'shield': return <ShieldCheck size={20} className="text-stone-800" />;
      default: return <Eye size={20} />;
    }
  };

  return (
    <div className="px-6 py-8 pb-32 max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3 pb-6 border-b border-stone-200">
        <h2 className="text-2xl font-serif text-stone-900">Exercícios Espirituais</h2>
        <p className="text-stone-500 text-xs uppercase tracking-widest">
          A filosofia é uma arte de viver
        </p>
      </div>

      <div className="grid gap-6">
        {practices.map(practice => (
          <div key={practice.id} className="group bg-white rounded-none border-l-2 border-stone-200 hover:border-bronze-500 pl-6 py-4 transition-all duration-300 hover:bg-stone-50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-100 rounded-md group-hover:bg-white group-hover:shadow-sm transition-all">
                  {getIcon(practice.iconName)}
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-bronze-700 transition-colors">{practice.title}</h3>
              </div>
            </div>
            
            <p className="text-stone-600 mb-4 text-sm leading-relaxed font-serif italic opacity-80">
              "{practice.description}"
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                <span>Prática</span>
                <div className="h-px bg-stone-200 flex-1"></div>
              </div>
              <ul className="space-y-2">
                {practice.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-stone-700 text-sm">
                    <span className="mt-1.5 w-1 h-1 bg-stone-300 rounded-full flex-shrink-0 group-hover:bg-bronze-400"></span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};