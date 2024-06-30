const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de três respostas', () => {
  modelo.cadastrar_pergunta('O que está sempre a sua frente mas não pode ser visto?');
  modelo.cadastrar_pergunta('O que é feito para andar mas não anda?');
  modelo.cadastrar_pergunta('O que quanto mais você tem, menos você vê?');

  const perguntas = modelo.listar_perguntas();
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, 'Futuro');
  modelo.cadastrar_resposta(perguntas[1].id_pergunta, 'Escada');
  modelo.cadastrar_resposta(perguntas[2].id_pergunta, 'Escuridão');

  expect(modelo.get_num_respostas(perguntas[0].id_pergunta)).toBe(1);
  expect(modelo.get_num_respostas(perguntas[1].id_pergunta)).toBe(1);

  expect(modelo.get_respostas(perguntas[1].id_pergunta)[0].texto).toBe('Escada');
  expect(modelo.get_respostas(perguntas[2].id_pergunta)[0].texto).toBe('Escuridão');

});

test('Testando pegar pergunta por id', () => {
  modelo.cadastrar_pergunta('O que não pode ser usado antes de ser quebrado?');
  
  const pergunta = modelo.listar_perguntas();
  expect(modelo.get_pergunta(pergunta[0].id_pergunta).texto).toBe('O que não pode ser usado antes de ser quebrado?');

});