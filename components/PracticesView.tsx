import React from 'react';
import { Eye, Skull, Scale, ShieldCheck } from 'lucide-react';
import { Practice } from '../types';

export const PracticesView: React.FC = () => {
  const practices: Practice[] = [
    {
      id: '1',
      title: 'Premeditatio Malorum',
      description: 'A premeditação dos males. Prepare-se mentalmente para dificuldades.',
      steps: [
        'Encontre um lugar calmo e feche os olhos.',
        'Imagine uma situação difícil que pode acontecer hoje (trânsito, crítica, falha).',
        'Visualize-se reagindo com calma e razão, sem se deixar levar pela emoção.',
        'Aceite que, se acontecer, você estará pronto.'
      ],
      iconName: 'skull'
    },
    {
      id: '2',
      title: 'A Vista de Cima',
      description: 'Expanda sua perspectiva para ver a insignificância dos problemas triviais.',
      steps: [
        'Imagine-se subindo acima do seu corpo, de sua casa, de sua cidade.',
        'Veja a Terra como um pequeno ponto pálido no cosmos.',
        'Perceba quão pequenos são seus problemas atuais na escala do universo.',
        'Retorne ao presente com essa perspectiva de humildade.'
      ],
      iconName: 'eye'
    },
    {
      id: '3',
      title: 'Dicotomia do Controle',
      description: 'Separe o que depende de você do que não depende.',
      steps: [
        'Escreva um problema que te aflige.',
        'Faça duas colunas: "Sob meu controle" e "Fora do meu controle".',
        'Liste as partes do problema em cada coluna.',
        'Comprometa-se a focar toda sua energia apenas na primeira coluna.'
      ],
      iconName: 'scale'
    },
    {
      id: '4',
      title: 'Cidadela Interior',
      description: 'Fortaleça sua mente contra intrusões externas.',
      steps: [
        'Visualize sua mente como uma fortaleza impenetrável.',
        'Insultos e azares são flechas que batem nos muros e caem, sem te ferir.',
        'Lembre-se: nada pode te ferir sem o seu consentimento mental.',
      ],
      iconName: 'shield'
    }
  ];

  const getIcon = (name: string) => {
    switch(name) {
      case 'skull': return <Skull size={24} className="text-stone-600" />;
      case 'eye': return <Eye size={24} className="text-stone-600" />;
      case 'scale': return <Scale size={24} className="text-stone-600" />;
      case 'shield': return <ShieldCheck size={24} className="text-stone-600" />;
      default: return <Eye size={24} />;
    }
  };

  return (
    <div className="px-6 py-8 pb-24 max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif text-stone-800">Exercícios Espirituais</h2>
        <p className="text-stone-500 text-sm">A filosofia não é teoria, é prática. Escolha um exercício para hoje.</p>
      </div>

      <div className="grid gap-6">
        {practices.map(practice => (
          <div key={practice.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-stone-100 rounded-lg">
                  {getIcon(practice.iconName)}
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg">{practice.title}</h3>
                  <p className="text-xs text-stone-500 uppercase tracking-wide">Prática Estoica</p>
                </div>
              </div>
              
              <p className="text-stone-600 mb-6 leading-relaxed">
                {practice.description}
              </p>

              <div className="bg-stone-50 p-5 rounded-lg border border-stone-100">
                <h4 className="font-serif text-stone-800 mb-3 font-semibold">Como Praticar:</h4>
                <ol className="list-decimal list-inside space-y-2 text-stone-700 text-sm">
                  {practice.steps.map((step, idx) => (
                    <li key={idx} className="pl-1"><span className="pl-1">{step}</span></li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};