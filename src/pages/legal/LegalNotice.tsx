import { CheckCircle, Building } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';

function LegalNotice() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader showLanguageSelector={true} />

      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-400 to-emerald-500">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">Mentions Légales</h1>
          <p className="text-xl text-white/90">Dernière mise à jour : Janvier 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">

            <div className="bg-gradient-to-br from-amber-50 to-emerald-50 border-2 border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <Building className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <p className="text-lg text-slate-700 leading-relaxed mb-0">
                Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, voici les mentions légales du site <strong>MaSécurité</strong>.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              1. Éditeur du Site
            </h2>
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-lg text-slate-700">
                <li><strong>Raison sociale :</strong> Digital Genesys Solutions LLC (MaSécurité)</li>
                <li><strong>Forme juridique :</strong> Limited Liability Company (LLC)</li>
                <li><strong>Numéro d'enregistrement :</strong> 3003074</li>
                <li><strong>Date de formation :</strong> 16 décembre 2024</li>
                <li><strong>Siège social :</strong> 5203 Juan Tabo Blvd STE 2B, Albuquerque, NM 87111, USA</li>
                <li><strong>Agent enregistré :</strong> Cindy's New Mexico LLC (5587298BA)</li>
                <li><strong>Adresse de l'agent :</strong> 5203 Juan Tabo Blvd NE Suite 2a, Albuquerque, NM 87111, USA</li>
                <li><strong>État de formation :</strong> New Mexico, USA</li>
                <li><strong>Téléphone :</strong> 01 89 71 28 66</li>
                <li><strong>Email :</strong> info@masecurite.be</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              2. Hébergement du Site
            </h2>
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-lg text-slate-700">
                <li><strong>Hébergeur :</strong> Supabase Inc.</li>
                <li><strong>Siège social :</strong> 970 Toa Payoh North, #07-04, Singapore 318992</li>
                <li><strong>Site web :</strong> <a href="https://supabase.com" className="text-amber-600 hover:text-amber-700 underline" target="_blank" rel="noopener noreferrer">https://supabase.com</a></li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              3. Propriété Intellectuelle
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              L'ensemble du contenu présent sur ce site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) est la propriété exclusive de MaSécurité ou fait l'objet d'une autorisation d'utilisation.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Toute reproduction, représentation, modification, publication, adaptation totale ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de MaSécurité.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Toute exploitation non autorisée du site ou de l'un des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              4. Protection des Données Personnelles
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              MaSécurité s'engage à respecter votre vie privée et à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Pour plus d'informations sur la collecte et le traitement de vos données, consultez notre <a href="/legal/privacy-policy" className="text-amber-600 hover:text-amber-700 font-semibold underline">Politique de Confidentialité</a>.
            </p>
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <p className="text-slate-700 mb-2"><strong>Délégué à la Protection des Données (DPO) :</strong></p>
              <ul className="space-y-2 text-slate-700">
                <li><strong>Email :</strong> dpo@masecurite.be</li>
                <li><strong>Téléphone :</strong> 01 89 71 28 66</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              5. Cookies
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Le site MaSécurité utilise des cookies pour améliorer votre expérience de navigation et analyser l'utilisation du site.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Pour en savoir plus sur l'utilisation des cookies et la gestion de vos préférences, consultez notre <a href="/legal/cookie-policy" className="text-amber-600 hover:text-amber-700 font-semibold underline">Politique des cookies</a>.
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              6. Conditions d'Utilisation du Site
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              L'accès au site MaSécurité est gratuit. Tous les frais nécessaires pour accéder au service (matériel informatique, connexion Internet, etc.) sont à la charge de l'utilisateur.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              L'utilisateur s'engage à :
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              <li>Utiliser le site conformément à sa destination et aux lois en vigueur</li>
              <li>Ne pas perturber le bon fonctionnement du site</li>
              <li>Ne pas extraire ou réutiliser le contenu du site sans autorisation</li>
              <li>Ne pas usurper l'identité d'un tiers ou masquer sa propre identité</li>
              <li>Ne pas diffuser de contenu illicite, offensant ou contraire aux bonnes mœurs</li>
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              7. Liens Hypertextes
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Le site MaSécurité peut contenir des liens vers d'autres sites internet. MaSécurité n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              La création de liens hypertextes vers le site MaSécurité nécessite une autorisation préalable écrite. Pour toute demande, contactez-nous à <strong>info@masecurite.be</strong>.
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              8. Limitation de Responsabilité
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              MaSécurité s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, MaSécurité ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations disponibles.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              MaSécurité ne saurait être tenu responsable :
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              <li>Des interruptions temporaires du site pour maintenance ou mise à jour</li>
              <li>Des dysfonctionnements dus à des causes externes (pannes de réseau, etc.)</li>
              <li>Des dommages directs ou indirects résultant de l'utilisation du site</li>
              <li>De l'utilisation frauduleuse du site par un tiers</li>
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              9. Droit Applicable et Juridiction
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Les présentes mentions légales sont régies par le droit français. Tout litige relatif à l'utilisation du site MaSécurité sera soumis à la compétence exclusive des tribunaux français.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Conformément aux dispositions du Code de la consommation, l'utilisateur dispose d'un droit de recours gratuit à un médiateur de la consommation en cas de litige.
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              10. Médiation et Résolution des Litiges
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              En cas de litige, nous vous encourageons à nous contacter en priorité pour trouver une solution amiable. Si aucun accord n'est trouvé, vous pouvez recourir gratuitement à un médiateur de la consommation.
            </p>
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <p className="text-slate-700 mb-2"><strong>Plateforme européenne de résolution des litiges en ligne :</strong></p>
              <a href="https://ec.europa.eu/consumers/odr" className="text-amber-600 hover:text-amber-700 underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              11. Crédits
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Ce site a été conçu et développé par MaSécurité. Les icônes utilisées proviennent de la bibliothèque Lucide React sous licence ISC.
            </p>

            <div className="bg-gradient-to-br from-amber-50 to-emerald-50 border-2 border-amber-200 rounded-2xl p-8 mt-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Besoin de Plus d'Informations ?</h3>
              <p className="text-lg text-slate-700 mb-4">
                Pour toute question concernant ces mentions légales, contactez-nous :
              </p>
              <ul className="space-y-2 text-slate-700">
                <li><strong>Société :</strong> Digital Genesys Solutions LLC</li>
                <li><strong>Email :</strong> info@masecurite.be</li>
                <li><strong>Téléphone :</strong> 01 89 71 28 66</li>
                <li><strong>Adresse :</strong> 5203 Juan Tabo Blvd STE 2B, Albuquerque, NM 87111, USA</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LegalNotice;
