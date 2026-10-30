export function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-500">
      <h1 className="font-title text-4xl md:text-5xl text-palette-yellow">
        Termos de Uso
      </h1>
      <div className="prose prose-invert max-w-none space-y-6 text-white/80 leading-relaxed">
        <p>
          Ao acessar o site Partituras Espíritas, você concorda em cumprir estes
          termos de serviço, todas as leis e regulamentos aplicáveis ​​e
          concorda que é responsável pelo cumprimento de todas as leis locais
          aplicáveis.
        </p>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Licença de Uso</h2>
          <p>
            O conteúdo deste site (partituras, áudios e textos) é
            disponibilizado para fins de estudo, prática musical e divulgação da
            doutrina espírita. É proibida a comercialização de qualquer material
            baixado deste portal.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            2. Isenção de Responsabilidade
          </h2>
          <p>
            Os materiais no site do Partituras Espíritas são fornecidos 'como
            estão'. Não oferecemos garantias, expressas ou implícitas, e, por
            este meio, isentamos e negamos todas as outras garantias, incluindo,
            sem limitação, garantias implícitas ou condições de comercialização
            ou adequação a um fim específico.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Limitações</h2>
          <p>
            Em nenhum caso o Partituras Espíritas ou seus fornecedores serão
            responsáveis ​​por quaisquer danos decorrentes do uso ou da
            incapacidade de usar os materiais em nosso site.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            4. Precisão dos Materiais
          </h2>
          <p>
            Os materiais exibidos no site podem incluir erros técnicos,
            tipográficos ou fotográficos. Não garantimos que qualquer material
            em seu site seja preciso, completo ou atual.
          </p>
        </section>
        <p className="pt-8 text-sm opacity-60 italic">
          Estes termos são regidos e interpretados de acordo com as leis
          brasileiras.
        </p>
      </div>
    </div>
  );
}
