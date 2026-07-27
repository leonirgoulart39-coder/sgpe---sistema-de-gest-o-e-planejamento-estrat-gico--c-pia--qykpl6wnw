migrate(
  (app) => {
    var planCol = app.findCollectionByNameOrId('planejamento')
    var plans = [
      {
        section: 'diagnostico',
        field_name: 'Contexto Histórico',
        content:
          'A IBMS possui mais de 15 anos de experiência no setor educacional, com forte reputação na região. A expansão via franquia Legacy School representa um marco na profissionalização da operação.',
      },
      {
        section: 'diagnostico',
        field_name: 'Análise de Mercado',
        content:
          'O mercado de educação infantil e fundamental em São Paulo cresce 8% ao ano. Há demanda reprimida por escolas com proposta pedagógica diferenciada na região de expansão.',
      },
      {
        section: 'diagnostico',
        field_name: 'Análise da Concorrência',
        content:
          'Principais concorrentes: escolas bilingues premium (ticket médio R$ 2.500+), escolas tradicionais (R$ 1.200-1.800), e franquias em expansão. Diferencial IBMS: relação custo-benefício com qualidade pedagógica Legacy.',
      },
      {
        section: 'identidade',
        field_name: 'Missão',
        content:
          'Educare crianças e adolescentes com excelência acadêmica, valores humanos e visão global, preparando-os para os desafios do século XXI.',
      },
      {
        section: 'identidade',
        field_name: 'Visão',
        content:
          'Ser referência em educação de qualidade acessível em São Paulo, expandindo o modelo Legacy School para 5 unidades até 2030.',
      },
      {
        section: 'identidade',
        field_name: 'Propósito',
        content:
          'Transformar vidas através de uma educação que combina tradição, inovação e valores cristãos.',
      },
      {
        section: 'modelo',
        field_name: 'Proposta de Valor',
        content:
          'Educação de qualidade premium a preço acessível, com curadoria pedagógica Legacy School, infraestrutura moderna e equipe qualificada.',
      },
      {
        section: 'modelo',
        field_name: 'Modelo de Receita',
        content:
          'Mensalidades + taxas de matrícula + materiais didáticos + uniformes + atividades extracurriculares (eletivos).',
      },
      {
        section: 'modelo',
        field_name: 'Estrutura Operacional',
        content:
          'Unidade de 800m² com 12 salas, laboratórios, biblioteca, brinquedoteca, refeitório e área externa. Equipe de 35 colaboradores.',
      },
      {
        section: 'pedagogico',
        field_name: 'Abordagem Pedagógica',
        content:
          'Metodologia Legacy School: aprendizagem ativa, projetos interdisciplinares, avaliação formativa e uso de tecnologia educacional.',
      },
      {
        section: 'pedagogico',
        field_name: 'Currículo',
        content:
          'BNCC alinhado com framework Legacy: trilhas de inglês, STEM, artes e educação socioemocional.',
      },
      {
        section: 'pedagogico',
        field_name: 'Avaliação',
        content:
          'Avaliação formatativa contínua com portfólios, rubricas e feedback estruturado. Reuniões trimestrais com famílias.',
      },
      {
        section: 'captacao',
        field_name: 'Estratégia de Marketing',
        content:
          'Marketing digital (Meta Ads, Google), eventos de portas abertas, parcerias com condomínios e indicação de famílias.',
      },
      {
        section: 'captacao',
        field_name: 'Canais',
        content:
          'Instagram, site otimizado SEO, WhatsApp Business, eventos presenciais, parcerias escolares feeder.',
      },
      {
        section: 'captacao',
        field_name: 'Parcerias',
        content:
          'Legacy School (franqueadora), fornecedores de material didático, plataforma de gestão escolar, empresas de transporte.',
      },
      {
        section: 'roadmap',
        field_name: 'Fase 1 — Fundação',
        content:
          'Constituição legal, contrato de franquia, locação do imóvel, contratação da equipe diretiva.',
      },
      {
        section: 'roadmap',
        field_name: 'Fase 2 — Implantação',
        content:
          'Reforma e adequação do imóvel, aquisição de equipamentos, contratação de professores, marketing de lançamento.',
      },
      {
        section: 'roadmap',
        field_name: 'Fase 3 — Operação',
        content:
          'Início das aulas, captação contínua, avaliação dos primeiros 90 dias, ajustes operacionais.',
      },
      {
        section: 'roadmap',
        field_name: 'Fase 4 — Crescimento',
        content:
          'Ocupação plena, avaliação de expansão, novos eletivos, programa de fidelização de famílias.',
      },
      {
        section: 'proximos',
        field_name: 'Ações Imediatas',
        content:
          '1. Assinar contrato de locação. 2. Iniciar reforma. 3. Contratar coordenador pedagógico. 4. Definir fornecedores de material. 5. Lançar campanha de captação.',
      },
      {
        section: 'proximos',
        field_name: 'Prioridades',
        content:
          'Reforma do imóvel (crítica), contratação de equipe (alta), regularização legal (alta), marketing (média), aquisição de equipamentos (média).',
      },
    ]

    plans.forEach(function (item) {
      try {
        app.findFirstRecordByData('planejamento', 'field_name', item.field_name)
      } catch (_) {
        var r = new Record(planCol)
        r.set('section', item.section)
        r.set('field_name', item.field_name)
        r.set('content', item.content)
        app.save(r)
      }
    })

    var swotCol = app.findCollectionByNameOrId('swot_items')
    var swots = [
      { quadrant: 'forcas', text: 'Marca consolidada IBMS com 15+ anos de experiência' },
      { quadrant: 'forcas', text: 'Modelo de franquia estruturado pela Legacy School' },
      { quadrant: 'forcas', text: 'Equipe diretiva com experiência comprovada' },
      {
        quadrant: 'fraquezas',
        text: 'Capital inicial limitado para investimento em infraestrutura',
      },
      { quadrant: 'fraquezas', text: 'Dependência de fornecedores específicos da franquia' },
      { quadrant: 'oportunidades', text: 'Crescimento de 8% ao ano no mercado de educação em SP' },
      { quadrant: 'oportunidades', text: 'Demanda por escolas com proposta bilíngue acessível' },
      { quadrant: 'oportunidades', text: 'Expansão para 5 unidades até 2030' },
      { quadrant: 'ameacas', text: 'Concorrência de redes de franquias com maior capital' },
      { quadrant: 'ameacas', text: 'Mudanças regulatórias na educação (BNCC, inspecões)' },
      {
        quadrant: 'ameacas',
        text: 'Instabilidade econômica afetando poder aquisitivo das famílias',
      },
    ]
    swots.forEach(function (item) {
      try {
        app.findFirstRecordByData('swot_items', 'text', item.text)
      } catch (_) {
        var r = new Record(swotCol)
        r.set('quadrant', item.quadrant)
        r.set('text', item.text)
        app.save(r)
      }
    })

    var valCol = app.findCollectionByNameOrId('valores_fundamentais')
    var valores = [
      {
        title: 'Excelência',
        description: 'Busca constante pela qualidade em todas as dimensões educacionais.',
      },
      { title: 'Integridade', description: 'Ação ética e transparente em todas as relações.' },
      { title: 'Inovação', description: 'Abertura ao novo, criatividade e melhoria contínua.' },
      { title: 'Cuidado', description: 'Atenção individual a cada aluno e família.' },
      {
        title: 'Comunidade',
        description: 'Construção de vínculos entre escola, famílias e sociedade.',
      },
    ]
    valores.forEach(function (item) {
      try {
        app.findFirstRecordByData('valores_fundamentais', 'title', item.title)
      } catch (_) {
        var r = new Record(valCol)
        r.set('title', item.title)
        r.set('description', item.description)
        app.save(r)
      }
    })
  },
  (app) => {},
)
