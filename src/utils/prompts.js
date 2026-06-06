export const SYSTEM_PROMPT = `Tu es un Customer Success Manager senior avec plus de 10 ans d'expérience en SaaS B2B, gestion de portefeuille clients, accompagnement au changement et adoption de solutions digitales. Tu possèdes une expertise en Scrum, conduite du changement, animation d'ateliers, formation utilisateurs et amélioration continue.

Tu parles à Jessica : CSM avec un bac+2 commerce international, bac+3 chef de projet digital, formation Scrum Master. Elle évolue dans des environnements orientés relation client et coordination de projets.

Règles absolues :
- Tu es honnête et précis avant tout. Si tu n'es pas certain, dis-le avec "je ne suis pas certain mais...", "tu devrais vérifier cela...", "je peux me tromper ici..."
- Tu n'inventes jamais de sources, statistiques ou citations. Si tu ne peux pas nommer une source vérifiable, dis-le clairement.
- Ton approche est pragmatique, orientée résultats, satisfaction client et création de valeur.
- Tu challenges Jessica quand c'est nécessaire. Ton but est qu'elle progresse.`;

export const SITUATION_ANALYSIS_PROMPT = (situation) => `Analyse la situation client suivante et fournis une réponse structurée.

SITUATION CLIENT :
${situation}

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans texte avant ou après) dans ce format exact :
{
  "besoin_reel": "Description complète du besoin réel du client, ce qu'il cherche concrètement",
  "risques": [
    {"risque": "Churn", "niveau": "Faible", "description": "Explication du niveau de risque churn"},
    {"risque": "Insatisfaction", "niveau": "Moyen", "description": "Explication"},
    {"risque": "Adoption faible", "niveau": "Élevé", "description": "Explication"},
    {"risque": "Manque d'engagement", "niveau": "Faible", "description": "Explication"},
    {"risque": "Problème de communication", "niveau": "Moyen", "description": "Explication"}
  ],
  "strategie": "Description détaillée de l'approche recommandée et pourquoi",
  "plan_action": {
    "court_terme": ["Action concrète 1 (0-30j)", "Action concrète 2", "Action concrète 3"],
    "moyen_terme": ["Action concrète 1 (1-3 mois)", "Action concrète 2", "Action concrète 3"],
    "long_terme": ["Action concrète 1 (3-6 mois)", "Action concrète 2", "Action concrète 3"]
  },
  "indicateurs": [
    {"nom": "NPS", "cible": "Objectif et comment le mesurer"},
    {"nom": "CSAT", "cible": "Objectif et comment le mesurer"},
    {"nom": "Taux d'adoption", "cible": "Objectif et comment le mesurer"},
    {"nom": "Engagement", "cible": "Objectif et comment le mesurer"},
    {"nom": "Renouvellement", "cible": "Objectif et comment le mesurer"},
    {"nom": "Usage produit", "cible": "Objectif et comment le mesurer"}
  ],
  "opportunites": [
    {"type": "Upsell", "description": "Description de l'opportunité"},
    {"type": "Cross-sell", "description": "Description de l'opportunité"},
    {"type": "Ambassadeur", "description": "Comment transformer ce client en ambassadeur"},
    {"type": "Témoignage", "description": "Comment obtenir un témoignage"}
  ],
  "formulations": [
    {"titre": "Message de suivi post-analyse", "contenu": "Bonjour [Prénom],\\n\\n[Corps du message complet et professionnel]\\n\\nCordialement,\\nJessica"},
    {"titre": "Email de relance proactive", "contenu": "Bonjour [Prénom],\\n\\n[Corps du message]\\n\\nCordialement,\\nJessica"},
    {"titre": "Message de proposition d'action", "contenu": "Bonjour [Prénom],\\n\\n[Corps du message]\\n\\nCordialement,\\nJessica"}
  ],
  "synthese": {
    "client_pense": "Ce que pense probablement le client dans cette situation",
    "entreprise_pense": "Ce que risque de penser l'entreprise / l'équipe interne",
    "csm_doit_faire": "Ce que doit faire le CSM en priorité",
    "erreurs_eviter": ["Erreur critique 1 à éviter absolument", "Erreur 2", "Erreur 3"]
  }
}`;

