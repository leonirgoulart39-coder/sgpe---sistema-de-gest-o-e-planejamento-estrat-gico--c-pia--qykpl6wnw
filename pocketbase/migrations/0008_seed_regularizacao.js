migrate(
  (app) => {
    var etapas = [
      ['CNPJ (constituição)', 'concluido', 'Contador', 1],
      ['Contrato de Locação do Imóvel', 'em_andamento', 'Diretor', 2],
      ['Alvará de Funcionamento', 'em_andamento', 'Diretor', 3],
      ['Alvará do Corpo de Bombeiros', 'pendente', 'Diretor', 4],
      ['Licença Sanitária (Vigilância)', 'pendente', 'Diretor', 5],
      ['Atestado de Vistoria Bombeiros', 'pendente', 'Diretor', 6],
      ['Aprovação de Projeto Arquitetônico', 'pendente', 'Arquiteto', 7],
      ['Registro no Conselho de Educação', 'pendente', 'Coord. Pedagógico', 8],
      ['Autorização de Funcionamento', 'pendente', 'Diretor', 9],
      ['Credencial Legacy School', 'pendente', 'Diretor', 10],
      ['Habite-se do Imóvel', 'pendente', 'Diretor', 11],
      ['Licença Ambiental', 'pendente', 'Diretor', 12],
      ['Registro de Funcionários (eSocial)', 'pendente', 'RH', 13],
      ['Política de Privacidade (LGPD)', 'pendente', 'TI', 14],
      ['Seguro de Responsabilidade Civil', 'pendente', 'Diretor', 15],
      ['Convênio Empresa de Transporte', 'pendente', 'Diretor', 16],
      ['Contrato de Coleta de Lixo', 'pendente', 'Diretor', 17],
      ['Atestado de Capacidade Técnica', 'pendente', 'Diretor', 18],
      ['Inscrição no INEP', 'pendente', 'Coord. Pedagógico', 19],
    ]
    var col = app.findCollectionByNameOrId('regularizacao_etapas')
    etapas.forEach(function (e) {
      try {
        app.findFirstRecordByData('regularizacao_etapas', 'nome', e[0])
      } catch (_) {
        var r = new Record(col)
        r.set('nome', e[0])
        r.set('status', e[1])
        r.set('responsavel', e[2])
        r.set('ordem', e[3])
        app.save(r)
      }
    })
  },
  (app) => {},
)
