import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register Roboto font with proper bold variant
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 'normal',
      fontStyle: 'normal'
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 'bold',
      fontStyle: 'normal'
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 'normal',
      fontStyle: 'italic'
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  ]
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 50,
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 1.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  toField: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 4,
  },
  fromSection: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  underline: {
    minWidth: 200,
    marginLeft: 5,
  },
  content: {
    marginBottom: 20,
    textAlign: 'justify',
  },
  paragraph: {
    fontSize: 12,
    fontFamily: 'Roboto',
    marginBottom: 12,
    textAlign: 'justify',
    lineHeight: 1.4,
  },
  documentsSection: {
    marginBottom: 20,
  },
  documentsTitle: {
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  documentsList: {
    marginLeft: 20,
  },
  documentItem: {
    fontSize: 12,
    fontFamily: 'Roboto',
    marginBottom: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    alignItems: 'flex-end',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footerField: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  signatureLine: {
    minWidth: 150,
    marginLeft: 5,
  },
})

interface MolbaZaRabotaTemplateProps {
  formData: {
    companyName?: string
    managerName?: string
    fullName?: string
    egn?: string
    idCardNumber?: string
    idCardIssuer?: string
    address?: string
    desiredPosition?: string
    submissionDate?: string
    submissionCity?: string
  }
}

const MolbaZaRabotaTemplate: React.FC<MolbaZaRabotaTemplateProps> = ({ formData }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '........................'
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG')
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Empty space for left alignment */}
          </View>
          <View style={styles.headerRight}>
            <View style={styles.toField}>
              <Text style={styles.label}>ДО</Text>
              <Text style={styles.underline}>{formData.managerName || '........................................................'}</Text>
            </View>
            <View style={styles.toField}>
              <Text style={styles.label}>УПРАВИТЕЛ НА</Text>
              <Text style={styles.underline}>{formData.companyName || '........................................................'}</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>М О Л Б А</Text>

        {/* Personal Info Section */}
        <View style={styles.fromSection}>
          <Text style={styles.label}>От</Text>
          <Text style={[styles.underline, { flex: 1, maxWidth: '75%' }]}>{formData.fullName || '.....................................................................................,'}</Text>
        </View>

        <View style={styles.fromSection}>
          <Text style={styles.label}>ЕГН</Text>
          <Text style={[styles.underline, { minWidth: 100, maxWidth: 100 }]}>{formData.egn || '.............................'}</Text>
          <Text style={styles.label}>, л.к. №</Text>
          <Text style={[styles.underline, { minWidth: 80, maxWidth: 80 }]}>{formData.idCardNumber || '........................'}</Text>
          <Text style={styles.label}>, издадена от</Text>
          <Text style={[styles.underline, { minWidth: 120, maxWidth: 120 }]}>{formData.idCardIssuer || '................................,'}</Text>
        </View>

        <View style={[styles.fromSection, { marginBottom: 30 }]}>
          <Text style={styles.label}>адрес</Text>
          <Text style={[styles.underline, { flex: 1, maxWidth: '85%' }]}>{formData.address || '..................................................................................................................'}</Text>
        </View>


        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Моля да бъде назначен/а в представляваното от Вас предприятие на 
            длъжност {formData.desiredPosition || '............................................................................................................................'}.
          </Text>
        </View>

        {/* Documents Section */}
        <View style={styles.documentsSection}>
          <Text style={styles.documentsTitle}>Прилагам следните документи:</Text>
          <View style={styles.documentsList}>
            <Text style={styles.documentItem}>1. Автобиография</Text>
            <Text style={styles.documentItem}>2. Мотивационно писмо</Text>
            <Text style={styles.documentItem}>3. Препоръка</Text>
            <Text style={styles.documentItem}>4. Копие от диплома за придобита образователна степен/сертификат за придобита квалификация</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.footerField}>
              <Text style={styles.label}>Дата</Text>
              <Text style={styles.signatureLine}>{formData.submissionDate ? formatDate(formData.submissionDate) : '................................'}</Text>
            </View>
            <View style={styles.footerField}>
              <Text style={styles.label}>Град</Text>
              <Text style={styles.signatureLine}>{formData.submissionCity || '.................................'}</Text>
            </View>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.footerField}>
              <Text style={styles.label}>Подпис:</Text>
              <Text style={styles.signatureLine}>............................................</Text>
            </View>
            <View style={[styles.footerField, { marginTop: 10 }]}>
              <Text style={[styles.signatureLine, { fontSize: 12 }]}>{formData.fullName || '/................................................................/'}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default MolbaZaRabotaTemplate
