import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en' | 'es';

type TranslationValue = string | string[] | Record<string, unknown> | Array<Record<string, unknown>>;
type TranslationFunction = ((key: string) => TranslationValue) & Record<string, unknown>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationFunction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && ['fr', 'en', 'es'].includes(savedLang)) {
      return savedLang as Language;
    }
    return 'fr';
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (!savedLang) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          const countryCode = data.country_code?.toLowerCase();
          let detectedLang: Language = 'fr';

          if (countryCode === 'fr') {
            detectedLang = 'fr';
          } else if (countryCode === 'es') {
            detectedLang = 'es';
          } else if (['gb', 'us', 'ca', 'au', 'nz', 'ie'].includes(countryCode)) {
            detectedLang = 'en';
          }

          setLanguageState(detectedLang);
          localStorage.setItem('language', detectedLang);
        })
        .catch(() => {
          console.log('Failed to detect language from IP');
        });
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = getTranslations(language);

  const tFunc = (key: string): TranslationValue => {
    const keys = key.split('.');
    let value: Record<string, unknown> | unknown = t;

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }

    return (value as TranslationValue) || key;
  };

  Object.assign(tFunc, t);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: tFunc }}>
      {children}
    </LanguageContext.Provider>
  );
};

const getTranslations = (lang: Language) => {
  return translations[lang];
};

