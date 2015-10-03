# Comunicação: cliente < - > servidor

  A comunicação entre o cliente e o servidor é feita via web sockets, utilizando-se de trocas de mensagens em *JSON*. As mensagens *JSON* utilizadas pelo SCE são descritas abaixo:

  `{
    code: '1000',
    desc: 'descrição'
    }`

  Ou

  `{
    code: '1006',
    desc: 'descricao',
    value: 'valor'
    }`



 Quando o servidor/cliente utiliza-se de códigos para se comunicar precisamos saber o significado de cada um. Abaixo temos uma tabela dos significados de cada código.

  Código  | Significado
  ------  | -----------
  1000    | Representa um *estado* que significa sucesso.
  1001    | Representa um *estado* que significa erro.
  1004    | Representa um *estado* que significa erro no sistema.
  1006    | Representa uma *requisição*, geralmente vinda do cliente ao servidor.
  1007    | Representa uma *resposta*, geralmente vinda do servidor ao cliente.
