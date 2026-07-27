migrate(
  (app) => {
    var colNiveis = app.findCollectionByNameOrId('pedagogico_niveis')

    var niveis = [
      {
        nivel: 'Kindergarten',
        ordem: 1,
        subniveis: ['Pré-1', 'Pré-2'],
        tags: [
          { label: 'Imersão bilíngue', color: '#b98a00' },
          { label: 'Bíblia lúdica', color: '#3b82f6' },
          { label: 'Sociointeracionismo', color: '#10b981' },
        ],
        descricao:
          'Nível 01 — Kindergarten: a base da jornada Legacy. Pré-1 e Pré-2 oferecem imersão bilíngue completa, com aulas diárias em inglês e atividades que integram a Bíblia de forma lúdica. A abordagem sociointeracionista de Vygotsky estimula o desenvolvimento cognitivo e socioemocional através do brincar dirigido e da interação entre pares.',
      },
      {
        nivel: 'Elementary & Middle',
        ordem: 2,
        subniveis: ['1º ao 9º ano'],
        tags: [
          { label: '5× Inglês/semana', color: '#b98a00' },
          { label: 'MAFE', color: '#8b5cf6' },
          { label: 'Chapel', color: '#3b82f6' },
          { label: 'Spelling Bee', color: '#ec4899' },
        ],
        descricao:
          'Nível 02 — Elementary & Middle: Anos Iniciais (1º ao 5º ano) com 5 aulas de inglês por semana, programa MAFE de matemática, Chapel semanal para formação espiritual e Spelling Bee. Anos Finais (6º ao 9º ano) intensificam a fluência bilíngue, introduzem projetos interdisciplinares e preparam o aluno para o High School com autonomia acadêmica.',
      },
      {
        nivel: 'High School',
        ordem: 3,
        subniveis: ['Ensino Médio'],
        tags: [
          { label: 'DBU / ORU', color: '#3b82f6' },
          { label: 'Legacy Exchange', color: '#b98a00' },
          { label: 'Vestibulares', color: '#10b981' },
        ],
        descricao:
          'Nível 03 — High School: Ensino Médio com dupla certificação via parcerias com Dallas Baptist University (DBU) e Oral Roberts University (ORU). O programa Legacy Exchange possibilita intercâmbio internacional. Preparação intensiva para vestibulares e exames de admissão universitária, com orientação vocacional cristã e mentorias individuais.',
      },
    ]

    niveis.forEach(function (n) {
      try {
        app.findFirstRecordByData('pedagogico_niveis', 'nivel', n.nivel)
      } catch (_) {
        var r = new Record(colNiveis)
        r.set('nivel', n.nivel)
        r.set('ordem', n.ordem)
        r.set('subniveis', n.subniveis)
        r.set('tags', n.tags)
        r.set('descricao', n.descricao)
        app.save(r)
      }
    })

    var colParcerias = app.findCollectionByNameOrId('pedagogico_parcerias')

    var parcerias = [
      {
        titulo: 'Dallas Baptist University (DBU)',
        ordem: 1,
        descricao:
          'Parceria exclusiva que permite aos alunos da Legacy School acesso prioritário aos programas de graduação da DBU, no Texas — EUA. Dupla certificação reconhecida internacionalmente, com possibilidades de bolsas de estudo para alunos destacados e programas de intercâmbio semestral.',
      },
      {
        titulo: 'Oral Roberts University (ORU)',
        ordem: 2,
        descricao:
          'Convênio com a ORU, universidade cristã de referência em Tulsa — Oklahoma. Oferece pathways para admissão direta em cursos de Engenharia, Negócios e Ciências da Saúde, além de programas de transferência de créditos para alunos do Ensino Médio da Legacy.',
      },
      {
        titulo: 'Christian Halls',
        ordem: 3,
        descricao:
          'Rede internacional de Christian Halls que conecta a Legacy School a instituições parceiras no mundo todo. Proporciona eventos globais, competições acadêmicas, conferências de liderança estudantil e oportunidades de intercâmbio cultural com escolas cristãs em diversos países.',
      },
    ]

    parcerias.forEach(function (p) {
      try {
        app.findFirstRecordByData('pedagogico_parcerias', 'titulo', p.titulo)
      } catch (_) {
        var r = new Record(colParcerias)
        r.set('titulo', p.titulo)
        r.set('ordem', p.ordem)
        r.set('descricao', p.descricao)
        app.save(r)
      }
    })
  },
  (app) => {},
)
