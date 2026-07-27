migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('dashboard_indicadores')
    var seeds = [
      ['Alunos Rede Legacy', 0, 'numero', 'widget', 1],
      ['Crescimento da Rede', 0, 'percentual', 'widget', 2],
      ['Unidades Ativas', 0, 'numero', 'widget', 3],
      ['Estados com Unidades', 0, 'numero', 'widget', 4],
      ['Pop. Evangélica 2026', 0, 'percentual', 'widget', 5],
      ['Alunos na Maturidade', 300, 'numero', 'tabela', 1],
      ['Ticket Médio Mensal', 1200, 'moeda', 'tabela', 2],
      ['Faturamento Anual Estimado', 4600000, 'moeda', 'tabela', 3],
      ['Margem Líquida Referencial', 19, 'percentual', 'tabela', 4],
      ['Payback Médio', 13, 'meses', 'tabela', 5],
    ]
    seeds.forEach(function (s) {
      try {
        app.findFirstRecordByData('dashboard_indicadores', 'nome', s[0])
      } catch (_) {
        var r = new Record(col)
        r.set('nome', s[0])
        r.set('valor', s[1])
        r.set('formato', s[2])
        r.set('categoria', s[3])
        r.set('ordem', s[4])
        app.save(r)
      }
    })
  },
  (app) => {},
)
