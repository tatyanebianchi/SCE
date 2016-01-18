# Comunicação: cliente < - > servidor 
  
  *__(SCEPC - SCE Protocolo de Comunicação)__*

  A comunicação entre o cliente e o servidor é feita via WebSockets, utilizando-se de trocas de mensagens em *JSON*. As mensagens *JSON* utilizadas pelo SCE são descritas abaixo:

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


  O protocolo não é rigoroso, não verifica nem padroniza a tipagem dos campos `code`, `desc`, `value`. Entretanto é recomendado que se utilize a seguinte tipagem:
  
  Parâmetro da mensagem | Tipagem
  --------------------- | -------
  code                  | String
  desc                  | String
  value                 | Object
   
  Essa recomendação é proprosta afim de facilitar o tratamento das mensagens no cliente. No futuro quem sabe isso vá ser padronizado e terá uma *lib* específica para a
  troca de mensagens entre cliente e servidor.
  Quando o servidor/cliente utiliza-se de códigos para se comunicar precisamos saber o significado de cada um. Abaixo temos uma tabela dos significados de cada código.

  Código  | Significado
  ------  | -----------
  1000    | Representa um *estado* que significa sucesso.
  1001    | Representa um *estado* que significa erro.
  1004    | Representa um *estado* que significa erro no sistema.
  1006    | Representa uma *requisição*, geralmente vinda do cliente ao servidor.
  1007    | Representa uma *resposta*, geralmente vinda do servidor ao cliente.

# Log do servidor

  __Nota: Os diretórios e nomes dos logs vão ser modificados ao longo do desenvolvimento do SCE, não há conscenso quanto ao estado atual dos logs.__

  O log do servidor é escrito na pasta `./log`, com o nome `server.log`, esse
  arquivo tem como função principal notificar qualquer modificação de estado do
  servidor e seus componentes, como o [`web_sockets.js`](). Qualquer ação de
  requisição/resposta é gravada no log do servidor, para tal, é definido um código
  afim de padronizar a identificação do conteúdo da mensagem no log.

  Código  | Significado
  ------  | -----------
  900     | Representa um *notificação*.
  903     | Representa um *estado* que significa sucesso.
  904     | Representa um *estado* que significa erro.
  906     | Representa uma *requisição* vinda do cliente ao servidor.
  907     | Representa uma *mensagem* a ser enviada pelo servidor.
