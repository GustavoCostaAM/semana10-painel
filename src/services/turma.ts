import type { Aluno } from '../types/aluno'

// A conversa com a rede mora AQUI, e só aqui. Nenhum componente dá fetch.
// O serviço promete um tipo (Promise<Aluno[]>) e traduz a falha tecnica
// numa frase que serve para uma PESSOA ler na tela.
export async function buscarTurma(): Promise<Aluno[]> {
  // a frase PARA A PESSOA muda conforme o passo em que a falha acontece
  let frase = 'Sem conexão com o servidor da turma. Confira sua internet e recarregue a página.'
  try {
    const resposta = await fetch(import.meta.env.VITE_API_URL, {
      headers: { Accept: 'application/json' },   // pedimos JSON: no servidor de dev, arquivo ausente vira 404
    })
    frase = 'O servidor respondeu com erro. Tente de novo daqui a pouco; se continuar, avise quem cuida do painel.'
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
    frase = 'A turma chegou num formato que o painel não entende. Avise quem cuida do painel.'
    const dados: unknown = await resposta.json()
    if (!Array.isArray(dados)) throw new Error('a resposta não é uma lista')
    return dados
  } catch (falha) {
    console.error('[buscarTurma]', falha)   // o motivo tecnico fica no console, para quem programa
    throw new Error(frase)
  }
}

// ESCRITA: o MESMO molde do buscarTurma, com tres coisas a mais — o verbo (PATCH),
// o cabecalho que diz "o corpo e' JSON" e o corpo. A URL continua vindo do .env:
// /api/alunos + /1 = o aluno 1. O servidor responde com o aluno JA ATUALIZADO.
export async function atualizarAluno(
  id: number,
  mudanca: Partial<Pick<Aluno, 'presente' | 'entregas'>>,
): Promise<Aluno> {
  try {
    const resposta = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mudanca),
    })
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
    const atualizado: Aluno = await resposta.json()
    return atualizado
  } catch (falha) {
    console.error('[atualizarAluno]', falha)
    throw new Error('Não foi possível salvar. Tente de novo.')
  }
}
