migrate(
  (app) => {
    var colPlan = app.findCollectionByNameOrId('planejamento')

    var taxasData = [
      ['Taxa de Franquia (entrada única)', 'R$ 280.000'],
      ['Royalties — Ano 1 (sobre mensalidades)', '5%'],
      ['Royalties — Ano 2 em diante', '6%'],
      ['Fundo de Marketing Nacional', '2% do faturamento'],
      ['Legacy Franchise Academy', 'Inclusa no contrato'],
      ['Incidência dos royalties', 'Apenas mensalidades'],
    ]

    taxasData.forEach(function (item) {
      try {
        app.findFirstRecordByFilter('planejamento', 'section = {:sec} && field_name = {:field}', {
          sec: 'taxas_royalties',
          field: item[0],
        })
      } catch (_) {
        var r = new Record(colPlan)
        r.set('section', 'taxas_royalties')
        r.set('field_name', item[0])
        r.set('content', item[1])
        app.save(r)
      }
    })

    try {
      app.findFirstRecordByFilter('planejamento', 'section = {:sec} && field_name = {:field}', {
        sec: 'academy_info',
        field: 'description',
      })
    } catch (_) {
      var rAcademy = new Record(colPlan)
      rAcademy.set('section', 'academy_info')
      rAcademy.set('field_name', 'description')
      rAcademy.set(
        'content',
        '+80 videoaulas e 30 módulos de treinamento estruturado — da Escola de Proprietários à Legalização Escolar. Acesso ilimitado para todos os colaboradores da unidade. Substitui investimento em treinamento próprio e reduz a curva de aprendizado de meses para semanas.',
      )
      app.save(rAcademy)
    }

    var colFontes = app.findCollectionByNameOrId('modelo_fontes_receita')
    var fontesData = [
      {
        titulo: 'Mensalidades',
        descricao: 'Receita recorrente mensal — ~80% do faturamento. Ticket R$ 1.200.',
        tag_label: 'PRINCIPAL',
        tag_color: 'emerald',
        bullet_color: '#b98a00',
        ordem: 1,
      },
      {
        titulo: 'Material Didático',
        descricao: 'Venda anual. Margem de ~40% sobre o custo. ~R$ 175/aluno/mês.',
        tag_label: 'RECORRENTE',
        tag_color: 'amber',
        bullet_color: '#10b981',
        ordem: 2,
      },
      {
        titulo: 'Uniformes Legacy',
        descricao: 'Venda anual com identidade da rede. Margem elevada.',
        tag_label: 'ANUAL',
        tag_color: 'indigo',
        bullet_color: '#6366f1',
        ordem: 3,
      },
      {
        titulo: 'Eletivos e Parceiros',
        descricao: 'Tecnologia, intercâmbio, KFN Camp, Legacy Theater, Spelling Bee.',
        tag_label: 'ADICIONAL',
        tag_color: 'pink',
        bullet_color: '#ec4899',
        ordem: 4,
      },
    ]

    fontesData.forEach(function (f) {
      try {
        app.findFirstRecordByData('modelo_fontes_receita', 'titulo', f.titulo)
      } catch (_) {
        var r = new Record(colFontes)
        r.set('titulo', f.titulo)
        r.set('descricao', f.descricao)
        r.set('tag_label', f.tag_label)
        r.set('tag_color', f.tag_color)
        r.set('bullet_color', f.bullet_color)
        r.set('ordem', f.ordem)
        app.save(r)
      }
    })
  },
  (app) => {},
)
