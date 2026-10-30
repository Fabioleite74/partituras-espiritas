export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-500">
      <h1 className="font-title text-4xl md:text-5xl text-palette-yellow">
        Política de Privacidade
      </h1>
      <div className="prose prose-invert max-w-none space-y-6 text-white/80 leading-relaxed">
        <p>
          A sua privacidade é importante para nós. É política do Partituras
          Espíritas respeitar a sua privacidade em relação a qualquer informação
          sua que possamos coletar no site Partituras Espíritas.
        </p>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            1. Coleta de Informações
          </h2>
          <p>
            Solicitamos informações pessoais apenas quando realmente precisamos
            delas para lhe fornecer um serviço. Fazemo-lo por meios justos e
            legais, com o seu conhecimento e consentimento.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Informações de Conta:</strong>
              {
                " Quando você faz login via Google, recebemos seu nome, e-mail e foto de perfil para identificação no sistema de comentários."
              }
            </li>
            <li>
              <strong>Dados de Uso:</strong>
              {
                " Coletamos informações sobre como você interage com o site para melhorar nossa interface e acervo."
              }
            </li>
          </ul>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Uso de Cookies</h2>
          <p>
            Utilizamos cookies para fornecer uma experiência personalizada,
            lembrar suas preferências e analisar o tráfego. Você pode optar por
            recusar cookies através das configurações do seu navegador, embora
            isso possa afetar a funcionalidade de algumas partes do site.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            3. Retenção de Dados
          </h2>
          <p>
            Apenas retemos as informações coletadas pelo tempo necessário para
            fornecer o serviço solicitado. Quando armazenamos dados, os
            protegemos dentro de meios comercialmente aceitáveis ​​para evitar
            perdas e roubos, bem como acesso, divulgação, cópia, uso ou
            modificação não autorizados.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            4. Seus Direitos (LGPD)
          </h2>
          <p>
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você
            tem o direito de:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acessar seus dados pessoais.</li>
            <li>Solicitar a correção de dados incompletos ou inexatos.</li>
            <li>Solicitar a exclusão de seus dados de nossa base.</li>
            <li>Revogar seu consentimento a qualquer momento.</li>
          </ul>
        </section>
        <p className="pt-8 text-sm opacity-60 italic">
          Esta política é efetiva a partir de Abril de 2026.
        </p>
      </div>
    </div>
  );
}