const translations = {
  fr: {
    nav: {
      home: 'Accueil',
      services: 'Services',
      ourServices: 'Nos services',
      pricing: 'Tarifs',
      features: 'Avantages',
      quickAnalysis: 'Diagnostic rapide',
      quickScan: 'Diagnostic rapide',
      about: 'À propos',
      whoAreWe: 'Qui sommes-nous?',
      contact: 'Nous contacter',
      quickSupport: 'Assistance Rapide',
      needHelp: 'Besoin d\'aide?',
      help: 'Aide',
      freeScan: 'Scan gratuit',
      getStarted: 'C\'est parti!',
      backHome: 'Retour à l\'accueil',
      belgianCompany: 'Entreprise belge',
      frenchSupport: 'Support en français',
      businessHours: 'Lun-Ven: 9h-18h',
      emergency247: 'Urgences: 24h/24'
    },
    trustBadges: {
      ssl: {
        title: 'Sécurisé SSL',
        subtitle: 'Paiement 100% sécurisé'
      },
      gdpr: {
        title: 'RGPD',
        subtitle: 'Données protégées'
      },
      certified: {
        title: 'Certifié EU',
        subtitle: 'Conformité européenne'
      },
      guarantee: {
        title: 'Garantie 30 jours',
        subtitle: 'Satisfait ou remboursé'
      }
    },
    paymentBadges: {
      title: 'Paiement 100% sécurisé - Moyens acceptés',
      sslEncrypted: 'Transactions chiffrées SSL',
      gdprCompliant: 'Conforme RGPD',
      satisfaction: 'Satisfait ou Remboursé'
    },
    hero: {
      title: 'Protégez vos données.',
      subtitle: 'Simplifiez votre informatique.',
      description: 'Solutions Cloud sécurisées et interventions informatiques rapides pour particuliers et professionnels',
      cta: 'Découvrir nos services',
      ctaSecondary: 'Nous contacter',
      simpleToUse: 'Simple d\'utilisation',
      secure: 'Sécurisé et privé',
      support247: 'Support 24h/24 et 7j/7'
    },
    services: {
      title: 'Nos Services',
      subtitle: 'Une solution complète, pensée pour votre sécurité',
      cloudServer: {
        title: 'Serveur Cloud Sécurisé',
        description: 'Accédez à vos fichiers personnels ou professionnels où que vous soyez. Vos données sont protégées par un chiffrement complexe et sauvegardées de manière sûre et durable, indépendamment de tout appareil unique.',
        feature1: 'Virtualisation VMware',
        feature2: 'Processeur Intel Xeon',
        feature3: 'Trafic illimité',
        feature4: 'REST API disponible'
      },
      security: {
        title: 'Suite Sécurité Intégrale',
        description: 'Notre MaSecuSecurity Software vous protège contre tous les types de menaces informatiques et sécurise efficacement votre identité numérique sur internet.',
        feature1: 'Protection antivirus avancée',
        feature2: 'MaSecuIntelligard inclus',
        feature3: 'Protection contre les cyberattaques',
        feature4: 'Blocage de la collecte de données'
      },
      phone: {
        title: 'Assistance Téléphonique',
        description: 'Un technicien certifié vous assiste par téléphone pour tout problème rencontré : accès Internet, emails, VPN clients, maintenance informatique et dépannage bureautique.',
        feature1: 'Du lundi au vendredi',
        feature2: '10h00 à 18h00',
        feature3: 'Techniciens certifiés',
        feature4: 'Suivi personnalisé'
      },
      identityProtection: {
        title: 'Protection d\'Identité numérique',
        description: 'Surveillez et protégez votre identité numérique contre le vol de données, les fuites d\'informations personnelles et les tentatives de fraude en ligne.',
        feature1: 'Surveillance du Dark Web',
        feature2: 'Alertes en temps réel',
        feature3: 'Protection des données personnelles',
        feature4: 'Assistance en cas de vol d\'identité'
      },
      family: {
        title: 'Restez connectés avec vos proches',
        description: 'Créez des albums photos partagés avec votre famille, synchronisez automatiquement vos souvenirs depuis votre téléphone et partagez-les en toute sécurité. Une interface simple que même vos grands-parents pourront utiliser facilement.'
      }
    },
    features: {
      title: 'Pourquoi Choisir MaSécurité ?',
      subtitle: 'L\'excellence au service de votre sérénité numérique',
      security: {
        title: 'Sécurité maximale',
        description: 'Vos données sont protégées par les technologies de cryptage les plus avancées'
      },
      support: {
        title: 'Support réactif',
        description: 'Une équipe d\'experts disponible 24/7 pour répondre à vos besoins'
      },
      simplicity: {
        title: 'Simplicité d\'utilisation',
        description: 'Interface intuitive accessible même aux utilisateurs débutants'
      },
      performance: {
        title: 'Performances optimales',
        description: 'Infrastructure cloud haute performance pour une expérience fluide'
      },
      cards: {
        completeProtection: {
          title: 'Protection Complète',
          description: 'MaSecuvous aide à lutter contre les attaques du quotidien avec une protection des utilisateurs, du réseau et des équipements.'
        },
        preventiveMaintenance: {
          title: 'Maintenance Préventive',
          description: 'MaSecumaintient la santé de vos systèmes informatiques en prévenant tout dysfonctionnement qui pourrait vous causer des problèmes.'
        },
        performantConnections: {
          title: 'Connexions Performantes',
          description: 'La garantie de connexions fiables et performantes pour l\'échange et le transfert de vos données en toute sécurité.'
        },
        softwareApplications: {
          title: 'Logiciels & Applications',
          description: 'MaSecuvous fournit les logiciels et les applications pour une meilleure gestion de votre réseau et de votre activité.'
        }
      }
    },
    pricing: {
      title: 'Nos Tarifs',
      subtitle: 'Choisissez la formule qui vous correspond le mieux !',
      choosePlan: 'Choisir cette offre',
      choose: 'Choisir',
      perMonth: '€/mois',
      taxExcluded: 'HT',
      recommended: 'Recommandé',
      mostPopular: 'Plus populaire',
      bestPrice: 'Meilleur prix',
      bestValue: 'Meilleure valeur',
      essential: 'Essentielle',
      complete: 'Complète',
      features: 'Fonctionnalités',
      inAdvance: '',
      inAdvancePlus24Free: '+ 24 mois gratuits',
      inAdvancePlus12Free: '+ 12 mois gratuits',
      inAdvancePlus3Free: '+ 3 mois gratuits',
      onlyAfterFreeVerification: 'Uniquement disponible après une vérification gratuite',
      taxNotice: 'Tous les prix sont indiqués HT (Hors Taxes). TVA applicable selon votre pays de résidence.',
      durationHeader: 'Durée',
      bestMonthlyValue: 'MEILLEURE VALEUR MENSUELLE',
      from: 'dès',
      perMonthShort: '/mois',
      monthsShort: 'Mois',
      customerType: {
        individual: 'Particulier',
        professional: 'Professionnel'
      },
      durations: {
        '36months': '36 mois + 24 offerts (5 ans)',
        '24months': '24 mois + 12 offerts (3 ans)',
        '12months': '12 mois + 3 offerts',
        '6months': '6 mois'
      },
      tableRows: {
        duration36: '36 mois (3 ans)',
        duration24: '24 mois (2 ans)',
        duration12: '12 mois (1 an)',
        duration6: '6 mois'
      },
      installation: {
        title: 'FRAIS D\'INSTALLATION',
        description: 'Des frais d\'installation non remboursables s\'appliquent lors de la souscription à un plan. Ils couvrent l\'activation du logiciel, l\'optimisation du système, l\'analyse technique ainsi que la suppression des logiciels malveillants.',
        priceAmount: '99,00 €',
        note: '',
        paymentMethodsTitle: 'Moyens de paiement acceptés'
      },
      offers: {
        s: {
          badge: 'Pour débuter',
          name: 'Protection Essentielle',
          storage: '10 GB de stockage',
          features: [
            'Espace Cloud 10GB',
            'MaSecuSecurity Software',
            '3h d\'assistance/mois',
            'Retour sous 24h',
            'Mises à jour annuelles'
          ]
        },
        m: {
          badge: 'Pour la famille',
          name: 'Protection Famille',
          storage: '30 GB de stockage',
          features: [
            'Tout de Protection Essentielle',
            'Espace Cloud 30GB',
            '5h d\'assistance/mois',
            'Suivi personnalisé',
            'Nettoyage inclus'
          ]
        },
        l: {
          badge: 'Protection maximale',
          name: 'Protection Complète',
          storage: '120 GB de stockage',
          features: [
            'Tout de Protection Famille',
            'Espace Cloud 120GB',
            'Assistance illimitée',
            'Retour illimité',
            'Support prioritaire'
          ]
        }
      },
      addons: {
        title: 'Modules Complémentaires',
        subtitle: 'Personnalisez votre expérience avec nos options additionnelles',
        devices: 'appareils',
        identity: {
          title: 'Protection d\'identité',
          description: 'Surveillez vos informations personnelles et protégez votre identité en ligne contre le vol et la fraude'
        },
        scam: {
          title: 'Protection Anti-Arnaque',
          description: 'Détectez et bloquez les tentatives de phishing, les emails frauduleux et les sites web malveillants'
        },
        vpn: {
          title: 'VPN Sécurisé',
          description: 'Naviguez anonymement et accédez en toute sécurité à vos contenus préférés depuis n\'importe où dans le monde'
        }
      },
      featureTable: [
        { name: 'Heures d\'ouverture', description: 'Horaires de disponibilité du support technique', values: ['10:00 — 18:00\nLun - Ven', '08:00 — 21:00\nLun - Ven', '08:00 — 21:00\n365 Jours'] },
        { name: 'Aide et Support de professionnels certifiés', description: 'Nous aidons à réparer les problèmes sur votre ordinateur', values: ['3 heures\npar mois', '5 heures\npar mois', 'Illimité'] },
        { name: 'Temps de réponse', description: 'Notre réponse à vos problèmes informatiques', values: ['Sous 24 heures', 'Maximum\n3 heures', 'Immédiat'] },
        { name: 'Espace Cloud Sécurisé', description: 'Stockage cloud chiffré pour vos fichiers', values: ['10 GB', '30 GB', '120 GB'] },
        { name: 'MaSecuSecurity Software', description: 'Protection antivirus et anti-malware avancée', values: ['✓', '✓', '✓'] },
        { name: 'MaSecuAdBlocker', description: 'Protège votre navigation et bloque les publicités', values: ['✓', '✓', '✓'] },
        { name: 'Nettoyer', bullets: ['+15 Go récupérés en moyenne', 'Trackers & mouchards supprimés', 'Navigateur jusqu\'à 3x plus rapide', 'Données personnelles protégées'], values: ['✓', '✓', '✓'] },
        { name: 'Optimisation', bullets: ['Démarrage en moins de 30 sec', '100% de votre RAM disponible', 'Fini les ralentissements', 'Performances du 1er jour'], values: ['✓', '✓', '✓'] },
        { name: 'Souscription transférable', description: 'Transférez votre abonnement à un autre ordinateur', values: ['—', '✓', '✓'] },
        { name: 'Maintenance régulière', description: 'Maintenance préventive pour votre appareil', values: ['Annuelles', 'Semestrielles', 'Trimestrielles'] },
        { name: 'Suivi personnalisé', description: 'Un référent dédié pour votre compte', values: ['—', '✓', '✓'] },
        { name: 'Support prioritaire', description: 'Vos demandes traitées en priorité', values: ['—', '—', '✓'] },
        { name: 'Vérification des fuites de données', description: 'Vérifiez si vos identifiants et mots de passe ont été compromis', values: ['—', '✓', '✓'] }
      ]
    },
    standaloneProducts: {
      badge: 'Solutions Indépendantes',
      title: 'Services Autonomes',
      subtitle: 'Souscrire sans abonnement principal - parfait pour des besoins spécifiques',
      aiAssistant: {
        name: 'MaSecuAI Assistant',
        description: 'Assistant IA alimenté par OpenAI pour une aide instantanée 24/7 sur tous vos besoins informatiques.',
        price: '19.99€',
        period: '/mois',
        features: [
          'Powered by OpenAI',
          'Support 24/7',
          'Réponses instantanées',
          'Multilingue',
          'Conseils personnalisés'
        ],
        button: 'En savoir plus'
      },
      mobileSecurity: {
        name: 'MaSecuMobile Security',
        description: 'Protection Bitdefender Total Security pour vos mobiles et tablettes Android.',
        price: '9.99€',
        period: '/appareil',
        features: [
          'Scanner Malware auto',
          'Protection Web',
          'Alerte Arnaque SMS',
          'VPN & Anti-Vol',
          'Blocage appels spam'
        ],
        button: 'En savoir plus'
      }
    },
    addons: {
      badge: 'Options Premium',
      title: 'Boostez votre protection',
      subtitle: 'Ajoutez des fonctionnalités premium à votre abonnement existant.',
      requirement: 'Nécessite un abonnement actif (Protection Essentielle, Famille ou Complète)',
      vpnPro: {
        name: 'MaSecuVPN Pro',
        price: '9.99€',
        period: '/mois',
        features: [
          '50+ serveurs dans 30 pays',
          'Bande passante illimitée',
          'Chiffrement AES-256',
          'Kill Switch automatique',
          'Aucun log conservé'
        ],
        button: 'En savoir plus'
      },
      adblock: {
        name: 'MaSecuAdBlock Plus',
        price: '9.99€',
        period: '/mois',
        features: [
          'Blocage pubs & pop-ups',
          'Anti-trackers avancé',
          'Protection vie privée',
          'Listes blanches personnalisées',
          'Navigation 40% plus rapide'
        ],
        button: 'En savoir plus'
      },
      systemCleaner: {
        name: 'MaSecuSystem Cleaner',
        description: 'Optimisez les performances de votre PC. Supprimez les fichiers inutiles et accélérez votre système.',
        price: '9.99€',
        period: '/mois',
        features: [
          'Nettoyage fichiers temporaires',
          'Optimisation du registre',
          'Gestionnaire de démarrage',
          'Défragmentation SSD/HDD',
          'Nettoyage automatique planifié'
        ],
        button: 'En savoir plus'
      },
      totalCare: {
        name: 'MaSecuTotal Care',
        badge: 'ÉCONOMISEZ 17%',
        description: 'Le pack complet : VPN + AdBlock + Cleaner réunis. La protection ultime pour votre vie numérique.',
        price: '24.99€',
        period: '/mois',
        oldPrice: 'au lieu de 29.97€',
        includes: [
          'VPN Pro',
          'AdBlock Plus',
          'System Cleaner'
        ],
        button: 'En savoir plus'
      }
    },
    vpnProduct: {
      hero: {
        title: 'MaSecuVPN Pro',
        subtitle: 'Naviguez en toute confidentialité avec notre VPN ultra-rapide. Protégez vos données sur les réseaux Wi-Fi publics.',
        ctaPrimary: 'Commencer maintenant - 9.99€/mois',
        ctaSecondary: 'En savoir plus'
      },
      ipSection: {
        title: 'Votre localisation actuelle',
        subtitle: 'Voici ce que les sites web peuvent voir sur vous en ce moment même'
      },
      featuresSection: {
        title: 'Pourquoi choisir MaSecuVPN Pro ?',
        subtitle: 'La protection la plus complète pour votre vie privée en ligne',
        features: [
          { title: 'Chiffrement militaire', description: 'Protection AES-256 bits pour sécuriser toutes vos données' },
          { title: '50+ serveurs mondiaux', description: 'Accédez à du contenu depuis 30 pays différents' },
          { title: 'Vitesse ultra-rapide', description: 'Streaming et navigation sans ralentissement' },
          { title: 'Politique no-logs', description: 'Nous ne conservons aucune trace de votre activité' },
          { title: 'Kill Switch automatique', description: 'Protection continue même en cas de déconnexion' },
          { title: 'Multi-plateformes', description: 'Compatible Windows, Mac, iOS, Android, Linux' }
        ]
      },
      serversSection: {
        title: 'Serveurs dans le monde entier',
        subtitle: 'Connectez-vous à plus de 50 serveurs dans 30 pays',
        countries: [
          '🇫🇷 France', '🇩🇪 Allemagne', '🇬🇧 Royaume-Uni', '🇺🇸 États-Unis',
          '🇨🇦 Canada', '🇯🇵 Japon', '🇦🇺 Australie', '🇧🇷 Brésil',
          '🇪🇸 Espagne', '🇮🇹 Italie', '🇳🇱 Pays-Bas', '🇨🇭 Suisse',
          '🇸🇪 Suède', '🇳🇴 Norvège', '🇩🇰 Danemark', '🇫🇮 Finlande',
          '🇵🇱 Pologne', '🇦🇹 Autriche', '🇧🇪 Belgique', '🇮🇪 Irlande',
          '🇵🇹 Portugal', '🇬🇷 Grèce', '🇨🇿 Tchéquie', '🇭🇺 Hongrie',
          '🇷🇴 Roumanie', '🇧🇬 Bulgarie', '🇸🇬 Singapour', '🇭🇰 Hong Kong',
          '🇮🇳 Inde', '🇰🇷 Corée du Sud', '🇲🇽 Mexique', '🇦🇷 Argentine'
        ]
      },
      comparisonSection: {
        title: 'Sans VPN vs Avec MaSecuVPN Pro',
        without: {
          title: 'Sans VPN',
          items: [
            'IP visible par tous les sites',
            'Localisation exposée',
            'FAI peut voir votre activité',
            'Données vulnérables sur Wi-Fi public',
            'Contenu géo-restreint inaccessible'
          ]
        },
        with: {
          title: 'Avec MaSecuVPN Pro',
          items: [
            'IP masquée et anonyme',
            'Localisation cachée',
            'Navigation privée totale',
            'Protection sur tous les réseaux',
            'Accès mondial sans restriction'
          ]
        }
      },
      pricingSection: {
        title: 'Choisissez votre formule',
        individual: 'Particulier',
        helpText: '💬 Besoin d\'aide pour choisir ? Nos experts sont là pour vous guider.',
        ctaButton: 'Parler à un expert'
      },
      faqSection: {
        title: 'Questions fréquentes',
        faqs: [
          {
            q: 'Puis-je utiliser le VPN sur plusieurs appareils ?',
            a: 'Oui ! MaSecuVPN Pro fonctionne sur Windows, Mac, iOS, Android et Linux. Vous pouvez protéger jusqu\'à 5 appareils simultanément avec un seul abonnement.'
          },
          {
            q: 'Le VPN ralentit-il ma connexion Internet ?',
            a: 'Non. Notre infrastructure de serveurs haute performance garantit des vitesses optimales. La plupart des utilisateurs ne constatent aucune différence notable.'
          },
          {
            q: 'Conservez-vous des logs de mon activité ?',
            a: 'Absolument pas. Nous appliquons une politique no-logs stricte. Nous ne conservons aucune trace de vos activités en ligne ou de vos connexions.'
          },
          {
            q: 'Puis-je accéder à du contenu géo-restreint ?',
            a: 'Oui. Avec nos serveurs dans 30 pays, vous pouvez accéder à du contenu disponible uniquement dans certaines régions.'
          }
        ]
      },
      ctaSection: {
        title: 'Prêt à protéger votre vie privée ?',
        subtitle: 'Rejoignez des milliers d\'utilisateurs qui font confiance à MaSecuVPN Pro',
        button: 'Commencer maintenant'
      }
    },
    pricingCard: {
      popular: 'Plus populaire',
      priceLabel: 'HT',
      monthlyPrice: 'Prix mensuel',
      perMonth: 'HT/mois',
      ctaButton: 'Choisir cette offre'
    },
    ipDetector: {
      loading: 'Détection en cours...',
      error: {
        title: 'Votre connexion est exposée',
        message: 'Impossible de détecter votre localisation, mais sans VPN, votre connexion reste vulnérable.'
      },
      main: {
        title: 'Votre connexion est exposée !',
        subtitle: 'Vos données sont visibles par votre FAI et les sites web'
      },
      labels: {
        ipAddress: 'Adresse IP publique',
        ipHelper: 'Visible par tous les sites web',
        location: 'Localisation détectée',
        isp: 'Fournisseur d\'accès Internet (FAI)',
        notAvailable: 'Non disponible'
      },
      warning: {
        title: 'Sans protection VPN :',
        items: [
          'Votre FAI peut voir tous vos sites visités',
          'Votre localisation est révélée à chaque connexion',
          'Vos données peuvent être interceptées sur les réseaux publics',
          'Les sites web suivent votre activité en ligne'
        ]
      }
    },
    adBlockProduct: {
      hero: {
        title: 'MaSecuAdBlock Plus',
        subtitle: 'Éliminez toutes les publicités intrusives et accélérez votre navigation jusqu\'à 40% plus vite.',
        ctaPrimary: 'Commencer maintenant - 9.99€/mois',
        ctaSecondary: 'Voir les fonctionnalités'
      },
      liveStats: {
        title: 'Protection en temps réel',
        subtitle: 'Simulateur : ce que MaSecuAdBlock Plus bloque chaque jour',
        adsBlocked: 'Publicités bloquées',
        trackersStopped: 'Trackers stoppés',
        timeSaved: 'Temps économisé',
        adsHelper: 'Aujourd\'hui pour cet utilisateur moyen',
        trackersHelper: 'Empêche le suivi de votre activité',
        timeHelper: 'Chargement plus rapide des pages',
        warningTitle: 'Sans AdBlock, vous subissez :',
        warningItems: [
          'Des milliers de publicités intrusives chaque jour',
          'Des trackers qui collectent vos données de navigation',
          'Des pages qui mettent jusqu\'à 40% plus de temps à charger',
          'Des risques accrus de malware via des publicités malveillantes'
        ]
      },
      features: {
        title: 'Une navigation plus rapide et plus sûre',
        subtitle: 'Protection complète contre les publicités et les trackers',
        list: [
          {
            title: 'Blocage intelligent',
            description: 'Élimine automatiquement les publicités intrusives et pop-ups'
          },
          {
            title: '40% plus rapide',
            description: 'Pages qui se chargent instantanément sans publicités lourdes'
          },
          {
            title: 'Anti-tracking',
            description: 'Empêche les trackers de suivre votre navigation'
          },
          {
            title: 'Protection malware',
            description: 'Bloque les sites malveillants et les scripts dangereux'
          },
          {
            title: 'Vie privée renforcée',
            description: 'Empêche la collecte de vos données personnelles'
          },
          {
            title: 'Listes personnalisées',
            description: 'Créez vos propres règles de filtrage avancées'
          }
        ]
      },
      comparison: {
        title: 'L\'impact d\'AdBlock Plus',
        subtitle: 'Découvrez la différence immédiate',
        without: {
          title: 'Sans AdBlock',
          loadTime: 'Temps de chargement',
          dataDownloaded: 'Données téléchargées',
          trackersActive: 'Trackers actifs',
          issues: [
            'Pop-ups intrusifs',
            'Bannières publicitaires',
            'Vidéos auto-play',
            'Suivi publicitaire'
          ]
        },
        with: {
          title: 'Avec MaSecuAdBlock Plus',
          benefits: [
            'Navigation fluide',
            'Contenu pertinent uniquement',
            'Expérience sans interruption',
            'Vie privée protégée'
          ]
        }
      },
      pricing: {
        title: 'Naviguez sans interruption',
        subtitle: 'Bloquez les publicités et protégez votre vie privée',
        specialOffer: '🎉 Offre spéciale : Mois bonus sur tous les forfaits',
        planTitle: 'MaSecuAdBlock Plus',
        price: '9.99€',
        perMonth: '/mois',
        requirement: 'Nécessite un abonnement MaSécurité actif',
        featuresTitle: 'Fonctionnalités incluses :',
        featuresList: [
          'Blocage de toutes les publicités (bannières, vidéos, pop-ups)',
          'Protection anti-tracking avancée',
          'Navigation jusqu\'à 40% plus rapide',
          'Blocage automatique des malwares publicitaires',
          'Listes de filtrage personnalisées',
          'Statistiques détaillées en temps réel',
          'Compatible tous navigateurs (Chrome, Firefox, Edge, Safari)',
          'Économie de bande passante jusqu\'à 50%',
          'Protection contre le phishing',
          'Mises à jour automatiques des filtres',
          'Support technique prioritaire 24/7'
        ],
        ctaButton: 'Commander AdBlock Plus',
        trial: 'Essai gratuit 30 jours - Sans engagement',
        helpText: '💬 Questions sur nos forfaits AdBlock ? Contactez nos experts.',
        expertButton: 'Parler à un expert'
      },
      finalCta: {
        title: 'Profitez d\'une navigation propre',
        subtitle: 'Plus de 2 millions de publicités bloquées chaque jour',
        button: 'Commencer gratuitement'
      }
    },
    systemCleanerProduct: {
      hero: {
        title: 'MaSecuSystem Cleaner',
        subtitle: 'Redonnez vie à votre PC. Supprimez les fichiers inutiles et accélérez votre système instantanément.',
        ctaPrimary: 'Commencer maintenant - 9.99€/mois',
        ctaSecondary: 'Analyser mon système'
      },
      scan: {
        scanning: {
          title: 'Analyse en cours...',
          subtitle: 'Détection des problèmes de performance',
          analyzing: 'Analyse de votre système...',
          wait: 'Cela peut prendre quelques instants'
        },
        results: {
          title: 'Résultats de l\'analyse',
          subtitle: 'Voici ce qui ralentit votre PC',
          tempFiles: 'Fichiers temporaires',
          tempFilesDesc: 'Fichiers temporaires qui occupent inutilement de l\'espace disque',
          registryIssues: 'Problèmes registre',
          registryIssuesDesc: 'Entrées invalides qui ralentissent votre système',
          diskSpace: 'Espace récupérable',
          diskSpaceDesc: 'Espace disque qui peut être libéré immédiatement',
          startupItems: 'Programmes au démarrage',
          startupItemsDesc: 'Applications qui ralentissent le démarrage de votre PC',
          solution: 'MaSecuSystem Cleaner peut résoudre tous ces problèmes !',
          solutionDesc: 'Nettoyez, optimisez et accélérez votre PC en un seul clic. Récupérez jusqu\'à {space} GB d\'espace et améliorez les performances jusqu\'à 40%.'
        }
      },
      features: {
        title: 'Fonctionnalités complètes',
        subtitle: 'Tout ce dont vous avez besoin pour un PC rapide et efficace',
        list: [
          {
            title: 'Nettoyage intelligent',
            description: 'Suppression sécurisée des fichiers temporaires et inutiles'
          },
          {
            title: 'Optimisation registre',
            description: 'Correction des erreurs et fragmentation du registre Windows'
          },
          {
            title: 'Gestionnaire démarrage',
            description: 'Contrôlez les programmes qui ralentissent votre PC au démarrage'
          },
          {
            title: 'Défragmentation',
            description: 'Optimisation SSD/HDD pour des performances maximales'
          },
          {
            title: 'Nettoyage automatique',
            description: 'Planification intelligente pour un PC toujours optimisé'
          },
          {
            title: 'Nettoyage sécurisé',
            description: 'Protection des fichiers système importants'
          }
        ]
      },
      comparison: {
        title: 'Résultats avant / après',
        subtitle: 'L\'impact immédiat de System Cleaner',
        bootTime: 'Temps de démarrage',
        diskSpace: 'Espace disque libre',
        performance: 'Performance globale',
        before: 'Avant',
        after: 'Après'
      },
      pricing: {
        title: 'Optimisez votre PC dès maintenant',
        subtitle: 'Plans flexibles pour tous vos besoins',
        specialOffer: '⚡ Obtenez jusqu\'à 3 mois gratuits avec un engagement long terme',
        planTitle: 'MaSecuSystem Cleaner',
        price: '9.99€',
        perMonth: '/mois',
        requirement: 'Nécessite un abonnement MaSécurité actif',
        featuresTitle: 'Fonctionnalités incluses :',
        featuresList: [
          'Nettoyage automatique planifié',
          'Optimisation du registre Windows',
          'Gestionnaire de démarrage intelligent',
          'Défragmentation SSD/HDD optimisée',
          'Récupération d\'espace disque',
          'Suppression fichiers temporaires',
          'Statistiques de performance détaillées',
          'Monitoring en temps réel',
          'Protection contre les logiciels malveillants',
          'Mises à jour automatiques',
          'Support technique prioritaire 24/7'
        ],
        ctaButton: 'Commander System Cleaner',
        trial: 'Essai gratuit 30 jours - Garantie satisfait ou remboursé',
        helpText: '💬 Besoin de conseils pour optimiser votre PC ? Contactez-nous.',
        expertButton: 'Parler à un expert'
      },
      finalCta: {
        title: 'Redonnez vie à votre PC',
        subtitle: 'Performances optimales en quelques minutes',
        button: 'Commencer l\'optimisation'
      }
    },
    totalCareProduct: {
      hero: {
        badge: 'ÉCONOMISEZ 17% - OFFRE SPÉCIALE',
        title: 'MaSecuTotal Care',
        subtitle: 'La protection ultime tout-en-un',
        description: 'VPN Pro + AdBlock Plus + System Cleaner réunis en un seul pack',
        priceCompare: {
          separate: 'Prix séparé',
          separatePrice: '29.97€/mois',
          pack: 'Pack Total Care',
          packPrice: '24.99€',
          perMonth: '/mois'
        },
        ctaPrimary: 'Profiter de l\'offre - 24.99€/mois',
        ctaSecondary: 'Voir la comparaison'
      },
      includedProducts: {
        title: '3 produits premium en 1',
        subtitle: 'Tous les outils dont vous avez besoin pour une protection complète',
        vpn: {
          name: 'MaSecuVPN Pro',
          features: [
            '50+ serveurs dans 30 pays',
            'Chiffrement AES-256',
            'Politique no-logs',
            'Kill Switch automatique'
          ]
        },
        adblock: {
          name: 'MaSecuAdBlock Plus',
          features: [
            'Blocage publicités et pop-ups',
            'Anti-tracking avancé',
            'Navigation 40% plus rapide',
            'Protection malware'
          ]
        },
        cleaner: {
          name: 'MaSecuSystem Cleaner',
          features: [
            'Nettoyage automatique',
            'Optimisation registre',
            'Défragmentation SSD/HDD',
            'Gestionnaire démarrage'
          ]
        },
        individualValue: 'Valeur individuelle',
        individualPrice: '9.99€',
        savings: {
          title: 'ÉCONOMIE TOTALE :',
          calculation: '3 produits × 9.99€ = ',
          originalPrice: '29.97€/mois',
          payOnly: 'Payez seulement 24.99€/mois',
          monthlySaving: 'Soit 4.98€ d\'économie chaque mois !'
        }
      },
      allFeatures: {
        title: 'Fonctionnalités complètes',
        subtitle: 'Tout ce dont vous avez besoin pour une protection totale',
        list: [
          'Protection VPN complète sur 50+ serveurs',
          'Blocage de toutes les publicités',
          'Navigation ultra-rapide (+40%)',
          'Nettoyage et optimisation système',
          'Protection anti-tracking',
          'Chiffrement militaire AES-256',
          'Politique stricte no-logs',
          'Récupération d\'espace disque',
          'Kill Switch automatique',
          'Défragmentation intelligente',
          'Gestionnaire de démarrage',
          'Protection contre les malwares',
          'Support multi-appareils',
          'Mises à jour automatiques',
          'Support client prioritaire 24/7',
          'Garantie satisfait ou remboursé'
        ]
      },
      comparison: {
        title: 'Pourquoi choisir le pack Total Care ?',
        tableHeaders: {
          feature: 'Fonctionnalité',
          separate: 'Produits séparés',
          totalCare: 'Total Care'
        },
        rows: {
          monthlyPrice: 'Prix mensuel',
          vpnPremium: 'VPN Premium',
          adBlocking: 'Blocage publicités',
          systemCleaning: 'Nettoyage système',
          prioritySupport: 'Support prioritaire',
          monthlySavings: 'Économie mensuelle',
          yearlySavings: 'Économie annuelle'
        }
      },
      pricing: {
        title: 'Pack Total Care - Tout inclus',
        subtitle: 'VPN Pro + AdBlock Plus + System Cleaner en un seul forfait',
        specialOffer: '🔥 Économisez jusqu\'à 40% avec le pack complet',
        badge: 'MEILLEURE VALEUR',
        planTitle: 'MaSecuTotal Care',
        planSubtitle: 'Le pack complet pour une protection totale',
        price: '24.99€',
        perMonth: '/mois',
        requirement: 'Nécessite un abonnement MaSécurité actif',
        featuresTitle: 'Inclus dans le pack :',
        featuresList: [
          '🛡️ VPN Pro - Protection complète avec 50+ serveurs',
          '🚫 AdBlock Plus - Navigation 40% plus rapide',
          '🧹 System Cleaner - Optimisation automatique',
          'Chiffrement AES-256 militaire',
          'Connexions simultanées illimitées',
          'Support multi-appareils complet',
          'Protection DDoS avancée',
          'Streaming 4K/8K optimisé',
          'Nettoyage automatique quotidien',
          'Bloquer 99% des publicités',
          'Gestionnaire de compte dédié',
          'Support prioritaire 24/7'
        ],
        ctaButton: 'Commander Total Care',
        trial: 'Garantie satisfait ou remboursé 30 jours',
        included: {
          title: 'Ce qui est inclus dans Total Care :',
          vpnValue: 'Valeur : 37.47€/mois',
          adblockValue: 'Valeur : 19.99€/mois',
          cleanerValue: 'Valeur : 24.99€/mois',
          totalValue: 'Valeur totale :',
          totalPrice: '82.45€/mois',
          packagePrice: 'Prix Total Care : À partir de 69.42€/mois',
          savings: 'Économisez 13.03€ par mois !'
        },
        helpText: '💬 Questions sur le pack Total Care ? Nos experts sont disponibles.',
        expertButton: 'Parler à un expert'
      },
      finalCta: {
        title: 'La protection ultime à un prix imbattable',
        subtitle: 'Rejoignez des milliers d\'utilisateurs qui ont choisi Total Care',
        button: 'Souscrire au pack Total Care',
        footer: 'Économisez 59.76€ par an · Support prioritaire inclus'
      }
    },
    aiAssistantProduct: {
      hero: {
        title: 'MaSecuAI Assistant',
        subtitle: 'Votre assistant personnel alimenté par une intelligence artificielle spécifique pour tous vos besoins informatiques',
        badges: {
          powered: 'IA Avancée',
          instant: 'Support 24h/24 et 7j/7',
          available: 'Disponible 24h/24'
        }
      },
      features: {
        list: [
          {
            title: 'Assistant IA Intelligent',
            description: 'Pour des réponses précises et contextuelles'
          },
          {
            title: 'Support 24h/24 et 7j/7',
            description: 'Obtenez de l\'aide instantanément, jour et nuit'
          },
          {
            title: 'Réponses Instantanées',
            description: 'Des solutions rapides à tous vos problèmes techniques'
          },
          {
            title: 'Sécurisé et Privé',
            description: 'Vos conversations restent confidentielles'
          },
          {
            title: 'Multilingue',
            description: 'Français, anglais, espagnol et plus'
          }
        ]
      },
      useCases: {
        title: 'Comment MaSecuAI Assistant Peut Vous Aider',
        list: [
          'Aide à la configuration de vos appareils',
          'Résolution de problèmes techniques',
          'Conseils de sécurité personnalisés',
          'Guidance pour l\'utilisation de logiciels',
          'Optimisation des performances système',
          'Assistance pour la sauvegarde de données',
          'Aide à la protection contre les malwares',
          'Conseils sur les meilleures pratiques'
        ]
      },
      pricing: {
        title: 'Choisissez Votre Formule',
        individual: 'Particulier',
        name: 'MaSecuAI Assistant',
        price: '19.99',
        period: '/mois',
        description: 'Assistant IA personnel pour tous vos besoins informatiques',
        features: [
          'Assistance par intelligence artificielle',
          'Disponible 24h/24 et 7j/7',
          'Réponses instantanées',
          'Support multilingue',
          'Historique des conversations',
          'Conseils personnalisés',
          'Guides pas à pas',
          'Mises à jour continues'
        ],
        ctaText: 'Choisir cette offre'
      },
      finalCta: {
        title: 'Prêt à Bénéficier de l\'Intelligence Artificielle ?',
        subtitle: 'Rejoignez les utilisateurs qui simplifient leur vie numérique avec MaSecuAI Assistant',
        button: 'Commencer Maintenant'
      }
    },
    cta: {
      title: 'Prêt à sécuriser votre informatique ?',
      subtitle: 'Rejoignez des milliers d\'utilisateurs satisfaits',
      button: 'Démarrer maintenant'
    },
    trustSeals: {
      title: 'Votre sécurité, notre priorité',
      subtitle: 'Nous respectons les plus hauts standards de sécurité et de conformité',
      sslSecure: 'SSL Sécurisé',
      sslDesc: 'Chiffrement 256-bit',
      rgpd: 'RGPD',
      rgpdDesc: 'Conforme EU',
      iso27001: 'ISO 27001',
      iso27001Desc: 'Certifié Sécurité',
      soc2: 'SOC 2 Type II',
      soc2Desc: 'Audité & Vérifié',
      pciDss: 'PCI DSS',
      pciDssDesc: 'Paiements Sécurisés',
      protection247: 'Protection 24/7',
      protection247Desc: 'Support Mondial',
      guaranteeTitle: 'Garantie de sécurité à 100%',
      guaranteeDesc: 'Vos données sont protégées par les technologies de chiffrement les plus avancées',
      protectionActive: 'Protection Active',
      certificationText: 'MaSécurité est certifié et audité régulièrement pour garantir les plus hauts standards de sécurité.',
      privacyText: 'Vos données personnelles sont traitées conformément au RGPD et ne sont jamais partagées avec des tiers.'
    },
    footer: {
      description: 'Solutions Cloud sécurisées pour particuliers et professionnels',
      services: 'Services',
      cloudServer: 'Serveur Cloud',
      securitySuite: 'Suite Sécurité',
      support: 'Assistance',
      identityProtection: 'Protection d\'Identité numérique',
      information: 'Informations',
      about: 'À propos',
      pricing: 'Tarifs',
      faq: 'FAQ',
      contact: 'Contact',
      legal: 'Légal',
      legalNotice: 'Mentions légales',
      privacyPolicy: 'Politique de confidentialité',
      terms: 'Conditions générales',
      cookiePolicy: 'Politique des cookies',
      refundPolicy: 'Politique de remboursement',
      rights: 'Tous droits réservés.',
      support247: 'Assistance 24h/24 et 7j/7'
    },
    testimonials: {
      badge: 'Témoignages clients',
      title: 'Ce que disent nos clients',
      subtitle: 'Plus de 10 000 utilisateurs nous font confiance pour protéger leur vie numérique',
      averageRating: 'Note moyenne',
      happyCustomers: 'Clients satisfaits',
      verified: 'Vérifié',
      noTestimonials: 'Aucun témoignage disponible pour le moment.',
      joinButton: 'Rejoignez nos clients satisfaits'
    },
    faq: {
      title: 'Questions Fréquentes',
      helpText: 'Besoin d\'aide ? Contactez-nous au 01 89 71 28 66',
      questions: [
        { question: "Comment accéder à mon espace Cloud ?", answer: "Une fois votre abonnement activé, vous recevrez vos identifiants de connexion par email. Vous pourrez accéder à votre espace Cloud depuis n'importe quel navigateur web ou via notre application dédiée." },
        { question: "Mes données sont-elles vraiment sécurisées ?", answer: "Absolument. Nous utilisons un système de chiffrement de bout en bout de niveau bancaire. Vos données sont stockées sur des serveurs sécurisés avec des sauvegardes automatiques quotidiennes." },
        { question: "Puis-je transférer mon abonnement à un autre ordinateur ?", answer: "Oui, toutes nos offres incluent la possibilité de transférer votre abonnement vers un autre appareil rapidement et facilement, sans frais supplémentaires." },
        { question: "Comment fonctionne l'assistance technique ?", answer: "Notre équipe de techniciens certifiés est disponible du lundi au vendredi de 10h00 à 18h00. Vous pouvez nous contacter par téléphone pour une assistance immédiate ou planifier une intervention sur site si nécessaire." },
        { question: "Que se passe-t-il à la fin de mon abonnement ?", answer: "Vous serez notifié avant l'expiration de votre abonnement. Vous pourrez renouveler votre offre ou télécharger toutes vos données. Nous ne supprimons jamais vos données sans préavis." },
        { question: "Les mois offerts sont-ils vraiment gratuits ?", answer: "Oui ! Les mois bonus sont ajoutés gratuitement à votre abonnement. Par exemple, avec l'offre 24 mois + 12 mois offerts, vous bénéficiez de 36 mois de service pour le prix de 24." }
      ]
    },
    products: {
      common: { individual: 'Particulier', ctaText: 'Choisir cette offre', startNow: 'Commencer Maintenant' },
      mobileSecurity: {
        title: 'MaSecuMobile Security',
        subtitle: 'Protection complète Bitdefender pour vos mobiles et tablettes Android',
        badges: { powered: 'Powered by Bitdefender', platform: 'Android & Tablets', price: '9.99€ par appareil' },
        features: [
          { title: 'Protection Malware', description: 'Scanne automatiquement chaque application installée' },
          { title: 'Protection Web', description: 'Bloque les sites malveillants et de phishing en temps réel' },
          { title: 'Alerte Arnaque', description: 'Détecte les liens suspects dans SMS et messages' },
          { title: 'Verrouillage d\'Apps', description: 'Protégez vos apps sensibles avec PIN ou empreinte' },
          { title: 'VPN Intégré', description: '200 MB/jour de trafic chiffré inclus' },
          { title: 'Anti-Vol', description: 'Localisez, verrouillez ou effacez à distance' }
        ],
        completeTitle: 'Fonctionnalités Complètes',
        categories: [
          { name: 'Protection Essentielle', items: ['Scanner Malware automatique et manuel', 'Protection Web en temps réel', 'Alerte Arnaque pour SMS et messages', 'Détection d\'anomalies d\'applications', 'Protection WearON pour smartwatch'] },
          { name: 'Confidentialité', items: ['VPN avec 200 MB/jour inclus', 'Verrouillage d\'apps par PIN/empreinte', 'Vérification Account Privacy', 'Blocage d\'appels spam et indésirables', 'Chiffrement des communications'] },
          { name: 'Anti-Vol', items: ['Localisation GPS à distance', 'Verrouillage à distance', 'Effacement des données à distance', 'Envoi de message au téléphone', 'Photo de l\'intrus après 3 tentatives'] }
        ],
        browsersTitle: 'Navigation Protégée',
        browsersSubtitle: 'La Protection Web fonctionne avec tous les navigateurs Android populaires :',
        pricingTitle: 'Tarification Simple',
        packageName: 'MaSecuMobile Security',
        price: '9.99',
        period: '/mois par appareil',
        description: 'Protection Bitdefender Total Security pour mobiles et tablettes',
        packageFeatures: ['Bitdefender Total Security', 'Scanner Malware complet', 'Protection Web temps réel', 'Alerte Arnaque SMS', 'VPN 200 MB/jour inclus', 'Verrouillage d\'apps', 'Anti-Vol complet', 'Blocage d\'appels spam', 'Protection WearON smartwatch', 'Account Privacy check'],
        wearonTitle: 'WearON Protection Smartwatch',
        wearonDescription: 'Étendez la protection Bitdefender à votre smartwatch pour une sécurité supplémentaire :',
        wearonFeatures: ['Déclenchez une alerte sonore depuis votre montre pour localiser votre téléphone', 'Recevez une notification si vous vous éloignez trop de votre téléphone'],
        finalCtaTitle: 'Protégez Vos Appareils Mobiles Dès Maintenant',
        finalCtaSubtitle: 'Rejoignez les milliers d\'utilisateurs qui font confiance à Bitdefender pour leur sécurité mobile'
      }
    },
    about: {
      title: 'À Propos de Nous',
      subtitle: 'Une équipe bienveillante à votre service pour protéger ce qui compte vraiment : votre famille, vos souvenirs et votre tranquillité d\'esprit',
      stats: [
        { number: '150K+', label: 'Clients Européens' },
        { number: '24/7', label: 'Assistance Humaine' },
        { number: '98%', label: 'Clients Satisfaits' },
        { number: '100%', label: 'À Votre Écoute' }
      ],
      story: {
        title: 'Notre Histoire',
        subtitle: 'Une aventure humaine au service de votre sérénité numérique',
        paragraph1: 'MaSécurité est née d\'une conviction simple : la technologie doit être au service de tous, peu importe l\'âge ou les connaissances techniques. Nous sommes une entreprise européenne spécialisée dans la cybersécurité et le support informatique, particulièrement attentive aux besoins des seniors en France et en Belgique.',
        paragraph2: 'Nous croyons que chacun mérite de profiter sereinement de la technologie pour rester en contact avec ses proches, préserver ses souvenirs et gérer ses affaires personnelles en toute sécurité. C\'est pourquoi nous avons créé des solutions simples, accompagnées d\'un support humain francophone disponible 24h/24 et 7j/7.',
        paragraph3: 'Notre équipe de techniciens certifiés est formée pour prendre le temps nécessaire avec chaque client. Nous expliquons chaque étape avec patience, nous adaptons à votre rythme, et nous assurons que vous vous sentiez en confiance avec votre ordinateur, tablette ou smartphone.',
        paragraph4: 'Basés en Europe avec des centres d\'assistance en France et en Belgique, nous sommes fiers de servir plus de 150 000 clients européens qui nous font confiance pour protéger leurs appareils et leurs données les plus précieuses.'
      },
      valuesSection: {
        title: 'Nos Valeurs',
        subtitle: 'Les principes qui guident chacune de nos actions',
        items: [
          { title: 'Bienveillance et Écoute', description: 'Nous prenons le temps de vous écouter et de comprendre vos besoins. Chaque question mérite une réponse claire et patiente.' },
          { title: 'Accompagnement Personnalisé', description: 'Notre équipe francophone vous accompagne à chaque étape, avec des explications simples et adaptées à votre rythme.' },
          { title: 'Simplicité et Clarté', description: 'Pas de jargon technique compliqué. Nous rendons la technologie accessible et facile à utiliser pour tous.' },
          { title: 'Protection Fiable', description: 'Une sécurité solide et efficace pour protéger vos souvenirs, vos photos de famille et vos informations personnelles.' }
        ]
      },
      benefits: {
        title: 'Ce Qui Nous Distingue',
        subtitle: 'Des avantages pensés pour vous faciliter la vie',
        items: [
          'Support téléphonique en français',
          'Techniciens patients et bienveillants',
          'Explications claires et simples',
          'Disponible 24h/24, 7j/7',
          'Protection de vos souvenirs de famille',
          'Respect de votre vie privée'
        ]
      },
      testimonialsSection: {
        title: 'Ils Nous Font Confiance',
        subtitle: 'Les témoignages de nos clients nous touchent profondément',
        items: [
          { name: 'Marie-Claire', age: '68 ans', location: 'Bruxelles', text: 'Enfin un service qui prend le temps de bien expliquer ! Le technicien a été très patient avec moi.' },
          { name: 'Jean-Pierre', age: '72 ans', location: 'Lyon', text: 'Je peux enfin partager mes photos avec mes petits-enfants en toute sécurité. Merci pour votre aide !' },
          { name: 'Françoise', age: '65 ans', location: 'Liège', text: 'Une équipe formidable qui comprend vraiment nos besoins. Je recommande vivement !' }
        ]
      },
      cta: {
        title: 'Prêt à Protéger Votre Vie Numérique ?',
        subtitle: 'Rejoignez les milliers de clients européens qui profitent sereinement de la technologie grâce à MaSécurité',
        button: 'Contactez-nous',
        description: 'Protéger les clients européens avec bienveillance et expertise depuis 2018.'
      },
      footerLinks: {
        about: 'À Propos',
        legal: 'Légal',
        privacy: 'Politique de confidentialité',
        terms: 'Conditions générales',
        mentions: 'Mentions légales'
      }
    },
    contact: {
      title: 'Contactez-nous',
      subtitle: 'Notre équipe bienveillante est là pour vous aider. N\'hésitez pas à la contacter !',
      form: {
        name: 'Nom complet',
        email: 'Courriel',
        phone: 'Téléphone',
        subject: 'Objet',
        message: 'Votre message',
        captcha: 'Combien font',
        send: 'Envoyez-nous votre message',
        sending: 'Envoi en cours...',
        success: 'Message envoyé avec succès !',
        error: 'Erreur lors de l\'envoi du message',
        captchaError: 'La réponse au calcul est incorrecte. Veuillez réessayer.',
        formIntro: 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais',
        selectSubject: 'Sélectionnez un sujet',
        subjectOptions: {
          general: 'Question générale',
          technical: 'Support technique',
          subscription: 'Question sur les abonnements',
          billing: 'Facturation',
          other: 'Autre'
        },
        securityCheck: 'Vérification de sécurité',
        messagePlaceholder: 'Décrivez votre demande en détail...'
      },
      info: {
        phone: {
          title: 'Téléphone',
          value: '01 89 71 28 66',
          hours: '9h à 21h du Lundi au Vendredi'
        },
        email: {
          title: 'Courriel',
          value: 'info@masecurite.be',
          responseTime: 'Réponse sous 24 heures'
        },
        address: {
          title: 'Adresse',
          value: 'Albuquerque, New Mexico, USA',
          officeSubtitle: 'Bureau USA'
        }
      },
      features: {
        immediateSupport: {
          title: 'Support Immédiat',
          description: 'Assistance téléphonique disponible 24h/24, 7j/7'
        },
        quickResponse: {
          title: 'Réponse Rapide',
          description: 'Nous répondons à tous les courriels sous 24 heures'
        },
        caringTeam: {
          title: 'Équipe Bienveillante',
          description: 'Des techniciens attentifs et à votre écoute'
        }
      }
    },
    quickScan: {
      initializing: 'Initialisation de l\'analyse...',
      scanning: 'Analyse en cours...',
      error: {
        title: 'Erreur d\'analyse',
        message: 'Une erreur s\'est produite pendant l\'analyse. Veuillez actualiser la page pour réessayer.',
        refreshButton: 'Actualiser la page'
      },
      stages: {
        initial: 'Initialisation de l\'analyse',
        filesystem: 'Analyse du système de fichiers',
        network: 'Analyse du réseau',
        registry: 'Analyse du registre'
      },
      progress: {
        filesAnalyzed: 'fichiers analysés',
        currentFile: 'Fichier actuel:',
        filesPerSec: 'fichiers/sec',
        timeRemaining: 'Temps restant'
      },
      systemInfo: {
        title: 'Informations système détectées',
        ipAddress: 'Adresse IP',
        location: 'Localisation',
        provider: 'Fournisseur',
        system: 'Système',
        browser: 'Navigateur',
        processors: 'Processeurs',
        cores: 'cœurs'
      },
      terminal: {
        analyzingProcesses: 'Analysing running processes...',
        scanning: 'Scanning',
        safe: 'SAFE',
        registryAnalysis: 'Registry Analysis',
        keys: 'keys',
        activeNetworkConnections: 'Active Network Connections',
        protocol: 'Protocol',
        local: 'Local',
        remote: 'Remote',
        state: 'State',
        process: 'Process',
        location: 'Location',
        status: 'Status'
      },
      results: {
        title: 'Résultats de l\'analyse',
        risk: 'Risque',
        riskLevels: {
          critical: 'CRITIQUE',
          high: 'ÉLEVÉ',
          medium: 'MODÉRÉ',
          low: 'FAIBLE'
        },
        needsAttention: 'Votre ordinateur nécessite une attention immédiate',
        systemAnalyzed: 'Système analysé',
        ipLocation: 'IP & Localisation',
        graphicsCard: 'Carte graphique',
        gpu: 'GPU',
        cookiesTrackers: 'Cookies & Trackers',
        totalCookies: 'Total cookies',
        trackingCookies: 'Cookies de tracking',
        detectTrackers: 'Trackers détectés',
        privacyRisk: 'Risque vie privée',
        mediaDevices: 'Périphériques média',
        cameras: 'Caméras',
        microphones: 'Microphones',
        speakers: 'Haut-parleurs',
        batteryStatus: 'État de la batterie',
        level: 'Niveau',
        status: 'Statut',
        charging: 'En charge',
        onBattery: 'Sur batterie',
        health: 'Santé',
        healthStatuses: {
          excellent: 'Excellente',
          good: 'Bonne',
          fair: 'Correcte',
          poor: 'Faible',
          critical: 'Critique'
        },
        webrtcLeak: 'Fuite WebRTC',
        leakStatus: 'Statut',
        leakDetected: 'Fuite détectée',
        noLeak: 'Aucune fuite',
        publicIPs: 'IPs publiques exposées',
        localIPs: 'IPs locales',
        digitalFingerprint: 'Empreinte numérique',
        uniqueness: 'Unicité',
        users: 'utilisateurs',
        thirdPartyResources: 'Ressources tierces',
        thirdPartyDomains: 'Domaines tiers',
        trackers: 'Trackers',
        analytics: 'Analytics',
        ads: 'Publicités',
        browserStorage: 'Stockage navigateur',
        localStorage: 'LocalStorage',
        sessionStorage: 'SessionStorage',
        indexedDB: 'IndexedDB',
        bytes: 'octets',
        entries: 'entrées',
        databases: 'bases',
        networkPerformance: 'Performance réseau',
        dns: 'DNS',
        tls: 'TLS',
        ttfb: 'TTFB',
        exposedAPIs: 'APIs exposées',
        totalExposed: 'Total exposées',
        highRisk: 'Risque élevé',
        geolocation: 'Géolocalisation',
        cameraAndMicrophone: 'Caméra/Microphone',
        bluetooth: 'Bluetooth',
        browserExtensions: 'Extensions navigateur',
        totalDetected: 'Total détectées',
        mediumRisk: 'Risque moyen',
        connectionSecurity: 'Sécurité connexion',
        protocol: 'Protocole',
        port: 'Port',
        dnsLeak: 'Fuite DNS',
        dnsServers: 'Serveurs DNS',
        noDnsLeakDetected: 'Aucune fuite DNS détectée',
        realIpExposed: 'Votre adresse IP réelle est exposée via WebRTC',
        fingerprintHighlyUnique: 'Votre empreinte numérique est hautement unique - vous êtes facilement traçable',
        threatsDetected: 'Menaces détectées',
        privacyIssues: 'Problèmes de confidentialité',
        performanceIssues: 'Problèmes de performance',
        systemVulnerabilities: 'Vulnérabilités système',
        systemCompromised: 'Attention ! Votre système est compromis',
        systemCompromisedDesc: 'Nous avons détecté plusieurs menaces actives qui mettent en danger vos données personnelles et la sécurité de votre système. Une action immédiate est recommandée.',
        securityThreats: 'Menaces de sécurité',
        threatsDetectedTitle: 'Menaces détectées',
        realTimeDetection: 'Détection en temps réel',
        threats: 'Menaces',
        criticalThreatsAction: 'menace(s) critique(s) détectée(s) - Action immédiate requise',
        criticalCount: 'Critiques',
        highCount: 'Élevés',
        mediumCount: 'Moyens',
        lowCount: 'Faibles',
        mediaDevicePermissionWarning: 'Permissions d\'accès aux périphériques média non accordées - détection limitée',
        personalizedRecommendation: 'Recommandation personnalisée',
        protectionAdapted: 'Protection adaptée à vos besoins',
        basedOnThreats: 'Basé sur les menaces détectées, voici notre recommandation',
        offer: 'Offre',
        storage: 'de stockage',
        for5Years: 'pour 5 ans (36 mois + 24 offerts)',
        benefits: {
          removeThreats: 'Suppression de toutes les menaces',
          removeThreatsDesc: 'Élimination complète des malwares et virus détectés',
          privacyProtection: 'Protection de la confidentialité',
          privacyProtectionDesc: 'Blocage des trackers et sécurisation de vos données',
          performanceOptimization: 'Optimisation des performances',
          performanceOptimizationDesc: 'Nettoyage et accélération de votre système',
          support247: 'Support technique 24/7',
          support247Desc: 'Assistance prioritaire par téléphone et sur site'
        },
        protectNow: 'Protéger mon ordinateur maintenant',
        limitedOffer: 'Offre limitée - Agissez maintenant pour sécuriser vos données',
        seeAllOffers: 'Voir toutes les offres',
        inactionWarning: {
          title: 'Si vous ne faites rien...',
          subtitle: 'Voici ce qui risque d\'arriver à votre système',
          now: 'Maintenant',
          oneHour: '1 heure',
          twentyFourHours: '24 heures',
          oneWeek: '1 semaine',
          oneMonth: '1 mois',
          activeThreats: 'Menaces actives sur votre PC',
          maliciousProcesses: '{count} processus malveillants en cours d\'exécution',
          passwordsCompromised: 'Mots de passe potentiellement compromis',
          keyloggerActive: 'Keylogger actif - Tous vos mots de passe à risque',
          personalDataStolen: 'Données personnelles possiblement volées',
          sensitiveFilesExposed: 'Documents, photos et fichiers sensibles exposés',
          ransomwareRisk: 'Risque élevé de ransomware',
          filesEncrypted: 'Tous vos fichiers pourraient être chiffrés contre rançon',
          identityTheft: 'Identité possiblement usurpée',
          darkWebSale: 'Vos données vendues sur le dark web - Fraude bancaire possible',
          avoidCatastrophe: 'Évitez ce scénario catastrophe',
          completeProtection: 'Protection complète en moins de 30 minutes',
          protectNow: 'Protéger maintenant'
        }
      }
    },
    breachChecker: {
      title: 'Vérificateur de Fuites',
      subtitle: 'Vérifiez si vos informations personnelles ont été compromises lors d\'une fuite de données',
      navTitle: 'Vérifier mes données',
      hero: {
        badge: 'Analyse en temps réel',
        title: 'Vérifiez si vos données ont été',
        titleHighlight: 'piratées',
        subtitle: 'Notre technologie analyse plus de 15 milliards d\'identifiants volés pour vérifier si vos informations circulent sur le Dark Web.'
      },
      badges: {
        confidential: '100% confidentiel',
        instant: 'Résultats instantanés'
      },
      tabs: {
        email: 'E-mail',
        password: 'Mot de passe',
        free: 'Gratuit'
      },
      search: {
        emailTitle: 'Vérifiez si votre e-mail a été piraté',
        emailPlaceholder: 'Entrez votre adresse e-mail',
        emailButton: 'Vérifier mon e-mail',
        emailButton2: 'Vérifier votre adresse email',
        passwordTitle: 'Vérifiez si votre mot de passe a été compromis',
        passwordPlaceholder: 'Entrez un mot de passe à vérifier',
        passwordButton: 'Vérifier ce mot de passe',
        searching: 'Recherche en cours...'
      },
      privacy: {
        email: 'Votre adresse n\'est jamais stockée ni partagée',
        password: 'Votre mot de passe n\'est jamais envoyé - nous utilisons un hash sécurisé'
      },
      emailChecker: {
        label: 'Votre adresse email',
        placeholder: 'exemple@email.com',
        button: 'Vérifier votre adresse email',
        privacy: 'Votre vie privée est protégée. Nous utilisons l\'API Have I Been Pwned pour vérifier votre adresse de manière sécurisée. Votre adresse n\'est jamais mémorisée.',
        contactMessage: 'Pour vérifier votre adresse e-mail, veuillez nous contacter ou appeler le'
      },
      passwordChecker: {
        label: 'Votre mot de passe',
        placeholder: 'Entrez votre mot de passe',
        button: 'Vérifier mon mot de passe',
        privacy: '100% anonyme. Votre mot de passe n\'est JAMAIS envoyé. Nous utilisons un système de hachage (SHA-1) qui vérifie uniquement les 5 premiers caractères du hash, sans jamais révéler votre mot de passe.'
      },
      results: {
        breached: {
          title: 'Attention ! Vos données ont été compromises',
          text: 'Votre adresse e-mail a été trouvée dans {count} fuites de données. Vos informations personnelles sont potentiellement accessibles aux pirates.'
        },
        safe: {
          title: 'Bonne nouvelle !',
          text: 'Votre adresse e-mail n\'a pas été trouvée dans les fuites de données connues.'
        },
        passwordPwned: {
          title: 'Ce mot de passe a été compromis !',
          text: 'Ce mot de passe a été trouvé dans des bases de données de pirates. Il ne doit PLUS être utilisé nulle part.',
          foundCount: 'Nombre de fois trouvé dans des fuites',
          times: 'fois',
          riskLevel: 'Niveau de risque',
          critical: 'Critique',
          recommendation: 'Recommandation',
          changeNow: 'Changer immédiatement'
        },
        passwordSafe: {
          title: 'Ce mot de passe n\'a pas été trouvé',
          text: 'Cela ne garantit pas qu\'il est sécurisé. Utilisez toujours des mots de passe uniques et complexes.'
        }
      },
      breachList: {
        title: 'Fuites de données détectées',
        breachDate: 'Fuite le',
        accounts: 'comptes'
      },
      dataTypes: {
        email: 'E-mail',
        password: 'Mot de passe',
        name: 'Nom',
        phone: 'Téléphone',
        address: 'Adresse',
        dob: 'Date de naissance',
        cardNumber: 'Numéro de carte'
      },
      cta: {
        badge: 'Offre limitée',
        title: 'Protégez votre identité en ligne',
        features: [
          'Surveillance du Dark Web 24/7',
          'Alertes instantanées en cas de fuite',
          'Support expert disponible',
          'Garantie satisfait ou remboursé'
        ],
        button: 'Voir nos offres',
        call: 'Nous appeler au',
        phone: '01 89 71 28 66',
        urgency: 'Vérifiez maintenant - vos données pourraient être compromises'
      },
      attribution: 'Données fournies par',
      loading: 'Vérification en cours...',
      error: 'Une erreur est survenue. Veuillez réessayer.'
    },
    legal: {
      common: {
        lastUpdated: 'Derniere mise a jour : Janvier 2025',
        company: 'Digital Genesys Solutions LLC',
        companyName: 'Digital Genesys Solutions LLC (MaSécurité)',
        legalForm: 'Limited Liability Company (LLC)',
        registrationNumber: 'Numéro d\'enregistrement',
        registrationNum: '3003074',
        formationDate: 'Date de formation',
        formationDateValue: '16 décembre 2024',
        address: 'Adresse',
        addressValue: '5203 Juan Tabo Blvd STE 2B, Albuquerque, NM 87111, USA',
        registeredAgent: 'Agent enregistré',
        registeredAgentValue: 'Cindy\'s New Mexico LLC (5587298BA)',
        agentAddress: 'Adresse de l\'agent',
        agentAddressValue: '5203 Juan Tabo Blvd NE Suite 2a, Albuquerque, NM 87111, USA',
        state: 'État de formation',
        stateValue: 'New Mexico, USA',
        phone: 'Téléphone',
        phoneValue: '01 89 71 28 66',
        email: 'Email',
        emailValue: 'info@masecurite.be',
        contactTitle: 'Besoin de Plus d\'Informations ?',
        contactText: 'Pour toute question concernant ces mentions légales, contactez-nous :',
        society: 'Société'
      },
      legalNotice: {
        title: 'Mentions Légales',
        intro: 'Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l\'économie numérique, voici les mentions légales du site MaSécurité.'
      },
      privacyPolicy: {
        title: 'Politique de Confidentialité',
        lastUpdate: 'Dernière mise à jour : Janvier 2025',
        intro: 'Chez MaSécurité, nous prenons très au sérieux la protection de vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations conformément au Règlement Général sur la Protection des Données (RGPD).',
        section1: {
          title: '1. Responsable du Traitement',
          description: 'Le responsable du traitement de vos données personnelles est :'
        },
        section2: {
          title: '2. Données Personnelles Collectées',
          intro: 'Nous collectons différents types de données personnelles selon votre utilisation de nos services :',
          identificationData: {
            title: 'Données d\'identification',
            items: ['Nom et prénom', 'Adresse email', 'Numéro de téléphone', 'Adresse postale']
          },
          technicalData: {
            title: 'Données techniques',
            items: ['Adresse IP', 'Type de navigateur et système d\'exploitation', 'Informations sur votre appareil (modèle, version)', 'Données de connexion et d\'utilisation']
          },
          paymentData: {
            title: 'Données de paiement',
            items: ['Informations de carte bancaire (cryptées et traitées par notre prestataire de paiement sécurisé)', 'Historique des transactions']
          }
        },
        section3: {
          title: '3. Finalités du Traitement',
          intro: 'Vos données personnelles sont utilisées pour les finalités suivantes :',
          items: [
            'Exécution du contrat : Fourniture des services de cybersécurité et support technique',
            'Gestion de la relation client : Répondre à vos demandes et gérer votre compte',
            'Amélioration des services : Analyse de l\'utilisation pour optimiser nos offres',
            'Communications : Envoi d\'informations importantes sur votre abonnement',
            'Marketing (avec consentement) : Envoi d\'offres promotionnelles et newsletters',
            'Obligations légales : Respect des exigences réglementaires et fiscales',
            'Sécurité : Prévention de la fraude et protection de nos systèmes'
          ]
        },
        section4: {
          title: '4. Base Légale du Traitement',
          intro: 'Le traitement de vos données repose sur les bases légales suivantes :',
          items: [
            'Exécution du contrat : Nécessaire à la fourniture de nos services',
            'Consentement : Pour les communications marketing (révocable à tout moment)',
            'Obligations légales : Conservation des factures, déclarations fiscales',
            'Intérêts légitimes : Amélioration de nos services, sécurité'
          ]
        },
        section5: {
          title: '5. Partage des Données',
          intro: 'Vos données personnelles peuvent être partagées avec :',
          items: [
            'Prestataires de services : Hébergement, paiement, support technique (sous contrat strict de confidentialité)',
            'Partenaires technologiques : Pour la fourniture des solutions de cybersécurité',
            'Autorités compétentes : En cas d\'obligation légale ou de demande judiciaire'
          ],
          important: 'Important : Nous ne vendons jamais vos données personnelles à des tiers à des fins commerciales.'
        },
        section6: {
          title: '6. Transferts Internationaux',
          description: 'Vos données sont principalement stockées et traitées au sein de l\'Union européenne. Si des transferts hors UE sont nécessaires, nous nous assurons que des garanties appropriées sont en place (clauses contractuelles types de la Commission européenne, Privacy Shield, etc.).'
        },
        section7: {
          title: '7. Durée de Conservation',
          intro: 'Nous conservons vos données personnelles pendant les durées suivantes :',
          items: [
            'Données du compte client : Pendant toute la durée de votre abonnement + 3 ans après résiliation',
            'Données de facturation : 10 ans (obligation légale comptable)',
            'Données de support : 3 ans après la dernière interaction',
            'Données marketing : 3 ans après le dernier consentement ou interaction',
            'Cookies : Selon les durées spécifiées dans notre Politique de Cookies'
          ]
        },
        section8: {
          title: '8. Vos Droits',
          intro: 'Conformément au RGPD, vous disposez des droits suivants :',
          items: [
            'Droit d\'accès : Obtenir une copie de vos données personnelles',
            'Droit de rectification : Corriger les données inexactes ou incomplètes',
            'Droit à l\'effacement : Demander la suppression de vos données (« droit à l\'oubli »)',
            'Droit à la limitation : Limiter le traitement de vos données dans certaines situations',
            'Droit d\'opposition : Vous opposer au traitement de vos données pour des raisons légitimes',
            'Droit à la portabilité : Recevoir vos données dans un format structuré et transférable',
            'Droit de retirer le consentement : Retirer votre consentement au traitement marketing à tout moment',
            'Droit de déposer une plainte : Contacter la CNIL (Commission Nationale de l\'Informatique et des Libertés)'
          ],
          howToExercise: {
            title: 'Comment exercer vos droits ?',
            intro: 'Pour exercer l\'un de ces droits, contactez-nous :',
            dpo: 'dpo@masecurite.be',
            responseTime: 'Nous répondrons à votre demande dans un délai d\'un mois maximum. Une pièce d\'identité pourra être demandée pour vérifier votre identité.'
          }
        },
        section9: {
          title: '9. Sécurité des Données',
          intro: 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données :',
          items: [
            'Chiffrement des données sensibles (SSL/TLS)',
            'Accès restreint aux données personnelles (principe du besoin de savoir)',
            'Authentification sécurisée et gestion des mots de passe',
            'Surveillance et détection des incidents de sécurité',
            'Sauvegardes régulières et plan de continuité d\'activité',
            'Formation régulière de nos équipes sur la protection des données'
          ],
          breachNotification: 'En cas de violation de données susceptible de porter atteinte à vos droits et libertés, nous vous en informerons dans les meilleurs délais conformément à la réglementation.'
        },
        section10: {
          title: '10. Cookies et Technologies Similaires',
          description: 'Notre site utilise des cookies pour améliorer votre expérience. Pour en savoir plus, consultez notre',
          cookiePolicyLink: 'Politique de Cookies'
        },
        section11: {
          title: '11. Modifications de la Politique',
          para1: 'Nous pouvons modifier cette politique de confidentialité pour refléter les changements dans nos pratiques ou la législation. Toute modification substantielle vous sera notifiée par email ou via notre site web.',
          para2: 'Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques en matière de protection des données.'
        },
        questionsSection: {
          title: 'Des Questions sur la Confidentialité ?',
          description: 'Notre Délégué à la Protection des Données (DPO) est à votre disposition pour toute question :'
        }
      },
      cookiePolicy: {
        title: 'Politique des cookies',
        lastUpdate: 'Dernière mise à jour : Janvier 2025',
        intro: 'Cette politique explique comment MaSécurité utilise les cookies et technologies similaires sur notre site web pour améliorer votre expérience de navigation.',
        section1: {
          title: '1. Qu\'est-ce qu\'un Cookie ?',
          description: 'Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette, smartphone) lorsque vous visitez un site web. Les cookies permettent au site de :',
          items: ['Mémoriser vos préférences et paramètres', 'Faciliter votre navigation', 'Analyser l\'utilisation du site pour l\'améliorer', 'Personnaliser votre expérience', 'Assurer la sécurité de votre connexion']
        },
        section2: {
          title: '2. Types de Cookies Utilisés',
          sessionCookies: {
            title: 'A. Cookies de Session',
            description: 'Ces cookies temporaires sont supprimés automatiquement lorsque vous fermez votre navigateur. Ils permettent de :',
            items: ['Maintenir votre connexion pendant votre visite', 'Mémoriser les informations que vous saisissez dans un formulaire', 'Gérer votre panier si vous effectuez un achat']
          },
          persistentCookies: {
            title: 'B. Cookies Permanents',
            description: 'Ces cookies restent sur votre appareil pendant une durée déterminée ou jusqu\'à ce que vous les supprimiez. Ils permettent de :',
            items: ['Reconnaître votre appareil lors de vos prochaines visites', 'Mémoriser vos préférences de langue', 'Conserver vos paramètres de confidentialité', 'Vous reconnecter automatiquement si vous l\'avez choisi']
          }
        },
        section3: {
          title: '3. Catégories de Cookies',
          strictlyNecessary: {
            title: 'A. Cookies Strictement Nécessaires',
            purpose: 'Essentiels au fonctionnement du site',
            duration: 'Session ou jusqu\'à 1 an',
            consentRequired: 'Non (cookies techniques indispensables)',
            description: 'Ces cookies sont indispensables pour :',
            items: ['Sécuriser votre connexion et prévenir la fraude', 'Permettre la navigation entre les pages', 'Accéder à votre espace client sécurisé', 'Mémoriser vos choix de cookies']
          },
          performance: {
            title: 'B. Cookies de Performance et d\'Analyse',
            purpose: 'Analyser l\'utilisation du site',
            duration: 'Jusqu\'à 2 ans',
            consentRequired: 'Oui',
            description: 'Ces cookies nous aident à comprendre comment vous utilisez notre site :',
            items: ['Pages les plus visitées', 'Durée des visites', 'Parcours de navigation', 'Messages d\'erreur rencontrés'],
            tool: 'Google Analytics (données anonymisées)'
          },
          functionality: {
            title: 'C. Cookies de Fonctionnalité',
            purpose: 'Personnaliser votre expérience',
            duration: 'Jusqu\'à 1 an',
            consentRequired: 'Oui',
            description: 'Ces cookies améliorent votre confort de navigation :',
            items: ['Mémorisation de votre choix de langue', 'Adaptation de l\'affichage à votre appareil', 'Personnalisation du contenu selon vos préférences', 'Sauvegarde de vos paramètres d\'affichage']
          },
          advertising: {
            title: 'D. Cookies Publicitaires et de Réseaux Sociaux',
            purpose: 'Diffuser des publicités pertinentes',
            duration: 'Jusqu\'à 13 mois',
            consentRequired: 'Oui',
            description: 'Ces cookies permettent :',
            items: ['L\'affichage de publicités adaptées à vos centres d\'intérêt', 'Le partage de contenu sur les réseaux sociaux', 'La limitation du nombre d\'affichages d\'une publicité', 'La mesure de l\'efficacité des campagnes publicitaires'],
            partners: 'Facebook, Google Ads'
          }
        },
        section4: {
          title: '4. Gestion de Vos Préférences',
          intro: 'Vous avez le contrôle total sur les cookies :',
          banner: {
            title: 'Via notre bandeau de cookies',
            description: 'Lors de votre première visite, un bandeau vous permet d\'accepter ou de refuser les cookies non essentiels. Vous pouvez modifier vos préférences à tout moment en cliquant sur le lien « Gérer les cookies » en bas de page.'
          },
          browser: {
            title: 'Via votre navigateur',
            description: 'Vous pouvez configurer votre navigateur pour :',
            items: ['Être notifié lorsqu\'un cookie est déposé', 'Accepter ou refuser les cookies au cas par cas', 'Refuser systématiquement tous les cookies', 'Supprimer les cookies existants'],
            browserLinks: 'Liens vers les paramètres des navigateurs populaires :'
          },
          warning: 'Attention : Le refus de certains cookies peut limiter l\'accès à certaines fonctionnalités du site ou dégrader votre expérience de navigation.'
        },
        section5: {
          title: '5. Cookies Tiers',
          intro: 'Notre site peut contenir des services de tiers (vidéos, cartes, boutons de partage) qui déposent leurs propres cookies. Nous n\'avons pas de contrôle sur ces cookies tiers.',
          services: 'Principaux services tiers utilisés :',
          items: ['Google Analytics : Analyse d\'audience (anonymisé)', 'Google Ads : Publicités ciblées', 'Facebook Pixel : Suivi des conversions', 'YouTube : Intégration de vidéos'],
          recommendation: 'Nous vous encourageons à consulter les politiques de confidentialité de ces services pour comprendre comment ils utilisent vos données.'
        },
        section6: {
          title: '6. Durée de Conservation',
          items: ['Cookies de session : Supprimés à la fermeture du navigateur', 'Cookies strictement nécessaires : Jusqu\'à 12 mois', 'Cookies d\'analyse : Jusqu\'à 24 mois', 'Cookies de personnalisation : Jusqu\'à 12 mois', 'Cookies publicitaires : Jusqu\'à 13 mois', 'Consentement aux cookies : 13 mois']
        },
        section7: {
          title: '7. Vos Droits',
          intro: 'Conformément au RGPD et à la directive ePrivacy, vous disposez des droits suivants :',
          items: ['Droit de consentir ou de refuser les cookies', 'Droit de retirer votre consentement à tout moment', 'Droit d\'accéder aux données collectées via les cookies', 'Droit de supprimer les cookies de votre appareil', 'Droit de déposer une plainte auprès de la CNIL']
        },
        section8: {
          title: '8. Modifications de la Politique',
          para1: 'Nous pouvons modifier cette politique de cookies pour refléter les changements dans nos pratiques ou la législation. La date de dernière mise à jour est indiquée en haut de cette page.',
          para2: 'Nous vous encourageons à consulter régulièrement cette page pour rester informé de notre utilisation des cookies.'
        },
        questionsSection: {
          title: 'Questions sur les Cookies ?',
          description: 'Pour toute question concernant notre utilisation des cookies :'
        }
      },
      refundPolicy: {
        title: 'Politique de remboursement',
        lastUpdate: 'Dernière mise à jour : Janvier 2025',
        intro: 'Chez MaSécurité, votre satisfaction est notre priorité. Cette politique explique les conditions de remboursement de nos services.',
        section1: {
          title: '1. Droit de Rétractation de 30 Jours',
          para1: 'Conformément à la législation européenne sur la protection des consommateurs, vous disposez d\'un délai de 30 jours calendaires à compter de la date de souscription pour exercer votre droit de rétractation sans avoir à justifier de motifs.',
          para2: 'Ce droit s\'applique à tous nos forfaits, qu\'ils soient mensuels, annuels ou pluriannuels.'
        },
        section2: {
          title: '2. Comment Demander un Remboursement',
          intro: 'Pour exercer votre droit de rétractation et demander un remboursement, vous pouvez :',
          items: ['Remplir le formulaire en ligne disponible dans votre espace client', 'Nous appeler au 01 89 71 28 66 (disponible 24h/24, 7j/7)', 'Nous envoyer un email à info@masecurite.be avec votre numéro de commande', 'Nous écrire par courrier postal à : Digital Genesys Solutions LLC, 5203 Juan Tabo Blvd STE 2B, Albuquerque, NM 87111, USA'],
          advice: 'Conseil : Pour un traitement plus rapide, utilisez le formulaire en ligne ou contactez-nous par téléphone.'
        },
        section3: {
          title: '3. Montants Non Remboursables',
          intro: 'Lors d\'un remboursement, certains montants peuvent être retenus :',
          installation: {
            title: 'Frais d\'installation et de configuration',
            description: 'Si vous avez bénéficié de notre service d\'installation et de configuration initiale, ces frais ne sont pas remboursables car le service a déjà été fourni.'
          },
          proportional: {
            title: 'Utilisation proportionnelle du service',
            description: 'Si vous avez utilisé nos services pendant la période de rétractation, un montant proportionnel au temps d\'utilisation sera retenu du remboursement.',
            example: 'Exemple de calcul : Abonnement annuel : 120€, Durée d\'utilisation : 10 jours, Montant retenu : 120€ × (10/365) = 3,29€, Remboursement : 116,71€'
          },
          hardware: {
            title: 'Équipements matériels',
            description: 'Si vous avez reçu un équipement matériel (par exemple, un routeur sécurisé) dans le cadre de votre abonnement :',
            items: ['L\'équipement doit être retourné dans son emballage d\'origine', 'L\'équipement ne doit pas être endommagé', 'Les frais de retour sont à votre charge', 'Si l\'équipement est endommagé, sa valeur sera déduite du remboursement']
          }
        },
        section4: {
          title: '4. Délai de Remboursement',
          intro: 'Une fois votre demande de remboursement validée :',
          items: ['Le remboursement est traité dans un délai maximum de 14 jours ouvrés', 'Le remboursement est effectué sur le moyen de paiement utilisé lors de la commande', 'Si un équipement doit être retourné, le remboursement est effectué dans les 30 jours suivant la réception de l\'équipement', 'Vous recevrez un email de confirmation une fois le remboursement traité']
        },
        section5: {
          title: '5. Remboursement Après la Période de Rétractation',
          intro: 'Après la période de rétractation de 30 jours, les remboursements ne sont généralement pas possibles. Cependant, nous étudions chaque situation au cas par cas :',
          items: ['Problème technique non résolu malgré nos interventions', 'Service non conforme aux engagements contractuels', 'Circonstances exceptionnelles justifiant une demande de remboursement'],
          note: 'Pour toute demande après la période de rétractation, contactez notre service client qui examinera votre situation avec attention.'
        },
        section6: {
          title: '6. Résiliation et Remboursement des Abonnements',
          intro: 'Si vous souhaitez résilier votre abonnement en cours :',
          items: ['La résiliation prend effet à la fin de la période d\'engagement en cours', 'Aucun remboursement n\'est effectué pour la période restante déjà payée', 'Le renouvellement automatique est désactivé', 'Vous continuez à bénéficier du service jusqu\'à la fin de la période payée']
        },
        section7: {
          title: '7. Garantie de Satisfaction',
          intro: 'Nous nous engageons à votre satisfaction :',
          items: ['Support technique illimité pendant toute la durée de votre abonnement', 'Résolution rapide des problèmes techniques', 'Possibilité de changer de formule si vos besoins évoluent', 'Écoute attentive de vos préoccupations et suggestions']
        },
        section8: {
          title: '8. Remboursement en Cas de Panne ou Interruption',
          intro: 'Si nos services sont interrompus pour des raisons indépendantes de votre volonté pendant une durée significative :',
          items: ['Un remboursement proportionnel peut être accordé', 'Une prolongation gratuite de votre abonnement peut être proposée', 'Chaque situation est évaluée individuellement']
        },
        questionsSection: {
          title: 'Questions sur les Remboursements ?',
          description: 'Notre équipe est là pour vous aider :'
        }
      },
      termsOfService: {
        title: 'Conditions générales de service',
        lastUpdate: 'Dernière mise à jour : Janvier 2025',
        intro: 'Les présentes conditions générales de service régissent l\'utilisation des services proposés par MaSécurité, exploité par notre société. En utilisant nos services, vous acceptez ces conditions dans leur intégralité.',
        section1: {
          title: '1. Objet du Contrat',
          intro: 'MaSécurité propose des services de cybersécurité, de support technique et de maintenance informatique comprenant :',
          items: [
            'Installation et configuration de logiciels de sécurité',
            'Protection en temps réel contre les menaces informatiques',
            'Support technique téléphonique 24h/24, 7j/7',
            'Maintenance préventive et optimisation des appareils',
            'Assistance à distance pour résoudre vos problèmes techniques'
          ]
        },
        section2: {
          title: '2. Formules et Tarification',
          intro: 'Nous proposons plusieurs formules d\'abonnement adaptées à vos besoins :',
          items: [
            'Formule Essentielle : Protection de base avec support téléphonique',
            'Formule Complète : Protection avancée avec maintenance régulière',
            'Formule Premium : Protection maximale avec assistance prioritaire'
          ],
          outro: 'Les tarifs sont indiqués en euros (€) et incluent la TVA applicable. Le paiement s\'effectue par carte bancaire, virement ou prélèvement automatique selon la formule choisie.'
        },
        section3: {
          title: '3. Durée et Renouvellement',
          para1: 'Les abonnements sont proposés pour des durées de 12, 24 ou 36 mois. Sauf indication contraire de votre part, votre abonnement se renouvelle automatiquement pour une période équivalente à la durée initiale.',
          para2: 'Vous serez informé par email au moins 30 jours avant la date de renouvellement. Vous pouvez désactiver le renouvellement automatique à tout moment depuis votre espace client ou en nous contactant.'
        },
        section4: {
          title: '4. Droit de Rétractation',
          para1: 'Conformément au droit européen, vous disposez d\'un délai de 30 jours à compter de la souscription pour exercer votre droit de rétractation sans avoir à justifier de motifs.',
          para2: 'Pour exercer ce droit, contactez notre service client par téléphone au 01 89 71 28 66 ou par email à info@masecurite.be.',
          important: 'Important : Si vous avez bénéficié de nos services durant cette période, un montant proportionnel au service utilisé sera retenu du remboursement.'
        },
        section5: {
          title: '5. Obligations du Client',
          intro: 'En tant que client, vous vous engagez à :',
          items: [
            'Fournir des informations exactes lors de l\'inscription',
            'Maintenir vos identifiants de connexion confidentiels',
            'Utiliser les services de manière conforme à la législation en vigueur',
            'Ne pas partager votre abonnement avec des tiers',
            'Informer rapidement MaSécurité de tout problème ou incident',
            'Permettre l\'accès à distance à vos appareils pour le support technique'
          ]
        },
        section6: {
          title: '6. Obligations de MaSécurité',
          intro: 'Nous nous engageons à :',
          items: [
            'Fournir un service de qualité conforme aux standards de l\'industrie',
            'Assurer une disponibilité du support technique 24h/24, 7j/7',
            'Protéger vos données personnelles conformément au RGPD',
            'Vous informer de toute modification importante des services',
            'Répondre à vos demandes dans les meilleurs délais',
            'Maintenir la confidentialité de vos informations'
          ]
        },
        section7: {
          title: '7. Limitation de Responsabilité',
          intro: 'MaSécurité met tout en œuvre pour assurer la sécurité de vos appareils. Cependant, notre responsabilité est limitée dans les cas suivants :',
          items: [
            'Problèmes matériels nécessitant une réparation physique',
            'Perte de données résultant d\'une action du client',
            'Interruptions de service dues à des causes indépendantes de notre volonté',
            'Dommages causés par des logiciels ou matériels tiers',
            'Utilisation inappropriée ou non autorisée des services'
          ]
        },
        section8: {
          title: '8. Protection des Données',
          para1: 'Vos données personnelles sont collectées et traitées conformément à notre Politique de Confidentialité et au Règlement Général sur la Protection des Données (RGPD).',
          para2: 'Vous disposez d\'un droit d\'accès, de rectification, de suppression et de portabilité de vos données personnelles. Pour exercer ces droits, contactez-nous à dpo@masecurite.be.',
          privacyPolicyLink: 'Politique de Confidentialité'
        },
        section9: {
          title: '9. Résiliation',
          para1: 'Vous pouvez résilier votre abonnement à tout moment en respectant un préavis de 30 jours. La résiliation prend effet à la fin de la période d\'abonnement en cours.',
          para2: 'MaSécurité se réserve le droit de résilier votre abonnement en cas de non-paiement, d\'utilisation frauduleuse ou de violation des présentes conditions, après notification préalable.'
        },
        section10: {
          title: '10. Modification des Conditions',
          para1: 'MaSécurité se réserve le droit de modifier les présentes conditions générales. Vous serez informé de toute modification substantielle par email au moins 30 jours avant leur entrée en vigueur.',
          para2: 'La poursuite de l\'utilisation de nos services après l\'entrée en vigueur des nouvelles conditions vaut acceptation de celles-ci.'
        },
        section11: {
          title: '11. Loi Applicable et Juridiction',
          para1: 'Les présentes conditions sont régies par le droit français et européen. En cas de litige, nous vous encourageons à nous contacter en priorité pour trouver une solution amiable.',
          para2: 'Si aucun accord amiable ne peut être trouvé, les tribunaux français seront compétents. Vous pouvez également recourir à une plateforme de règlement en ligne des litiges de l\'Union européenne accessible à l\'adresse :'
        },
        contact: {
          title: 'Questions ?',
          intro: 'Pour toute question concernant ces conditions générales, n\'hésitez pas à nous contacter :',
          company: 'Société',
          phone: 'Téléphone',
          phoneValue: '01 89 71 28 66',
          email: 'Email',
          address: 'Adresse'
        }
      }
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      ourServices: 'Our services',
      pricing: 'Pricing',
      features: 'Features',
      quickAnalysis: 'Quick Diagnosis',
      quickScan: 'Quick Diagnosis',
      about: 'About',
      whoAreWe: 'Who are we?',
      contact: 'Contact us',
      quickSupport: 'Quick Support',
      needHelp: 'Need help?',
      help: 'Help',
      freeScan: 'Free scan',
      getStarted: 'Let\'s go!',
      backHome: 'Back to home',
      belgianCompany: 'Belgian company',
      frenchSupport: 'Support in French',
      businessHours: 'Mon-Fri: 9am-6pm',
      emergency247: 'Emergency: 24/7'
    },
    trustBadges: {
      ssl: {
        title: 'SSL Secured',
        subtitle: '100% secure payment'
      },
      gdpr: {
        title: 'GDPR',
        subtitle: 'Protected data'
      },
      certified: {
        title: 'EU Certified',
        subtitle: 'European compliance'
      },
      guarantee: {
        title: '30-Day Guarantee',
        subtitle: 'Satisfaction guaranteed'
      }
    },
    paymentBadges: {
      title: '100% Secure Payment - Accepted Methods',
      sslEncrypted: 'SSL Encrypted Transactions',
      gdprCompliant: 'GDPR Compliant',
      satisfaction: 'Satisfaction Guaranteed'
    },
    hero: {
      title: 'Protect your data.',
      subtitle: 'Simplify your IT.',
      description: 'Secure cloud solutions and fast IT support for individuals and businesses',
      cta: 'Discover our services',
      ctaSecondary: 'Contact us',
      simpleToUse: 'Easy to use',
      secure: 'Secure and private',
      support247: '24/7 Support'
    },
    services: {
      title: 'Our Services',
      subtitle: 'A complete solution, designed for your comfort',
      cloudServer: {
        title: 'Secure Cloud Server',
        description: 'Access your personal or professional files wherever you are. Your data is protected by complex encryption and safely backed up, independent of any single device.',
        feature1: 'VMware Virtualization',
        feature2: 'Intel Xeon Processor',
        feature3: 'Unlimited bandwidth',
        feature4: 'REST API available'
      },
      security: {
        title: 'Complete Security Suite',
        description: 'Our MaSecuSecurity Software protects you against all types of IT threats and effectively secures your digital identity online.',
        feature1: 'Advanced antivirus protection',
        feature2: 'MaSecuIntelligard included',
        feature3: 'Protection against cyberattacks',
        feature4: 'Data collection blocking'
      },
      phone: {
        title: 'Phone Support',
        description: 'A certified technician assists you by phone for any issue: Internet access, emails, VPN clients, IT maintenance and office troubleshooting.',
        feature1: 'Monday to Friday',
        feature2: '10am to 6pm',
        feature3: 'Certified technicians',
        feature4: 'Personalized follow-up'
      },
      identityProtection: {
        title: 'Identity Protection',
        description: 'Monitor and protect your digital identity against data theft, personal information leaks, and online fraud attempts.',
        feature1: 'Dark Web Monitoring',
        feature2: 'Real-time Alerts',
        feature3: 'Personal Data Protection',
        feature4: 'Identity Theft Assistance'
      },
      family: {
        title: 'Stay connected with your loved ones',
        description: 'Create shared photo albums with your family, automatically sync your memories from your phone and share them securely. A simple interface that even your grandparents can use easily.'
      }
    },
    features: {
      title: 'Why Choose MaSécurité?',
      subtitle: 'Excellence in service of your digital peace of mind',
      security: {
        title: 'Maximum security',
        description: 'Your data is protected by the most advanced encryption technologies'
      },
      support: {
        title: 'Responsive support',
        description: 'A team of experts available 24/7 to meet your needs'
      },
      simplicity: {
        title: 'Easy to use',
        description: 'Intuitive interface accessible even to beginner users'
      },
      performance: {
        title: 'Optimal performance',
        description: 'High-performance cloud infrastructure for a smooth experience'
      },
      cards: {
        completeProtection: {
          title: 'Complete Protection',
          description: 'MaSecuhelps you fight against everyday attacks with user, network, and equipment protection.'
        },
        preventiveMaintenance: {
          title: 'Preventive Maintenance',
          description: 'MaSecumaintains the health of your IT systems by preventing any malfunction that could cause you problems.'
        },
        performantConnections: {
          title: 'High-Performance Connections',
          description: 'The guarantee of reliable and high-performance connections for the exchange and transfer of your data in complete security.'
        },
        softwareApplications: {
          title: 'Software & Applications',
          description: 'MaSecuprovides you with software and applications for better management of your network and your activity.'
        }
      }
    },
    pricing: {
      title: 'Our Pricing',
      subtitle: 'Choose the plan that suits you',
      choosePlan: 'Choose this plan',
      choose: 'Choose',
      perMonth: '€/month',
      taxExcluded: 'excl. VAT',
      recommended: 'Recommended',
      mostPopular: 'Most popular',
      bestPrice: 'Best price',
      bestValue: 'Best value',
      essential: 'Essential',
      complete: 'Complete',
      features: 'Features',
      inAdvance: '',
      inAdvancePlus24Free: '+ 24 months free',
      inAdvancePlus12Free: '+ 12 months free',
      inAdvancePlus3Free: '+ 3 months free',
      onlyAfterFreeVerification: 'Only available after a free verification',
      taxNotice: 'All prices are shown excl. VAT. VAT applicable according to your country of residence.',
      durationHeader: 'Duration',
      bestMonthlyValue: 'BEST MONTHLY VALUE',
      from: 'from',
      perMonthShort: '/month',
      monthsShort: 'Months',
      customerType: {
        individual: 'Individual',
        professional: 'Professional'
      },
      durations: {
        '36months': '36 months + 24 free (5 years)',
        '24months': '24 months + 12 free (3 years)',
        '12months': '12 months + 3 free',
        '6months': '6 months'
      },
      tableRows: {
        duration36: '36 months (3 years)',
        duration24: '24 months (2 years)',
        duration12: '12 months (1 year)',
        duration6: '6 months'
      },
      installation: {
        title: 'INSTALLATION FEES',
        description: 'A non-refundable installation fee applies when subscribing to a plan. It covers software activation, system optimization, technical analysis, and malware removal.',
        priceAmount: '€99.00',
        note: '',
        paymentMethodsTitle: 'Accepted payment methods'
      },
      offers: {
        s: {
          badge: 'To get started',
          name: 'Essential Protection',
          storage: '10 GB storage',
          features: [
            'Cloud Space 10GB',
            'MaSecuSecurity Software',
            '3h support/month',
            'Response within 24h',
            'Annual updates'
          ]
        },
        m: {
          badge: 'For the family',
          name: 'Family Protection',
          storage: '30 GB storage',
          features: [
            'All Essential Protection features',
            'Cloud Space 30GB',
            '5h support/month',
            'Personalized follow-up',
            'Cleanup included'
          ]
        },
        l: {
          badge: 'Maximum protection',
          name: 'Complete Protection',
          storage: '120 GB storage',
          features: [
            'All Family Protection features',
            'Cloud Space 120GB',
            'Unlimited support',
            'Unlimited returns',
            'Priority support'
          ]
        }
      },
      addons: {
        title: 'Add-ons',
        subtitle: 'Customize your experience with our additional options',
        devices: 'devices',
        identity: {
          title: 'Identity Protection',
          description: 'Monitor your personal information and protect your online identity against theft and fraud'
        },
        scam: {
          title: 'Anti-Scam Protection',
          description: 'Detect and block phishing attempts, fraudulent emails and malicious websites'
        },
        vpn: {
          title: 'Secure VPN',
          description: 'Browse anonymously and securely access your favorite content from anywhere in the world'
        }
      },
      featureTable: [
        { name: 'Opening Hours', description: 'Technical support availability hours', values: ['10:00 — 18:00\nMon - Fri', '08:00 — 21:00\nMon - Fri', '08:00 — 21:00\n365 Days'] },
        { name: 'Help and Support from certified professionals', description: 'We help fix problems on your computer', values: ['3 hours\nper month', '5 hours\nper month', 'Unlimited'] },
        { name: 'Response Time', description: 'Our response to your IT problems', values: ['Within 24 hours', 'Maximum\n3 hours', 'Immediate'] },
        { name: 'Secure Cloud Space', description: 'Encrypted cloud storage for your files', values: ['10 GB', '30 GB', '120 GB'] },
        { name: 'MaSecuSecurity Software', description: 'Advanced antivirus and anti-malware protection', values: ['✓', '✓', '✓'] },
        { name: 'MaSecuAdBlocker', description: 'Protects your browsing and blocks ads', values: ['✓', '✓', '✓'] },
        { name: 'Deep Clean', bullets: ['+15 GB recovered on average', 'Trackers & spyware removed', 'Browser up to 3x faster', 'Personal data protected'], values: ['✓', '✓', '✓'] },
        { name: 'Optimization', bullets: ['Startup under 30 seconds', '100% of your RAM available', 'No more sudden slowdowns', 'Day-one performance restored'], values: ['✓', '✓', '✓'] },
        { name: 'Transferable Subscription', description: 'Transfer your subscription to another computer', values: ['—', '✓', '✓'] },
        { name: 'Regular Maintenance', description: 'Proactive maintenance for your device', values: ['Annual', 'Bimonthly', 'Quarterly'] },
        { name: 'Personalized Follow-up', description: 'Dedicated advisor for your account', values: ['—', '✓', '✓'] },
        { name: 'Priority Support', description: 'Your requests processed as priority', values: ['—', '—', '✓'] },
        { name: 'Data Breach Monitoring', description: 'Check if your credentials and passwords have been compromised', values: ['—', '✓', '✓'] }
      ]
    },
    standaloneProducts: {
      badge: 'Independent Solutions',
      title: 'Standalone Services',
      subtitle: 'Subscribe without main subscription - perfect for specific needs',
      aiAssistant: {
        name: 'MaSecuAI Assistant',
        description: 'AI assistant powered by OpenAI for instant 24/7 help with all your IT needs.',
        price: '€19.99',
        period: '/month',
        features: [
          'Powered by OpenAI',
          '24/7 Support',
          'Instant responses',
          'Multilingual',
          'Personalized advice'
        ],
        button: 'Learn more'
      },
      mobileSecurity: {
        name: 'MaSecuMobile Security',
        description: 'Bitdefender Total Security protection for your Android mobiles and tablets.',
        price: '€9.99',
        period: '/device',
        features: [
          'Auto Malware Scanner',
          'Web Protection',
          'SMS Scam Alert',
          'VPN & Anti-Theft',
          'Spam Call Blocking'
        ],
        button: 'Learn more'
      }
    },
    addons: {
      badge: 'Premium Options',
      title: 'Boost Your Protection',
      subtitle: 'Add premium features to your existing subscription.',
      requirement: 'Requires an active subscription (Essential, Family or Complete Protection)',
      vpnPro: {
        name: 'MaSecuVPN Pro',
        price: '€9.99',
        period: '/month',
        features: [
          '50+ servers in 30 countries',
          'Unlimited bandwidth',
          'AES-256 encryption',
          'Automatic Kill Switch',
          'No logs kept'
        ],
        button: 'Learn more'
      },
      adblock: {
        name: 'MaSecuAdBlock Plus',
        price: '€9.99',
        period: '/month',
        features: [
          'Block ads & pop-ups',
          'Advanced anti-trackers',
          'Privacy protection',
          'Custom whitelists',
          '40% faster browsing'
        ],
        button: 'Learn more'
      },
      systemCleaner: {
        name: 'MaSecuSystem Cleaner',
        description: 'Optimize your PC performance. Remove unnecessary files and speed up your system.',
        price: '€9.99',
        period: '/month',
        features: [
          'Temporary file cleanup',
          'Registry optimization',
          'Startup manager',
          'SSD/HDD defragmentation',
          'Scheduled automatic cleanup'
        ],
        button: 'Learn more'
      },
      totalCare: {
        name: 'MaSecuTotal Care',
        badge: 'SAVE 17%',
        description: 'The complete package: VPN + AdBlock + Cleaner combined. Ultimate protection for your digital life.',
        price: '€24.99',
        period: '/month',
        oldPrice: 'instead of €29.97',
        includes: [
          'VPN Pro',
          'AdBlock Plus',
          'System Cleaner'
        ],
        button: 'Learn more'
      }
    },
    vpnProduct: {
      hero: {
        title: 'MaSecuVPN Pro',
        subtitle: 'Browse with complete privacy using our ultra-fast VPN. Protect your data on public Wi-Fi networks.',
        ctaPrimary: 'Start now - €9.99/month',
        ctaSecondary: 'Learn more'
      },
      ipSection: {
        title: 'Your Current Location',
        subtitle: 'Here\'s what websites can see about you right now'
      },
      featuresSection: {
        title: 'Why Choose MaSecuVPN Pro?',
        subtitle: 'The most complete protection for your online privacy',
        features: [
          { title: 'Military-grade encryption', description: 'AES-256 bit protection to secure all your data' },
          { title: '50+ worldwide servers', description: 'Access content from 30 different countries' },
          { title: 'Ultra-fast speed', description: 'Streaming and browsing without slowdown' },
          { title: 'No-logs policy', description: 'We don\'t keep any trace of your activity' },
          { title: 'Automatic Kill Switch', description: 'Continuous protection even if disconnected' },
          { title: 'Multi-platform', description: 'Compatible with Windows, Mac, iOS, Android, Linux' }
        ]
      },
      serversSection: {
        title: 'Servers Worldwide',
        subtitle: 'Connect to over 50 servers in 30 countries',
        countries: [
          '🇫🇷 France', '🇩🇪 Germany', '🇬🇧 United Kingdom', '🇺🇸 United States',
          '🇨🇦 Canada', '🇯🇵 Japan', '🇦🇺 Australia', '🇧🇷 Brazil',
          '🇪🇸 Spain', '🇮🇹 Italy', '🇳🇱 Netherlands', '🇨🇭 Switzerland',
          '🇸🇪 Sweden', '🇳🇴 Norway', '🇩🇰 Denmark', '🇫🇮 Finland',
          '🇵🇱 Poland', '🇦🇹 Austria', '🇧🇪 Belgium', '🇮🇪 Ireland',
          '🇵🇹 Portugal', '🇬🇷 Greece', '🇨🇿 Czech Republic', '🇭🇺 Hungary',
          '🇷🇴 Romania', '🇧🇬 Bulgaria', '🇸🇬 Singapore', '🇭🇰 Hong Kong',
          '🇮🇳 India', '🇰🇷 South Korea', '🇲🇽 Mexico', '🇦🇷 Argentina'
        ]
      },
      comparisonSection: {
        title: 'Without VPN vs With MaSecuVPN Pro',
        without: {
          title: 'Without VPN',
          items: [
            'IP visible to all websites',
            'Location exposed',
            'ISP can see your activity',
            'Vulnerable data on public Wi-Fi',
            'Geo-restricted content inaccessible'
          ]
        },
        with: {
          title: 'With MaSecuVPN Pro',
          items: [
            'Masked and anonymous IP',
            'Hidden location',
            'Totally private browsing',
            'Protection on all networks',
            'Unrestricted worldwide access'
          ]
        }
      },
      pricingSection: {
        title: 'Choose Your Plan',
        individual: 'Individual',
        helpText: '💬 Need help choosing? Our experts are here to guide you.',
        ctaButton: 'Talk to an expert'
      },
      faqSection: {
        title: 'Frequently Asked Questions',
        faqs: [
          {
            q: 'Can I use the VPN on multiple devices?',
            a: 'Yes! MaSecuVPN Pro works on Windows, Mac, iOS, Android and Linux. You can protect up to 5 devices simultaneously with a single subscription.'
          },
          {
            q: 'Does the VPN slow down my internet connection?',
            a: 'No. Our high-performance server infrastructure guarantees optimal speeds. Most users notice no significant difference.'
          },
          {
            q: 'Do you keep logs of my activity?',
            a: 'Absolutely not. We apply a strict no-logs policy. We don\'t keep any trace of your online activities or connections.'
          },
          {
            q: 'Can I access geo-restricted content?',
            a: 'Yes. With our servers in 30 countries, you can access content only available in certain regions.'
          }
        ]
      },
      ctaSection: {
        title: 'Ready to Protect Your Privacy?',
        subtitle: 'Join thousands of users who trust MaSecuVPN Pro',
        button: 'Start now'
      }
    },
    pricingCard: {
      popular: 'Most Popular',
      priceLabel: 'Excl. Tax',
      monthlyPrice: 'Monthly Price',
      perMonth: 'Excl. Tax/month',
      ctaButton: 'Choose this plan'
    },
    ipDetector: {
      loading: 'Detection in progress...',
      error: {
        title: 'Your connection is exposed',
        message: 'Unable to detect your location, but without VPN, your connection remains vulnerable.'
      },
      main: {
        title: 'Your connection is exposed!',
        subtitle: 'Your data is visible to your ISP and websites'
      },
      labels: {
        ipAddress: 'Public IP Address',
        ipHelper: 'Visible to all websites',
        location: 'Detected Location',
        isp: 'Internet Service Provider (ISP)',
        notAvailable: 'Not available'
      },
      warning: {
        title: 'Without VPN protection:',
        items: [
          'Your ISP can see all your visited sites',
          'Your location is revealed with each connection',
          'Your data can be intercepted on public networks',
          'Websites track your online activity'
        ]
      }
    },
    adBlockProduct: {
      hero: {
        title: 'MaSecuAdBlock Plus',
        subtitle: 'Eliminate all intrusive ads and speed up your browsing by up to 40%.',
        ctaPrimary: 'Start now - 9.99€/month',
        ctaSecondary: 'View features'
      },
      liveStats: {
        title: 'Real-time Protection',
        subtitle: 'Simulator: What MaSecuAdBlock Plus blocks every day',
        adsBlocked: 'Ads Blocked',
        trackersStopped: 'Trackers Stopped',
        timeSaved: 'Time Saved',
        adsHelper: 'Today for this average user',
        trackersHelper: 'Prevents tracking of your activity',
        timeHelper: 'Faster page loading',
        warningTitle: 'Without AdBlock, you experience:',
        warningItems: [
          'Thousands of intrusive ads every day',
          'Trackers collecting your browsing data',
          'Pages taking up to 40% longer to load',
          'Increased malware risks through malicious ads'
        ]
      },
      features: {
        title: 'Faster and Safer Browsing',
        subtitle: 'Complete protection against ads and trackers',
        list: [
          {
            title: 'Smart Blocking',
            description: 'Automatically eliminates intrusive ads and pop-ups'
          },
          {
            title: '40% Faster',
            description: 'Pages load instantly without heavy ads'
          },
          {
            title: 'Anti-tracking',
            description: 'Prevents trackers from following your browsing'
          },
          {
            title: 'Malware Protection',
            description: 'Blocks malicious sites and dangerous scripts'
          },
          {
            title: 'Enhanced Privacy',
            description: 'Prevents collection of your personal data'
          },
          {
            title: 'Custom Lists',
            description: 'Create your own advanced filtering rules'
          }
        ]
      },
      comparison: {
        title: 'The Impact of AdBlock Plus',
        subtitle: 'Discover the immediate difference',
        without: {
          title: 'Without AdBlock',
          loadTime: 'Load Time',
          dataDownloaded: 'Data Downloaded',
          trackersActive: 'Active Trackers',
          issues: [
            'Intrusive pop-ups',
            'Ad banners',
            'Auto-play videos',
            'Ad tracking'
          ]
        },
        with: {
          title: 'With MaSecuAdBlock Plus',
          benefits: [
            'Smooth browsing',
            'Relevant content only',
            'Uninterrupted experience',
            'Protected privacy'
          ]
        }
      },
      pricing: {
        title: 'Browse Without Interruption',
        subtitle: 'Block ads and protect your privacy',
        specialOffer: '🎉 Special Offer: Bonus month on all plans',
        planTitle: 'MaSecuAdBlock Plus',
        price: '9.99€',
        perMonth: '/month',
        requirement: 'Requires an active MaSécurité subscription',
        featuresTitle: 'Included Features:',
        featuresList: [
          'Blocking of all ads (banners, videos, pop-ups)',
          'Advanced anti-tracking protection',
          'Up to 40% faster browsing',
          'Automatic blocking of ad malware',
          'Custom filtering lists',
          'Detailed real-time statistics',
          'All browsers compatible (Chrome, Firefox, Edge, Safari)',
          'Up to 50% bandwidth savings',
          'Phishing protection',
          'Automatic filter updates',
          '24/7 priority technical support'
        ],
        ctaButton: 'Order AdBlock Plus',
        trial: '30-day free trial - No commitment',
        helpText: '💬 Questions about our AdBlock plans? Contact our experts.',
        expertButton: 'Talk to an expert'
      },
      finalCta: {
        title: 'Enjoy Clean Browsing',
        subtitle: 'Over 2 million ads blocked every day',
        button: 'Start Free'
      }
    },
    systemCleanerProduct: {
      hero: {
        title: 'MaSecuSystem Cleaner',
        subtitle: 'Bring your PC back to life. Remove unnecessary files and speed up your system instantly.',
        ctaPrimary: 'Start now - 9.99€/month',
        ctaSecondary: 'Scan my system'
      },
      scan: {
        scanning: {
          title: 'Scanning in progress...',
          subtitle: 'Detecting performance issues',
          analyzing: 'Analyzing your system...',
          wait: 'This may take a few moments'
        },
        results: {
          title: 'Scan Results',
          subtitle: 'Here\'s what\'s slowing down your PC',
          tempFiles: 'Temporary Files',
          tempFilesDesc: 'Temporary files unnecessarily occupying disk space',
          registryIssues: 'Registry Issues',
          registryIssuesDesc: 'Invalid entries slowing down your system',
          diskSpace: 'Recoverable Space',
          diskSpaceDesc: 'Disk space that can be freed immediately',
          startupItems: 'Startup Programs',
          startupItemsDesc: 'Applications slowing down your PC startup',
          solution: 'MaSecuSystem Cleaner can solve all these problems!',
          solutionDesc: 'Clean, optimize and speed up your PC with one click. Recover up to {space} GB of space and improve performance by up to 40%.'
        }
      },
      features: {
        title: 'Complete Features',
        subtitle: 'Everything you need for a fast and efficient PC',
        list: [
          {
            title: 'Smart Cleaning',
            description: 'Safe removal of temporary and unnecessary files'
          },
          {
            title: 'Registry Optimization',
            description: 'Fix errors and Windows registry fragmentation'
          },
          {
            title: 'Startup Manager',
            description: 'Control programs that slow down your PC at startup'
          },
          {
            title: 'Defragmentation',
            description: 'SSD/HDD optimization for maximum performance'
          },
          {
            title: 'Automatic Cleaning',
            description: 'Smart scheduling for an always optimized PC'
          },
          {
            title: 'Secure Cleaning',
            description: 'Protection of important system files'
          }
        ]
      },
      comparison: {
        title: 'Before / After Results',
        subtitle: 'The immediate impact of System Cleaner',
        bootTime: 'Boot Time',
        diskSpace: 'Free Disk Space',
        performance: 'Overall Performance',
        before: 'Before',
        after: 'After'
      },
      pricing: {
        title: 'Optimize Your PC Now',
        subtitle: 'Flexible plans for all your needs',
        specialOffer: '⚡ Get up to 3 months free with long-term commitment',
        planTitle: 'MaSecuSystem Cleaner',
        price: '9.99€',
        perMonth: '/month',
        requirement: 'Requires an active MaSécurité subscription',
        featuresTitle: 'Included Features:',
        featuresList: [
          'Scheduled automatic cleaning',
          'Windows registry optimization',
          'Smart startup manager',
          'Optimized SSD/HDD defragmentation',
          'Disk space recovery',
          'Temporary file removal',
          'Detailed performance statistics',
          'Real-time monitoring',
          'Malware protection',
          'Automatic updates',
          '24/7 priority technical support'
        ],
        ctaButton: 'Order System Cleaner',
        trial: '30-day free trial - Money-back guarantee',
        helpText: '💬 Need advice to optimize your PC? Contact us.',
        expertButton: 'Talk to an expert'
      },
      finalCta: {
        title: 'Bring Your PC Back to Life',
        subtitle: 'Optimal performance in minutes',
        button: 'Start Optimization'
      }
    },
    totalCareProduct: {
      hero: {
        badge: 'SAVE 17% - SPECIAL OFFER',
        title: 'MaSecuTotal Care',
        subtitle: 'The ultimate all-in-one protection',
        description: 'VPN Pro + AdBlock Plus + System Cleaner combined in one pack',
        priceCompare: {
          separate: 'Separate price',
          separatePrice: '29.97€/month',
          pack: 'Total Care Pack',
          packPrice: '24.99€',
          perMonth: '/month'
        },
        ctaPrimary: 'Get the offer - 24.99€/month',
        ctaSecondary: 'View comparison'
      },
      includedProducts: {
        title: '3 premium products in 1',
        subtitle: 'All the tools you need for complete protection',
        vpn: {
          name: 'MaSecuVPN Pro',
          features: [
            '50+ servers in 30 countries',
            'AES-256 encryption',
            'No-logs policy',
            'Automatic Kill Switch'
          ]
        },
        adblock: {
          name: 'MaSecuAdBlock Plus',
          features: [
            'Ad and pop-up blocking',
            'Advanced anti-tracking',
            '40% faster browsing',
            'Malware protection'
          ]
        },
        cleaner: {
          name: 'MaSecuSystem Cleaner',
          features: [
            'Automatic cleaning',
            'Registry optimization',
            'SSD/HDD defragmentation',
            'Startup manager'
          ]
        },
        individualValue: 'Individual value',
        individualPrice: '9.99€',
        savings: {
          title: 'TOTAL SAVINGS:',
          calculation: '3 products × 9.99€ = ',
          originalPrice: '29.97€/month',
          payOnly: 'Pay only 24.99€/month',
          monthlySaving: 'That\'s 4.98€ savings every month!'
        }
      },
      allFeatures: {
        title: 'Complete Features',
        subtitle: 'Everything you need for total protection',
        list: [
          'Complete VPN protection on 50+ servers',
          'Block all ads',
          'Ultra-fast browsing (+40%)',
          'System cleaning and optimization',
          'Anti-tracking protection',
          'Military-grade AES-256 encryption',
          'Strict no-logs policy',
          'Disk space recovery',
          'Automatic Kill Switch',
          'Smart defragmentation',
          'Startup manager',
          'Malware protection',
          'Multi-device support',
          'Automatic updates',
          '24/7 priority customer support',
          'Money-back guarantee'
        ]
      },
      comparison: {
        title: 'Why choose the Total Care pack?',
        tableHeaders: {
          feature: 'Feature',
          separate: 'Separate products',
          totalCare: 'Total Care'
        },
        rows: {
          monthlyPrice: 'Monthly price',
          vpnPremium: 'Premium VPN',
          adBlocking: 'Ad blocking',
          systemCleaning: 'System cleaning',
          prioritySupport: 'Priority support',
          monthlySavings: 'Monthly savings',
          yearlySavings: 'Yearly savings'
        }
      },
      pricing: {
        title: 'Total Care Pack - All Inclusive',
        subtitle: 'VPN Pro + AdBlock Plus + System Cleaner in one package',
        specialOffer: '🔥 Save up to 40% with the complete pack',
        badge: 'BEST VALUE',
        planTitle: 'MaSecuTotal Care',
        planSubtitle: 'The complete pack for total protection',
        price: '24.99€',
        perMonth: '/month',
        requirement: 'Requires an active MaSécurité subscription',
        featuresTitle: 'Included in the pack:',
        featuresList: [
          '🛡️ VPN Pro - Complete protection with 50+ servers',
          '🚫 AdBlock Plus - 40% faster browsing',
          '🧹 System Cleaner - Automatic optimization',
          'Military AES-256 encryption',
          'Unlimited simultaneous connections',
          'Full multi-device support',
          'Advanced DDoS protection',
          'Optimized 4K/8K streaming',
          'Daily automatic cleaning',
          'Block 99% of ads',
          'Dedicated account manager',
          '24/7 priority support'
        ],
        ctaButton: 'Order Total Care',
        trial: '30-day money-back guarantee',
        included: {
          title: 'What\'s included in Total Care:',
          vpnValue: 'Value: 37.47€/month',
          adblockValue: 'Value: 19.99€/month',
          cleanerValue: 'Value: 24.99€/month',
          totalValue: 'Total value:',
          totalPrice: '82.45€/month',
          packagePrice: 'Total Care price: From 69.42€/month',
          savings: 'Save 13.03€ per month!'
        },
        helpText: '💬 Questions about the Total Care pack? Our experts are available.',
        expertButton: 'Talk to an expert'
      },
      finalCta: {
        title: 'Ultimate protection at an unbeatable price',
        subtitle: 'Join thousands of users who chose Total Care',
        button: 'Subscribe to Total Care pack',
        footer: 'Save 59.76€ per year · Priority support included'
      }
    },
    aiAssistantProduct: {
      hero: {
        title: 'MaSecuAI Assistant',
        subtitle: 'Your personal assistant powered by advanced artificial intelligence for all your IT needs',
        badges: {
          powered: 'Advanced AI',
          instant: '24/7 Support',
          available: 'Always Available'
        }
      },
      features: {
        list: [
          {
            title: 'Smart AI Assistant',
            description: 'For accurate and contextual responses'
          },
          {
            title: '24/7 Support',
            description: 'Get help instantly, day and night'
          },
          {
            title: 'Instant Responses',
            description: 'Quick solutions to all your technical problems'
          },
          {
            title: 'Secure and Private',
            description: 'Your conversations remain confidential'
          },
          {
            title: 'Multilingual',
            description: 'French, English, Spanish and more'
          }
        ]
      },
      useCases: {
        title: 'How MaSecuAI Assistant Can Help You',
        list: [
          'Help setting up your devices',
          'Technical problem resolution',
          'Personalized security advice',
          'Software usage guidance',
          'System performance optimization',
          'Data backup assistance',
          'Malware protection help',
          'Best practices advice'
        ]
      },
      pricing: {
        title: 'Choose Your Plan',
        individual: 'Individual',
        name: 'MaSecuAI Assistant',
        price: '19.99',
        period: '/month',
        description: 'Personal AI assistant for all your IT needs',
        features: [
          'AI-powered assistance',
          'Available 24/7',
          'Instant responses',
          'Multilingual support',
          'Conversation history',
          'Personalized advice',
          'Step-by-step guides',
          'Continuous updates'
        ],
        ctaText: 'Choose this offer'
      },
      finalCta: {
        title: 'Ready to Benefit from Artificial Intelligence?',
        subtitle: 'Join users who are simplifying their digital life with MaSecuAI Assistant',
        button: 'Start Now'
      }
    },
    cta: {
      title: 'Ready to secure your IT?',
      subtitle: 'Join thousands of satisfied users',
      button: 'Get started now'
    },
    trustSeals: {
      title: 'Your security, our priority',
      subtitle: 'We uphold the highest security and compliance standards',
      sslSecure: 'SSL Secured',
      sslDesc: '256-bit Encryption',
      rgpd: 'GDPR',
      rgpdDesc: 'EU Compliant',
      iso27001: 'ISO 27001',
      iso27001Desc: 'Security Certified',
      soc2: 'SOC 2 Type II',
      soc2Desc: 'Audited & Verified',
      pciDss: 'PCI DSS',
      pciDssDesc: 'Secure Payments',
      protection247: '24/7 Protection',
      protection247Desc: 'Global Support',
      guaranteeTitle: '100% Security Guarantee',
      guaranteeDesc: 'Your data is protected by the most advanced encryption technologies',
      protectionActive: 'Active Protection',
      certificationText: 'MaSécurité is regularly certified and audited to guarantee the highest security standards.',
      privacyText: 'Your personal data is processed in accordance with GDPR and is never shared with third parties.'
    },
    footer: {
      description: 'Secure cloud solutions for individuals and businesses',
      services: 'Services',
      cloudServer: 'Cloud Server',
      securitySuite: 'Security Suite',
      support: 'Support',
      identityProtection: 'Digital Identity Protection',
      information: 'Information',
      about: 'About',
      pricing: 'Pricing',
      faq: 'FAQ',
      contact: 'Contact',
      legal: 'Legal',
      legalNotice: 'Legal Notice',
      privacyPolicy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookiePolicy: 'Cookie Policy',
      refundPolicy: 'Refund Policy',
      rights: 'All rights reserved.',
      support247: 'Support 24/7'
    },
    testimonials: {
      badge: 'Customer Testimonials',
      title: 'What Our Clients Say',
      subtitle: 'Over 10,000 users trust us to protect their digital life',
      averageRating: 'Average rating',
      happyCustomers: 'Happy customers',
      verified: 'Verified',
      noTestimonials: 'No testimonials available at the moment.',
      joinButton: 'Join Our Satisfied Customers'
    },
    faq: {
      title: 'Frequently Asked Questions',
      helpText: 'Need help? Contact us at 01 89 71 28 66',
      questions: [
        { question: "How do I access my Cloud space?", answer: "Once your subscription is activated, you will receive your login credentials by email. You can access your Cloud space from any web browser or via our dedicated application." },
        { question: "Is my data really secure?", answer: "Absolutely. We use bank-level end-to-end encryption. Your data is stored on secure servers with automatic daily backups." },
        { question: "Can I transfer my subscription to another computer?", answer: "Yes, all our plans include the ability to transfer your subscription to another device quickly and easily, at no additional cost." },
        { question: "How does technical support work?", answer: "Our team of certified technicians is available Monday to Friday from 10am to 6pm. You can contact us by phone for immediate assistance or schedule an on-site visit if necessary." },
        { question: "What happens at the end of my subscription?", answer: "You will be notified before your subscription expires. You can renew your plan or download all your data. We never delete your data without notice." },
        { question: "Are the free months really free?", answer: "Yes! Bonus months are added free to your subscription. For example, with the 24-month + 12-month offer, you get 36 months of service for the price of 24." }
      ]
    },
    products: {
      common: { individual: 'Individual', ctaText: 'Choose this plan', startNow: 'Start Now' },
      mobileSecurity: {
        title: 'MaSecuMobile Security',
        subtitle: 'Complete Bitdefender protection for your Android mobiles and tablets',
        badges: { powered: 'Powered by Bitdefender', platform: 'Android & Tablets', price: '€9.99 per device' },
        features: [
          { title: 'Malware Protection', description: 'Automatically scans every installed application' },
          { title: 'Web Protection', description: 'Blocks malicious and phishing sites in real-time' },
          { title: 'Scam Alert', description: 'Detects suspicious links in SMS and messages' },
          { title: 'App Lock', description: 'Protect your sensitive apps with PIN or fingerprint' },
          { title: 'Integrated VPN', description: '200 MB/day of encrypted traffic included' },
          { title: 'Anti-Theft', description: 'Locate, lock or wipe remotely' }
        ],
        completeTitle: 'Complete Features',
        categories: [
          { name: 'Essential Protection', items: ['Automatic and manual Malware Scanner', 'Real-time Web Protection', 'Scam Alert for SMS and messages', 'Application anomaly detection', 'WearON smartwatch protection'] },
          { name: 'Privacy', items: ['VPN with 200 MB/day included', 'App lock by PIN/fingerprint', 'Account Privacy verification', 'Spam and unwanted call blocking', 'Communications encryption'] },
          { name: 'Anti-Theft', items: ['Remote GPS location', 'Remote lock', 'Remote data wipe', 'Send message to phone', 'Intruder photo after 3 attempts'] }
        ],
        browsersTitle: 'Protected Browsing',
        browsersSubtitle: 'Web Protection works with all popular Android browsers:',
        pricingTitle: 'Simple Pricing',
        packageName: 'MaSecuMobile Security',
        price: '9.99',
        period: '/month per device',
        description: 'Bitdefender Total Security protection for mobiles and tablets',
        packageFeatures: ['Bitdefender Total Security', 'Complete Malware Scanner', 'Real-time Web Protection', 'SMS Scam Alert', 'VPN 200 MB/day included', 'App lock', 'Complete Anti-Theft', 'Spam call blocking', 'WearON smartwatch protection', 'Account Privacy check'],
        wearonTitle: 'WearON Smartwatch Protection',
        wearonDescription: 'Extend Bitdefender protection to your smartwatch for additional security:',
        wearonFeatures: ['Trigger a sound alert from your watch to locate your phone', 'Receive a notification if you move too far from your phone'],
        finalCtaTitle: 'Protect Your Mobile Devices Now',
        finalCtaSubtitle: 'Join thousands of users who trust Bitdefender for their mobile security'
      }
    },
    about: {
      title: 'About Us',
      subtitle: 'A caring team at your service to protect what really matters: your family, your memories and your peace of mind',
      stats: [
        { number: '150K+', label: 'European Customers' },
        { number: '24/7', label: 'Human Support' },
        { number: '98%', label: 'Satisfied Customers' },
        { number: '100%', label: 'Listening to You' }
      ],
      story: {
        title: 'Our Story',
        subtitle: 'A human adventure serving your digital serenity',
        paragraph1: 'MaSécurité was born from a simple conviction: technology should serve everyone, regardless of age or technical knowledge. We are a European company specializing in cybersecurity and IT support, particularly attentive to the needs of seniors in France and Belgium.',
        paragraph2: 'We believe that everyone deserves to enjoy technology peacefully to stay in touch with loved ones, preserve memories and manage personal affairs securely. That\'s why we created simple solutions, accompanied by French-speaking human support available 24/7.',
        paragraph3: 'Our team of certified technicians is trained to take the necessary time with each client. We explain each step patiently, adapt to your pace, and ensure you feel confident with your computer, tablet or smartphone.',
        paragraph4: 'Based in Europe with support centers in France and Belgium, we are proud to serve over 150,000 European customers who trust us to protect their devices and most precious data.'
      },
      valuesSection: {
        title: 'Our Values',
        subtitle: 'The principles that guide each of our actions',
        items: [
          { title: 'Kindness and Listening', description: 'We take the time to listen and understand your needs. Every question deserves a clear and patient answer.' },
          { title: 'Personalized Support', description: 'Our French-speaking team accompanies you at every step, with simple explanations adapted to your pace.' },
          { title: 'Simplicity and Clarity', description: 'No complicated technical jargon. We make technology accessible and easy to use for everyone.' },
          { title: 'Reliable Protection', description: 'Solid and effective security to protect your memories, family photos and personal information.' }
        ]
      },
      benefits: {
        title: 'What Sets Us Apart',
        subtitle: 'Benefits designed to make your life easier',
        items: [
          'French-speaking phone support',
          'Patient and caring technicians',
          'Clear and simple explanations',
          'Available 24/7',
          'Protection of your family memories',
          'Respect for your privacy'
        ]
      },
      testimonialsSection: {
        title: 'They Trust Us',
        subtitle: 'Our customers\' testimonials deeply touch us',
        items: [
          { name: 'Marie-Claire', age: '68 years', location: 'Brussels', text: 'Finally a service that takes the time to explain well! The technician was very patient with me.' },
          { name: 'Jean-Pierre', age: '72 years', location: 'Lyon', text: 'I can finally share my photos with my grandchildren safely. Thank you for your help!' },
          { name: 'Françoise', age: '65 years', location: 'Liège', text: 'A wonderful team that truly understands our needs. I highly recommend!' }
        ]
      },
      cta: {
        title: 'Ready to Protect Your Digital Life?',
        subtitle: 'Join thousands of European customers who enjoy technology peacefully thanks to MaSécurité',
        button: 'Contact Us',
        description: 'Protecting European customers with care and expertise since 2018.'
      },
      footerLinks: {
        about: 'About',
        legal: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        mentions: 'Legal Notice'
      }
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Our caring team is here to help you. Don\'t hesitate to contact us!',
      form: {
        name: 'Full name',
        email: 'Email address',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Your message',
        captcha: 'How much is',
        send: 'Send message',
        sending: 'Sending...',
        success: 'Message sent successfully!',
        error: 'Error sending message',
        captchaError: 'The answer to the calculation is incorrect. Please try again.',
        formIntro: 'Fill out the form below and we will respond as soon as possible',
        selectSubject: 'Select a subject',
        subjectOptions: {
          general: 'General question',
          technical: 'Technical support',
          subscription: 'Subscription question',
          billing: 'Billing',
          other: 'Other'
        },
        securityCheck: 'Security check',
        messagePlaceholder: 'Describe your request in detail...'
      },
      info: {
        phone: {
          title: 'Phone',
          value: '01 89 71 28 66',
          hours: 'Available 24/7'
        },
        email: {
          title: 'Email',
          value: 'info@masecurite.be',
          responseTime: 'Response within 24h'
        },
        address: {
          title: 'Address',
          value: 'Albuquerque, New Mexico, USA',
          officeSubtitle: 'USA Office'
        }
      },
      features: {
        immediateSupport: {
          title: 'Immediate Support',
          description: 'Phone support available 24/7'
        },
        quickResponse: {
          title: 'Quick Response',
          description: 'We respond to all emails within 24 hours'
        },
        caringTeam: {
          title: 'Caring Team',
          description: 'Attentive technicians at your service'
        }
      }
    },
    quickScan: {
      initializing: 'Initializing scan...',
      scanning: 'Scanning in progress...',
      error: {
        title: 'Scan Error',
        message: 'An error occurred during the scan. Please refresh the page to try again.',
        refreshButton: 'Refresh Page'
      },
      stages: {
        initial: 'Initializing scan',
        filesystem: 'Analyzing file system',
        network: 'Analyzing network',
        registry: 'Analyzing registry'
      },
      progress: {
        filesAnalyzed: 'files analyzed',
        currentFile: 'Current file:',
        filesPerSec: 'files/sec',
        timeRemaining: 'Time remaining'
      },
      systemInfo: {
        title: 'Detected system information',
        ipAddress: 'IP Address',
        location: 'Location',
        provider: 'Provider',
        system: 'System',
        browser: 'Browser',
        processors: 'Processors',
        cores: 'cores'
      },
      terminal: {
        analyzingProcesses: 'Analysing running processes...',
        scanning: 'Scanning',
        safe: 'SAFE',
        registryAnalysis: 'Registry Analysis',
        keys: 'keys',
        activeNetworkConnections: 'Active Network Connections',
        protocol: 'Protocol',
        local: 'Local',
        remote: 'Remote',
        state: 'State',
        process: 'Process',
        location: 'Location',
        status: 'Status'
      },
      results: {
        title: 'Scan Results',
        risk: 'Risk',
        riskLevels: {
          critical: 'CRITICAL',
          high: 'HIGH',
          medium: 'MODERATE',
          low: 'LOW'
        },
        needsAttention: 'Your computer requires immediate attention',
        systemAnalyzed: 'Analyzed system',
        ipLocation: 'IP & Location',
        graphicsCard: 'Graphics card',
        gpu: 'GPU',
        cookiesTrackers: 'Cookies & Trackers',
        totalCookies: 'Total cookies',
        trackingCookies: 'Tracking cookies',
        detectTrackers: 'Detected trackers',
        privacyRisk: 'Privacy risk',
        mediaDevices: 'Media devices',
        cameras: 'Cameras',
        microphones: 'Microphones',
        speakers: 'Speakers',
        batteryStatus: 'Battery status',
        level: 'Level',
        status: 'Status',
        charging: 'Charging',
        onBattery: 'On battery',
        health: 'Health',
        healthStatuses: {
          excellent: 'Excellent',
          good: 'Good',
          fair: 'Fair',
          poor: 'Poor',
          critical: 'Critical'
        },
        webrtcLeak: 'WebRTC Leak',
        leakStatus: 'Status',
        leakDetected: 'Leak detected',
        noLeak: 'No leak',
        publicIPs: 'Exposed public IPs',
        localIPs: 'Local IPs',
        digitalFingerprint: 'Digital fingerprint',
        uniqueness: 'Uniqueness',
        users: 'users',
        thirdPartyResources: 'Third-party resources',
        thirdPartyDomains: 'Third-party domains',
        trackers: 'Trackers',
        analytics: 'Analytics',
        ads: 'Ads',
        browserStorage: 'Browser storage',
        localStorage: 'LocalStorage',
        sessionStorage: 'SessionStorage',
        indexedDB: 'IndexedDB',
        bytes: 'bytes',
        entries: 'entries',
        databases: 'databases',
        networkPerformance: 'Network performance',
        dns: 'DNS',
        tls: 'TLS',
        ttfb: 'TTFB',
        exposedAPIs: 'Exposed APIs',
        totalExposed: 'Total exposed',
        highRisk: 'High risk',
        geolocation: 'Geolocation',
        cameraAndMicrophone: 'Camera/Microphone',
        bluetooth: 'Bluetooth',
        browserExtensions: 'Browser extensions',
        totalDetected: 'Total detected',
        mediumRisk: 'Medium risk',
        connectionSecurity: 'Connection security',
        protocol: 'Protocol',
        port: 'Port',
        dnsLeak: 'DNS Leak',
        dnsServers: 'DNS servers',
        noDnsLeakDetected: 'No DNS leak detected',
        realIpExposed: 'Your real IP address is exposed via WebRTC',
        fingerprintHighlyUnique: 'Your digital fingerprint is highly unique - you are easily traceable',
        threatsDetected: 'Threats detected',
        privacyIssues: 'Privacy issues',
        performanceIssues: 'Performance issues',
        systemVulnerabilities: 'System vulnerabilities',
        systemCompromised: 'Warning! Your system is compromised',
        systemCompromisedDesc: 'We have detected several active threats that endanger your personal data and the security of your system. Immediate action is recommended.',
        securityThreats: 'Security threats',
        threatsDetectedTitle: 'Detected threats',
        realTimeDetection: 'Real-time detection',
        threats: 'Threats',
        criticalThreatsAction: 'critical threat(s) detected - Immediate action required',
        criticalCount: 'Critical',
        highCount: 'High',
        mediumCount: 'Medium',
        lowCount: 'Low',
        mediaDevicePermissionWarning: 'Media device permissions not granted - limited detection',
        personalizedRecommendation: 'Personalized recommendation',
        protectionAdapted: 'Protection tailored to your needs',
        basedOnThreats: 'Based on the detected threats, here is our recommendation',
        offer: 'Plan',
        storage: 'storage',
        for5Years: 'for 5 years (36 months + 24 free)',
        benefits: {
          removeThreats: 'Removal of all threats',
          removeThreatsDesc: 'Complete elimination of detected malware and viruses',
          privacyProtection: 'Privacy protection',
          privacyProtectionDesc: 'Blocking trackers and securing your data',
          performanceOptimization: 'Performance optimization',
          performanceOptimizationDesc: 'Cleaning and accelerating your system',
          support247: 'Technical support 24/7',
          support247Desc: 'Priority assistance by phone and on-site'
        },
        protectNow: 'Protect my computer now',
        limitedOffer: 'Limited offer - Act now to secure your data',
        seeAllOffers: 'See all offers',
        inactionWarning: {
          title: 'If you do nothing...',
          subtitle: 'Here\'s what could happen to your system',
          now: 'Now',
          oneHour: '1 hour',
          twentyFourHours: '24 hours',
          oneWeek: '1 week',
          oneMonth: '1 month',
          activeThreats: 'Active threats on your PC',
          maliciousProcesses: '{count} malicious processes running',
          passwordsCompromised: 'Passwords potentially compromised',
          keyloggerActive: 'Keylogger active - All your passwords at risk',
          personalDataStolen: 'Personal data possibly stolen',
          sensitiveFilesExposed: 'Documents, photos, and sensitive files exposed',
          ransomwareRisk: 'High risk of ransomware',
          filesEncrypted: 'All your files could be encrypted for ransom',
          identityTheft: 'Identity possibly stolen',
          darkWebSale: 'Your data sold on the dark web - Possible banking fraud',
          avoidCatastrophe: 'Avoid this catastrophic scenario',
          completeProtection: 'Complete protection in less than 30 minutes',
          protectNow: 'Protect now'
        }
      }
    },
    breachChecker: {
      title: 'Breach Checker',
      subtitle: 'Check if your personal data has been compromised in a data breach',
      navTitle: 'Check my data',
      hero: {
        badge: 'Real-time Analysis',
        title: 'Check if your data has been',
        titleHighlight: 'hacked',
        subtitle: 'Our technology analyzes more than 15 billion stolen identifiers to check if your information is circulating on the Dark Web.'
      },
      badges: {
        confidential: '100% Confidential',
        instant: 'Instant Results'
      },
      tabs: {
        email: 'Email',
        password: 'Password',
        free: 'Free'
      },
      search: {
        emailTitle: 'Check if your email has been hacked',
        emailPlaceholder: 'Enter your email address',
        emailButton: 'Check my email',
        emailButton2: 'Check my address',
        passwordTitle: 'Check if your password has been compromised',
        passwordPlaceholder: 'Enter a password to check',
        passwordButton: 'Check this password',
        searching: 'Searching...'
      },
      privacy: {
        email: 'Your address is never stored or shared',
        password: 'Your password is never sent - we use secure hashing'
      },
      emailChecker: {
        label: 'Your email address',
        placeholder: 'example@email.com',
        button: 'Check my address',
        privacy: 'Your privacy is protected. We use the Have I Been Pwned API to securely check your address. Your address is never stored.',
        contactMessage: 'To check your email address, please contact us or call'
      },
      passwordChecker: {
        label: 'Your password',
        placeholder: 'Enter your password',
        button: 'Check my password',
        privacy: '100% anonymous. Your password is NEVER sent. We use a hashing system (SHA-1) that only checks the first 5 characters of the hash, without ever revealing your password.'
      },
      results: {
        breached: {
          title: 'Warning! Your data has been compromised',
          text: 'Your email address was found in {count} data breaches. Your personal information is potentially accessible to hackers.'
        },
        safe: {
          title: 'Good news!',
          text: 'Your email address was not found in known data breaches.'
        },
        passwordPwned: {
          title: 'This password has been compromised!',
          text: 'This password was found in hacker databases. It should NO LONGER be used anywhere.',
          foundCount: 'Number of times found in breaches',
          times: 'times',
          riskLevel: 'Risk level',
          critical: 'Critical',
          recommendation: 'Recommendation',
          changeNow: 'Change immediately'
        },
        passwordSafe: {
          title: 'This password was not found',
          text: 'This does not guarantee it is secure. Always use unique and complex passwords.'
        }
      },
      breachList: {
        title: 'Data breaches detected',
        breachDate: 'Breached on',
        accounts: 'accounts'
      },
      dataTypes: {
        email: 'Email',
        password: 'Password',
        name: 'Name',
        phone: 'Phone',
        address: 'Address',
        dob: 'Date of birth',
        cardNumber: 'Card number'
      },
      cta: {
        badge: 'Limited offer',
        title: 'Protect your online identity',
        features: [
          'Dark Web surveillance 24/7',
          'Instant alerts on breaches',
          'Expert support available',
          'Money-back guarantee'
        ],
        button: 'See our offers',
        call: 'Call us at',
        phone: '+1 (555) 123-4567',
        urgency: 'Check now - your data could be compromised'
      },
      attribution: 'Data provided by',
      loading: 'Checking...',
      error: 'An error occurred. Please try again.'
    },
    legal: {
      common: {
        lastUpdated: 'Last updated: January 2025',
        company: 'Digital Genesys Solutions LLC',
        companyName: 'Digital Genesys Solutions LLC (MaSécurité)',
        legalForm: 'Limited Liability Company (LLC)',
        registrationNumber: 'Registration number',
        registrationNum: '3003074',
        formationDate: 'Formation date',
        formationDateValue: 'December 16, 2024',
        address: 'Address',
        addressValue: '5203 Juan Tabo Blvd STE 2B, Albuquerque, NM 87111, USA',
        registeredAgent: 'Registered agent',
        registeredAgentValue: 'Cindy\'s New Mexico LLC (5587298BA)',
        agentAddress: 'Agent address',
        agentAddressValue: '5203 Juan Tabo Blvd NE Suite 2a, Albuquerque, NM 87111, USA',
        state: 'Formation state',
        stateValue: 'New Mexico, USA',
        phone: 'Phone',
        phoneValue: '01 89 71 28 66',
        email: 'Email',
        emailValue: 'info@masecurite.be',
        contactTitle: 'Need More Information?',
        contactText: 'For any questions regarding this legal notice, contact us:',
        society: 'Company'
      },
      legalNotice: {
        title: 'Legal Notice',
        intro: 'In accordance with the provisions of Law No. 2004-575 of June 21, 2004 on confidence in the digital economy, here is the legal information for the MaSécurité website.'
      },
      privacyPolicy: {
        title: 'Privacy Policy',
        lastUpdate: 'Last updated: January 2025',
        intro: 'At MaSécurité, we take the protection of your personal data very seriously. This policy explains how we collect, use and protect your information in accordance with the General Data Protection Regulation (GDPR).',
        section1: {
          title: '1. Data Controller',
          description: 'The data controller for your personal data is:'
        },
        section2: {
          title: '2. Personal Data Collected',
          intro: 'We collect different types of personal data depending on your use of our services:',
          identificationData: {
            title: 'Identification data',
            items: ['First and last name', 'Email address', 'Phone number', 'Postal address']
          },
          technicalData: {
            title: 'Technical data',
            items: ['IP address', 'Browser type and operating system', 'Device information (model, version)', 'Connection and usage data']
          },
          paymentData: {
            title: 'Payment data',
            items: ['Credit card information (encrypted and processed by our secure payment provider)', 'Transaction history']
          }
        },
        section3: {
          title: '3. Processing Purposes',
          intro: 'Your personal data is used for the following purposes:',
          items: [
            'Contract execution: Provision of cybersecurity services and technical support',
            'Customer relationship management: Respond to your requests and manage your account',
            'Service improvement: Usage analysis to optimize our offerings',
            'Communications: Sending important information about your subscription',
            'Marketing (with consent): Sending promotional offers and newsletters',
            'Legal obligations: Compliance with regulatory and tax requirements',
            'Security: Fraud prevention and system protection'
          ]
        },
        section4: {
          title: '4. Legal Basis for Processing',
          intro: 'The processing of your data is based on the following legal grounds:',
          items: [
            'Contract execution: Necessary for the provision of our services',
            'Consent: For marketing communications (revocable at any time)',
            'Legal obligations: Retention of invoices, tax declarations',
            'Legitimate interests: Service improvement, security'
          ]
        },
        section5: {
          title: '5. Data Sharing',
          intro: 'Your personal data may be shared with:',
          items: [
            'Service providers: Hosting, payment, technical support (under strict confidentiality contract)',
            'Technology partners: For the provision of cybersecurity solutions',
            'Competent authorities: In case of legal obligation or court order'
          ],
          important: 'Important: We never sell your personal data to third parties for commercial purposes.'
        },
        section6: {
          title: '6. International Transfers',
          description: 'Your data is primarily stored and processed within the European Union. If transfers outside the EU are necessary, we ensure that appropriate safeguards are in place (EU Commission standard contractual clauses, Privacy Shield, etc.).'
        },
        section7: {
          title: '7. Retention Period',
          intro: 'We retain your personal data for the following periods:',
          items: [
            'Customer account data: Throughout your subscription + 3 years after termination',
            'Billing data: 10 years (legal accounting obligation)',
            'Support data: 3 years after last interaction',
            'Marketing data: 3 years after last consent or interaction',
            'Cookies: According to the periods specified in our Cookie Policy'
          ]
        },
        section8: {
          title: '8. Your Rights',
          intro: 'In accordance with GDPR, you have the following rights:',
          items: [
            'Right of access: Obtain a copy of your personal data',
            'Right of rectification: Correct inaccurate or incomplete data',
            'Right to erasure: Request deletion of your data ("right to be forgotten")',
            'Right to restriction: Limit the processing of your data in certain situations',
            'Right to object: Object to the processing of your data for legitimate reasons',
            'Right to data portability: Receive your data in a structured and transferable format',
            'Right to withdraw consent: Withdraw your consent to marketing processing at any time',
            'Right to lodge a complaint: Contact the CNIL (French Data Protection Authority)'
          ],
          howToExercise: {
            title: 'How to exercise your rights?',
            intro: 'To exercise any of these rights, contact us:',
            dpo: 'dpo@masecurite.be',
            responseTime: 'We will respond to your request within a maximum of one month. Proof of identity may be requested to verify your identity.'
          }
        },
        section9: {
          title: '9. Data Security',
          intro: 'We implement appropriate technical and organizational security measures to protect your data:',
          items: [
            'Encryption of sensitive data (SSL/TLS)',
            'Restricted access to personal data (need-to-know principle)',
            'Secure authentication and password management',
            'Security incident monitoring and detection',
            'Regular backups and business continuity plan',
            'Regular training of our teams on data protection'
          ],
          breachNotification: 'In the event of a data breach likely to affect your rights and freedoms, we will inform you as soon as possible in accordance with regulations.'
        },
        section10: {
          title: '10. Cookies and Similar Technologies',
          description: 'Our site uses cookies to improve your experience. To learn more, see our',
          cookiePolicyLink: 'Cookie Policy'
        },
        section11: {
          title: '11. Policy Changes',
          para1: 'We may modify this privacy policy to reflect changes in our practices or legislation. Any substantial changes will be notified to you by email or via our website.',
          para2: 'We encourage you to regularly consult this page to stay informed about our data protection practices.'
        },
        questionsSection: {
          title: 'Questions About Privacy?',
          description: 'Our Data Protection Officer (DPO) is available for any questions:'
        }
      },
      cookiePolicy: {
        title: 'Cookie Policy',
        lastUpdate: 'Last updated: January 2025',
        intro: 'This policy explains how MaSécurité uses cookies and similar technologies on our website to improve your browsing experience.',
        section1: {
          title: '1. What is a Cookie?',
          description: 'A cookie is a small text file placed on your device (computer, tablet, smartphone) when you visit a website. Cookies allow the site to:',
          items: ['Remember your preferences and settings', 'Facilitate your navigation', 'Analyze site usage to improve it', 'Personalize your experience', 'Ensure the security of your connection']
        },
        section2: {
          title: '2. Types of Cookies Used',
          sessionCookies: {
            title: 'A. Session Cookies',
            description: 'These temporary cookies are automatically deleted when you close your browser. They allow:',
            items: ['Maintain your connection during your visit', 'Remember information you enter in a form', 'Manage your cart if you make a purchase']
          },
          persistentCookies: {
            title: 'B. Persistent Cookies',
            description: 'These cookies remain on your device for a set period or until you delete them. They allow:',
            items: ['Recognize your device on your next visits', 'Remember your language preferences', 'Retain your privacy settings', 'Automatically reconnect you if you chose to']
          }
        },
        section3: {
          title: '3. Cookie Categories',
          strictlyNecessary: {
            title: 'A. Strictly Necessary Cookies',
            purpose: 'Essential for site functionality',
            duration: 'Session or up to 1 year',
            consentRequired: 'No (essential technical cookies)',
            description: 'These cookies are essential to:',
            items: ['Secure your connection and prevent fraud', 'Enable navigation between pages', 'Access your secure customer area', 'Remember your cookie choices']
          },
          performance: {
            title: 'B. Performance and Analytics Cookies',
            purpose: 'Analyze site usage',
            duration: 'Up to 2 years',
            consentRequired: 'Yes',
            description: 'These cookies help us understand how you use our site:',
            items: ['Most visited pages', 'Visit duration', 'Navigation paths', 'Error messages encountered'],
            tool: 'Google Analytics (anonymized data)'
          },
          functionality: {
            title: 'C. Functionality Cookies',
            purpose: 'Personalize your experience',
            duration: 'Up to 1 year',
            consentRequired: 'Yes',
            description: 'These cookies improve your browsing comfort:',
            items: ['Remember your language choice', 'Adapt display to your device', 'Personalize content according to your preferences', 'Save your display settings']
          },
          advertising: {
            title: 'D. Advertising and Social Media Cookies',
            purpose: 'Deliver relevant ads',
            duration: 'Up to 13 months',
            consentRequired: 'Yes',
            description: 'These cookies enable:',
            items: ['Display ads adapted to your interests', 'Share content on social networks', 'Limit the number of times an ad is displayed', 'Measure the effectiveness of advertising campaigns'],
            partners: 'Facebook, Google Ads'
          }
        },
        section4: {
          title: '4. Managing Your Preferences',
          intro: 'You have full control over cookies:',
          banner: {
            title: 'Via our cookie banner',
            description: 'On your first visit, a banner allows you to accept or refuse non-essential cookies. You can modify your preferences at any time by clicking on the "Manage cookies" link at the bottom of the page.'
          },
          browser: {
            title: 'Via your browser',
            description: 'You can configure your browser to:',
            items: ['Be notified when a cookie is placed', 'Accept or refuse cookies on a case-by-case basis', 'Systematically refuse all cookies', 'Delete existing cookies'],
            browserLinks: 'Links to popular browser settings:'
          },
          warning: 'Warning: Refusing certain cookies may limit access to certain site features or degrade your browsing experience.'
        },
        section5: {
          title: '5. Third-Party Cookies',
          intro: 'Our site may contain third-party services (videos, maps, share buttons) that place their own cookies. We have no control over these third-party cookies.',
          services: 'Main third-party services used:',
          items: ['Google Analytics: Audience analysis (anonymized)', 'Google Ads: Targeted advertising', 'Facebook Pixel: Conversion tracking', 'YouTube: Video integration'],
          recommendation: 'We encourage you to consult the privacy policies of these services to understand how they use your data.'
        },
        section6: {
          title: '6. Retention Period',
          items: ['Session cookies: Deleted when browser is closed', 'Strictly necessary cookies: Up to 12 months', 'Analytics cookies: Up to 24 months', 'Personalization cookies: Up to 12 months', 'Advertising cookies: Up to 13 months', 'Cookie consent: 13 months']
        },
        section7: {
          title: '7. Your Rights',
          intro: 'In accordance with GDPR and the ePrivacy directive, you have the following rights:',
          items: ['Right to consent to or refuse cookies', 'Right to withdraw your consent at any time', 'Right to access data collected via cookies', 'Right to delete cookies from your device', 'Right to file a complaint with the CNIL']
        },
        section8: {
          title: '8. Policy Changes',
          para1: 'We may modify this cookie policy to reflect changes in our practices or legislation. The last update date is indicated at the top of this page.',
          para2: 'We encourage you to regularly consult this page to stay informed about our use of cookies.'
        },
        questionsSection: {
          title: 'Questions About Cookies?',
          description: 'For any questions regarding our use of cookies:'
        }
      },
      refundPolicy: {
        title: 'Refund Policy',
        lastUpdate: 'Last updated: January 2025',
        intro: 'At MaSécurité, your satisfaction is our priority. This policy explains the conditions for refunding our services.',
        section1: {
          title: '1. 30-Day Right of Withdrawal',
          para1: 'In accordance with European consumer protection legislation, you have a period of 30 calendar days from the date of subscription to exercise your right of withdrawal without having to justify your reasons.',
          para2: 'This right applies to all our plans, whether monthly, annual or multi-year.'
        },
        section2: {
          title: '2. How to Request a Refund',
          intro: 'To exercise your right of withdrawal and request a refund, you can:',
          items: ['Fill out the online form available in your customer area', 'Call us at 01 89 71 28 66 (available 24/7)', 'Email us at info@masecurite.be with your order number', 'Write to us by postal mail at: Digital Genesys Solutions LLC, 5203 Juan Tabo Blvd STE 2B, Albuquerque, NM 87111, USA'],
          advice: 'Tip: For faster processing, use the online form or contact us by phone.'
        },
        section3: {
          title: '3. Non-Refundable Amounts',
          intro: 'During a refund, certain amounts may be withheld:',
          installation: {
            title: 'Installation and configuration fees',
            description: 'If you have benefited from our installation and initial configuration service, these fees are not refundable as the service has already been provided.'
          },
          proportional: {
            title: 'Proportional use of the service',
            description: 'If you have used our services during the withdrawal period, an amount proportional to the time of use will be withheld from the refund.',
            example: 'Calculation example: Annual subscription: €120, Usage duration: 10 days, Amount withheld: €120 × (10/365) = €3.29, Refund: €116.71'
          },
          hardware: {
            title: 'Hardware equipment',
            description: 'If you received hardware equipment (for example, a secure router) as part of your subscription:',
            items: ['The equipment must be returned in its original packaging', 'The equipment must not be damaged', 'Return shipping costs are your responsibility', 'If the equipment is damaged, its value will be deducted from the refund']
          }
        },
        section4: {
          title: '4. Refund Timeframe',
          intro: 'Once your refund request is validated:',
          items: ['The refund is processed within a maximum of 14 business days', 'The refund is made to the payment method used during the order', 'If equipment must be returned, the refund is made within 30 days of receiving the equipment', 'You will receive a confirmation email once the refund is processed']
        },
        section5: {
          title: '5. Refund After the Withdrawal Period',
          intro: 'After the 30-day withdrawal period, refunds are generally not possible. However, we examine each situation on a case-by-case basis:',
          items: ['Technical problem unresolved despite our interventions', 'Service not compliant with contractual commitments', 'Exceptional circumstances justifying a refund request'],
          note: 'For any request after the withdrawal period, contact our customer service which will carefully examine your situation.'
        },
        section6: {
          title: '6. Cancellation and Subscription Refunds',
          intro: 'If you wish to cancel your current subscription:',
          items: ['Cancellation takes effect at the end of the current commitment period', 'No refund is made for the remaining period already paid', 'Automatic renewal is disabled', 'You continue to benefit from the service until the end of the paid period']
        },
        section7: {
          title: '7. Satisfaction Guarantee',
          intro: 'We are committed to your satisfaction:',
          items: ['Unlimited technical support throughout your subscription', 'Rapid resolution of technical problems', 'Ability to change plans if your needs evolve', 'Attentive listening to your concerns and suggestions']
        },
        section8: {
          title: '8. Refund in Case of Outage or Interruption',
          intro: 'If our services are interrupted for reasons beyond your control for a significant period:',
          items: ['A proportional refund may be granted', 'A free extension of your subscription may be offered', 'Each situation is evaluated individually']
        },
        questionsSection: {
          title: 'Questions About Refunds?',
          description: 'Our team is here to help you:'
        }
      },
      termsOfService: {
        title: 'Terms of Service',
        lastUpdate: 'Last updated: January 2025',
        intro: 'These Terms of Service govern the use of services offered by MaSécurité, operated by our company. By using our services, you accept these terms in their entirety.',
        section1: {
          title: '1. Contract Purpose',
          intro: 'MaSécurité offers cybersecurity services, technical support and computer maintenance including:',
          items: [
            'Installation and configuration of security software',
            'Real-time protection against computer threats',
            '24/7 telephone technical support',
            'Preventive maintenance and device optimization',
            'Remote assistance to resolve your technical problems'
          ]
        },
        section2: {
          title: '2. Plans and Pricing',
          intro: 'We offer several subscription plans tailored to your needs:',
          items: [
            'Essential Plan: Basic protection with telephone support',
            'Complete Plan: Advanced protection with regular maintenance',
            'Premium Plan: Maximum protection with priority assistance'
          ],
          outro: 'Prices are indicated in euros (€) and include applicable VAT. Payment is made by credit card, bank transfer or automatic debit depending on the chosen plan.'
        },
        section3: {
          title: '3. Duration and Renewal',
          para1: 'Subscriptions are offered for periods of 12, 24 or 36 months. Unless you indicate otherwise, your subscription will automatically renew for a period equivalent to the initial duration.',
          para2: 'You will be notified by email at least 30 days before the renewal date. You can disable automatic renewal at any time from your customer area or by contacting us.'
        },
        section4: {
          title: '4. Right of Withdrawal',
          para1: 'In accordance with European law, you have a period of 30 days from the subscription to exercise your right of withdrawal without having to justify reasons.',
          para2: 'To exercise this right, contact our customer service by phone at 01 89 71 28 66 or by email at info@masecurite.be.',
          important: 'Important: If you have benefited from our services during this period, an amount proportional to the service used will be deducted from the refund.'
        },
        section5: {
          title: '5. Customer Obligations',
          intro: 'As a customer, you agree to:',
          items: [
            'Provide accurate information during registration',
            'Keep your login credentials confidential',
            'Use the services in accordance with current legislation',
            'Not share your subscription with third parties',
            'Promptly inform MaSécurité of any problem or incident',
            'Allow remote access to your devices for technical support'
          ]
        },
        section6: {
          title: '6. MaSécurité Obligations',
          intro: 'We are committed to:',
          items: [
            'Provide a quality service compliant with industry standards',
            'Ensure 24/7 technical support availability',
            'Protect your personal data in accordance with GDPR',
            'Inform you of any significant service changes',
            'Respond to your requests as quickly as possible',
            'Maintain the confidentiality of your information'
          ]
        },
        section7: {
          title: '7. Limitation of Liability',
          intro: 'MaSécurité makes every effort to ensure the security of your devices. However, our liability is limited in the following cases:',
          items: [
            'Hardware problems requiring physical repair',
            'Data loss resulting from customer action',
            'Service interruptions due to causes beyond our control',
            'Damage caused by third-party software or hardware',
            'Inappropriate or unauthorized use of services'
          ]
        },
        section8: {
          title: '8. Data Protection',
          para1: 'Your personal data is collected and processed in accordance with our Privacy Policy and the General Data Protection Regulation (GDPR).',
          para2: 'You have a right of access, rectification, deletion and portability of your personal data. To exercise these rights, contact us at dpo@masecurite.be.',
          privacyPolicyLink: 'Privacy Policy'
        },
        section9: {
          title: '9. Termination',
          para1: 'You can terminate your subscription at any time with 30 days notice. Termination takes effect at the end of the current subscription period.',
          para2: 'MaSécurité reserves the right to terminate your subscription in case of non-payment, fraudulent use or violation of these terms, after prior notification.'
        },
        section10: {
          title: '10. Modification of Terms',
          para1: 'MaSécurité reserves the right to modify these general terms. You will be informed of any substantial modification by email at least 30 days before they come into effect.',
          para2: 'Continued use of our services after the new terms come into effect constitutes acceptance thereof.'
        },
        section11: {
          title: '11. Applicable Law and Jurisdiction',
          para1: 'These terms are governed by French and European law. In case of dispute, we encourage you to contact us first to find an amicable solution.',
          para2: 'If no amicable agreement can be found, French courts will have jurisdiction. You can also use the European Union online dispute resolution platform accessible at:'
        },
        contact: {
          title: 'Questions?',
          intro: 'For any questions concerning these general terms, do not hesitate to contact us:',
          company: 'Company',
          phone: 'Phone',
          phoneValue: '01 89 71 28 66',
          email: 'Email',
          address: 'Address'
        }
      }
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      ourServices: 'Nuestros servicios',
      pricing: 'Tarifas',
      features: 'Ventajas',
      quickAnalysis: 'Diagnóstico rápido',
      quickScan: 'Diagnóstico rápido',
      about: 'Sobre nosotros',
      whoAreWe: '¿Quiénes somos?',
      contact: 'Contáctenos',
      quickSupport: 'Asistencia Rápida',
      needHelp: '¿Necesitas ayuda?',
      help: 'Ayuda',
      freeScan: 'Escaneo gratis',
      getStarted: '¡Vamos!',
      backHome: 'Volver al inicio',
      belgianCompany: 'Empresa belga',
      frenchSupport: 'Soporte en francés',
      businessHours: 'Lun-Vie: 9h-18h',
      emergency247: 'Urgencias: 24/7'
    },
    trustBadges: {
      ssl: {
        title: 'SSL Seguro',
        subtitle: 'Pago 100% seguro'
      },
      gdpr: {
        title: 'RGPD',
        subtitle: 'Datos protegidos'
      },
      certified: {
        title: 'Certificado UE',
        subtitle: 'Cumplimiento europeo'
      },
      guarantee: {
        title: 'Garantía 30 días',
        subtitle: 'Satisfecho o reembolsado'
      }
    },
    paymentBadges: {
      title: 'Pago 100% seguro - Métodos aceptados',
      sslEncrypted: 'Transacciones cifradas SSL',
      gdprCompliant: 'Conforme RGPD',
      satisfaction: 'Satisfecho o Reembolsado'
    },
    hero: {
      title: 'Proteja sus datos.',
      subtitle: 'Simplifique su informática.',
      description: 'Soluciones Cloud seguras e intervenciones informáticas rápidas para particulares y profesionales',
      cta: 'Descubra nuestros servicios',
      ctaSecondary: 'Contáctenos',
      simpleToUse: 'Sencillo de usar',
      secure: 'Seguro y privado',
      support247: 'Asistencia 24/7'
    },
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Una solución completa, pensada para su comodidad',
      cloudServer: {
        title: 'Servidor Cloud Seguro',
        description: 'Acceda a sus archivos personales o profesionales dondequiera que esté. Sus datos están protegidos mediante cifrado avanzado y guardados de forma segura y duradera, independientemente de cualquier dispositivo.',
        feature1: 'Virtualización VMware',
        feature2: 'Procesador Intel Xeon',
        feature3: 'Tráfico ilimitado',
        feature4: 'API REST disponible'
      },
      security: {
        title: 'Suite de Seguridad Integral',
        description: 'Nuestro MaSecuSecurity Software le protege contra todo tipo de amenazas informáticas y protege eficazmente su identidad digital en internet.',
        feature1: 'Protección antivirus avanzada',
        feature2: 'MaSecuIntelligard incluido',
        feature3: 'Protección contra ciberataques',
        feature4: 'Bloqueo de recogida de datos'
      },
      phone: {
        title: 'Asistencia Telefónica',
        description: 'Un técnico certificado le asiste por teléfono ante cualquier problema: acceso a internet, correos electrónicos, VPN de clientes, mantenimiento informático y resolución de problemas ofimáticos.',
        feature1: 'De lunes a viernes',
        feature2: 'De 10:00 a 18:00',
        feature3: 'Técnicos certificados',
        feature4: 'Seguimiento personalizado'
      },
      identityProtection: {
        title: 'Protección de Identidad',
        description: 'Supervise y proteja su identidad digital contra el robo de datos, las filtraciones de información personal y los intentos de fraude en línea.',
        feature1: 'Vigilancia de la Dark Web',
        feature2: 'Alertas en tiempo real',
        feature3: 'Protección de datos personales',
        feature4: 'Asistencia en caso de robo de identidad'
      },
      family: {
        title: 'Manténgase conectado con sus seres queridos',
        description: 'Cree álbumes de fotos compartidos con su familia, sincronice automáticamente sus recuerdos desde su móvil y compártalos de forma segura. Una interfaz sencilla que incluso sus abuelos podrán utilizar fácilmente.'
      }
    },
    features: {
      title: '¿Por qué elegir MaSécurité?',
      subtitle: 'La excelencia al servicio de su serenidad digital',
      security: {
        title: 'Seguridad máxima',
        description: 'Sus datos están protegidos mediante las tecnologías de cifrado más avanzadas'
      },
      support: {
        title: 'Asistencia reactiva',
        description: 'Un equipo de expertos disponible 24/7 para atender sus necesidades'
      },
      simplicity: {
        title: 'Sencillez de uso',
        description: 'Interfaz intuitiva accesible incluso para usuarios principiantes'
      },
      performance: {
        title: 'Rendimiento óptimo',
        description: 'Infraestructura Cloud de alto rendimiento para una experiencia fluida'
      },
      cards: {
        completeProtection: {
          title: 'Protección Completa',
          description: 'MaSecule ayuda a luchar contra los ataques diarios con protección de usuarios, red y equipos.'
        },
        preventiveMaintenance: {
          title: 'Mantenimiento Preventivo',
          description: 'MaSecumantiene la salud de sus sistemas informáticos previniendo cualquier mal funcionamiento que pueda causarle problemas.'
        },
        performantConnections: {
          title: 'Conexiones de Alto Rendimiento',
          description: 'La garantía de conexiones fiables y de alto rendimiento para el intercambio y transferencia de sus datos con total seguridad.'
        },
        softwareApplications: {
          title: 'Software y Aplicaciones',
          description: 'MaSecule proporciona el software y las aplicaciones para una mejor gestión de su red y su actividad.'
        }
      }
    },
    pricing: {
      title: 'Nuestras Tarifas',
      subtitle: 'Elija la opción que más le convenga',
      choosePlan: 'Elegir esta oferta',
      choose: 'Elegir',
      perMonth: ' €/mes',
      taxExcluded: 'sin IVA',
      recommended: 'Recomendado',
      mostPopular: 'Más popular',
      bestPrice: 'Mejor precio',
      bestValue: 'Mejor relación calidad-precio',
      essential: 'Esencial',
      complete: 'Completa',
      features: 'Prestaciones',
      inAdvance: '',
      inAdvancePlus24Free: '+ 24 meses gratuitos',
      inAdvancePlus12Free: '+ 12 meses gratuitos',
      inAdvancePlus3Free: '+ 3 meses gratuitos',
      onlyAfterFreeVerification: 'Disponible únicamente tras una verificación gratuita',
      taxNotice: 'Todos los precios se indican sin IVA. IVA aplicable según su país de residencia.',
      durationHeader: 'Duración',
      bestMonthlyValue: 'MEJOR VALOR MENSUAL',
      from: 'desde',
      perMonthShort: '/mes',
      monthsShort: 'Meses',
      customerType: {
        individual: 'Particular',
        professional: 'Profesional'
      },
      durations: {
        '36months': '36 meses + 24 de regalo (5 años)',
        '24months': '24 meses + 12 de regalo (3 años)',
        '12months': '12 meses + 3 de regalo',
        '6months': '6 meses'
      },
      tableRows: {
        duration36: '36 meses (3 años)',
        duration24: '24 meses (2 años)',
        duration12: '12 meses (1 año)',
        duration6: '6 meses'
      },
      installation: {
        title: 'GASTOS DE INSTALACIÓN',
        description: 'Se aplican gastos de instalación no reembolsables al suscribirse a un plan. Cubren la activación del software, la optimización del sistema, el análisis técnico y la eliminación de software malicioso.',
        priceAmount: '99,00 €',
        note: '',
        paymentMethodsTitle: 'Métodos de pago aceptados'
      },
      offers: {
        s: {
          badge: 'Para empezar',
          name: 'Protección Esencial',
          storage: '10 GB de almacenamiento',
          features: [
            'Espacio Cloud 10 GB',
            'MaSecuSecurity Software',
            '3 horas de asistencia/mes',
            'Respuesta en 24 horas',
            'Actualizaciones anuales'
          ]
        },
        m: {
          badge: 'Para la familia',
          name: 'Protección Familiar',
          storage: '30 GB de almacenamiento',
          features: [
            'Todo lo de Protección Esencial',
            'Espacio Cloud 30 GB',
            '5 horas de asistencia/mes',
            'Seguimiento personalizado',
            'Limpieza incluida'
          ]
        },
        l: {
          badge: 'Protección máxima',
          name: 'Protección Completa',
          storage: '120 GB de almacenamiento',
          features: [
            'Todo lo de Protección Familiar',
            'Espacio Cloud 120 GB',
            'Asistencia ilimitada',
            'Respuestas ilimitadas',
            'Asistencia prioritaria'
          ]
        }
      },
      addons: {
        title: 'Módulos Complementarios',
        subtitle: 'Personalice su experiencia con nuestras opciones adicionales',
        devices: 'dispositivos',
        identity: {
          title: 'Protección de Identidad',
          description: 'Supervise su información personal y proteja su identidad online contra el robo y el fraude'
        },
        scam: {
          title: 'Protección Antifraude',
          description: 'Detecte y bloquee intentos de phishing, correos electrónicos fraudulentos y sitios web maliciosos'
        },
        vpn: {
          title: 'VPN Segura',
          description: 'Navegue de forma anónima y acceda de forma segura a su contenido favorito desde cualquier lugar del mundo'
        }
      },
      featureTable: [
        { name: 'Horario de atención', description: 'Horarios de disponibilidad de la asistencia técnica', values: ['10:00 — 18:00\nLun - Vie', '08:00 — 21:00\nLun - Vie', '08:00 — 21:00\n365 días'] },
        { name: 'Ayuda y asistencia de profesionales certificados', description: 'Le ayudamos a resolver los problemas de su ordenador', values: ['3 horas\nal mes', '5 horas\nal mes', 'Ilimitado'] },
        { name: 'Tiempo de respuesta', description: 'Nuestra respuesta a sus problemas informáticos', values: ['En 24 horas', 'Máximo\n3 horas', 'Inmediato'] },
        { name: 'Espacio Cloud Seguro', description: 'Almacenamiento cloud cifrado para sus archivos', values: ['10 GB', '30 GB', '120 GB'] },
        { name: 'MaSecuSecurity Software', description: 'Protección antivirus y antimalware avanzada', values: ['✓', '✓', '✓'] },
        { name: 'MaSecuSafeBrowse', description: 'Protege su navegación y bloquea anuncios', values: ['✓', '✓', '✓'] },
        { name: 'Limpieza', bullets: ['+15 GB recuperados en promedio', 'Trackers y espías eliminados', 'Navegador hasta 3x más rápido', 'Datos personales protegidos'], values: ['✓', '✓', '✓'] },
        { name: 'Optimización', bullets: ['Inicio en menos de 30 seg', '100% de tu RAM disponible', 'Adiós a los bloqueos', 'Rendimiento del primer día'], values: ['✓', '✓', '✓'] },
        { name: 'Suscripción transferible', description: 'Transfiera su suscripción a otro ordenador', values: ['—', '✓', '✓'] },
        { name: 'Mantenimiento periódico', description: 'Mantenimiento proactivo para su dispositivo', values: ['Anuales', 'Bimestrales', 'Trimestrales'] },
        { name: 'Seguimiento personalizado', description: 'Un asesor dedicado a su cuenta', values: ['—', '✓', '✓'] },
        { name: 'Asistencia prioritaria', description: 'Sus solicitudes procesadas con prioridad', values: ['—', '—', '✓'] }
      ]
    },
    standaloneProducts: {
      badge: 'Soluciones Independientes',
      title: 'Servicios Autónomos',
      subtitle: 'Contrate sin suscripción principal - perfecto para necesidades específicas',
      aiAssistant: {
        name: 'MaSecuAI Assistant',
        description: 'Asistente IA alimentado por OpenAI para ayuda instantánea 24/7 en todas sus necesidades informáticas.',
        price: '19,99 €',
        period: '/mes',
        features: [
          'Tecnología OpenAI',
          'Asistencia 24/7',
          'Respuestas instantáneas',
          'Multiidioma',
          'Consejos personalizados'
        ],
        button: 'Más información'
      },
      mobileSecurity: {
        name: 'MaSecuMobile Security',
        description: 'Protección Bitdefender Total Security para sus móviles y tabletas Android.',
        price: '9,99 €',
        period: '/dispositivo',
        features: [
          'Escáner automático de malware',
          'Protección web',
          'Alerta de fraude por SMS',
          'VPN y antirrobo',
          'Bloqueo de llamadas spam'
        ],
        button: 'Más información'
      }
    },
    addons: {
      badge: 'Opciones Premium',
      title: 'Potencie su protección',
      subtitle: 'Añada prestaciones premium a su suscripción existente.',
      requirement: 'Requiere una suscripción activa (Protección Esencial, Familiar o Completa)',
      vpnPro: {
        name: 'MaSecuVPN Pro',
        price: '9,99 €',
        period: '/mes',
        features: [
          'Más de 50 servidores en 30 países',
          'Ancho de banda ilimitado',
          'Cifrado AES-256',
          'Kill Switch automático',
          'Sin registros conservados'
        ],
        button: 'Más información'
      },
      adblock: {
        name: 'MaSecuAdBlock Plus',
        price: '9,99 €',
        period: '/mes',
        features: [
          'Bloqueo de anuncios y ventanas emergentes',
          'Antirastreadores avanzado',
          'Protección de la privacidad',
          'Listas blancas personalizadas',
          'Navegación un 40% más rápida'
        ],
        button: 'Más información'
      },
      systemCleaner: {
        name: 'MaSecuSystem Cleaner',
        description: 'Optimice el rendimiento de su ordenador. Elimine archivos innecesarios y acelere su sistema.',
        price: '9,99 €',
        period: '/mes',
        features: [
          'Limpieza de archivos temporales',
          'Optimización del registro',
          'Gestor de inicio',
          'Desfragmentación SSD/HDD',
          'Limpieza automática programada'
        ],
        button: 'Más información'
      },
      totalCare: {
        name: 'MaSecuTotal Care',
        badge: 'AHORRE UN 17%',
        description: 'El paquete completo: VPN + AdBlock + Cleaner reunidos. La protección definitiva para su vida digital.',
        price: '24,99 €',
        period: '/mes',
        oldPrice: 'en lugar de 29,97 €',
        includes: [
          'VPN Pro',
          'AdBlock Plus',
          'System Cleaner'
        ],
        button: 'Más información'
      }
    },
    vpnProduct: {
      hero: {
        title: 'MaSecuVPN Pro',
        subtitle: 'Navegue con total privacidad con nuestra VPN ultrarrápida. Proteja sus datos en redes Wi-Fi públicas.',
        ctaPrimary: 'Empezar ahora - 9,99 €/mes',
        ctaSecondary: 'Más información'
      },
      ipSection: {
        title: 'Su Ubicación Actual',
        subtitle: 'Esto es lo que los sitios web pueden ver sobre usted en este momento'
      },
      featuresSection: {
        title: '¿Por Qué Elegir MaSecuVPN Pro?',
        subtitle: 'La protección más completa para su privacidad en línea',
        features: [
          { title: 'Cifrado militar', description: 'Protección AES-256 bits para asegurar todos sus datos' },
          { title: '50+ servidores mundiales', description: 'Acceda a contenido desde 30 países diferentes' },
          { title: 'Velocidad ultrarrápida', description: 'Streaming y navegación sin ralentización' },
          { title: 'Política sin registros', description: 'No conservamos ningún rastro de su actividad' },
          { title: 'Kill Switch automático', description: 'Protección continua incluso si se desconecta' },
          { title: 'Multiplataforma', description: 'Compatible con Windows, Mac, iOS, Android, Linux' }
        ]
      },
      serversSection: {
        title: 'Servidores en Todo el Mundo',
        subtitle: 'Conéctese a más de 50 servidores en 30 países',
        countries: [
          '🇫🇷 Francia', '🇩🇪 Alemania', '🇬🇧 Reino Unido', '🇺🇸 Estados Unidos',
          '🇨🇦 Canadá', '🇯🇵 Japón', '🇦🇺 Australia', '🇧🇷 Brasil',
          '🇪🇸 España', '🇮🇹 Italia', '🇳🇱 Países Bajos', '🇨🇭 Suiza',
          '🇸🇪 Suecia', '🇳🇴 Noruega', '🇩🇰 Dinamarca', '🇫🇮 Finlandia',
          '🇵🇱 Polonia', '🇦🇹 Austria', '🇧🇪 Bélgica', '🇮🇪 Irlanda',
          '🇵🇹 Portugal', '🇬🇷 Grecia', '🇨🇿 República Checa', '🇭🇺 Hungría',
          '🇷🇴 Rumanía', '🇧🇬 Bulgaria', '🇸🇬 Singapur', '🇭🇰 Hong Kong',
          '🇮🇳 India', '🇰🇷 Corea del Sur', '🇲🇽 México', '🇦🇷 Argentina'
        ]
      },
      comparisonSection: {
        title: 'Sin VPN vs Con MaSecuVPN Pro',
        without: {
          title: 'Sin VPN',
          items: [
            'IP visible para todos los sitios',
            'Ubicación expuesta',
            'ISP puede ver su actividad',
            'Datos vulnerables en Wi-Fi público',
            'Contenido geo-restringido inaccesible'
          ]
        },
        with: {
          title: 'Con MaSecuVPN Pro',
          items: [
            'IP enmascarada y anónima',
            'Ubicación oculta',
            'Navegación totalmente privada',
            'Protección en todas las redes',
            'Acceso mundial sin restricciones'
          ]
        }
      },
      pricingSection: {
        title: 'Elija Su Plan',
        individual: 'Individual',
        helpText: '💬 ¿Necesita ayuda para elegir? Nuestros expertos están aquí para guiarlo.',
        ctaButton: 'Hablar con un experto'
      },
      faqSection: {
        title: 'Preguntas Frecuentes',
        faqs: [
          {
            q: '¿Puedo usar la VPN en varios dispositivos?',
            a: '¡Sí! MaSecuVPN Pro funciona en Windows, Mac, iOS, Android y Linux. Puede proteger hasta 5 dispositivos simultáneamente con una sola suscripción.'
          },
          {
            q: '¿La VPN ralentiza mi conexión a Internet?',
            a: 'No. Nuestra infraestructura de servidores de alto rendimiento garantiza velocidades óptimas. La mayoría de los usuarios no notan ninguna diferencia significativa.'
          },
          {
            q: '¿Conservan registros de mi actividad?',
            a: 'Absolutamente no. Aplicamos una política estricta sin registros. No conservamos ningún rastro de sus actividades en línea o conexiones.'
          },
          {
            q: '¿Puedo acceder a contenido geo-restringido?',
            a: 'Sí. Con nuestros servidores en 30 países, puede acceder a contenido disponible solo en ciertas regiones.'
          }
        ]
      },
      ctaSection: {
        title: '¿Listo Para Proteger Su Privacidad?',
        subtitle: 'Únase a miles de usuarios que confían en MaSecuVPN Pro',
        button: 'Comenzar ahora'
      }
    },
    pricingCard: {
      popular: 'Más Popular',
      priceLabel: 'Sin IVA',
      monthlyPrice: 'Precio Mensual',
      perMonth: 'Sin IVA/mes',
      ctaButton: 'Elegir esta oferta'
    },
    ipDetector: {
      loading: 'Detección en progreso...',
      error: {
        title: 'Su conexión está expuesta',
        message: 'No se puede detectar su ubicación, pero sin VPN, su conexión sigue siendo vulnerable.'
      },
      main: {
        title: '¡Su conexión está expuesta!',
        subtitle: 'Sus datos son visibles para su ISP y los sitios web'
      },
      labels: {
        ipAddress: 'Dirección IP Pública',
        ipHelper: 'Visible para todos los sitios web',
        location: 'Ubicación Detectada',
        isp: 'Proveedor de Servicios de Internet (ISP)',
        notAvailable: 'No disponible'
      },
      warning: {
        title: 'Sin protección VPN:',
        items: [
          'Su ISP puede ver todos sus sitios visitados',
          'Su ubicación se revela con cada conexión',
          'Sus datos pueden ser interceptados en redes públicas',
          'Los sitios web rastrean su actividad en línea'
        ]
      }
    },
    adBlockProduct: {
      hero: {
        title: 'MaSecuAdBlock Plus',
        subtitle: 'Elimine todos los anuncios intrusivos y acelere su navegación hasta un 40% más.',
        ctaPrimary: 'Empezar ahora - 9,99 €/mes',
        ctaSecondary: 'Ver prestaciones'
      },
      liveStats: {
        title: 'Protección en Tiempo Real',
        subtitle: 'Simulador: Lo que MaSecuAdBlock Plus bloquea cada día',
        adsBlocked: 'Anuncios Bloqueados',
        trackersStopped: 'Rastreadores Detenidos',
        timeSaved: 'Tiempo Ahorrado',
        adsHelper: 'Hoy para este usuario promedio',
        trackersHelper: 'Previene el seguimiento de su actividad',
        timeHelper: 'Carga de páginas más rápida',
        warningTitle: 'Sin AdBlock, usted sufre:',
        warningItems: [
          'Miles de anuncios intrusivos cada día',
          'Rastreadores que recopilan sus datos de navegación',
          'Páginas que tardan hasta un 40% más en cargar',
          'Riesgos aumentados de malware a través de anuncios maliciosos'
        ]
      },
      features: {
        title: 'Navegación Más Rápida y Segura',
        subtitle: 'Protección completa contra anuncios y rastreadores',
        list: [
          {
            title: 'Bloqueo Inteligente',
            description: 'Elimina automáticamente anuncios intrusivos y ventanas emergentes'
          },
          {
            title: '40% Más Rápido',
            description: 'Las páginas se cargan instantáneamente sin anuncios pesados'
          },
          {
            title: 'Anti-rastreo',
            description: 'Impide que los rastreadores sigan su navegación'
          },
          {
            title: 'Protección Malware',
            description: 'Bloquea sitios maliciosos y scripts peligrosos'
          },
          {
            title: 'Privacidad Reforzada',
            description: 'Impide la recopilación de sus datos personales'
          },
          {
            title: 'Listas Personalizadas',
            description: 'Cree sus propias reglas de filtrado avanzadas'
          }
        ]
      },
      comparison: {
        title: 'El Impacto de AdBlock Plus',
        subtitle: 'Descubra la diferencia inmediata',
        without: {
          title: 'Sin AdBlock',
          loadTime: 'Tiempo de Carga',
          dataDownloaded: 'Datos Descargados',
          trackersActive: 'Rastreadores Activos',
          issues: [
            'Ventanas emergentes intrusivas',
            'Banners publicitarios',
            'Videos con reproducción automática',
            'Seguimiento publicitario'
          ]
        },
        with: {
          title: 'Con MaSecuAdBlock Plus',
          benefits: [
            'Navegación fluida',
            'Solo contenido relevante',
            'Experiencia sin interrupciones',
            'Privacidad protegida'
          ]
        }
      },
      pricing: {
        title: 'Navegue sin interrupciones',
        subtitle: 'Bloquee anuncios y proteja su privacidad',
        specialOffer: '🎉 Oferta especial: mes adicional en todos los planes',
        planTitle: 'MaSecuAdBlock Plus',
        price: '9,99 €',
        perMonth: '/mes',
        requirement: 'Requiere una suscripción activa de MaSécurité',
        featuresTitle: 'Prestaciones incluidas:',
        featuresList: [
          'Bloqueo de todos los anuncios (banners, vídeos, ventanas emergentes)',
          'Protección antirastreo avanzada',
          'Navegación hasta un 40% más rápida',
          'Bloqueo automático de malware publicitario',
          'Listas de filtrado personalizadas',
          'Estadísticas detalladas en tiempo real',
          'Compatible con todos los navegadores (Chrome, Firefox, Edge, Safari)',
          'Ahorro de ancho de banda hasta del 50%',
          'Protección contra phishing',
          'Actualizaciones automáticas de filtros',
          'Asistencia técnica prioritaria 24/7'
        ],
        ctaButton: 'Contratar AdBlock Plus',
        trial: 'Prueba gratuita de 30 días - Sin compromiso',
        helpText: '💬 ¿Preguntas sobre nuestros planes AdBlock? Contacte con nuestros expertos.',
        expertButton: 'Hablar con un experto'
      },
      finalCta: {
        title: 'Disfrute de una Navegación Limpia',
        subtitle: 'Más de 2 millones de anuncios bloqueados cada día',
        button: 'Comenzar Gratis'
      }
    },
    systemCleanerProduct: {
      hero: {
        title: 'MaSecuSystem Cleaner',
        subtitle: 'Devuelva la vida a su ordenador. Elimine archivos innecesarios y acelere su sistema al instante.',
        ctaPrimary: 'Empezar ahora - 9,99 €/mes',
        ctaSecondary: 'Analizar mi sistema'
      },
      scan: {
        scanning: {
          title: 'Análisis en progreso...',
          subtitle: 'Detección de problemas de rendimiento',
          analyzing: 'Analizando su sistema...',
          wait: 'Esto puede tardar unos momentos'
        },
        results: {
          title: 'Resultados del Análisis',
          subtitle: 'Esto es lo que ralentiza su PC',
          tempFiles: 'Archivos Temporales',
          tempFilesDesc: 'Archivos temporales que ocupan espacio en disco innecesariamente',
          registryIssues: 'Problemas de Registro',
          registryIssuesDesc: 'Entradas inválidas que ralentizan su sistema',
          diskSpace: 'Espacio Recuperable',
          diskSpaceDesc: 'Espacio en disco que se puede liberar inmediatamente',
          startupItems: 'Programas de Inicio',
          startupItemsDesc: 'Aplicaciones que ralentizan el inicio de su PC',
          solution: '¡MaSecuSystem Cleaner puede resolver todos estos problemas!',
          solutionDesc: 'Limpie, optimice y acelere su PC con un solo clic. Recupere hasta {space} GB de espacio y mejore el rendimiento hasta un 40%.'
        }
      },
      features: {
        title: 'Funcionalidades Completas',
        subtitle: 'Todo lo que necesita para una PC rápida y eficiente',
        list: [
          {
            title: 'Limpieza Inteligente',
            description: 'Eliminación segura de archivos temporales e innecesarios'
          },
          {
            title: 'Optimización de Registro',
            description: 'Corrección de errores y fragmentación del registro de Windows'
          },
          {
            title: 'Gestor de Inicio',
            description: 'Controle los programas que ralentizan su PC al iniciar'
          },
          {
            title: 'Desfragmentación',
            description: 'Optimización SSD/HDD para rendimiento máximo'
          },
          {
            title: 'Limpieza Automática',
            description: 'Programación inteligente para una PC siempre optimizada'
          },
          {
            title: 'Limpieza Segura',
            description: 'Protección de archivos del sistema importantes'
          }
        ]
      },
      comparison: {
        title: 'Resultados Antes / Después',
        subtitle: 'El impacto inmediato de System Cleaner',
        bootTime: 'Tiempo de Arranque',
        diskSpace: 'Espacio en Disco Libre',
        performance: 'Rendimiento General',
        before: 'Antes',
        after: 'Después'
      },
      pricing: {
        title: 'Optimice su ordenador ahora',
        subtitle: 'Planes flexibles para todas sus necesidades',
        specialOffer: '⚡ Obtenga hasta 3 meses gratuitos con compromiso a largo plazo',
        planTitle: 'MaSecuSystem Cleaner',
        price: '9,99 €',
        perMonth: '/mes',
        requirement: 'Requiere una suscripción activa de MaSécurité',
        featuresTitle: 'Prestaciones incluidas:',
        featuresList: [
          'Limpieza automática programada',
          'Optimización del registro de Windows',
          'Gestor de inicio inteligente',
          'Desfragmentación SSD/HDD optimizada',
          'Recuperación de espacio en disco',
          'Eliminación de archivos temporales',
          'Estadísticas de rendimiento detalladas',
          'Supervisión en tiempo real',
          'Protección contra malware',
          'Actualizaciones automáticas',
          'Asistencia técnica prioritaria 24/7'
        ],
        ctaButton: 'Contratar System Cleaner',
        trial: 'Prueba gratuita de 30 días - Garantía de devolución del dinero',
        helpText: '💬 ¿Necesita consejos para optimizar su ordenador? Contáctenos.',
        expertButton: 'Hablar con un experto'
      },
      finalCta: {
        title: 'Devuelva la Vida a su PC',
        subtitle: 'Rendimiento óptimo en minutos',
        button: 'Comenzar Optimización'
      }
    },
    totalCareProduct: {
      hero: {
        badge: 'AHORRE UN 17% - OFERTA ESPECIAL',
        title: 'MaSecuTotal Care',
        subtitle: 'La protección definitiva todo en uno',
        description: 'VPN Pro + AdBlock Plus + System Cleaner reunidos en un solo paquete',
        priceCompare: {
          separate: 'Precio por separado',
          separatePrice: '29,97 €/mes',
          pack: 'Pack Total Care',
          packPrice: '24,99 €',
          perMonth: '/mes'
        },
        ctaPrimary: 'Aprovechar la oferta - 24,99 €/mes',
        ctaSecondary: 'Ver comparativa'
      },
      includedProducts: {
        title: '3 productos premium en 1',
        subtitle: 'Todas las herramientas que necesita para una protección completa',
        vpn: {
          name: 'MaSecuVPN Pro',
          features: [
            '50+ servidores en 30 países',
            'Cifrado AES-256',
            'Política sin registros',
            'Kill Switch automático'
          ]
        },
        adblock: {
          name: 'MaSecuAdBlock Plus',
          features: [
            'Bloqueo de anuncios y ventanas emergentes',
            'Anti-rastreo avanzado',
            'Navegación 40% más rápida',
            'Protección contra malware'
          ]
        },
        cleaner: {
          name: 'MaSecuSystem Cleaner',
          features: [
            'Limpieza automática',
            'Optimización de registro',
            'Desfragmentación SSD/HDD',
            'Gestor de inicio'
          ]
        },
        individualValue: 'Valor individual',
        individualPrice: '9,99 €',
        savings: {
          title: 'AHORRO TOTAL:',
          calculation: '3 productos × 9,99 € = ',
          originalPrice: '29,97 €/mes',
          payOnly: 'Pague sólo 24,99 €/mes',
          monthlySaving: '¡Son 4,98 € de ahorro cada mes!'
        }
      },
      allFeatures: {
        title: 'Funcionalidades Completas',
        subtitle: 'Todo lo que necesita para una protección total',
        list: [
          'Protección VPN completa en 50+ servidores',
          'Bloqueo de todos los anuncios',
          'Navegación ultra-rápida (+40%)',
          'Limpieza y optimización del sistema',
          'Protección anti-rastreo',
          'Cifrado militar AES-256',
          'Política estricta sin registros',
          'Recuperación de espacio en disco',
          'Kill Switch automático',
          'Desfragmentación inteligente',
          'Gestor de inicio',
          'Protección contra malware',
          'Soporte multi-dispositivo',
          'Actualizaciones automáticas',
          'Soporte al cliente prioritario 24/7',
          'Garantía de devolución de dinero'
        ]
      },
      comparison: {
        title: '¿Por qué elegir el pack Total Care?',
        tableHeaders: {
          feature: 'Funcionalidad',
          separate: 'Productos separados',
          totalCare: 'Total Care'
        },
        rows: {
          monthlyPrice: 'Precio mensual',
          vpnPremium: 'VPN Premium',
          adBlocking: 'Bloqueo de anuncios',
          systemCleaning: 'Limpieza del sistema',
          prioritySupport: 'Soporte prioritario',
          monthlySavings: 'Ahorro mensual',
          yearlySavings: 'Ahorro anual'
        }
      },
      pricing: {
        title: 'Pack Total Care - Todo incluido',
        subtitle: 'VPN Pro + AdBlock Plus + System Cleaner en un solo paquete',
        specialOffer: '🔥 Ahorre hasta un 40% con el pack completo',
        badge: 'MEJOR RELACIÓN CALIDAD-PRECIO',
        planTitle: 'MaSecuTotal Care',
        planSubtitle: 'El pack completo para una protección total',
        price: '24,99 €',
        perMonth: '/mes',
        requirement: 'Requiere una suscripción activa de MaSécurité',
        featuresTitle: 'Incluido en el pack:',
        featuresList: [
          '🛡️ VPN Pro - Protección completa con más de 50 servidores',
          '🚫 AdBlock Plus - Navegación un 40% más rápida',
          '🧹 System Cleaner - Optimización automática',
          'Cifrado militar AES-256',
          'Conexiones simultáneas ilimitadas',
          'Compatibilidad completa multidispositivo',
          'Protección avanzada DDoS',
          'Streaming 4K/8K optimizado',
          'Limpieza automática diaria',
          'Bloqueo del 99% de los anuncios',
          'Gestor de cuenta dedicado',
          'Asistencia prioritaria 24/7'
        ],
        ctaButton: 'Contratar Total Care',
        trial: 'Garantía de devolución del dinero de 30 días',
        included: {
          title: 'Lo que incluye Total Care:',
          vpnValue: 'Valor: 37,47 €/mes',
          adblockValue: 'Valor: 19,99 €/mes',
          cleanerValue: 'Valor: 24,99 €/mes',
          totalValue: 'Valor total:',
          totalPrice: '82,45 €/mes',
          packagePrice: 'Precio Total Care: desde 69,42 €/mes',
          savings: '¡Ahorre 13,03 € al mes!'
        },
        helpText: '💬 ¿Preguntas sobre el pack Total Care? Nuestros expertos están disponibles.',
        expertButton: 'Hablar con un experto'
      },
      finalCta: {
        title: 'Protección definitiva a un precio inmejorable',
        subtitle: 'Únase a miles de usuarios que han elegido Total Care',
        button: 'Suscribirse al pack Total Care',
        footer: 'Ahorre 59,76 € al año · Asistencia prioritaria incluida'
      }
    },
    aiAssistantProduct: {
      hero: {
        title: 'MaSecuAI Assistant',
        subtitle: 'Su asistente personal alimentado por una inteligencia artificial específica para todas sus necesidades informáticas',
        badges: {
          powered: 'IA Avanzada',
          instant: 'Soporte 24h/24 y 7j/7',
          available: 'Disponible 24h/24'
        }
      },
      features: {
        list: [
          {
            title: 'Asistente IA Inteligente',
            description: 'Para respuestas precisas y contextuales'
          },
          {
            title: 'Soporte 24h/24 y 7j/7',
            description: 'Obtenga ayuda instantáneamente, día y noche'
          },
          {
            title: 'Respuestas Instantáneas',
            description: 'Soluciones rápidas a todos sus problemas técnicos'
          },
          {
            title: 'Seguro y Privado',
            description: 'Sus conversaciones permanecen confidenciales'
          },
          {
            title: 'Multilingüe',
            description: 'Francés, inglés, español y más'
          }
        ]
      },
      useCases: {
        title: 'Cómo MaSecuAI Assistant Puede Ayudarle',
        list: [
          'Ayuda para configurar sus dispositivos',
          'Resolución de problemas técnicos',
          'Consejos de seguridad personalizados',
          'Orientación para el uso de software',
          'Optimización del rendimiento del sistema',
          'Asistencia para copia de seguridad de datos',
          'Ayuda para protección contra malware',
          'Consejos sobre mejores prácticas'
        ]
      },
      pricing: {
        title: 'Elija su plan',
        individual: 'Particular',
        name: 'MaSecuAI Assistant',
        price: '19,99',
        period: '/mes',
        description: 'Asistente IA personal para todas sus necesidades informáticas',
        features: [
          'Asistencia con inteligencia artificial',
          'Disponible 24h/24 y 7j/7',
          'Respuestas instantáneas',
          'Asistencia multiidioma',
          'Historial de conversaciones',
          'Consejos personalizados',
          'Guías paso a paso',
          'Actualizaciones continuas'
        ],
        ctaText: 'Elegir esta oferta'
      },
      finalCta: {
        title: '¿Listo para Beneficiarse de la Inteligencia Artificial?',
        subtitle: 'Únase a los usuarios que simplifican su vida digital con MaSecuAI Assistant',
        button: 'Comenzar Ahora'
      }
    },
    cta: {
      title: '¿Listo para asegurar su informática?',
      subtitle: 'Únase a miles de usuarios satisfechos',
      button: 'Comenzar ahora'
    },
    trustSeals: {
      title: 'Su seguridad, nuestra prioridad',
      subtitle: 'Respetamos los más altos estándares de seguridad y cumplimiento',
      sslSecure: 'SSL Seguro',
      sslDesc: 'Cifrado 256-bit',
      rgpd: 'RGPD',
      rgpdDesc: 'Conforme UE',
      iso27001: 'ISO 27001',
      iso27001Desc: 'Certificado de Seguridad',
      soc2: 'SOC 2 Tipo II',
      soc2Desc: 'Auditado y Verificado',
      pciDss: 'PCI DSS',
      pciDssDesc: 'Pagos Seguros',
      protection247: 'Protección 24/7',
      protection247Desc: 'Soporte Mundial',
      guaranteeTitle: 'Garantía de seguridad al 100%',
      guaranteeDesc: 'Sus datos están protegidos por las tecnologías de cifrado más avanzadas',
      protectionActive: 'Protección Activa',
      certificationText: 'MaSécurité está certificado y auditado regularmente para garantizar los más altos estándares de seguridad.',
      privacyText: 'Sus datos personales se procesan de acuerdo con el RGPD y nunca se comparten con terceros.'
    },
    footer: {
      description: 'Soluciones en la nube seguras para particulares y profesionales',
      services: 'Servicios',
      cloudServer: 'Servidor en la Nube',
      securitySuite: 'Suite de Seguridad',
      support: 'Asistencia',
      identityProtection: 'Protección de Identidad Digital',
      information: 'Información',
      about: 'Acerca de',
      pricing: 'Precios',
      faq: 'Preguntas Frecuentes',
      contact: 'Contacto',
      legal: 'Legal',
      legalNotice: 'Aviso legal',
      privacyPolicy: 'Política de privacidad',
      terms: 'Condiciones generales',
      cookiePolicy: 'Política de cookies',
      refundPolicy: 'Política de reembolso',
      rights: 'Todos los derechos reservados.',
      support247: 'Asistencia 24/7'
    },
    testimonials: {
      badge: 'Testimonios de Clientes',
      title: 'Lo Que Dicen Nuestros Clientes',
      subtitle: 'Más de 10,000 usuarios confían en nosotros para proteger su vida digital',
      averageRating: 'Calificación promedio',
      happyCustomers: 'Clientes satisfechos',
      verified: 'Verificado',
      noTestimonials: 'No hay testimonios disponibles en este momento.',
      joinButton: 'Únase a Nuestros Clientes Satisfechos'
    },
    faq: {
      title: 'Preguntas Frecuentes',
      helpText: '¿Necesita ayuda? Contáctenos al 900 423 288',
      questions: [
        { question: "¿Cómo accedo a mi espacio Cloud?", answer: "Una vez activada su suscripción, recibirá sus credenciales de acceso por correo electrónico. Podrá acceder a su espacio Cloud desde cualquier navegador web o mediante nuestra aplicación dedicada." },
        { question: "¿Mis datos están realmente seguros?", answer: "Absolutamente. Utilizamos un sistema de cifrado de extremo a extremo de nivel bancario. Sus datos se almacenan en servidores seguros con copias de seguridad automáticas diarias." },
        { question: "¿Puedo transferir mi suscripción a otra computadora?", answer: "Sí, todas nuestras ofertas incluyen la posibilidad de transferir su suscripción a otro dispositivo de forma rápida y sencilla, sin costes adicionales." },
        { question: "¿Cómo funciona la asistencia técnica?", answer: "Nuestro equipo de técnicos certificados está disponible de lunes a viernes de 10:00 a 18:00. Puede contactarnos por teléfono para asistencia inmediata o programar una intervención en el sitio si es necesario." },
        { question: "¿Qué sucede al final de mi suscripción?", answer: "Será notificado antes de que expire su suscripción. Podrá renovar su oferta o descargar todos sus datos. Nunca eliminamos sus datos sin previo aviso." },
        { question: "¿Los meses de regalo son realmente gratuitos?", answer: "¡Sí! Los meses de bonificación se agregan gratuitamente a su suscripción. Por ejemplo, con la oferta de 24 meses + 12 meses de regalo, obtiene 36 meses de servicio por el precio de 24." }
      ]
    },
    products: {
      common: { individual: 'Particular', ctaText: 'Elegir esta oferta', startNow: 'Empezar Ahora' },
      mobileSecurity: {
        title: 'MaSecuMobile Security',
        subtitle: 'Protección completa de Bitdefender para sus móviles y tabletas Android',
        badges: { powered: 'Tecnología Bitdefender', platform: 'Android y tabletas', price: '9,99 € por dispositivo' },
        features: [
          { title: 'Protección contra malware', description: 'Escanea automáticamente cada aplicación instalada' },
          { title: 'Protección web', description: 'Bloquea sitios maliciosos y de phishing en tiempo real' },
          { title: 'Alerta de fraude', description: 'Detecta enlaces sospechosos en SMS y mensajes' },
          { title: 'Bloqueo de aplicaciones', description: 'Proteja sus aplicaciones sensibles con PIN o huella dactilar' },
          { title: 'VPN integrada', description: '200 MB al día de tráfico cifrado incluido' },
          { title: 'Antirrobo', description: 'Localice, bloquee o borre a distancia' }
        ],
        completeTitle: 'Prestaciones completas',
        categories: [
          { name: 'Protección esencial', items: ['Escáner de malware automático y manual', 'Protección web en tiempo real', 'Alerta de fraude para SMS y mensajes', 'Detección de anomalías de aplicaciones', 'Protección WearON para smartwatch'] },
          { name: 'Privacidad', items: ['VPN con 200 MB al día incluidos', 'Bloqueo de aplicaciones por PIN o huella', 'Verificación Account Privacy', 'Bloqueo de llamadas spam y no deseadas', 'Cifrado de comunicaciones'] },
          { name: 'Antirrobo', items: ['Localización GPS remota', 'Bloqueo remoto', 'Borrado de datos remoto', 'Envío de mensaje al móvil', 'Foto del intruso tras 3 intentos'] }
        ],
        browsersTitle: 'Navegación protegida',
        browsersSubtitle: 'La protección web funciona con todos los navegadores Android populares:',
        pricingTitle: 'Tarifas sencillas',
        packageName: 'MaSecuMobile Security',
        price: '9,99',
        period: '/mes por dispositivo',
        description: 'Protección Bitdefender Total Security para móviles y tabletas',
        packageFeatures: ['Bitdefender Total Security', 'Escáner de malware completo', 'Protección web en tiempo real', 'Alerta de fraude por SMS', 'VPN 200 MB al día incluido', 'Bloqueo de aplicaciones', 'Antirrobo completo', 'Bloqueo de llamadas spam', 'Protección WearON para smartwatch', 'Verificación Account Privacy'],
        wearonTitle: 'Protección WearON Smartwatch',
        wearonDescription: 'Extienda la protección de Bitdefender a su smartwatch para mayor seguridad:',
        wearonFeatures: ['Active una alerta sonora desde su reloj para localizar su teléfono', 'Reciba una notificación si se aleja demasiado de su teléfono'],
        finalCtaTitle: 'Proteja Sus Dispositivos Móviles Ahora',
        finalCtaSubtitle: 'Únase a miles de usuarios que confían en Bitdefender para su seguridad móvil'
      }
    },
    about: {
      title: 'Acerca de Nosotros',
      subtitle: 'Un equipo atento a su servicio para proteger lo que realmente importa: su familia, sus recuerdos y su tranquilidad',
      stats: [
        { number: '150K+', label: 'Clientes Europeos' },
        { number: '24/7', label: 'Asistencia Humana' },
        { number: '98%', label: 'Clientes Satisfechos' },
        { number: '100%', label: 'Escuchándole' }
      ],
      story: {
        title: 'Nuestra Historia',
        subtitle: 'Una aventura humana al servicio de su serenidad digital',
        paragraph1: 'MaSécurité nació de una convicción simple: la tecnología debe estar al servicio de todos, sin importar la edad o los conocimientos técnicos. Somos una empresa europea especializada en ciberseguridad y soporte informático, particularmente atenta a las necesidades de las personas mayores en Francia y Bélgica.',
        paragraph2: 'Creemos que todos merecen disfrutar de la tecnología con tranquilidad para mantenerse en contacto con sus seres queridos, preservar sus recuerdos y gestionar sus asuntos personales con seguridad. Por eso hemos creado soluciones simples, acompañadas de soporte humano en francés disponible 24/7.',
        paragraph3: 'Nuestro equipo de técnicos certificados está capacitado para tomar el tiempo necesario con cada cliente. Explicamos cada paso con paciencia, nos adaptamos a su ritmo y nos aseguramos de que se sienta seguro con su ordenador, tableta o smartphone.',
        paragraph4: 'Con sede en Europa y centros de asistencia en Francia y Bélgica, estamos orgullosos de servir a más de 150,000 clientes europeos que confían en nosotros para proteger sus dispositivos y datos más preciados.'
      },
      valuesSection: {
        title: 'Nuestros Valores',
        subtitle: 'Los principios que guían cada una de nuestras acciones',
        items: [
          { title: 'Amabilidad y Escucha', description: 'Nos tomamos el tiempo de escuchar y comprender sus necesidades. Cada pregunta merece una respuesta clara y paciente.' },
          { title: 'Acompañamiento Personalizado', description: 'Nuestro equipo de habla francesa le acompaña en cada paso, con explicaciones sencillas adaptadas a su ritmo.' },
          { title: 'Simplicidad y Claridad', description: 'Sin jerga técnica complicada. Hacemos que la tecnología sea accesible y fácil de usar para todos.' },
          { title: 'Protección Confiable', description: 'Seguridad sólida y efectiva para proteger sus recuerdos, fotos familiares e información personal.' }
        ]
      },
      benefits: {
        title: 'Lo Que Nos Distingue',
        subtitle: 'Ventajas diseñadas para facilitarle la vida',
        items: [
          'Soporte telefónico en francés',
          'Técnicos pacientes y atentos',
          'Explicaciones claras y sencillas',
          'Disponible 24/7',
          'Protección de sus recuerdos familiares',
          'Respeto por su privacidad'
        ]
      },
      testimonialsSection: {
        title: 'Confían en Nosotros',
        subtitle: 'Los testimonios de nuestros clientes nos conmueven profundamente',
        items: [
          { name: 'Marie-Claire', age: '68 años', location: 'Bruselas', text: '¡Por fin un servicio que se toma el tiempo de explicar bien! El técnico fue muy paciente conmigo.' },
          { name: 'Jean-Pierre', age: '72 años', location: 'Lyon', text: 'Por fin puedo compartir mis fotos con mis nietos de forma segura. ¡Gracias por su ayuda!' },
          { name: 'Françoise', age: '65 años', location: 'Lieja', text: '¡Un equipo maravilloso que realmente entiende nuestras necesidades. Lo recomiendo encarecidamente!' }
        ]
      },
      cta: {
        title: '¿Listo para Proteger Su Vida Digital?',
        subtitle: 'Únase a miles de clientes europeos que disfrutan de la tecnología con tranquilidad gracias a MaSécurité',
        button: 'Contáctenos',
        description: 'Protegiendo a clientes europeos con cuidado y experiencia desde 2018.'
      },
      footerLinks: {
        about: 'Acerca de',
        legal: 'Legal',
        privacy: 'Política de Privacidad',
        terms: 'Términos de Servicio',
        mentions: 'Aviso Legal'
      }
    },
    contact: {
      title: 'Contacto',
      subtitle: 'Nuestro equipo está aquí para ayudarle. No dude en contactarnos.',
      form: {
        name: 'Nombre completo',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        subject: 'Asunto',
        message: 'Su mensaje',
        captcha: '¿Cuánto es',
        send: 'Enviar mensaje',
        sending: 'Enviando...',
        success: 'Mensaje enviado correctamente',
        error: 'Error al enviar el mensaje',
        captchaError: 'La respuesta al cálculo es incorrecta. Por favor, inténtelo de nuevo.',
        formIntro: 'Rellene el formulario a continuación y le responderemos lo antes posible',
        selectSubject: 'Seleccione un asunto',
        subjectOptions: {
          general: 'Consulta general',
          technical: 'Asistencia técnica',
          subscription: 'Consulta sobre suscripción',
          billing: 'Facturación',
          other: 'Otro'
        },
        securityCheck: 'Verificación de seguridad',
        messagePlaceholder: 'Describa su consulta en detalle...'
      },
      info: {
        phone: {
          title: 'Teléfono',
          value: '900 423 288',
          hours: 'Disponible 24/7'
        },
        email: {
          title: 'Correo electrónico',
          value: 'info@masecurite.be',
          responseTime: 'Respuesta en 24 horas'
        },
        address: {
          title: 'Dirección',
          value: 'Albuquerque, Nuevo México, EE. UU.',
          officeSubtitle: 'Oficina EE. UU.'
        }
      },
      features: {
        immediateSupport: {
          title: 'Asistencia Inmediata',
          description: 'Asistencia telefónica disponible 24/7'
        },
        quickResponse: {
          title: 'Respuesta Rápida',
          description: 'Respondemos a todos los correos en 24 horas'
        },
        caringTeam: {
          title: 'Equipo Atento',
          description: 'Técnicos atentos a su servicio'
        }
      }
    },
    quickScan: {
      initializing: 'Iniciando análisis...',
      scanning: 'Análisis en curso...',
      error: {
        title: 'Error de análisis',
        message: 'Se produjo un error durante el análisis. Por favor, actualice la página para volver a intentarlo.',
        refreshButton: 'Actualizar página'
      },
      stages: {
        initial: 'Iniciando análisis',
        filesystem: 'Analizando el sistema de archivos',
        network: 'Analizando la red',
        registry: 'Analizando el registro'
      },
      progress: {
        filesAnalyzed: 'archivos analizados',
        currentFile: 'Archivo actual:',
        filesPerSec: 'archivos/seg',
        timeRemaining: 'Tiempo restante'
      },
      systemInfo: {
        title: 'Información del sistema detectada',
        ipAddress: 'Dirección IP',
        location: 'Ubicación',
        provider: 'Proveedor',
        system: 'Sistema',
        browser: 'Navegador',
        processors: 'Procesadores',
        cores: 'núcleos'
      },
      terminal: {
        analyzingProcesses: 'Analizando procesos en ejecución...',
        scanning: 'Escaneando',
        safe: 'SEGURO',
        registryAnalysis: 'Análisis de registro',
        keys: 'claves',
        activeNetworkConnections: 'Conexiones de red activas',
        protocol: 'Protocolo',
        local: 'Local',
        remote: 'Remoto',
        state: 'Estado',
        process: 'Proceso',
        location: 'Ubicación',
        status: 'Estado'
      },
      results: {
        title: 'Resultados del análisis',
        risk: 'Riesgo',
        riskLevels: {
          critical: 'CRÍTICO',
          high: 'ALTO',
          medium: 'MODERADO',
          low: 'BAJO'
        },
        needsAttention: 'Su computadora requiere atención inmediata',
        systemAnalyzed: 'Sistema analizado',
        ipLocation: 'IP y ubicación',
        graphicsCard: 'Tarjeta gráfica',
        gpu: 'GPU',
        cookiesTrackers: 'Cookies y rastreadores',
        totalCookies: 'Total de cookies',
        trackingCookies: 'Cookies de seguimiento',
        detectTrackers: 'Rastreadores detectados',
        privacyRisk: 'Riesgo de privacidad',
        mediaDevices: 'Dispositivos multimedia',
        cameras: 'Cámaras',
        microphones: 'Micrófonos',
        speakers: 'Altavoces',
        batteryStatus: 'Estado de la batería',
        level: 'Nivel',
        status: 'Estado',
        charging: 'Cargando',
        onBattery: 'Con batería',
        health: 'Salud',
        healthStatuses: {
          excellent: 'Excelente',
          good: 'Buena',
          fair: 'Aceptable',
          poor: 'Baja',
          critical: 'Crítica'
        },
        webrtcLeak: 'Fuga WebRTC',
        leakStatus: 'Estado',
        leakDetected: 'Fuga detectada',
        noLeak: 'Sin fugas',
        publicIPs: 'IPs públicas expuestas',
        localIPs: 'IPs locales',
        realIpExposed: 'Su dirección IP real está expuesta a través de WebRTC',
        digitalFingerprint: 'Huella digital',
        uniqueness: 'Unicidad',
        users: 'usuarios',
        fingerprintHighlyUnique: 'Su huella digital es altamente única - es fácil rastrearlo',
        thirdPartyResources: 'Recursos de terceros',
        thirdPartyDomains: 'Dominios de terceros',
        trackers: 'Rastreadores',
        analytics: 'Analítica',
        ads: 'Anuncios',
        browserStorage: 'Almacenamiento del navegador',
        localStorage: 'LocalStorage',
        sessionStorage: 'SessionStorage',
        indexedDB: 'IndexedDB',
        bytes: 'octetos',
        entries: 'entradas',
        databases: 'bases de datos',
        networkPerformance: 'Rendimiento de red',
        dns: 'DNS',
        tls: 'TLS',
        ttfb: 'TTFB',
        exposedAPIs: 'APIs expuestas',
        totalExposed: 'Total expuestas',
        highRisk: 'Riesgo alto',
        geolocation: 'Geolocalización',
        cameraAndMicrophone: 'Cámara/Micrófono',
        bluetooth: 'Bluetooth',
        browserExtensions: 'Extensiones del navegador',
        totalDetected: 'Total detectadas',
        mediumRisk: 'Riesgo medio',
        connectionSecurity: 'Seguridad de conexión',
        protocol: 'Protocolo',
        port: 'Puerto',
        dnsLeak: 'Fuga DNS',
        dnsServers: 'Servidores DNS',
        noDnsLeakDetected: 'No se detectó ninguna fuga DNS',
        threatsDetected: 'Amenazas detectadas',
        privacyIssues: 'Problemas de privacidad',
        performanceIssues: 'Problemas de rendimiento',
        systemVulnerabilities: 'Vulnerabilidades del sistema',
        systemCompromised: '¡Atención! Su sistema está comprometido',
        systemCompromisedDesc: 'Hemos detectado varias amenazas activas que ponen en peligro sus datos personales y la seguridad de su sistema. Se recomienda una acción inmediata.',
        securityThreats: 'Amenazas de seguridad',
        threatsDetectedTitle: 'Amenazas detectadas',
        realTimeDetection: 'Detección en tiempo real',
        threats: 'Amenazas',
        criticalThreatsAction: 'amenaza(s) crítica(s) detectada(s) - Acción inmediata requerida',
        criticalCount: 'Críticas',
        highCount: 'Altas',
        mediumCount: 'Medias',
        lowCount: 'Bajas',
        mediaDevicePermissionWarning: 'Permisos de dispositivos multimedia no otorgados - detección limitada',
        personalizedRecommendation: 'Recomendación personalizada',
        protectionAdapted: 'Protección adaptada a sus necesidades',
        basedOnThreats: 'Basado en las amenazas detectadas, aquí está nuestra recomendación',
        offer: 'Oferta',
        storage: 'de almacenamiento',
        for5Years: 'por 5 años (36 meses + 24 de regalo)',
        benefits: {
          removeThreats: 'Eliminación de todas las amenazas',
          removeThreatsDesc: 'Eliminación completa de malware y virus detectados',
          privacyProtection: 'Protección de privacidad',
          privacyProtectionDesc: 'Bloqueo de rastreadores y protección de sus datos',
          performanceOptimization: 'Optimización del rendimiento',
          performanceOptimizationDesc: 'Limpieza y aceleración de su sistema',
          support247: 'Soporte técnico 24/7',
          support247Desc: 'Asistencia prioritaria por teléfono y en sitio'
        },
        protectNow: 'Proteger mi computadora ahora',
        limitedOffer: 'Oferta limitada - Actúe ahora para proteger sus datos',
        seeAllOffers: 'Ver todas las ofertas',
        inactionWarning: {
          title: 'Si no hace nada...',
          subtitle: 'Esto es lo que podría sucederle a su sistema',
          now: 'Ahora',
          oneHour: '1 hora',
          twentyFourHours: '24 horas',
          oneWeek: '1 semana',
          oneMonth: '1 mes',
          activeThreats: 'Amenazas activas en su PC',
          maliciousProcesses: '{count} procesos maliciosos en ejecución',
          passwordsCompromised: 'Contraseñas potencialmente comprometidas',
          keyloggerActive: 'Keylogger activo - Todas sus contraseñas en riesgo',
          personalDataStolen: 'Datos personales posiblemente robados',
          sensitiveFilesExposed: 'Documentos, fotos y archivos sensibles expuestos',
          ransomwareRisk: 'Riesgo elevado de ransomware',
          filesEncrypted: 'Todos sus archivos podrían ser cifrados por rescate',
          identityTheft: 'Identidad posiblemente usurpada',
          darkWebSale: 'Sus datos vendidos en la dark web - Posible fraude bancario',
          avoidCatastrophe: 'Evite este escenario catastrófico',
          completeProtection: 'Protección completa en menos de 30 minutos',
          protectNow: 'Proteger ahora'
        }
      }
    },
    breachChecker: {
      title: 'Verificador de Filtraciones',
      subtitle: 'Verifique si sus datos personales han sido comprometidos en una filtracion de datos',
      navTitle: 'Verificar mis datos',
      hero: {
        badge: 'Análisis en tiempo real',
        title: 'Verifique si sus datos han sido',
        titleHighlight: 'hackeados',
        subtitle: 'Nuestra tecnología analiza más de 15 mil millones de identificadores robados para verificar si su información está circulando en la Dark Web.'
      },
      badges: {
        confidential: '100% confidencial',
        instant: 'Resultados instantáneos'
      },
      tabs: {
        email: 'Correo',
        password: 'Contraseña',
        free: 'Gratis'
      },
      search: {
        emailTitle: 'Verifique si su correo ha sido hackeado',
        emailPlaceholder: 'Ingrese su correo electrónico',
        emailButton: 'Verificar mi correo',
        emailButton2: 'Verificar mi correo',
        passwordTitle: 'Verifique si su contraseña ha sido comprometida',
        passwordPlaceholder: 'Ingrese una contraseña para verificar',
        passwordButton: 'Verificar esta contraseña',
        searching: 'Buscando...'
      },
      privacy: {
        email: 'Su correo nunca se almacena ni se comparte',
        password: 'Su contraseña nunca se envía - utilizamos hash seguro'
      },
      emailChecker: {
        label: 'Su correo electronico',
        placeholder: 'ejemplo@email.com',
        button: 'Verificar mi correo',
        privacy: 'Su privacidad esta protegida. Utilizamos la API de Have I Been Pwned para verificar su direccion de forma segura. Su direccion nunca se almacena.',
        contactMessage: 'Para verificar su correo electronico, contactenos o llame al'
      },
      passwordChecker: {
        label: 'Su contrasena',
        placeholder: 'Ingrese su contrasena',
        button: 'Verificar mi contrasena',
        privacy: '100% anonimo. Su contrasena NUNCA se envia. Utilizamos un sistema de hash (SHA-1) que solo verifica los primeros 5 caracteres del hash, sin revelar jamas su contrasena.'
      },
      results: {
        breached: {
          title: 'Atencion! Sus datos han sido comprometidos',
          text: 'Su correo electronico fue encontrado en {count} filtraciones de datos. Su informacion personal es potencialmente accesible para los piratas informaticos.'
        },
        safe: {
          title: 'Buenas noticias!',
          text: 'Su correo electronico no fue encontrado en las filtraciones de datos conocidas.'
        },
        passwordPwned: {
          title: 'Esta contrasena ha sido comprometida!',
          text: 'Esta contrasena fue encontrada en bases de datos de piratas informaticos. NO debe usarse mas en ningun lugar.',
          foundCount: 'Numero de veces encontrada en filtraciones',
          times: 'veces',
          riskLevel: 'Nivel de riesgo',
          critical: 'Critico',
          recommendation: 'Recomendacion',
          changeNow: 'Cambiar inmediatamente'
        },
        passwordSafe: {
          title: 'Esta contrasena no fue encontrada',
          text: 'Esto no garantiza que sea segura. Utilice siempre contrasenas unicas y complejas.'
        }
      },
      breachList: {
        title: 'Filtraciones de datos detectadas',
        breachDate: 'Filtracion el',
        accounts: 'cuentas'
      },
      dataTypes: {
        email: 'Correo',
        password: 'Contrasena',
        name: 'Nombre',
        phone: 'Telefono',
        address: 'Direccion',
        dob: 'Fecha de nacimiento',
        cardNumber: 'Numero de tarjeta'
      },
      cta: {
        badge: 'Oferta limitada',
        title: 'Proteja su identidad en línea',
        features: [
          'Vigilancia de Dark Web 24/7',
          'Alertas instantáneas de filtraciones',
          'Soporte de expertos disponible',
          'Garantía de devolución de dinero'
        ],
        button: 'Ver nuestras ofertas',
        call: 'Llámenos al',
        phone: '+34 (123) 456-7890',
        urgency: 'Verifique ahora - sus datos podrían estar comprometidos'
      },
      attribution: 'Datos proporcionados por',
      loading: 'Verificando...',
      error: 'Ocurrio un error. Por favor intente de nuevo.'
    },
    legal: {
      common: {
        lastUpdated: 'Ultima actualizacion: Enero 2025',
        company: 'Digital Genesys Solutions LLC',
        companyName: 'Digital Genesys Solutions LLC (MaSécurité)',
        legalForm: 'Limited Liability Company (LLC)',
        registrationNumber: 'Número de registro',
        registrationNum: '3003074',
        formationDate: 'Fecha de formación',
        formationDateValue: '16 de diciembre de 2024',
        address: 'Dirección',
        addressValue: '5203 Juan Tabo Blvd STE 2B, Albuquerque, NM 87111, USA',
        registeredAgent: 'Agente registrado',
        registeredAgentValue: 'Cindy\'s New Mexico LLC (5587298BA)',
        agentAddress: 'Dirección del agente',
        agentAddressValue: '5203 Juan Tabo Blvd NE Suite 2a, Albuquerque, NM 87111, USA',
        state: 'Estado de formación',
        stateValue: 'Nuevo México, USA',
        phone: 'Teléfono',
        phoneValue: '900 423 288',
        email: 'Email',
        emailValue: 'info@masecurite.be',
        contactTitle: '¿Necesita Más Información?',
        contactText: 'Para cualquier pregunta sobre este aviso legal, contáctenos:',
        society: 'Empresa'
      },
      legalNotice: {
        title: 'Aviso Legal',
        intro: 'De conformidad con las disposiciones de la Ley N° 2004-575 del 21 de junio de 2004 sobre la confianza en la economía digital, aquí está la información legal del sitio web MaSécurité.'
      },
      privacyPolicy: {
        title: 'Política de Privacidad',
        lastUpdate: 'Última actualización: Enero 2025',
        intro: 'En MaSécurité, nos tomamos muy en serio la protección de sus datos personales. Esta política explica cómo recopilamos, utilizamos y protegemos su información de acuerdo con el Reglamento General de Protección de Datos (RGPD).',
        section1: {
          title: '1. Responsable del Tratamiento',
          description: 'El responsable del tratamiento de sus datos personales es:'
        },
        section2: {
          title: '2. Datos Personales Recopilados',
          intro: 'Recopilamos diferentes tipos de datos personales según su uso de nuestros servicios:',
          identificationData: {
            title: 'Datos de identificación',
            items: ['Nombre y apellidos', 'Dirección de correo electrónico', 'Número de teléfono', 'Dirección postal']
          },
          technicalData: {
            title: 'Datos técnicos',
            items: ['Dirección IP', 'Tipo de navegador y sistema operativo', 'Información del dispositivo (modelo, versión)', 'Datos de conexión y uso']
          },
          paymentData: {
            title: 'Datos de pago',
            items: ['Información de tarjeta bancaria (cifrada y procesada por nuestro proveedor de pago seguro)', 'Historial de transacciones']
          }
        },
        section3: {
          title: '3. Finalidades del Tratamiento',
          intro: 'Sus datos personales se utilizan para las siguientes finalidades:',
          items: [
            'Ejecución del contrato: Provisión de servicios de ciberseguridad y soporte técnico',
            'Gestión de la relación con el cliente: Responder a sus solicitudes y gestionar su cuenta',
            'Mejora de servicios: Análisis de uso para optimizar nuestras ofertas',
            'Comunicaciones: Envío de información importante sobre su suscripción',
            'Marketing (con consentimiento): Envío de ofertas promocionales y boletines',
            'Obligaciones legales: Cumplimiento de requisitos regulatorios y fiscales',
            'Seguridad: Prevención del fraude y protección de nuestros sistemas'
          ]
        },
        section4: {
          title: '4. Base Legal del Tratamiento',
          intro: 'El tratamiento de sus datos se basa en las siguientes bases legales:',
          items: [
            'Ejecución del contrato: Necesario para la provisión de nuestros servicios',
            'Consentimiento: Para comunicaciones de marketing (revocable en cualquier momento)',
            'Obligaciones legales: Conservación de facturas, declaraciones fiscales',
            'Intereses legítimos: Mejora de servicios, seguridad'
          ]
        },
        section5: {
          title: '5. Compartir Datos',
          intro: 'Sus datos personales pueden compartirse con:',
          items: [
            'Proveedores de servicios: Alojamiento, pago, soporte técnico (bajo estricto contrato de confidencialidad)',
            'Socios tecnológicos: Para la provisión de soluciones de ciberseguridad',
            'Autoridades competentes: En caso de obligación legal u orden judicial'
          ],
          important: 'Importante: Nunca vendemos sus datos personales a terceros con fines comerciales.'
        },
        section6: {
          title: '6. Transferencias Internacionales',
          description: 'Sus datos se almacenan y procesan principalmente dentro de la Unión Europea. Si son necesarias transferencias fuera de la UE, nos aseguramos de que existan garantías apropiadas (cláusulas contractuales estándar de la Comisión Europea, Privacy Shield, etc.).'
        },
        section7: {
          title: '7. Período de Conservación',
          intro: 'Conservamos sus datos personales durante los siguientes períodos:',
          items: [
            'Datos de cuenta del cliente: Durante toda su suscripción + 3 años después de la terminación',
            'Datos de facturación: 10 años (obligación legal contable)',
            'Datos de soporte: 3 años después de la última interacción',
            'Datos de marketing: 3 años después del último consentimiento o interacción',
            'Cookies: Según los períodos especificados en nuestra Política de Cookies'
          ]
        },
        section8: {
          title: '8. Sus Derechos',
          intro: 'De acuerdo con el RGPD, usted tiene los siguientes derechos:',
          items: [
            'Derecho de acceso: Obtener una copia de sus datos personales',
            'Derecho de rectificación: Corregir datos inexactos o incompletos',
            'Derecho de supresión: Solicitar la eliminación de sus datos ("derecho al olvido")',
            'Derecho a la limitación: Limitar el procesamiento de sus datos en ciertas situaciones',
            'Derecho de oposición: Oponerse al procesamiento de sus datos por razones legítimas',
            'Derecho a la portabilidad: Recibir sus datos en un formato estructurado y transferible',
            'Derecho a retirar el consentimiento: Retirar su consentimiento al procesamiento de marketing en cualquier momento',
            'Derecho a presentar una reclamación: Contactar a la CNIL (Autoridad Francesa de Protección de Datos)'
          ],
          howToExercise: {
            title: '¿Cómo ejercer sus derechos?',
            intro: 'Para ejercer cualquiera de estos derechos, contáctenos:',
            dpo: 'dpo@masecurite.be',
            responseTime: 'Responderemos a su solicitud en un máximo de un mes. Se puede solicitar prueba de identidad para verificar su identidad.'
          }
        },
        section9: {
          title: '9. Seguridad de Datos',
          intro: 'Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos:',
          items: [
            'Cifrado de datos sensibles (SSL/TLS)',
            'Acceso restringido a datos personales (principio de necesidad de conocer)',
            'Autenticación segura y gestión de contraseñas',
            'Supervisión y detección de incidentes de seguridad',
            'Copias de seguridad regulares y plan de continuidad del negocio',
            'Formación regular de nuestros equipos sobre protección de datos'
          ],
          breachNotification: 'En caso de una violación de datos que pueda afectar sus derechos y libertades, le informaremos lo antes posible de acuerdo con la normativa.'
        },
        section10: {
          title: '10. Cookies y Tecnologías Similares',
          description: 'Nuestro sitio utiliza cookies para mejorar su experiencia. Para obtener más información, consulte nuestra',
          cookiePolicyLink: 'Política de Cookies'
        },
        section11: {
          title: '11. Cambios en la Política',
          para1: 'Podemos modificar esta política de privacidad para reflejar cambios en nuestras prácticas o la legislación. Cualquier cambio sustancial le será notificado por correo electrónico o a través de nuestro sitio web.',
          para2: 'Le recomendamos que consulte regularmente esta página para mantenerse informado sobre nuestras prácticas de protección de datos.'
        },
        questionsSection: {
          title: '¿Preguntas sobre Privacidad?',
          description: 'Nuestro Delegado de Protección de Datos (DPO) está disponible para cualquier pregunta:'
        }
      },
      cookiePolicy: {
        title: 'Política de Cookies',
        lastUpdate: 'Última actualización: Enero 2025',
        intro: 'Esta política explica cómo MaSécurité utiliza las cookies y tecnologías similares en nuestro sitio web para mejorar su experiencia de navegación.',
        section1: {
          title: '1. ¿Qué es una Cookie?',
          description: 'Una cookie es un pequeño archivo de texto colocado en su dispositivo (computadora, tableta, teléfono inteligente) cuando visita un sitio web. Las cookies permiten al sitio:',
          items: ['Recordar sus preferencias y configuraciones', 'Facilitar su navegación', 'Analizar el uso del sitio para mejorarlo', 'Personalizar su experiencia', 'Garantizar la seguridad de su conexión']
        },
        section2: {
          title: '2. Tipos de Cookies Utilizadas',
          sessionCookies: {
            title: 'A. Cookies de Sesión',
            description: 'Estas cookies temporales se eliminan automáticamente cuando cierra su navegador. Permiten:',
            items: ['Mantener su conexión durante su visita', 'Recordar la información que ingresa en un formulario', 'Gestionar su carrito si realiza una compra']
          },
          persistentCookies: {
            title: 'B. Cookies Persistentes',
            description: 'Estas cookies permanecen en su dispositivo durante un período determinado o hasta que las elimine. Permiten:',
            items: ['Reconocer su dispositivo en sus próximas visitas', 'Recordar sus preferencias de idioma', 'Conservar sus configuraciones de privacidad', 'Reconectarlo automáticamente si así lo eligió']
          }
        },
        section3: {
          title: '3. Categorías de Cookies',
          strictlyNecessary: {
            title: 'A. Cookies Estrictamente Necesarias',
            purpose: 'Esenciales para el funcionamiento del sitio',
            duration: 'Sesión o hasta 1 año',
            consentRequired: 'No (cookies técnicas indispensables)',
            description: 'Estas cookies son esenciales para:',
            items: ['Asegurar su conexión y prevenir el fraude', 'Permitir la navegación entre páginas', 'Acceder a su área de cliente segura', 'Recordar sus elecciones de cookies']
          },
          performance: {
            title: 'B. Cookies de Rendimiento y Análisis',
            purpose: 'Analizar el uso del sitio',
            duration: 'Hasta 2 años',
            consentRequired: 'Sí',
            description: 'Estas cookies nos ayudan a comprender cómo utiliza nuestro sitio:',
            items: ['Páginas más visitadas', 'Duración de las visitas', 'Rutas de navegación', 'Mensajes de error encontrados'],
            tool: 'Google Analytics (datos anonimizados)'
          },
          functionality: {
            title: 'C. Cookies de Funcionalidad',
            purpose: 'Personalizar su experiencia',
            duration: 'Hasta 1 año',
            consentRequired: 'Sí',
            description: 'Estas cookies mejoran su comodidad de navegación:',
            items: ['Recordar su elección de idioma', 'Adaptar la visualización a su dispositivo', 'Personalizar el contenido según sus preferencias', 'Guardar sus configuraciones de visualización']
          },
          advertising: {
            title: 'D. Cookies Publicitarias y de Redes Sociales',
            purpose: 'Entregar anuncios relevantes',
            duration: 'Hasta 13 meses',
            consentRequired: 'Sí',
            description: 'Estas cookies permiten:',
            items: ['Mostrar anuncios adaptados a sus intereses', 'Compartir contenido en redes sociales', 'Limitar el número de veces que se muestra un anuncio', 'Medir la efectividad de las campañas publicitarias'],
            partners: 'Facebook, Google Ads'
          }
        },
        section4: {
          title: '4. Gestión de Sus Preferencias',
          intro: 'Tiene control total sobre las cookies:',
          banner: {
            title: 'A través de nuestro banner de cookies',
            description: 'En su primera visita, un banner le permite aceptar o rechazar las cookies no esenciales. Puede modificar sus preferencias en cualquier momento haciendo clic en el enlace "Gestionar cookies" en la parte inferior de la página.'
          },
          browser: {
            title: 'A través de su navegador',
            description: 'Puede configurar su navegador para:',
            items: ['Ser notificado cuando se coloque una cookie', 'Aceptar o rechazar cookies caso por caso', 'Rechazar sistemáticamente todas las cookies', 'Eliminar las cookies existentes'],
            browserLinks: 'Enlaces a configuraciones de navegadores populares:'
          },
          warning: 'Advertencia: Rechazar ciertas cookies puede limitar el acceso a ciertas funciones del sitio o degradar su experiencia de navegación.'
        },
        section5: {
          title: '5. Cookies de Terceros',
          intro: 'Nuestro sitio puede contener servicios de terceros (videos, mapas, botones para compartir) que colocan sus propias cookies. No tenemos control sobre estas cookies de terceros.',
          services: 'Principales servicios de terceros utilizados:',
          items: ['Google Analytics: Análisis de audiencia (anonimizado)', 'Google Ads: Publicidad dirigida', 'Facebook Pixel: Seguimiento de conversiones', 'YouTube: Integración de videos'],
          recommendation: 'Le recomendamos consultar las políticas de privacidad de estos servicios para comprender cómo utilizan sus datos.'
        },
        section6: {
          title: '6. Período de Conservación',
          items: ['Cookies de sesión: Eliminadas al cerrar el navegador', 'Cookies estrictamente necesarias: Hasta 12 meses', 'Cookies de análisis: Hasta 24 meses', 'Cookies de personalización: Hasta 12 meses', 'Cookies publicitarias: Hasta 13 meses', 'Consentimiento de cookies: 13 meses']
        },
        section7: {
          title: '7. Sus Derechos',
          intro: 'De acuerdo con el RGPD y la directiva ePrivacy, usted tiene los siguientes derechos:',
          items: ['Derecho a consentir o rechazar cookies', 'Derecho a retirar su consentimiento en cualquier momento', 'Derecho a acceder a los datos recopilados a través de cookies', 'Derecho a eliminar cookies de su dispositivo', 'Derecho a presentar una reclamación ante la CNIL']
        },
        section8: {
          title: '8. Cambios en la Política',
          para1: 'Podemos modificar esta política de cookies para reflejar cambios en nuestras prácticas o la legislación. La fecha de la última actualización se indica en la parte superior de esta página.',
          para2: 'Le recomendamos que consulte regularmente esta página para mantenerse informado sobre nuestro uso de cookies.'
        },
        questionsSection: {
          title: '¿Preguntas sobre Cookies?',
          description: 'Para cualquier pregunta sobre nuestro uso de cookies:'
        }
      },
      refundPolicy: {
        title: 'Política de Reembolso',
        lastUpdate: 'Última actualización: Enero 2025',
        intro: 'En MaSécurité, su satisfacción es nuestra prioridad. Esta política explica las condiciones para reembolsar nuestros servicios.',
        section1: {
          title: '1. Derecho de Desistimiento de 30 Días',
          para1: 'De acuerdo con la legislación europea de protección del consumidor, tiene un período de 30 días calendario desde la fecha de suscripción para ejercer su derecho de desistimiento sin tener que justificar sus razones.',
          para2: 'Este derecho se aplica a todos nuestros planes, ya sean mensuales, anuales o plurianuales.'
        },
        section2: {
          title: '2. Cómo Solicitar un Reembolso',
          intro: 'Para ejercer su derecho de desistimiento y solicitar un reembolso, puede:',
          items: ['Complete el formulario en línea disponible en su área de cliente', 'Llámenos al 900 423 288 (disponible 24/7)', 'Envíenos un correo electrónico a info@masecurite.be con su número de pedido', 'Escríbanos por correo postal a: Digital Genesys Solutions LLC, 5203 Juan Tabo Blvd STE 2B, Albuquerque, NM 87111, USA'],
          advice: 'Consejo: Para un procesamiento más rápido, use el formulario en línea o contáctenos por teléfono.'
        },
        section3: {
          title: '3. Montos No Reembolsables',
          intro: 'Durante un reembolso, ciertos montos pueden retenerse:',
          installation: {
            title: 'Tarifas de instalación y configuración',
            description: 'Si se ha beneficiado de nuestro servicio de instalación y configuración inicial, estas tarifas no son reembolsables ya que el servicio ya ha sido proporcionado.'
          },
          proportional: {
            title: 'Uso proporcional del servicio',
            description: 'Si ha utilizado nuestros servicios durante el período de desistimiento, se retendrá del reembolso un monto proporcional al tiempo de uso.',
            example: 'Ejemplo de cálculo: Suscripción anual: €120, Duración de uso: 10 días, Monto retenido: €120 × (10/365) = €3,29, Reembolso: €116,71'
          },
          hardware: {
            title: 'Equipo de hardware',
            description: 'Si recibió equipo de hardware (por ejemplo, un enrutador seguro) como parte de su suscripción:',
            items: ['El equipo debe devolverse en su embalaje original', 'El equipo no debe estar dañado', 'Los costos de envío de devolución son su responsabilidad', 'Si el equipo está dañado, su valor se deducirá del reembolso']
          }
        },
        section4: {
          title: '4. Plazo de Reembolso',
          intro: 'Una vez validada su solicitud de reembolso:',
          items: ['El reembolso se procesa en un máximo de 14 días hábiles', 'El reembolso se realiza mediante el método de pago utilizado durante el pedido', 'Si se debe devolver equipo, el reembolso se realiza dentro de los 30 días posteriores a la recepción del equipo', 'Recibirá un correo electrónico de confirmación una vez procesado el reembolso']
        },
        section5: {
          title: '5. Reembolso Después del Período de Desistimiento',
          intro: 'Después del período de desistimiento de 30 días, los reembolsos generalmente no son posibles. Sin embargo, examinamos cada situación caso por caso:',
          items: ['Problema técnico no resuelto a pesar de nuestras intervenciones', 'Servicio no conforme con los compromisos contractuales', 'Circunstancias excepcionales que justifican una solicitud de reembolso'],
          note: 'Para cualquier solicitud después del período de desistimiento, contacte a nuestro servicio de atención al cliente que examinará cuidadosamente su situación.'
        },
        section6: {
          title: '6. Cancelación y Reembolsos de Suscripciones',
          intro: 'Si desea cancelar su suscripción actual:',
          items: ['La cancelación entra en vigencia al final del período de compromiso actual', 'No se realiza ningún reembolso por el período restante ya pagado', 'La renovación automática está desactivada', 'Continúa beneficiándose del servicio hasta el final del período pagado']
        },
        section7: {
          title: '7. Garantía de Satisfacción',
          intro: 'Estamos comprometidos con su satisfacción:',
          items: ['Soporte técnico ilimitado durante toda su suscripción', 'Resolución rápida de problemas técnicos', 'Capacidad de cambiar de plan si sus necesidades evolucionan', 'Escucha atenta de sus preocupaciones y sugerencias']
        },
        section8: {
          title: '8. Reembolso en Caso de Interrupción',
          intro: 'Si nuestros servicios se interrumpen por razones fuera de su control durante un período significativo:',
          items: ['Se puede otorgar un reembolso proporcional', 'Se puede ofrecer una extensión gratuita de su suscripción', 'Cada situación se evalúa individualmente']
        },
        questionsSection: {
          title: '¿Preguntas sobre Reembolsos?',
          description: 'Nuestro equipo está aquí para ayudarlo:'
        }
      },
      termsOfService: {
        title: 'Condiciones Generales de Servicio',
        lastUpdate: 'Última actualización: Enero 2025',
        intro: 'Las presentes Condiciones Generales de Servicio rigen el uso de los servicios ofrecidos por MaSécurité, operado por nuestra empresa. Al utilizar nuestros servicios, usted acepta estas condiciones en su totalidad.',
        section1: {
          title: '1. Objeto del Contrato',
          intro: 'MaSécurité ofrece servicios de ciberseguridad, soporte técnico y mantenimiento informático que incluyen:',
          items: [
            'Instalación y configuración de software de seguridad',
            'Protección en tiempo real contra amenazas informáticas',
            'Soporte técnico telefónico 24/7',
            'Mantenimiento preventivo y optimización de dispositivos',
            'Asistencia remota para resolver sus problemas técnicos'
          ]
        },
        section2: {
          title: '2. Planes y Tarifas',
          intro: 'Ofrecemos varios planes de suscripción adaptados a sus necesidades:',
          items: [
            'Plan Esencial: Protección básica con soporte telefónico',
            'Plan Completo: Protección avanzada con mantenimiento regular',
            'Plan Premium: Protección máxima con asistencia prioritaria'
          ],
          outro: 'Las tarifas se indican en euros (€) e incluyen el IVA aplicable. El pago se realiza mediante tarjeta de crédito, transferencia bancaria o débito automático según el plan elegido.'
        },
        section3: {
          title: '3. Duración y Renovación',
          para1: 'Las suscripciones se ofrecen por períodos de 12, 24 o 36 meses. A menos que indique lo contrario, su suscripción se renovará automáticamente por un período equivalente a la duración inicial.',
          para2: 'Se le notificará por correo electrónico al menos 30 días antes de la fecha de renovación. Puede desactivar la renovación automática en cualquier momento desde su área de cliente o contactándonos.'
        },
        section4: {
          title: '4. Derecho de Desistimiento',
          para1: 'De conformidad con la ley europea, usted dispone de un plazo de 30 días desde la suscripción para ejercer su derecho de desistimiento sin tener que justificar motivos.',
          para2: 'Para ejercer este derecho, contacte a nuestro servicio al cliente por teléfono al 900 423 288 o por correo electrónico a info@masecurite.be.',
          important: 'Importante: Si ha utilizado nuestros servicios durante este período, se deducirá del reembolso un importe proporcional al servicio utilizado.'
        },
        section5: {
          title: '5. Obligaciones del Cliente',
          intro: 'Como cliente, usted se compromete a:',
          items: [
            'Proporcionar información precisa durante el registro',
            'Mantener sus credenciales de acceso confidenciales',
            'Utilizar los servicios de acuerdo con la legislación vigente',
            'No compartir su suscripción con terceros',
            'Informar rápidamente a MaSécurité de cualquier problema o incidente',
            'Permitir el acceso remoto a sus dispositivos para el soporte técnico'
          ]
        },
        section6: {
          title: '6. Obligaciones de MaSécurité',
          intro: 'Nos comprometemos a:',
          items: [
            'Proporcionar un servicio de calidad conforme a los estándares de la industria',
            'Garantizar la disponibilidad del soporte técnico 24/7',
            'Proteger sus datos personales de acuerdo con el RGPD',
            'Informarle de cualquier cambio importante en los servicios',
            'Responder a sus solicitudes lo antes posible',
            'Mantener la confidencialidad de su información'
          ]
        },
        section7: {
          title: '7. Limitación de Responsabilidad',
          intro: 'MaSécurité hace todo lo posible para garantizar la seguridad de sus dispositivos. Sin embargo, nuestra responsabilidad es limitada en los siguientes casos:',
          items: [
            'Problemas de hardware que requieren reparación física',
            'Pérdida de datos resultante de una acción del cliente',
            'Interrupciones del servicio debido a causas fuera de nuestro control',
            'Daños causados por software o hardware de terceros',
            'Uso inapropiado o no autorizado de los servicios'
          ]
        },
        section8: {
          title: '8. Protección de Datos',
          para1: 'Sus datos personales se recopilan y procesan de acuerdo con nuestra Política de Privacidad y el Reglamento General de Protección de Datos (RGPD).',
          para2: 'Usted tiene derecho de acceso, rectificación, supresión y portabilidad de sus datos personales. Para ejercer estos derechos, contáctenos en dpo@masecurite.be.',
          privacyPolicyLink: 'Política de Privacidad'
        },
        section9: {
          title: '9. Terminación',
          para1: 'Puede cancelar su suscripción en cualquier momento con un aviso previo de 30 días. La cancelación surte efecto al final del período de suscripción actual.',
          para2: 'MaSécurité se reserva el derecho de cancelar su suscripción en caso de impago, uso fraudulento o violación de estos términos, previa notificación.'
        },
        section10: {
          title: '10. Modificación de las Condiciones',
          para1: 'MaSécurité se reserva el derecho de modificar estos términos generales. Se le informará de cualquier modificación sustancial por correo electrónico al menos 30 días antes de su entrada en vigor.',
          para2: 'El uso continuado de nuestros servicios después de la entrada en vigor de los nuevos términos constituye su aceptación.'
        },
        section11: {
          title: '11. Ley Aplicable y Jurisdicción',
          para1: 'Estos términos se rigen por la ley francesa y europea. En caso de disputa, le recomendamos que nos contacte primero para encontrar una solución amistosa.',
          para2: 'Si no se puede encontrar un acuerdo amistoso, los tribunales franceses tendrán jurisdicción. También puede utilizar la plataforma de resolución de litigios en línea de la Unión Europea accesible en:'
        },
        contact: {
          title: '¿Preguntas?',
          intro: 'Para cualquier pregunta sobre estos términos generales, no dude en contactarnos:',
          company: 'Empresa',
          phone: 'Teléfono',
          phoneValue: '900 423 288',
          email: 'Correo electrónico',
          address: 'Dirección'
        }
      }
    }
  }
};
