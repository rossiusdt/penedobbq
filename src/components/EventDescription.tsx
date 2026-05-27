export default function EventDescription() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrição do evento</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            Bruna Louise celebra 15 anos de stand up comedy do jeito mais especial possível — com muito humor, emoção e um show inesquecível!
          </p>
          <p>
            Conhecida por seus textos afiados, histórias pessoais e uma pitada de drama, Bruna convida você para essa festa única onde a valsa foi cancelada por falta de pai, mas o ingresso você garante agora!
          </p>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">O que esperar:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Stand up comedy ao vivo</li>
              <li>Histórias reais e hilárias</li>
              <li>15 anos de carreira celebrados em grande estilo</li>
              <li>Uma noite cheia de risadas e emoção</li>
              <li>Experiência teatral única</li>
            </ul>
          </div>
        </div>

      </section>
    </div>
  );
}