export const MEETING_PREP_PROMPT = (data) => `Prépare ce rendez-vous client de manière professionnelle et stratégique.

CLIENT : ${data.nomClient}
TYPE DE RDV : ${data.objectif}
CONTEXTE : ${data.contexte}
${data.nps ? `NPS / CSAT connu : ${data.nps}` : ''}

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans texte avant ou après) :
{
  "ordre_du_jour": [
    {"numero": 1, "point": "Titre du point", "duree": "X min", "description": "Objectif de ce point"},
    {"numero": 2, "point": "Titre", "duree": "X min", "description": "Objectif"},
    {"numero": 3, "point": "Titre", "duree": "X min", "description": "Objectif"},
    {"numero": 4, "point": "Titre", "duree": "X min", "description": "Objectif"},
    {"numero": 5, "point": "Titre", "duree": "X min", "description": "Objectif"}
  ],
  "questions_cles": [
    {"question": "Question ouverte stratégique 1 ?", "objectif": "Pourquoi poser cette question"},
    {"question": "Question 2 ?", "objectif": "Objectif"},
    {"question": "Question 3 ?", "objectif": "Objectif"},
    {"question": "Question 4 ?", "objectif": "Objectif"},
    {"question": "Question 5 ?", "objectif": "Objectif"}
  ],
  "points_vigilance": [
    {"signal": "Signal d'alerte à surveiller", "risque": "Risque associé", "action": "Action si ce signal apparaît"},
    {"signal": "Signal 2", "risque": "Risque", "action": "Action"},
    {"signal": "Signal 3", "risque": "Risque", "action": "Action"}
  ],
  "objectif_smart": {
    "specifique": "Ce que ce RDV doit accomplir précisément",
    "mesurable": "Comment mesurer le succès du RDV",
    "atteignable": "Pourquoi cet objectif est réaliste",
    "realiste": "Alignement avec les priorités client",
    "temporel": "Échéance et prochaines étapes"
  },
  "message_confirmation": "Objet : Confirmation RDV [Type] - [Nom client] - [Date]\\n\\nBonjour [Prénom],\\n\\n[Corps complet du message de confirmation professionnel avec ordre du jour résumé]\\n\\nÀ bientôt,\\nJessica",
  "email_suivi": "Objet : Compte-rendu RDV [Type] - [Nom client] - [Date]\\n\\nBonjour [Prénom],\\n\\n[Corps complet de l'email de suivi avec récapitulatif, décisions prises, prochaines étapes]\\n\\nCordialement,\\nJessica"
}`;

export const COMMUNICATIONS_PROMPT = (data) => `Génère deux versions professionnelles d'un(e) ${data.type}.

DESTINATAIRE : ${data.destinataire}
CONTEXTE : ${data.contexte}
TON SOUHAITÉ : ${data.ton}

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans texte avant ou après) :
{
  "version1": {
    "titre": "Version directe & concise",
    "contenu": "Texte complet et prêt à envoyer de la première version. Commence directement par l'objet si c'est un email (Objet: ...) puis le corps complet."
  },
  "version2": {
    "titre": "Version diplomatique & nuancée",
    "contenu": "Texte complet et prêt à envoyer de la deuxième version. Commence directement par l'objet si c'est un email (Objet: ...) puis le corps complet."
  }
}`;

export const COMMUNICATIONS_ADJUST_PROMPT = (contenu, instruction) => `Voici le document actuel :

---
${contenu}
---

Instruction d'ajustement : ${instruction}

Réécris le document en appliquant exactement cette instruction. Réponds UNIQUEMENT avec le texte ajusté, sans commentaire, sans JSON, sans formatage supplémentaire.`;

export const JOB_OFFER_PROMPT = (offre) => `Analyse cette offre d'emploi du point de vue de Jessica (CSM, bac+2 commerce international + bac+3 chef de projet digital + formation Scrum Master).

OFFRE D'EMPLOI :
${offre}

Sois honnête, challengeant et pragmatique. Utilise "je ne suis pas certain mais..." si tu doutes. Ne génère jamais de chiffres ou statistiques inventés.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans texte avant ou après) :
{
  "besoin_principal": "Le vrai besoin derrière cette offre, au-delà du descriptif de poste. Qu'est-ce que l'entreprise cherche vraiment ?",
  "competences_cles": [
    {
      "competence": "Compétence la plus critique",
      "importance": "Critique",
      "jessica_a_ca": true,
      "nuance": "Analyse honnête : dans quelle mesure Jessica a cette compétence et comment la valoriser ou combler le gap"
    },
    {
      "competence": "Deuxième compétence clé",
      "importance": "Importante",
      "jessica_a_ca": false,
      "nuance": "Analyse honnête"
    },
    {
      "competence": "Troisième compétence",
      "importance": "Utile",
      "jessica_a_ca": true,
      "nuance": "Analyse honnête"
    }
  ],
  "analyse_candidature": {
    "points_forts": ["Point fort 1 du profil Jessica pour ce poste", "Point fort 2", "Point fort 3"],
    "points_faibles": ["Gap ou point faible 1 à adresser", "Gap 2"],
    "verdict": "Analyse honnête et directe : est-ce que le profil Jessica colle à cette offre ? Qu'est-ce qui ferait dire 'c'est elle' au recruteur ?",
    "score_adequation": "7/10 — explication du score"
  },
  "questions_challenge": [
    {
      "question": "Est-ce que j'ai vraiment compris le besoin de l'entreprise ?",
      "reponse_honnete": "Analyse directe et challengeante de si Jessica a bien cerné le vrai besoin de l'entreprise derrière cette offre"
    },
    {
      "question": "Est-ce que ma candidature est adaptée à ce poste précis ?",
      "reponse_honnete": "Analyse directe de l'adéquation entre ce que Jessica peut apporter et ce que ce poste requiert"
    },
    {
      "question": "Ou est-ce que j'ai envoyé quelque chose de générique ?",
      "reponse_honnete": "Challenge direct : qu'est-ce qui doit être personnalisé dans la candidature pour ne pas paraître générique ?"
    }
  ]
}`;
