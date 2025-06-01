import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  EN: {
    'nav.home': 'Home',
    'nav.howItWorks': 'How It Works',
    'nav.pricing': 'Pricing',
    'nav.about': 'About Us',
    'nav.login': 'Log In',
    'nav.logout': 'Logout',
    'nav.startComparing': 'Start Comparing',
    'hero.title': 'Compare Documents with Precision',
    'hero.subtitle': 'Upload your documents and get instant, accurate comparisons with detailed change tracking and professional export options.',
    'hero.watchDemo': 'Watch Demo',
    'upload.title': 'Ready to Compare? Choose Your Option',
    'upload.uploadFiles': '📄 Upload Files',
    'upload.compareText': '📝 Compare Text',
    'upload.previousVersion': 'Select Previous Version',
    'upload.latestVersion': 'Select Latest Version',
    'upload.dragDrop': 'Drag & Drop your files here',
    'upload.or': 'or',
    'upload.browseFiles': 'Browse Files',
    'upload.filesSupported': 'Files Supported: PDF, DOC, DOCX, TXT, JPG, PNG',
    'upload.ocrNote': '* OCR will be applied to PDF files',
    'upload.compareDocuments': 'Compare Documents',
    'text.originalText': 'Original Text',
    'text.modifiedText': 'Modified Text',
    'text.enterInput': 'Enter Input Here',
    'text.compareText': 'Compare Text',
    'howItWorks.title': 'How Comparely Works',
    'howItWorks.subtitle': 'Compare documents in just a few simple steps. Our advanced technology makes document comparison fast, accurate, and easy.',
    'howItWorks.step1': '1. Upload Files',
    'howItWorks.step1Description': 'Upload your original and revised documents. Supports Word, PDF, PowerPoint, and more.',
    'howItWorks.step2': '2. Compare',
    'howItWorks.step2Description': 'Our AI analyzes your documents and identifies all changes, additions, and deletions.',
    'howItWorks.step3': '3. Review',
    'howItWorks.step3Description': 'View changes side-by-side with clear highlighting and detailed change summaries.',
    'howItWorks.step4': '4. Export',
    'howItWorks.step4Description': 'Download comparison reports or save directly to Google Drive in multiple formats.',
    'pricing.title': 'Choose Your Plan',
    'pricing.subtitle': 'Select the perfect plan for your document comparison needs',
    'pricing.free': 'Free',
    'pricing.pro': 'Pro',
    'pricing.enterprise': 'Enterprise',
    'pricing.custom': 'Custom',
    'pricing.mostPopular': 'Most Popular',
    'pricing.freeFeature1': '5 comparisons per month',
    'pricing.freeFeature2': 'Basic file formats',
    'pricing.freeFeature3': 'Side-by-side view',
    'pricing.proFeature1': 'Unlimited comparisons',
    'pricing.proFeature2': 'All file formats',
    'pricing.proFeature3': 'Advanced export options',
    'pricing.proFeature4': 'Google Drive integration',
    'pricing.proFeature5': 'Priority support',
    'pricing.enterpriseFeature1': 'Everything in Pro',
    'pricing.enterpriseFeature2': 'API access',
    'pricing.enterpriseFeature3': 'Self-hosted option',
    'pricing.enterpriseFeature4': 'Custom integrations',
    'pricing.enterpriseFeature5': 'Dedicated support',
    'pricing.getStarted': 'Get Started',
    'pricing.startTrial': 'Start Free Trial',
    'pricing.contactSales': 'Contact Sales',
    'about.title': 'About Comparely',
    'about.subtitle': 'We\'re on a mission to make document comparison simple, accurate, and accessible for everyone.',
    'about.missionTitle': 'Our Mission',
    'about.missionDescription': 'To revolutionize how professionals compare and review documents, making the process faster and more reliable than ever before.',
    'about.teamTitle': 'Our Team',
    'about.teamDescription': 'A dedicated team of engineers, designers, and document experts working together to build the best comparison tools.',
    'about.valuesTitle': 'Our Values',
    'about.valuesDescription': 'Accuracy, simplicity, and user-focused design drive everything we do. We believe technology should make work easier, not harder.',
    'about.storyTitle': 'Our Story',
    'about.storyParagraph1': 'Comparely was founded in 2023 by a team of professionals who were frustrated with the complexity and limitations of existing document comparison tools. We saw an opportunity to create something better.',
    'about.storyParagraph2': 'Our platform combines advanced AI technology with intuitive design to deliver accurate, fast document comparisons that anyone can use. Whether you\'re a lawyer reviewing contracts, a writer editing manuscripts, or a business professional tracking changes in proposals, Comparely makes your work easier.',
    'about.storyParagraph3': 'Today, thousands of professionals trust Comparely to handle their most important document comparisons. We\'re just getting started on our mission to transform how the world works with documents.'
  },
  DE: {
    'nav.home': 'Startseite',
    'nav.howItWorks': 'Wie es funktioniert',
    'nav.pricing': 'Preise',
    'nav.about': 'Über uns',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    'nav.startComparing': 'Vergleich starten',
    'hero.title': 'Dokumente präzise vergleichen',
    'hero.subtitle': 'Laden Sie Ihre Dokumente hoch und erhalten Sie sofortige, genaue Vergleiche mit detaillierter Änderungsverfolgung und professionellen Exportoptionen.',
    'hero.watchDemo': 'Demo ansehen',
    'upload.title': 'Bereit zum Vergleichen? Wählen Sie Ihre Option',
    'upload.uploadFiles': '📄 Dateien hochladen',
    'upload.compareText': '📝 Text vergleichen',
    'upload.previousVersion': 'Vorherige Version auswählen',
    'upload.latestVersion': 'Neueste Version auswählen',
    'upload.dragDrop': 'Dateien hier hineinziehen',
    'upload.or': 'oder',
    'upload.browseFiles': 'Dateien durchsuchen',
    'upload.filesSupported': 'Unterstützte Dateien: PDF, DOC, DOCX, TXT, JPG, PNG',
    'upload.ocrNote': '* OCR wird auf PDF-Dateien angewendet',
    'upload.compareDocuments': 'Dokumente vergleichen',
    'text.originalText': 'Originaltext',
    'text.modifiedText': 'Geänderter Text',
    'text.enterInput': 'Eingabe hier eingeben',
    'text.compareText': 'Text vergleichen',
    'howItWorks.title': 'Wie Comparely funktioniert',
    'howItWorks.subtitle': 'Vergleichen Sie Dokumente in nur wenigen einfachen Schritten. Unsere fortschrittliche Technologie macht den Dokumentenvergleich schnell, genau und einfach.',
    'howItWorks.step1': '1. Dateien hochladen',
    'howItWorks.step1Description': 'Laden Sie Ihre Original- und überarbeiteten Dokumente hoch. Unterstützt Word, PDF, PowerPoint und mehr.',
    'howItWorks.step2': '2. Vergleichen',
    'howItWorks.step2Description': 'Unsere KI analysiert Ihre Dokumente und identifiziert alle Änderungen, Ergänzungen und Löschungen.',
    'howItWorks.step3': '3. Überprüfen',
    'howItWorks.step3Description': 'Zeigen Sie Änderungen nebeneinander mit klarer Hervorhebung und detaillierten Änderungszusammenfassungen an.',
    'howItWorks.step4': '4. Exportieren',
    'howItWorks.step4Description': 'Laden Sie Vergleichsberichte herunter oder speichern Sie sie direkt in Google Drive in mehreren Formaten.',
    'pricing.title': 'Wählen Sie Ihren Plan',
    'pricing.subtitle': 'Wählen Sie den perfekten Plan für Ihre Dokumentenvergleichsanforderungen',
    'pricing.free': 'Kostenlos',
    'pricing.pro': 'Pro',
    'pricing.enterprise': 'Unternehmen',
    'pricing.custom': 'Individuell',
    'pricing.mostPopular': 'Beliebteste',
    'pricing.freeFeature1': '5 Vergleiche pro Monat',
    'pricing.freeFeature2': 'Grundlegende Dateiformate',
    'pricing.freeFeature3': 'Nebeneinander-Ansicht',
    'pricing.proFeature1': 'Unbegrenzte Vergleiche',
    'pricing.proFeature2': 'Alle Dateiformate',
    'pricing.proFeature3': 'Erweiterte Exportoptionen',
    'pricing.proFeature4': 'Google Drive-Integration',
    'pricing.proFeature5': 'Prioritätssupport',
    'pricing.enterpriseFeature1': 'Alles in Pro',
    'pricing.enterpriseFeature2': 'API-Zugang',
    'pricing.enterpriseFeature3': 'Self-Hosted-Option',
    'pricing.enterpriseFeature4': 'Benutzerdefinierte Integrationen',
    'pricing.enterpriseFeature5': 'Dedizierter Support',
    'pricing.getStarted': 'Loslegen',
    'pricing.startTrial': 'Kostenlose Testversion starten',
    'pricing.contactSales': 'Vertrieb kontaktieren',
    'about.title': 'Über Comparely',
    'about.subtitle': 'Wir haben die Mission, den Dokumentenvergleich einfach, genau und für jeden zugänglich zu machen.',
    'about.missionTitle': 'Unsere Mission',
    'about.missionDescription': 'Die Art und Weise zu revolutionieren, wie Fachleute Dokumente vergleichen und überprüfen, und den Prozess schneller und zuverlässiger als je zuvor zu machen.',
    'about.teamTitle': 'Unser Team',
    'about.teamDescription': 'Ein engagiertes Team von Ingenieuren, Designern und Dokumentenexperten, die zusammenarbeiten, um die besten Vergleichstools zu entwickeln.',
    'about.valuesTitle': 'Unsere Werte',
    'about.valuesDescription': 'Genauigkeit, Einfachheit und benutzerfokussiertes Design treiben alles an, was wir tun. Wir glauben, dass Technologie die Arbeit einfacher und nicht schwieriger machen sollte.',
    'about.storyTitle': 'Unsere Geschichte',
    'about.storyParagraph1': 'Comparely wurde 2023 von einem Team von Fachleuten gegründet, die von der Komplexität und den Einschränkungen bestehender Dokumentenvergleichstools frustriert waren. Wir sahen eine Gelegenheit, etwas Besseres zu schaffen.',
    'about.storyParagraph2': 'Unsere Plattform kombiniert fortschrittliche KI-Technologie mit intuitivem Design, um genaue, schnelle Dokumentenvergleiche zu liefern, die jeder verwenden kann. Ob Sie ein Anwalt sind, der Verträge überprüft, ein Schriftsteller, der Manuskripte bearbeitet, oder ein Geschäftsprofi, der Änderungen in Vorschlägen verfolgt, Comparely macht Ihre Arbeit einfacher.',
    'about.storyParagraph3': 'Heute vertrauen Tausende von Fachleuten Comparely bei der Bearbeitung ihrer wichtigsten Dokumentenvergleiche. Wir stehen erst am Anfang unserer Mission, die Art und Weise zu transformieren, wie die Welt mit Dokumenten arbeitet.'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('EN');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.EN] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
